import type { LearningEvent, LearningStrategyType, Subject } from './types';
import type { LearningState } from './learningState';
import type { FlowInsight } from './flowEngine';
import type { SessionMemoryInsight } from './sessionMemoryEngine';
import type { TeachingStrategyMemory, TeachingStrategyRecord } from './teachingStrategyMemory';

export type StrategyEvaluationStatus =
  | 'working'
  | 'promising'
  | 'uncertain'
  | 'not_working'
  | 'harmful_to_continue';

export interface TeachingStrategyEvaluation {
  subject: Subject;
  concept?: string;
  strategy: LearningStrategyType;
  status: StrategyEvaluationStatus;
  effectivenessScore: number;
  confidenceScore: number;
  shouldContinue: boolean;
  shouldChangeRepresentation: boolean;
  shouldReduceSupport: boolean;
  shouldIncreaseSupport: boolean;
  evidence: string[];
  reason: string;
  nextStrategyGuidance: string;
  safeguards: string[];
  evaluatedAt: string;
}

function clamp(value: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function findHistoricalRecord(params: {
  memory?: TeachingStrategyMemory;
  subject: Subject;
  concept?: string;
  strategy: LearningStrategyType;
}): TeachingStrategyRecord | undefined {
  return params.memory?.records.find((record) => {
    const subjectMatches = record.subject === params.subject || record.subject === 'geral';
    const conceptMatches = !params.concept || !record.concept || record.concept === params.concept;
    return subjectMatches && conceptMatches && record.strategy === params.strategy;
  });
}

function eventOutcome(events: LearningEvent[]): { positive: number; negative: number; evidence: string[] } {
  const positiveTypes = new Set([
    'ConceptUnderstood',
    'ConfidenceImproved',
    'ReflectionCompleted',
    'CuriositySignalDetected',
    'ConceptMastered',
  ]);
  const negativeTypes = new Set([
    'FrustrationDetected',
    'MisconceptionDetected',
    'ConfidenceDecreased',
  ]);

  let positive = 0;
  let negative = 0;
  const evidence: string[] = [];

  for (const event of events) {
    if (positiveTypes.has(event.type)) positive += 1;
    if (negativeTypes.has(event.type)) negative += 1;
    if ((positiveTypes.has(event.type) || negativeTypes.has(event.type)) && event.evidence) {
      evidence.push(event.evidence);
    }
  }

  return { positive, negative, evidence: evidence.slice(-6) };
}

export function evaluateTeachingStrategy(params: {
  subject: Subject;
  concept?: string;
  strategy: LearningStrategyType;
  events: LearningEvent[];
  learningState: LearningState;
  flow: FlowInsight;
  sessionMemory: SessionMemoryInsight;
  memory?: TeachingStrategyMemory;
}): TeachingStrategyEvaluation {
  const historical = findHistoricalRecord(params);
  const outcome = eventOutcome(params.events);
  const historicalRate = historical
    ? historical.successes / Math.max(1, historical.attempts)
    : 0.5;

  let score = 5;
  score += (outcome.positive - outcome.negative) * 1.25;
  score += (historicalRate - 0.5) * 4;
  score += params.learningState.confidence >= 6 ? 1 : 0;
  score += params.flow.zone === 'productive_flow' ? 1 : 0;
  score -= params.flow.zone === 'too_hard' ? 2 : 0;
  score -= params.sessionMemory.stuckScore >= 7 ? 2 : 0;
  score -= params.sessionMemory.shouldChangeApproach ? 2 : 0;
  score = clamp(score);

  const confidenceScore = clamp(
    2 +
      Math.min(4, params.events.length) +
      Math.min(3, historical?.attempts || 0) +
      (outcome.positive + outcome.negative > 0 ? 1 : 0)
  );

  let status: StrategyEvaluationStatus = 'uncertain';
  if (params.sessionMemory.stuckScore >= 8 || params.learningState.label === 'frustrated') {
    status = 'harmful_to_continue';
  } else if (score <= 3 || params.sessionMemory.shouldChangeApproach) {
    status = 'not_working';
  } else if (score >= 8 && confidenceScore >= 6) {
    status = 'working';
  } else if (score >= 6) {
    status = 'promising';
  }

  const shouldContinue = status === 'working' || status === 'promising';
  const shouldChangeRepresentation = status === 'not_working' || status === 'harmful_to_continue';
  const shouldIncreaseSupport =
    params.flow.zone === 'too_hard' ||
    params.learningState.label === 'needs_support' ||
    params.learningState.label === 'frustrated';
  const shouldReduceSupport =
    params.flow.zone === 'too_easy' || params.learningState.label === 'ready_for_challenge';

  const evidence = [
    ...outcome.evidence,
    historical
      ? `Historical success: ${Math.round(historicalRate * 100)}% over ${historical.attempts} attempts.`
      : 'No historical evidence for this strategy yet.',
    `Current flow zone: ${params.flow.zone}.`,
    `Session stuck score: ${params.sessionMemory.stuckScore}/10.`,
  ];

  const nextStrategyGuidance = shouldChangeRepresentation
    ? 'Change the representation, example or teaching method. Do not merely rephrase the previous explanation.'
    : shouldIncreaseSupport
      ? 'Keep the learning goal, but reduce complexity and add one concrete support at a time.'
      : shouldReduceSupport
        ? 'Preserve the strategy while removing unnecessary support and asking for transfer or justification.'
        : shouldContinue
          ? 'Continue briefly, then verify understanding with observable evidence before repeating the same move.'
          : 'Collect one short piece of evidence before deciding whether to continue or change the strategy.';

  return {
    subject: params.subject,
    concept: params.concept,
    strategy: params.strategy,
    status,
    effectivenessScore: score,
    confidenceScore,
    shouldContinue,
    shouldChangeRepresentation,
    shouldReduceSupport,
    shouldIncreaseSupport,
    evidence,
    reason: `The strategy is ${status.replaceAll('_', ' ')} based on current outcomes, flow, session persistence and historical evidence.`,
    nextStrategyGuidance,
    safeguards: [
      'Do not treat one successful or unsuccessful turn as proof of a permanent learning preference.',
      'Do not optimize for speed at the expense of understanding, dignity or autonomy.',
      'Change the teaching method before lowering the learning expectation.',
      'Require observable evidence before declaring that a strategy works for this learner.',
      'Allow the learner to reject, revise or choose between responsible strategies when appropriate.',
    ],
    evaluatedAt: new Date().toISOString(),
  };
}

export function summarizeTeachingStrategyEvaluation(evaluation: TeachingStrategyEvaluation): string {
  return [
    `${evaluation.strategy}: ${evaluation.status}`,
    `effectiveness ${evaluation.effectivenessScore}/10`,
    `confidence ${evaluation.confidenceScore}/10`,
    evaluation.nextStrategyGuidance,
  ].join(' | ');
}
