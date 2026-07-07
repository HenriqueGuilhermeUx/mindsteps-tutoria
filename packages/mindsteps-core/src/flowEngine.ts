import type { LearningState } from './learningState';
import type { LearningSignal } from './learningSignals';

export type FlowZone = 'too_easy' | 'productive_flow' | 'too_hard' | 'unknown';

export interface FlowInsight {
  zone: FlowZone;
  challengeLevel: number;
  supportLevel: number;
  explanation: string;
  recommendedAdjustment: string;
}

function clamp(value: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, value));
}

export function analyzeFlow(params: {
  learningState: LearningState;
  signals: LearningSignal[];
}): FlowInsight {
  const { learningState, signals } = params;
  const recoveryNeeded = signals.some((signal) => signal.type === 'RecoveryNeeded');
  const challengeReady = signals.some((signal) => signal.type === 'ChallengeReady');

  const supportLevel = clamp(learningState.cognitiveLoad + (recoveryNeeded ? 2 : 0) - learningState.confidence / 3);
  const challengeLevel = clamp(learningState.confidence + learningState.curiosity / 2 - learningState.cognitiveLoad / 2);

  if (recoveryNeeded || learningState.cognitiveLoad >= 8) {
    return {
      zone: 'too_hard',
      challengeLevel,
      supportLevel,
      explanation: 'The learner may be overloaded or frustrated. The task is probably above the current support level.',
      recommendedAdjustment: 'Reduce difficulty, give one concrete hint and avoid introducing new concepts.',
    };
  }

  if (challengeReady && learningState.cognitiveLoad <= 4) {
    return {
      zone: 'too_easy',
      challengeLevel,
      supportLevel,
      explanation: 'The learner appears confident and may need a more meaningful challenge.',
      recommendedAdjustment: 'Increase challenge slightly or ask for transfer to a new situation.',
    };
  }

  if (learningState.confidence >= 4 && learningState.cognitiveLoad >= 3 && learningState.cognitiveLoad <= 7) {
    return {
      zone: 'productive_flow',
      challengeLevel,
      supportLevel,
      explanation: 'The learner seems to be in a workable learning zone.',
      recommendedAdjustment: 'Keep the current strategy and use short Socratic steps.',
    };
  }

  return {
    zone: 'unknown',
    challengeLevel,
    supportLevel,
    explanation: 'There is not enough evidence to determine the flow zone confidently.',
    recommendedAdjustment: 'Continue observing and ask a short diagnostic question.',
  };
}
