import type { LearningEvent, LearningEventType, Subject } from './types';

export function createLearningEvent(params: {
  learnerId: string;
  type: LearningEventType;
  subject?: Subject;
  concept?: string;
  evidence?: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}): LearningEvent {
  return {
    ...params,
    createdAt: new Date().toISOString(),
  };
}

export function isPositiveLearningEvent(event: LearningEvent): boolean {
  return ['ConceptUnderstood', 'ConfidenceImproved', 'ReflectionCompleted'].includes(event.type);
}

export function isSupportNeededEvent(event: LearningEvent): boolean {
  return ['MisconceptionDetected', 'FrustrationDetected'].includes(event.type);
}
