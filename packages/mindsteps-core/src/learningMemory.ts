import type { LearningEvent, LearningMemory, LearningStrategyType } from './types';

export function createEmptyLearningMemory(learnerId: string): LearningMemory {
  const now = new Date().toISOString();
  return {
    learnerId,
    semanticMemory: [],
    strategyMemory: [],
    interestMemory: [],
    reflectionMemory: [],
    updatedAt: now,
  };
}

function uniquePush(list: string[], value?: string): string[] {
  if (!value || !value.trim()) return list;
  const normalized = value.trim();
  return list.includes(normalized) ? list : [...list, normalized];
}

export function applyLearningEventToMemory(
  memory: LearningMemory,
  event: LearningEvent
): LearningMemory {
  const next: LearningMemory = {
    ...memory,
    semanticMemory: [...memory.semanticMemory],
    strategyMemory: [...memory.strategyMemory],
    interestMemory: [...memory.interestMemory],
    reflectionMemory: [...memory.reflectionMemory],
    updatedAt: event.createdAt,
  };

  if (event.type === 'ConceptUnderstood' && event.concept) {
    next.semanticMemory = uniquePush(next.semanticMemory, event.concept);
  }

  if (event.type === 'ReflectionCompleted' && event.evidence) {
    next.reflectionMemory = uniquePush(next.reflectionMemory, event.evidence);
  }

  if (event.metadata?.interest && typeof event.metadata.interest === 'string') {
    next.interestMemory = uniquePush(next.interestMemory, event.metadata.interest);
  }

  if (event.metadata?.selectedStrategy && typeof event.metadata.selectedStrategy === 'string') {
    const strategy = event.metadata.selectedStrategy as LearningStrategyType;
    const concept = event.concept || event.subject || 'general';
    next.strategyMemory.push({
      concept,
      strategy,
      worked: event.type !== 'FrustrationDetected',
      evidence: event.evidence,
    });
  }

  return next;
}

export function applyLearningEventsToMemory(
  memory: LearningMemory,
  events: LearningEvent[]
): LearningMemory {
  return events.reduce((current, event) => applyLearningEventToMemory(current, event), memory);
}

export function summarizeLearningMemory(memory: LearningMemory): string {
  const parts: string[] = [];

  if (memory.semanticMemory.length > 0) {
    parts.push(`Concepts already understood: ${memory.semanticMemory.slice(-5).join(', ')}.`);
  }

  const successfulStrategies = memory.strategyMemory.filter((item) => item.worked).slice(-5);
  if (successfulStrategies.length > 0) {
    parts.push(
      `Recent successful strategies: ${successfulStrategies
        .map((item) => `${item.strategy} for ${item.concept}`)
        .join('; ')}.`
    );
  }

  if (memory.interestMemory.length > 0) {
    parts.push(`Known interests: ${memory.interestMemory.slice(-5).join(', ')}.`);
  }

  if (memory.reflectionMemory.length > 0) {
    parts.push(`Recent reflections: ${memory.reflectionMemory.slice(-3).join(' | ')}.`);
  }

  return parts.join(' ');
}
