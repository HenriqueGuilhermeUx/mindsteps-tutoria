import type { CognitiveTwin, LearningEvent } from './types';
import { analyzeConfidence } from './confidenceEngine';
import { analyzeCuriosity } from './curiosityEngine';

export type LearningEnergy = 'low' | 'balanced' | 'high';
export type LearningStateLabel =
  | 'ready_to_learn'
  | 'curious'
  | 'confident'
  | 'needs_support'
  | 'frustrated'
  | 'ready_for_challenge';

export interface LearningState {
  label: LearningStateLabel;
  confidence: number;
  curiosity: number;
  energy: LearningEnergy;
  cognitiveLoad: number;
  persistence: number;
  explanation: string;
  recommendedTeachingMove: string;
}

function clamp(value: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, value));
}

function estimatePersistence(events: LearningEvent[]): number {
  const attempts = events.filter((event) => event.type === 'QuestionAsked').length;
  const supportEvents = events.filter((event) =>
    ['HintRequested', 'HintAccepted', 'FrustrationDetected'].includes(event.type)
  ).length;

  return clamp(5 + attempts * 0.5 + supportEvents * 0.3);
}

function estimateCognitiveLoad(twin: CognitiveTwin, events: LearningEvent[]): number {
  const frustration = events.some((event) => event.type === 'FrustrationDetected') ? 2 : 0;
  const fragileConcepts = Math.min(3, twin.fragileConcepts.length);
  const lowConfidence = twin.confidenceLevel < 4 ? 2 : 0;

  return clamp(3 + frustration + fragileConcepts + lowConfidence);
}

function estimateEnergy(confidence: number, curiosity: number, cognitiveLoad: number): LearningEnergy {
  if (confidence <= 3 || cognitiveLoad >= 8) return 'low';
  if (curiosity >= 8 && cognitiveLoad <= 6) return 'high';
  return 'balanced';
}

export function analyzeLearningState(twin: CognitiveTwin, events: LearningEvent[] = []): LearningState {
  const confidenceInsight = analyzeConfidence(twin, events);
  const curiosityInsight = analyzeCuriosity(twin, events);
  const cognitiveLoad = estimateCognitiveLoad(twin, events);
  const persistence = estimatePersistence(events);
  const energy = estimateEnergy(twin.confidenceLevel, twin.curiosityLevel, cognitiveLoad);

  if (events.some((event) => event.type === 'FrustrationDetected') || twin.confidenceLevel <= 3) {
    return {
      label: 'frustrated',
      confidence: twin.confidenceLevel,
      curiosity: twin.curiosityLevel,
      energy,
      cognitiveLoad,
      persistence,
      explanation: 'The learner appears frustrated or low-confidence and needs support before more challenge.',
      recommendedTeachingMove: 'Recover confidence with a small guided step and a psychologically safe tone.',
    };
  }

  if (twin.confidenceLevel >= 7 && cognitiveLoad <= 5) {
    return {
      label: 'ready_for_challenge',
      confidence: twin.confidenceLevel,
      curiosity: twin.curiosityLevel,
      energy,
      cognitiveLoad,
      persistence,
      explanation: 'The learner seems confident enough to try transfer or a harder challenge.',
      recommendedTeachingMove: 'Offer a slightly harder task or ask the learner to explain the idea to someone else.',
    };
  }

  if (curiosityInsight.state !== 'quiet') {
    return {
      label: 'curious',
      confidence: twin.confidenceLevel,
      curiosity: twin.curiosityLevel,
      energy,
      cognitiveLoad,
      persistence,
      explanation: 'The learner is showing curiosity signals that can be used to deepen engagement.',
      recommendedTeachingMove: 'Use an investigative question and connect the topic to discovery.',
    };
  }

  if (confidenceInsight.state === 'high') {
    return {
      label: 'confident',
      confidence: twin.confidenceLevel,
      curiosity: twin.curiosityLevel,
      energy,
      cognitiveLoad,
      persistence,
      explanation: 'The learner is confident and can sustain a productive learning interaction.',
      recommendedTeachingMove: 'Continue with Socratic questioning and monitor for mastery or overconfidence.',
    };
  }

  if (cognitiveLoad >= 7) {
    return {
      label: 'needs_support',
      confidence: twin.confidenceLevel,
      curiosity: twin.curiosityLevel,
      energy,
      cognitiveLoad,
      persistence,
      explanation: 'The estimated cognitive load is high.',
      recommendedTeachingMove: 'Reduce complexity, use a concrete example and avoid adding new concepts.',
    };
  }

  return {
    label: 'ready_to_learn',
    confidence: twin.confidenceLevel,
    curiosity: twin.curiosityLevel,
    energy,
    cognitiveLoad,
    persistence,
    explanation: 'The learner appears ready for a normal guided learning step.',
    recommendedTeachingMove: 'Use a short Socratic question followed by a small explanation if needed.',
  };
}
