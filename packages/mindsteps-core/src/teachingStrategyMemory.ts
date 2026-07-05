import type { LearningEvent, LearningStrategyType, Subject } from './types';

export interface TeachingStrategyRecord {
  subject: Subject;
  concept?: string;
  strategy: LearningStrategyType;
  attempts: number;
  successes: number;
  failures: number;
  evidence: string[];
  lastUsedAt: string;
}

export interface TeachingStrategyMemory {
  learnerId: string;
  records: TeachingStrategyRecord[];
  updatedAt: string;
}

export function createEmptyTeachingStrategyMemory(learnerId: string): TeachingStrategyMemory {
  return {
    learnerId,
    records: [],
    updatedAt: new Date().toISOString(),
  };
}

function getStrategyFromEvent(event: LearningEvent): LearningStrategyType | null {
  const strategy = event.metadata?.selectedStrategy;
  if (typeof strategy !== 'string') return null;
  return strategy as LearningStrategyType;
}

function didStrategyWork(event: LearningEvent): boolean | null {
  if (['ConceptUnderstood', 'ConfidenceImproved', 'ReflectionCompleted', 'CuriositySignalDetected'].includes(event.type)) {
    return true;
  }

  if (['FrustrationDetected', 'MisconceptionDetected', 'ConfidenceDecreased'].includes(event.type)) {
    return false;
  }

  return null;
}

export function applyEventToTeachingStrategyMemory(
  memory: TeachingStrategyMemory,
  event: LearningEvent
): TeachingStrategyMemory {
  const strategy = getStrategyFromEvent(event);
  if (!strategy) return memory;

  const worked = didStrategyWork(event);
  const subject = event.subject || 'geral';
  const concept = event.concept;
  const key = `${subject}:${concept || 'general'}:${strategy}`;

  const records = [...memory.records];
  const index = records.findIndex(
    (record) => `${record.subject}:${record.concept || 'general'}:${record.strategy}` === key
  );

  const existing = index >= 0 ? records[index] : undefined;
  const nextRecord: TeachingStrategyRecord = existing
    ? { ...existing, evidence: [...existing.evidence] }
    : {
        subject,
        concept,
        strategy,
        attempts: 0,
        successes: 0,
        failures: 0,
        evidence: [],
        lastUsedAt: event.createdAt,
      };

  nextRecord.attempts += 1;
  if (worked === true) nextRecord.successes += 1;
  if (worked === false) nextRecord.failures += 1;
  if (event.evidence) nextRecord.evidence = [...nextRecord.evidence.slice(-4), event.evidence];
  nextRecord.lastUsedAt = event.createdAt;

  if (index >= 0) records[index] = nextRecord;
  else records.push(nextRecord);

  return {
    ...memory,
    records,
    updatedAt: event.createdAt,
  };
}

export function applyEventsToTeachingStrategyMemory(
  memory: TeachingStrategyMemory,
  events: LearningEvent[]
): TeachingStrategyMemory {
  return events.reduce((current, event) => applyEventToTeachingStrategyMemory(current, event), memory);
}

export function getBestTeachingStrategy(params: {
  memory: TeachingStrategyMemory;
  subject: Subject;
  concept?: string;
}): TeachingStrategyRecord | null {
  const candidates = params.memory.records.filter((record) => {
    const subjectMatches = record.subject === params.subject || record.subject === 'geral';
    const conceptMatches = !params.concept || !record.concept || record.concept === params.concept;
    return subjectMatches && conceptMatches && record.attempts > 0;
  });

  if (candidates.length === 0) return null;

  return candidates.sort((a, b) => {
    const aRate = a.successes / a.attempts;
    const bRate = b.successes / b.attempts;
    return bRate - aRate || b.attempts - a.attempts;
  })[0];
}

export function summarizeTeachingStrategyMemory(memory: TeachingStrategyMemory): string {
  if (memory.records.length === 0) return 'No teaching strategy evidence yet.';

  return memory.records
    .slice(-5)
    .map((record) => {
      const rate = Math.round((record.successes / Math.max(1, record.attempts)) * 100);
      return `${record.strategy} for ${record.concept || record.subject}: ${rate}% success over ${record.attempts} attempts`;
    })
    .join(' | ');
}
