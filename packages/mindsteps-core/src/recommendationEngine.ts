import type { CognitiveTwin, LearningMemory } from './types';

export interface LearningRecommendation {
  target: 'learner' | 'family' | 'teacher';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
}

export function generateRecommendations(params: {
  twin: CognitiveTwin;
  memory: LearningMemory;
}): LearningRecommendation[] {
  const { twin, memory } = params;
  const recommendations: LearningRecommendation[] = [];

  if (twin.confidenceLevel < 4) {
    recommendations.push({
      target: 'learner',
      priority: 'high',
      title: 'Rebuild confidence',
      description: 'Use a short, concrete and low-pressure challenge before increasing difficulty.',
    });
  }

  if (twin.fragileConcepts.length > 0) {
    const concept = twin.fragileConcepts[twin.fragileConcepts.length - 1];
    recommendations.push({
      target: 'teacher',
      priority: 'high',
      title: `Review ${concept}`,
      description: `The learner may need a targeted intervention around ${concept}.`,
    });
  }

  if (memory.interestMemory.length > 0) {
    recommendations.push({
      target: 'family',
      priority: 'medium',
      title: 'Use interests at home',
      description: `Try connecting learning to ${memory.interestMemory.slice(-2).join(' or ')}.`,
    });
  }

  return recommendations;
}
