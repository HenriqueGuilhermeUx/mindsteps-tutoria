import type { Subject } from './types';
import type { LearningState } from './learningState';
import type { MisconceptionPattern } from './misconceptionEngine';
import type { FlowInsight } from './flowEngine';
import type { LearningGraph } from './learningGraph';

export type PredictionRisk = 'low' | 'medium' | 'high';

export interface LearningPrediction {
  conceptId?: string;
  conceptTitle: string;
  subject: Subject;
  risk: PredictionRisk;
  probability: number;
  reason: string;
  recommendedPrevention: string;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function riskFromProbability(probability: number): PredictionRisk {
  if (probability >= 75) return 'high';
  if (probability >= 45) return 'medium';
  return 'low';
}

export function predictLearningRisks(params: {
  subject: Subject;
  learningState: LearningState;
  flow: FlowInsight;
  misconceptions: MisconceptionPattern[];
  graph?: LearningGraph;
}): LearningPrediction[] {
  const predictions: LearningPrediction[] = [];
  const baseRisk =
    (10 - params.learningState.confidence) * 4 +
    params.learningState.cognitiveLoad * 4 +
    (params.flow.zone === 'too_hard' ? 20 : 0);

  for (const misconception of params.misconceptions) {
    const severityWeight = misconception.severity === 'high' ? 25 : misconception.severity === 'medium' ? 15 : 8;
    const probability = clamp(baseRisk + severityWeight);

    predictions.push({
      conceptTitle: misconception.concept || misconception.label,
      subject: misconception.subject,
      risk: riskFromProbability(probability),
      probability,
      reason: misconception.description,
      recommendedPrevention: misconception.recommendedIntervention,
    });
  }

  if (params.graph) {
    const fragileTitles = params.misconceptions
      .map((item) => `${item.concept || ''} ${item.label}`.toLowerCase())
      .join(' ');

    for (const node of params.graph.nodes) {
      if (node.subject !== params.subject) continue;

      const prerequisites = params.graph.edges
        .filter((edge) => edge.to === node.id && edge.relation === 'prerequisite')
        .map((edge) => params.graph?.nodes.find((candidate) => candidate.id === edge.from))
        .filter(Boolean);

      const fragilePrerequisite = prerequisites.find((prerequisite) =>
        fragileTitles.includes(prerequisite!.title.toLowerCase())
      );

      if (!fragilePrerequisite) continue;

      const probability = clamp(baseRisk + 30);
      predictions.push({
        conceptId: node.id,
        conceptTitle: node.title,
        subject: node.subject,
        risk: riskFromProbability(probability),
        probability,
        reason: `${node.title} depende de ${fragilePrerequisite.title}, que apresenta sinais de fragilidade.`,
        recommendedPrevention: `Revisar ${fragilePrerequisite.title} antes de avançar para ${node.title}.`,
      });
    }
  }

  if (predictions.length === 0 && params.flow.zone === 'too_hard') {
    const probability = clamp(baseRisk);
    predictions.push({
      conceptTitle: 'Próximo conteúdo da trilha',
      subject: params.subject,
      risk: riskFromProbability(probability),
      probability,
      reason: 'A carga cognitiva atual está alta e pode gerar dificuldade no próximo passo.',
      recommendedPrevention: 'Reduzir complexidade, consolidar o conceito atual e verificar compreensão antes de avançar.',
    });
  }

  return predictions.sort((a, b) => b.probability - a.probability);
}

export function summarizeLearningPredictions(predictions: LearningPrediction[]): string {
  if (predictions.length === 0) return 'No meaningful learning risk predicted.';

  return predictions
    .slice(0, 4)
    .map((prediction) => `${prediction.conceptTitle}: ${prediction.probability}% risk - ${prediction.recommendedPrevention}`)
    .join(' | ');
}
