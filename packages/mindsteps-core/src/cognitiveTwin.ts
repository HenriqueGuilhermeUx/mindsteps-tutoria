import type { CognitiveTwin, LearningEvent, LearningStrategyType, AgeGroup } from './types';

export function createInitialCognitiveTwin(params: {
  learnerId: string;
  ageGroup: AgeGroup;
  interests?: string[];
  learningStyle?: CognitiveTwin['learningStyle'];
}): CognitiveTwin {
  const now = new Date().toISOString();

  return {
    learnerId: params.learnerId,
    ageGroup: params.ageGroup,
    interests: params.interests || [],
    preferredExamples: params.interests || [],
    learningStyle: params.learningStyle || 'mixed',
    masteredConcepts: [],
    fragileConcepts: [],
    misconceptions: [],
    confidenceLevel: 5,
    frustrationSignals: [],
    successfulStrategies: [],
    updatedAt: now,
  };
}

function uniquePush<T>(list: T[], value?: T): T[] {
  if (!value) return list;
  return list.includes(value) ? list : [...list, value];
}

function clamp(value: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, value));
}

export function applyLearningEventToTwin(
  twin: CognitiveTwin,
  event: LearningEvent
): CognitiveTwin {
  const next: CognitiveTwin = {
    ...twin,
    interests: [...twin.interests],
    preferredExamples: [...twin.preferredExamples],
    masteredConcepts: [...twin.masteredConcepts],
    fragileConcepts: [...twin.fragileConcepts],
    misconceptions: [...twin.misconceptions],
    frustrationSignals: [...twin.frustrationSignals],
    successfulStrategies: [...twin.successfulStrategies],
    updatedAt: event.createdAt,
  };

  if (event.type === 'ConceptUnderstood' && event.concept) {
    next.masteredConcepts = uniquePush(next.masteredConcepts, event.concept);
    next.fragileConcepts = next.fragileConcepts.filter((concept) => concept !== event.concept);
    next.confidenceLevel = clamp(next.confidenceLevel + 0.5);
  }

  if (event.type === 'MisconceptionDetected') {
    if (event.concept) next.fragileConcepts = uniquePush(next.fragileConcepts, event.concept);
    if (event.evidence) next.misconceptions = uniquePush(next.misconceptions, event.evidence);
    next.confidenceLevel = clamp(next.confidenceLevel - 0.3);
  }

  if (event.type === 'FrustrationDetected') {
    if (event.evidence) next.frustrationSignals = uniquePush(next.frustrationSignals, event.evidence);
    next.confidenceLevel = clamp(next.confidenceLevel - 0.5);
  }

  if (event.type === 'ConfidenceImproved') {
    next.confidenceLevel = clamp(next.confidenceLevel + 1);
  }

  if (event.metadata?.interest && typeof event.metadata.interest === 'string') {
    next.interests = uniquePush(next.interests, event.metadata.interest);
    next.preferredExamples = uniquePush(next.preferredExamples, event.metadata.interest);
  }

  if (event.metadata?.selectedStrategy && typeof event.metadata.selectedStrategy === 'string' && event.type !== 'FrustrationDetected') {
    next.successfulStrategies = uniquePush(
      next.successfulStrategies,
      event.metadata.selectedStrategy as LearningStrategyType
    );
  }

  next.nextRecommendedStep = inferNextRecommendedStep(next);
  return next;
}

export function applyLearningEventsToTwin(
  twin: CognitiveTwin,
  events: LearningEvent[]
): CognitiveTwin {
  return events.reduce((current, event) => applyLearningEventToTwin(current, event), twin);
}

export function inferNextRecommendedStep(twin: CognitiveTwin): string {
  if (twin.frustrationSignals.length > 0 && twin.confidenceLevel < 4) {
    return 'Use a short guided hint and rebuild confidence before increasing difficulty.';
  }

  if (twin.fragileConcepts.length > 0) {
    return `Review fragile concept: ${twin.fragileConcepts[twin.fragileConcepts.length - 1]}.`;
  }

  if (twin.masteredConcepts.length > 0 && twin.confidenceLevel >= 7) {
    return 'Offer a slightly harder challenge or ask the learner to explain the idea in their own words.';
  }

  return 'Start with Socratic questioning and connect the task to learner interests.';
}

export function summarizeCognitiveTwin(twin: CognitiveTwin): string {
  return [
    `Age group: ${twin.ageGroup}.`,
    twin.interests.length ? `Interests: ${twin.interests.join(', ')}.` : '',
    twin.learningStyle ? `Learning style: ${twin.learningStyle}.` : '',
    twin.masteredConcepts.length ? `Mastered concepts: ${twin.masteredConcepts.slice(-5).join(', ')}.` : '',
    twin.fragileConcepts.length ? `Fragile concepts: ${twin.fragileConcepts.slice(-5).join(', ')}.` : '',
    twin.misconceptions.length ? `Known misconceptions: ${twin.misconceptions.slice(-3).join(' | ')}.` : '',
    `Confidence level: ${twin.confidenceLevel}/10.`,
    twin.nextRecommendedStep ? `Next recommendation: ${twin.nextRecommendedStep}` : '',
  ]
    .filter(Boolean)
    .join(' ');
}
