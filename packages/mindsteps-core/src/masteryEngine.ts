import type { LearningEvent, Subject } from './types';

export type MasteryStage = 'introduced' | 'practiced' | 'applied' | 'explained' | 'taught' | 'mastered';

export interface ConceptMasteryEvidence {
  type: 'attempt' | 'success' | 'transfer' | 'explanation' | 'teaching' | 'retention';
  description: string;
  createdAt: string;
  weight: number;
}

export interface ConceptMastery {
  conceptId: string;
  conceptTitle: string;
  subject: Subject;
  stage: MasteryStage;
  score: number;
  confidence: number;
  evidence: ConceptMasteryEvidence[];
  nextRequirement: string;
  updatedAt: string;
}

const STAGE_THRESHOLDS: Array<{ stage: MasteryStage; score: number }> = [
  { stage: 'mastered', score: 90 },
  { stage: 'taught', score: 78 },
  { stage: 'explained', score: 65 },
  { stage: 'applied', score: 50 },
  { stage: 'practiced', score: 25 },
  { stage: 'introduced', score: 0 },
];

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function inferStage(score: number): MasteryStage {
  return STAGE_THRESHOLDS.find((item) => score >= item.score)?.stage || 'introduced';
}

function getNextRequirement(stage: MasteryStage): string {
  switch (stage) {
    case 'introduced':
      return 'Praticar com pelo menos dois exemplos guiados.';
    case 'practiced':
      return 'Aplicar o conceito em uma situação diferente.';
    case 'applied':
      return 'Explicar o conceito com as próprias palavras.';
    case 'explained':
      return 'Ensinar ou orientar outra pessoa em um exemplo.';
    case 'taught':
      return 'Demonstrar retenção após um intervalo de tempo.';
    case 'mastered':
      return 'Manter o domínio com desafios de transferência.';
  }
}

function eventWeight(event: LearningEvent): number {
  switch (event.type) {
    case 'ConceptUnderstood':
      return 18;
    case 'ReflectionCompleted':
      return 12;
    case 'ConfidenceImproved':
      return 8;
    case 'CuriositySignalDetected':
      return 5;
    case 'MisconceptionDetected':
      return -10;
    case 'FrustrationDetected':
      return -6;
    case 'ConfidenceDecreased':
      return -5;
    default:
      return 2;
  }
}

export function createConceptMastery(params: {
  conceptId: string;
  conceptTitle: string;
  subject: Subject;
}): ConceptMastery {
  const now = new Date().toISOString();
  return {
    conceptId: params.conceptId,
    conceptTitle: params.conceptTitle,
    subject: params.subject,
    stage: 'introduced',
    score: 5,
    confidence: 4,
    evidence: [],
    nextRequirement: getNextRequirement('introduced'),
    updatedAt: now,
  };
}

export function applyEvidenceToMastery(
  mastery: ConceptMastery,
  evidence: ConceptMasteryEvidence
): ConceptMastery {
  const score = clamp(mastery.score + evidence.weight);
  const stage = inferStage(score);

  return {
    ...mastery,
    score,
    stage,
    confidence: clamp(mastery.confidence * 10 + evidence.weight / 2) / 10,
    evidence: [...mastery.evidence, evidence].slice(-20),
    nextRequirement: getNextRequirement(stage),
    updatedAt: evidence.createdAt,
  };
}

export function applyLearningEventsToMastery(
  mastery: ConceptMastery,
  events: LearningEvent[]
): ConceptMastery {
  return events.reduce((current, event) => {
    const weight = eventWeight(event);
    const evidence: ConceptMasteryEvidence = {
      type: event.type === 'ConceptUnderstood'
        ? 'success'
        : event.type === 'ReflectionCompleted'
          ? 'explanation'
          : event.type === 'MisconceptionDetected'
            ? 'attempt'
            : 'attempt',
      description: event.evidence || `${event.type} registrado para ${event.concept || mastery.conceptTitle}.`,
      createdAt: event.createdAt,
      weight,
    };

    return applyEvidenceToMastery(current, evidence);
  }, mastery);
}

export function isConceptMastered(mastery: ConceptMastery): boolean {
  return mastery.stage === 'mastered' && mastery.score >= 90;
}

export function summarizeConceptMastery(mastery: ConceptMastery): string {
  return `${mastery.conceptTitle}: ${mastery.stage} (${mastery.score}%). Próximo requisito: ${mastery.nextRequirement}`;
}
