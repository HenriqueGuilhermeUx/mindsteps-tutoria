import type { LearningEvent, Subject } from './types';
import type { LearningState } from './learningState';
import type { MisconceptionPattern } from './misconceptionEngine';

export type LearningSignalType =
  | 'ConfidenceChanged'
  | 'CuriosityDetected'
  | 'MisconceptionDetected'
  | 'RecoveryNeeded'
  | 'ChallengeReady'
  | 'ReflectionSuggested'
  | 'TeacherAttentionSuggested'
  | 'FamilySupportSuggested';

export interface LearningSignal {
  type: LearningSignalType;
  learnerId: string;
  subject?: Subject;
  strength: number;
  reason: string;
  evidence?: string;
  createdAt: string;
}

function signal(params: Omit<LearningSignal, 'createdAt'>): LearningSignal {
  return {
    ...params,
    strength: Math.max(0, Math.min(10, params.strength)),
    createdAt: new Date().toISOString(),
  };
}

export function extractLearningSignals(params: {
  learnerId: string;
  subject: Subject;
  events: LearningEvent[];
  learningState: LearningState;
  misconceptions?: MisconceptionPattern[];
}): LearningSignal[] {
  const signals: LearningSignal[] = [];
  const latestEvidence = params.events[params.events.length - 1]?.evidence;

  if (params.learningState.confidence <= 3) {
    signals.push(signal({
      type: 'RecoveryNeeded',
      learnerId: params.learnerId,
      subject: params.subject,
      strength: 9,
      reason: 'Learner confidence is low or frustration was detected.',
      evidence: latestEvidence,
    }));
  }

  if (params.learningState.confidence >= 7 && params.learningState.cognitiveLoad <= 5) {
    signals.push(signal({
      type: 'ChallengeReady',
      learnerId: params.learnerId,
      subject: params.subject,
      strength: 7,
      reason: 'Learner appears confident and cognitive load is manageable.',
      evidence: latestEvidence,
    }));
  }

  if (params.learningState.curiosity >= 7) {
    signals.push(signal({
      type: 'CuriosityDetected',
      learnerId: params.learnerId,
      subject: params.subject,
      strength: params.learningState.curiosity,
      reason: 'Learner curiosity level is high enough to support exploratory learning.',
      evidence: latestEvidence,
    }));
  }

  for (const misconception of params.misconceptions || []) {
    signals.push(signal({
      type: 'MisconceptionDetected',
      learnerId: params.learnerId,
      subject: misconception.subject,
      strength: misconception.severity === 'high' ? 9 : misconception.severity === 'medium' ? 6 : 3,
      reason: misconception.description,
      evidence: misconception.evidence[0],
    }));
  }

  if (params.learningState.label === 'frustrated' || params.learningState.cognitiveLoad >= 8) {
    signals.push(signal({
      type: 'TeacherAttentionSuggested',
      learnerId: params.learnerId,
      subject: params.subject,
      strength: 8,
      reason: 'Repeated support may be needed if this state persists.',
      evidence: latestEvidence,
    }));
  }

  if (params.learningState.label === 'curious') {
    signals.push(signal({
      type: 'FamilySupportSuggested',
      learnerId: params.learnerId,
      subject: params.subject,
      strength: 5,
      reason: 'Curiosity can be reinforced with a simple home conversation or observation.',
      evidence: latestEvidence,
    }));
  }

  signals.push(signal({
    type: 'ReflectionSuggested',
    learnerId: params.learnerId,
    subject: params.subject,
    strength: 4,
    reason: 'Short reflection helps the learner become aware of progress and confusion.',
    evidence: latestEvidence,
  }));

  return signals;
}

export function summarizeLearningSignals(signals: LearningSignal[]): string {
  if (signals.length === 0) return 'No learning signals generated.';

  return signals
    .map((item) => `${item.type}(${item.strength}/10): ${item.reason}`)
    .join(' | ');
}
