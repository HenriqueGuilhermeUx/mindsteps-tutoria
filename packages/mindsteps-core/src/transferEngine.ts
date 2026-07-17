import type { LearningEvent, Subject } from './types';
import type { LearningDecision } from './learningDecisionEngine';
import type { IntellectualGrowthProfile } from './intellectualGrowthEngine';

export type TransferLevel = 'not_observed' | 'surface_connection' | 'guided_transfer' | 'independent_transfer';

export interface TransferEvidence {
  description: string;
  source: 'message' | 'event' | 'growth_profile';
  strength: number;
  observedAt: string;
}

export interface TransferChallenge {
  sourceContext: string;
  targetContext: string;
  prompt: string;
  successCriteria: string[];
  supportMode: 'none' | 'light' | 'guided';
}

export interface KnowledgeTransferAssessment {
  learnerId: string;
  subject: Subject;
  concept?: string;
  level: TransferLevel;
  score: number;
  confidence: number;
  evidence: TransferEvidence[];
  challenge: TransferChallenge;
  shouldChallengeNow: boolean;
  safeguards: string[];
  generatedAt: string;
}

function clamp(value: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function detectMessageEvidence(message: string, now: string): TransferEvidence[] {
  const text = message.toLowerCase();
  const result: TransferEvidence[] = [];

  if (/tamb[eé]m serve|em outra situa[cç][aã]o|parece com|isso acontece quando/.test(text)) {
    result.push({
      description: 'O estudante conectou o conceito a outro contexto.',
      source: 'message',
      strength: 7,
      observedAt: now,
    });
  }

  if (/eu usaria|daria para usar|aplicaria|se fosse em/.test(text)) {
    result.push({
      description: 'O estudante propôs uma aplicação própria do conceito.',
      source: 'message',
      strength: 8,
      observedAt: now,
    });
  }

  if (/porque a ideia [eé] a mesma|o que muda [eé]|a regra continua/.test(text)) {
    result.push({
      description: 'O estudante identificou a estrutura comum entre contextos.',
      source: 'message',
      strength: 9,
      observedAt: now,
    });
  }

  return result;
}

function detectEventEvidence(events: LearningEvent[]): TransferEvidence[] {
  return events.flatMap((event) => {
    if (event.type !== 'ConceptMastered' && event.type !== 'ReflectionCompleted') return [];
    return [{
      description: event.evidence || 'A interação gerou evidência compatível com consolidação ou reflexão.',
      source: 'event' as const,
      strength: event.type === 'ConceptMastered' ? 6 : 5,
      observedAt: event.createdAt,
    }];
  });
}

function levelFrom(score: number, evidenceCount: number): TransferLevel {
  if (evidenceCount === 0) return 'not_observed';
  if (score >= 8) return 'independent_transfer';
  if (score >= 6) return 'guided_transfer';
  return 'surface_connection';
}

function createChallenge(params: {
  subject: Subject;
  concept?: string;
  level: TransferLevel;
  decision: LearningDecision;
}): TransferChallenge {
  const concept = params.concept || 'a ideia estudada';
  const supportMode: TransferChallenge['supportMode'] =
    params.decision.type === 'recover_confidence' || params.decision.type === 'scaffold'
      ? 'guided'
      : params.level === 'not_observed'
        ? 'light'
        : 'none';

  return {
    sourceContext: params.subject,
    targetContext: 'um contexto diferente do exemplo original',
    prompt: `Onde ${concept} poderia aparecer fora deste exemplo? Explique o que permanece igual e o que muda.`,
    successCriteria: [
      'Aplica o conceito em uma situação diferente',
      'Explica a estrutura comum entre os contextos',
      'Justifica por que a aplicação faz sentido',
    ],
    supportMode,
  };
}

export function assessKnowledgeTransfer(params: {
  learnerId: string;
  subject: Subject;
  concept?: string;
  message: string;
  events: LearningEvent[];
  decision: LearningDecision;
  intellectualGrowth: IntellectualGrowthProfile;
}): KnowledgeTransferAssessment {
  const now = new Date().toISOString();
  const evidence = [
    ...detectMessageEvidence(params.message, now),
    ...detectEventEvidence(params.events),
  ];
  const transferIndicator = params.intellectualGrowth.indicators.find((item) => item.dimension === 'transfer');

  if (transferIndicator && transferIndicator.status !== 'insufficient_evidence') {
    evidence.push({
      description: `O perfil de crescimento intelectual registrou transferência em ${transferIndicator.score}/10.`,
      source: 'growth_profile',
      strength: transferIndicator.score,
      observedAt: now,
    });
  }

  const score = clamp(
    evidence.length ? evidence.reduce((sum, item) => sum + item.strength, 0) / evidence.length : 0
  );
  const confidence = clamp(evidence.length * 2 + (transferIndicator?.confidence || 0) / 2);
  const level = levelFrom(score, evidence.length);
  const shouldChallengeNow =
    !['recover_confidence', 'scaffold'].includes(params.decision.type) && level !== 'independent_transfer';

  return {
    learnerId: params.learnerId,
    subject: params.subject,
    concept: params.concept,
    level,
    score,
    confidence,
    evidence,
    challenge: createChallenge({
      subject: params.subject,
      concept: params.concept,
      level,
      decision: params.decision,
    }),
    shouldChallengeNow,
    safeguards: [
      'Não confundir repetição de palavras com transferência real.',
      'Não exigir transferência enquanto o estudante estiver frustrado ou sem o pré-requisito necessário.',
      'Aceitar múltiplas formas válidas de aplicação e justificativa.',
      'Tratar uma transferência bem-sucedida como evidência revisável, não como domínio definitivo.',
    ],
    generatedAt: now,
  };
}

export function summarizeKnowledgeTransfer(assessment: KnowledgeTransferAssessment): string {
  return [
    `Transfer level: ${assessment.level}.`,
    `Score: ${assessment.score}/10 with ${assessment.confidence}/10 confidence.`,
    assessment.shouldChallengeNow ? `Next challenge: ${assessment.challenge.prompt}` : 'Do not force a transfer challenge now.',
  ].join(' ');
}
