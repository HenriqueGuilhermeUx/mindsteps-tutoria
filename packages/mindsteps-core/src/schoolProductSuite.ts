import type { Subject } from './types';
import type { KnowledgeMapEvolution } from './knowledgeMapEvolution';
import type { LongitudinalLearningProfile } from './longitudinalLearningEngine';
import type { PedagogicalPlan } from './pedagogicalAIPlanner';
import type { TeacherCopilotBrief } from './teacherCopilotV2';

export interface BnccSkillReference {
  code: string;
  title: string;
  description: string;
  subject: Subject;
  gradeBand: string;
  sourceVersion: string;
}

export interface CurriculumAlignment {
  conceptId: string;
  skillCodes: string[];
  evidenceRequired: string[];
  status: 'not_started' | 'in_progress' | 'evidenced' | 'mastered';
  confidence: number;
}

export interface AssessmentItem {
  id: string;
  subject: Subject;
  conceptId: string;
  skillCodes: string[];
  type: 'multiple_choice' | 'open_response' | 'oral' | 'project' | 'performance' | 'portfolio';
  prompt: string;
  rubric: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  checksTransfer: boolean;
}

export interface AssessmentResult {
  assessmentId: string;
  learnerId: string;
  score: number;
  rubricEvidence: Array<{ criterion: string; level: number; evidence: string }>;
  misconceptions: string[];
  nextAction: string;
  completedAt: string;
}

export interface LearningTrailStep {
  id: string;
  conceptId: string;
  title: string;
  objective: string;
  activityType: 'learn' | 'practice' | 'reflect' | 'assess' | 'transfer' | 'create';
  prerequisiteStepIds: string[];
  completionEvidence: string[];
  optional: boolean;
}

export interface LearningTrail {
  id: string;
  title: string;
  subject: Subject;
  learnerId?: string;
  skillCodes: string[];
  steps: LearningTrailStep[];
  estimatedMinutes: number;
  status: 'draft' | 'active' | 'completed' | 'paused';
}

export interface IndividualLearningPlan {
  learnerId: string;
  essentialGoals: string[];
  currentPriorities: string[];
  supports: string[];
  extensionOpportunities: string[];
  reviewDates: string[];
  learnerVoice: string[];
  teacherNotes: string[];
  generatedAt: string;
}

export interface SchoolAnalytics {
  learners: number;
  averageCoverage: number;
  conceptsAtRisk: Array<{ conceptId: string; learnersAffected: number }>;
  interventionCount: number;
  readyForChallengeCount: number;
  curriculumCoverage: number;
  evidenceQuality: number;
}

export interface SchoolDashboard {
  schoolId: string;
  schoolName: string;
  periodLabel: string;
  analytics: SchoolAnalytics;
  teacherBriefs: TeacherCopilotBrief[];
  alerts: string[];
  generatedAt: string;
}

export interface LearnerReport {
  learnerId: string;
  periodLabel: string;
  summary: string;
  strengths: string[];
  priorities: string[];
  curriculumEvidence: CurriculumAlignment[];
  nextPlan: PedagogicalPlan;
  languageForFamily: string;
  generatedAt: string;
}

export function buildIndividualLearningPlan(params: {
  learnerId: string;
  map: KnowledgeMapEvolution;
  longitudinal: LongitudinalLearningProfile;
  plan: PedagogicalPlan;
}): IndividualLearningPlan {
  return {
    learnerId: params.learnerId,
    essentialGoals: params.map.nextBestConcepts.slice(0, 3),
    currentPriorities: [...params.longitudinal.fragileKnowledge, ...params.map.bottlenecks].slice(0, 5),
    supports: params.longitudinal.fragileKnowledge.length
      ? ['Revisão espaçada', 'Nova representação', 'Prática guiada com retirada gradual de apoio']
      : ['Prática independente com feedback', 'Transferência para novos contextos'],
    extensionOpportunities: params.longitudinal.durableStrengths.slice(0, 3).map((id) => `Criar ou ensinar uma aplicação de ${id}.`),
    reviewDates: params.longitudinal.trajectories.map((item) => item.recommendedReviewAt).filter(Boolean) as string[],
    learnerVoice: ['Registrar estratégia preferida nesta tarefa.', 'Permitir escolha entre duas atividades equivalentes.'],
    teacherNotes: [`Plano gerado com ${params.plan.actions.length} ações; requer validação docente.`],
    generatedAt: new Date().toISOString(),
  };
}

export function buildLearnerReport(params: {
  learnerId: string;
  periodLabel: string;
  map: KnowledgeMapEvolution;
  longitudinal: LongitudinalLearningProfile;
  curriculum: CurriculumAlignment[];
  plan: PedagogicalPlan;
}): LearnerReport {
  const strengths = params.longitudinal.durableStrengths;
  const priorities = [...new Set([...params.longitudinal.fragileKnowledge, ...params.map.bottlenecks])];
  return {
    learnerId: params.learnerId,
    periodLabel: params.periodLabel,
    summary: `Cobertura do mapa: ${params.map.coverage}%. Pontos fortes duráveis: ${strengths.length}. Prioridades atuais: ${priorities.length}.`,
    strengths,
    priorities,
    curriculumEvidence: params.curriculum,
    nextPlan: params.plan,
    languageForFamily: priorities.length
      ? 'Há avanços importantes e alguns conhecimentos que precisam de apoio planejado. O foco será consolidar essas bases sem reduzir os objetivos de aprendizagem.'
      : 'A aprendizagem está consistente. O próximo passo será ampliar autonomia, explicação e aplicação em novos contextos.',
    generatedAt: new Date().toISOString(),
  };
}

export function buildSchoolDashboard(params: {
  schoolId: string;
  schoolName: string;
  periodLabel: string;
  maps: KnowledgeMapEvolution[];
  teacherBriefs: TeacherCopilotBrief[];
  curriculum: CurriculumAlignment[];
}): SchoolDashboard {
  const riskCounts = new Map<string, number>();
  params.maps.forEach((map) => map.bottlenecks.forEach((id) => riskCounts.set(id, (riskCounts.get(id) || 0) + 1)));
  const learners = params.maps.length;
  const averageCoverage = learners ? Math.round(params.maps.reduce((sum, map) => sum + map.coverage, 0) / learners) : 0;
  const evidenced = params.curriculum.filter((item) => ['evidenced', 'mastered'].includes(item.status)).length;
  const curriculumCoverage = params.curriculum.length ? Math.round((evidenced / params.curriculum.length) * 100) : 0;
  const evidenceQuality = params.curriculum.length
    ? Math.round(params.curriculum.reduce((sum, item) => sum + item.confidence, 0) / params.curriculum.length)
    : 0;
  const interventionCount = params.teacherBriefs.reduce((sum, brief) => sum + brief.interventions.length, 0);
  const readyForChallengeCount = new Set(params.teacherBriefs.flatMap((brief) => brief.readyForChallenge)).size;

  return {
    schoolId: params.schoolId,
    schoolName: params.schoolName,
    periodLabel: params.periodLabel,
    analytics: {
      learners,
      averageCoverage,
      conceptsAtRisk: [...riskCounts.entries()].map(([conceptId, learnersAffected]) => ({ conceptId, learnersAffected })).sort((a, b) => b.learnersAffected - a.learnersAffected),
      interventionCount,
      readyForChallengeCount,
      curriculumCoverage,
      evidenceQuality,
    },
    teacherBriefs: params.teacherBriefs,
    alerts: [
      ...(interventionCount ? [`${interventionCount} intervenção(ões) recomendada(s).`] : []),
      ...(curriculumCoverage < 60 ? ['Cobertura curricular abaixo de 60% no período.'] : []),
      ...(evidenceQuality < 50 ? ['Qualidade/confiança das evidências precisa ser ampliada.'] : []),
    ],
    generatedAt: new Date().toISOString(),
  };
}

export function createAdaptiveAssessment(params: {
  subject: Subject;
  conceptId: string;
  skillCodes: string[];
  currentMastery: number;
}): AssessmentItem[] {
  const baseDifficulty = params.currentMastery >= 80 ? 4 : params.currentMastery >= 50 ? 3 : 2;
  return [
    {
      id: `${params.conceptId}:explain`,
      subject: params.subject,
      conceptId: params.conceptId,
      skillCodes: params.skillCodes,
      type: 'open_response',
      prompt: 'Explique a ideia com suas próprias palavras e dê um exemplo.',
      rubric: ['Precisão conceitual', 'Clareza', 'Exemplo pertinente'],
      difficulty: Math.min(5, baseDifficulty) as 1 | 2 | 3 | 4 | 5,
      checksTransfer: false,
    },
    {
      id: `${params.conceptId}:transfer`,
      subject: params.subject,
      conceptId: params.conceptId,
      skillCodes: params.skillCodes,
      type: 'performance',
      prompt: 'Aplique a ideia em uma situação nova e justifique por que ela funciona.',
      rubric: ['Identificação da estrutura', 'Aplicação', 'Justificativa', 'Reconhecimento de limites'],
      difficulty: Math.min(5, baseDifficulty + 1) as 1 | 2 | 3 | 4 | 5,
      checksTransfer: true,
    },
  ];
}
