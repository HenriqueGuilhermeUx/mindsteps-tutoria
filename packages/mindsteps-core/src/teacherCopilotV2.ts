import type { Subject } from './types';
import type { KnowledgeMapEvolution } from './knowledgeMapEvolution';
import type { LongitudinalLearningProfile } from './longitudinalLearningEngine';
import type { PedagogicalPlan } from './pedagogicalAIPlanner';

export interface LearnerClassSnapshot {
  learnerId: string;
  displayName: string;
  subject: Subject;
  knowledgeMap: KnowledgeMapEvolution;
  longitudinal: LongitudinalLearningProfile;
  plan?: PedagogicalPlan;
}

export interface TeacherIntervention {
  learnerId: string;
  urgency: 'low' | 'medium' | 'high';
  reason: string;
  recommendedAction: string;
  evidence: string[];
}

export interface InstructionalGroup {
  id: string;
  learnerIds: string[];
  purpose: string;
  conceptIds: string[];
  strategy: string;
  temporary: true;
}

export interface TeacherCopilotBrief {
  subject: Subject;
  interventions: TeacherIntervention[];
  groups: InstructionalGroup[];
  readyForChallenge: string[];
  classCoverage: number;
  suggestedNextLesson: string;
  teacherDecisionsRequired: string[];
  generatedAt: string;
}

export function buildTeacherCopilotBrief(learners: LearnerClassSnapshot[]): TeacherCopilotBrief {
  const subject = learners[0]?.subject || 'geral';
  const interventions: TeacherIntervention[] = learners.flatMap((learner) => {
    const fragile = learner.longitudinal.fragileKnowledge;
    const bottlenecks = learner.knowledgeMap.bottlenecks;
    if (!fragile.length && !bottlenecks.length) return [];
    return [{
      learnerId: learner.learnerId,
      urgency: fragile.length >= 3 || bottlenecks.length >= 2 ? 'high' as const : 'medium' as const,
      reason: `Conhecimento frágil: ${fragile.join(', ') || 'nenhum'}; gargalos: ${bottlenecks.join(', ') || 'nenhum'}.`,
      recommendedAction: 'Realizar intervenção curta, verificar pré-requisito e usar representação diferente antes de nova avaliação.',
      evidence: [...fragile.map((id) => `trajetória frágil:${id}`), ...bottlenecks.map((id) => `gargalo:${id}`)],
    }];
  }).sort((a, b) => (a.urgency === 'high' ? -1 : 1) - (b.urgency === 'high' ? -1 : 1));

  const conceptGroups = new Map<string, string[]>();
  learners.forEach((learner) => learner.knowledgeMap.nextBestConcepts.slice(0, 2).forEach((conceptId) => {
    conceptGroups.set(conceptId, [...(conceptGroups.get(conceptId) || []), learner.learnerId]);
  }));
  const groups: InstructionalGroup[] = [...conceptGroups.entries()]
    .filter(([, learnerIds]) => learnerIds.length >= 2)
    .map(([conceptId, learnerIds]) => ({
      id: `group:${conceptId}`,
      learnerIds,
      purpose: `Trabalhar ${conceptId} com apoio compartilhado e evidência individual.`,
      conceptIds: [conceptId],
      strategy: 'Mini-aula curta, prática em pares e verificação individual de compreensão.',
      temporary: true,
    }));

  const readyForChallenge = learners
    .filter((learner) => learner.knowledgeMap.coverage >= 75 && learner.longitudinal.fragileKnowledge.length === 0)
    .map((learner) => learner.learnerId);
  const classCoverage = learners.length
    ? Math.round(learners.reduce((sum, learner) => sum + learner.knowledgeMap.coverage, 0) / learners.length)
    : 0;
  const mostCommonConcept = [...conceptGroups.entries()].sort((a, b) => b[1].length - a[1].length)[0]?.[0];

  return {
    subject,
    interventions,
    groups,
    readyForChallenge,
    classCoverage,
    suggestedNextLesson: mostCommonConcept
      ? `Priorizar ${mostCommonConcept}, com diferenciação de apoio e uma saída individual de evidência.`
      : 'Coletar diagnóstico curto antes de definir a próxima sequência.',
    teacherDecisionsRequired: [
      'Confirmar ou rejeitar agrupamentos sugeridos.',
      'Revisar intervenções de alta urgência.',
      'Validar o próximo objetivo comum da turma.',
    ],
    generatedAt: new Date().toISOString(),
  };
}
