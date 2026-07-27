import type { Subject } from './types';
import type { KnowledgeMapEvolution } from './knowledgeMapEvolution';
import type { LongitudinalLearningProfile } from './longitudinalLearningEngine';

export type PlanningHorizon = 'next_session' | 'week' | 'month' | 'term';

export interface PlannedLearningAction {
  id: string;
  horizon: PlanningHorizon;
  subject: Subject;
  conceptId: string;
  objective: string;
  activityType: 'diagnostic' | 'instruction' | 'guided_practice' | 'independent_practice' | 'review' | 'transfer' | 'assessment';
  estimatedMinutes: number;
  successEvidence: string[];
  prerequisiteChecks: string[];
  adaptationRule: string;
  priority: number;
}

export interface PedagogicalPlan {
  learnerId: string;
  actions: PlannedLearningAction[];
  weeklyGoal: string;
  monthlyGoal: string;
  termGoal: string;
  teacherReviewRequired: boolean;
  generatedAt: string;
  safeguards: string[];
}

function actionId(conceptId: string, activityType: PlannedLearningAction['activityType']): string {
  return `${conceptId}:${activityType}:${Date.now()}`;
}

export function createPedagogicalPlan(params: {
  learnerId: string;
  subject: Subject;
  knowledgeMap: KnowledgeMapEvolution;
  longitudinal: LongitudinalLearningProfile;
}): PedagogicalPlan {
  const concepts = [...new Set([
    ...params.longitudinal.reviewQueue.slice(0, 3).map((item) => item.conceptId),
    ...params.knowledgeMap.nextBestConcepts.slice(0, 5),
  ])];

  const actions: PlannedLearningAction[] = concepts.flatMap((conceptId, index) => {
    const needsReview = params.longitudinal.reviewQueue.some((item) => item.conceptId === conceptId);
    const base: PlannedLearningAction = {
      id: actionId(conceptId, needsReview ? 'review' : 'guided_practice'),
      horizon: index < 2 ? 'next_session' : index < 4 ? 'week' : 'month',
      subject: params.subject,
      conceptId,
      objective: needsReview ? 'Recuperar e estabilizar conhecimento frágil.' : 'Avançar no mapa preservando pré-requisitos.',
      activityType: needsReview ? 'review' : 'guided_practice',
      estimatedMinutes: needsReview ? 12 : 20,
      successEvidence: ['Explicação com palavras próprias.', 'Aplicação em exemplo diferente.', 'Confiança compatível com desempenho.'],
      prerequisiteChecks: params.knowledgeMap.nodes.find((node) => node.id === conceptId)?.prerequisiteIds || [],
      adaptationRule: 'Se houver duas tentativas sem progresso, trocar representação e aumentar apoio sem reduzir o objetivo.',
      priority: 100 - index * 10,
    };
    const transfer: PlannedLearningAction | null = params.knowledgeMap.nodes.find((node) => node.id === conceptId)?.masteryScore! >= 70
      ? {
          ...base,
          id: actionId(conceptId, 'transfer'),
          horizon: 'week',
          activityType: 'transfer',
          objective: 'Verificar uso do conceito em contexto novo.',
          estimatedMinutes: 15,
          priority: base.priority - 5,
        }
      : null;
    return transfer ? [base, transfer] : [base];
  });

  return {
    learnerId: params.learnerId,
    actions: actions.sort((a, b) => b.priority - a.priority),
    weeklyGoal: 'Consolidar prioridades imediatas e produzir pelo menos uma evidência de aplicação independente.',
    monthlyGoal: 'Reduzir conhecimento frágil e ampliar cobertura do mapa de aprendizagem.',
    termGoal: 'Alcançar resultados essenciais com retenção, explicação, transferência e autonomia progressiva.',
    teacherReviewRequired: true,
    generatedAt: new Date().toISOString(),
    safeguards: [
      'O plano é recomendação pedagógica revisável, não decisão automática definitiva.',
      'Não reduzir expectativas essenciais com base em origem, ritmo ou desempenho temporário.',
      'Professores podem editar, rejeitar ou substituir qualquer ação.',
    ],
  };
}
