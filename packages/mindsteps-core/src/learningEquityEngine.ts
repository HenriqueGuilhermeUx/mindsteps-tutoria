import type { Subject } from './types';
import type { LearningDecision } from './learningDecisionEngine';

export interface CulturalLearningContext {
  country?: string;
  region?: string;
  locality?: string;
  language?: string;
  culturalReferences?: string[];
  availableResources?: string[];
  curriculumName?: string;
}

export interface CommonCycleOutcome {
  id: string;
  title: string;
  subject: Subject;
  cycle: string;
  essentialKnowledge: string[];
  criticalThinkingGoals: string[];
  evidenceRequired: string[];
}

export interface LearnerCycleProgress {
  outcomeId: string;
  masteredKnowledge: string[];
  demonstratedThinking: string[];
  evidenceCount: number;
}

export interface LearningEquityPlan {
  principle: 'personalized_path_common_knowledge';
  commonOutcome: CommonCycleOutcome;
  localContext: CulturalLearningContext;
  knowledgeCoverage: number;
  criticalThinkingCoverage: number;
  convergenceStatus: 'starting' | 'progressing' | 'near_common_outcome' | 'common_outcome_reached';
  nextUniversalTarget: string;
  contextualizationGuidance: string[];
  equitySafeguards: string[];
  teacherMessage: string;
  learnerMessage: string;
}

function percentage(done: number, total: number): number {
  if (total <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

function resolveStatus(knowledgeCoverage: number, criticalThinkingCoverage: number): LearningEquityPlan['convergenceStatus'] {
  const combined = Math.round((knowledgeCoverage + criticalThinkingCoverage) / 2);
  if (combined >= 90) return 'common_outcome_reached';
  if (combined >= 70) return 'near_common_outcome';
  if (combined >= 30) return 'progressing';
  return 'starting';
}

function findNextTarget(outcome: CommonCycleOutcome, progress?: LearnerCycleProgress): string {
  const mastered = new Set(progress?.masteredKnowledge || []);
  const thinking = new Set(progress?.demonstratedThinking || []);

  const missingKnowledge = outcome.essentialKnowledge.find((item) => !mastered.has(item));
  if (missingKnowledge) return missingKnowledge;

  const missingThinking = outcome.criticalThinkingGoals.find((item) => !thinking.has(item));
  return missingThinking || 'Consolidar e transferir o conhecimento para um novo contexto';
}

export function createLearningEquityPlan(params: {
  outcome: CommonCycleOutcome;
  localContext?: CulturalLearningContext;
  progress?: LearnerCycleProgress;
  decision: LearningDecision;
}): LearningEquityPlan {
  const localContext = params.localContext || {};
  const mastered = new Set(params.progress?.masteredKnowledge || []);
  const demonstrated = new Set(params.progress?.demonstratedThinking || []);

  const knowledgeCoverage = percentage(
    params.outcome.essentialKnowledge.filter((item) => mastered.has(item)).length,
    params.outcome.essentialKnowledge.length
  );
  const criticalThinkingCoverage = percentage(
    params.outcome.criticalThinkingGoals.filter((item) => demonstrated.has(item)).length,
    params.outcome.criticalThinkingGoals.length
  );
  const nextUniversalTarget = findNextTarget(params.outcome, params.progress);
  const convergenceStatus = resolveStatus(knowledgeCoverage, criticalThinkingCoverage);

  const place = [localContext.locality, localContext.region, localContext.country].filter(Boolean).join(', ');
  const references = localContext.culturalReferences?.length
    ? localContext.culturalReferences.join(', ')
    : 'experiências reais e referências familiares ao estudante';

  return {
    principle: 'personalized_path_common_knowledge',
    commonOutcome: params.outcome,
    localContext,
    knowledgeCoverage,
    criticalThinkingCoverage,
    convergenceStatus,
    nextUniversalTarget,
    contextualizationGuidance: [
      `Ensine o próximo alvo universal usando ${references}.`,
      place ? `Conecte exemplos ao contexto de ${place}, sem limitar o estudante a esse contexto.` : 'Use o contexto local como ponte, nunca como teto de aprendizagem.',
      `Respeite o ritmo individual e mantenha o movimento pedagógico atual: ${params.decision.type}.`,
      'Depois da compreensão contextual, peça transferência para uma situação diferente ou universal.',
    ],
    equitySafeguards: [
      'Não reduzir expectativas por origem, renda, localidade, idioma ou acesso tecnológico.',
      'Não exigir o mesmo caminho, velocidade, exemplo ou quantidade de apoio para todos.',
      'Mensurar domínio por evidências variadas, não apenas por tempo ou número de tentativas.',
      'Garantir que conhecimento essencial e pensamento crítico sejam alcançados ao final do ciclo.',
      'Tratar contexto cultural como fonte de significado, jamais como rótulo permanente.',
      'Oferecer apoio adicional antes de concluir que o estudante não é capaz.',
    ],
    teacherMessage: `Personalize o percurso, mas preserve o destino comum: ${params.outcome.title}. Próximo alvo: ${nextUniversalTarget}.`,
    learnerMessage: `Você pode aprender no seu ritmo e do seu jeito. O próximo passo é ${nextUniversalTarget}, sempre entendendo, questionando e formando suas próprias ideias.`,
  };
}

export function summarizeLearningEquityPlan(plan: LearningEquityPlan): string {
  return [
    `Common outcome: ${plan.commonOutcome.title} (${plan.commonOutcome.cycle})`,
    `Knowledge coverage: ${plan.knowledgeCoverage}%`,
    `Critical-thinking coverage: ${plan.criticalThinkingCoverage}%`,
    `Convergence: ${plan.convergenceStatus}`,
    `Next universal target: ${plan.nextUniversalTarget}`,
  ].join(' | ');
}
