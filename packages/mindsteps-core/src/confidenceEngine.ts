import type { CognitiveTwin, LearningEvent } from './types';

export type ConfidenceState = 'low' | 'stable' | 'growing' | 'high';

export interface ConfidenceInsight {
  state: ConfidenceState;
  score: number;
  explanation: string;
  recommendedAction: string;
}

export function analyzeConfidence(twin: CognitiveTwin, events: LearningEvent[] = []): ConfidenceInsight {
  const recentFrustration = events.some((event) => event.type === 'FrustrationDetected');
  const recentImprovement = events.some((event) => event.type === 'ConfidenceImproved' || event.type === 'ConceptUnderstood');

  if (twin.confidenceLevel <= 3 || recentFrustration) {
    return {
      state: 'low',
      score: twin.confidenceLevel,
      explanation: 'The learner may be uncertain or frustrated and needs emotional safety before more challenge.',
      recommendedAction: 'Use a small guided hint, normalize mistakes and ask one simple next-step question.',
    };
  }

  if (twin.confidenceLevel >= 8) {
    return {
      state: 'high',
      score: twin.confidenceLevel,
      explanation: 'The learner is showing strong confidence and may be ready for transfer or a harder challenge.',
      recommendedAction: 'Offer a slightly more complex task or ask the learner to explain the idea in their own words.',
    };
  }

  if (recentImprovement) {
    return {
      state: 'growing',
      score: twin.confidenceLevel,
      explanation: 'The learner showed signs of progress or understanding in the recent interaction.',
      recommendedAction: 'Reinforce the strategy that worked and invite the learner to try a similar challenge.',
    };
  }

  return {
    state: 'stable',
    score: twin.confidenceLevel,
    explanation: 'The learner confidence appears stable.',
    recommendedAction: 'Continue with Socratic questioning and monitor for frustration or mastery signals.',
  };
}
