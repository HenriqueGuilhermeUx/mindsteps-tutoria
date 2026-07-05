import type { LearningEvent, Subject } from './types';

export type LearningSessionStatus = 'active' | 'completed' | 'paused';

export interface LearningSessionObjective {
  subject: Subject;
  concept?: string;
  goal: string;
}

export interface LearningSessionSummary {
  totalEvents: number;
  conceptsTouched: string[];
  frustrationDetected: boolean;
  curiosityDetected: boolean;
  confidenceImproved: boolean;
  reflectionCompleted: boolean;
}

export interface LearningSession {
  id: string;
  learnerId: string;
  status: LearningSessionStatus;
  objective: LearningSessionObjective;
  events: LearningEvent[];
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export function createLearningSession(params: {
  id: string;
  learnerId: string;
  subject: Subject;
  concept?: string;
  goal?: string;
}): LearningSession {
  const now = new Date().toISOString();

  return {
    id: params.id,
    learnerId: params.learnerId,
    status: 'active',
    objective: {
      subject: params.subject,
      concept: params.concept,
      goal: params.goal || 'Understand the learner need and guide the next learning step.',
    },
    events: [],
    startedAt: now,
    updatedAt: now,
  };
}

export function addEventsToLearningSession(
  session: LearningSession,
  events: LearningEvent[]
): LearningSession {
  const updatedAt = events[events.length - 1]?.createdAt || new Date().toISOString();

  return {
    ...session,
    events: [...session.events, ...events],
    updatedAt,
  };
}

export function completeLearningSession(session: LearningSession): LearningSession {
  const now = new Date().toISOString();

  return {
    ...session,
    status: 'completed',
    updatedAt: now,
    completedAt: now,
  };
}

export function summarizeLearningSession(session: LearningSession): LearningSessionSummary {
  const conceptsTouched = Array.from(
    new Set(session.events.map((event) => event.concept).filter(Boolean) as string[])
  );

  return {
    totalEvents: session.events.length,
    conceptsTouched,
    frustrationDetected: session.events.some((event) => event.type === 'FrustrationDetected'),
    curiosityDetected: session.events.some((event) => event.type === 'CuriositySignalDetected'),
    confidenceImproved: session.events.some((event) => event.type === 'ConfidenceImproved'),
    reflectionCompleted: session.events.some((event) => event.type === 'ReflectionCompleted'),
  };
}
