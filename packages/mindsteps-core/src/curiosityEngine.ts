import type { CognitiveTwin, LearningEvent } from './types';

export type CuriosityState = 'quiet' | 'active' | 'exploratory';

export interface CuriosityInsight {
  state: CuriosityState;
  score: number;
  explanation: string;
  recommendedAction: string;
}

export function detectCuriosityFromText(message: string): boolean {
  const normalized = message.toLowerCase();
  return [
    'por que',
    'porque',
    'como funciona',
    'e se',
    'quero saber',
    'me explica',
    'curioso',
    'descobrir',
  ].some((pattern) => normalized.includes(pattern));
}

export function analyzeCuriosity(twin: CognitiveTwin, events: LearningEvent[] = []): CuriosityInsight {
  const curiosityEvents = events.filter((event) => event.type === 'CuriositySignalDetected').length;

  if (twin.curiosityLevel >= 8 || curiosityEvents >= 2) {
    return {
      state: 'exploratory',
      score: twin.curiosityLevel,
      explanation: 'The learner is showing strong exploratory behavior.',
      recommendedAction: 'Offer an open-ended challenge, project question or discovery path connected to the current topic.',
    };
  }

  if (twin.curiosityLevel >= 5 || curiosityEvents === 1) {
    return {
      state: 'active',
      score: twin.curiosityLevel,
      explanation: 'The learner is showing active curiosity.',
      recommendedAction: 'Respond with a question that expands thinking before giving an explanation.',
    };
  }

  return {
    state: 'quiet',
    score: twin.curiosityLevel,
    explanation: 'The learner has not shown strong curiosity signals yet.',
    recommendedAction: 'Use a surprising example, real-life connection or learner interest to spark curiosity.',
  };
}
