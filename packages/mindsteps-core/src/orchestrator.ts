import type {
  CognitiveTwin,
  LearningContext,
  LearningEvent,
  LearningMemory,
  LearningResponsePlan,
  Subject,
} from './types';
import { createLearningResponsePlan } from './pedagogicalEngine';
import { applyLearningEventsToMemory } from './learningMemory';
import { applyLearningEventsToTwin, summarizeCognitiveTwin } from './cognitiveTwin';
import { summarizeLearningMemory } from './learningMemory';

export interface OrchestratorInput {
  learnerId: string;
  learnerName?: string;
  subject: Subject;
  message: string;
  cognitiveTwin: CognitiveTwin;
  learningMemory: LearningMemory;
  recentMessages?: Array<{ role: 'learner' | 'assistant'; content: string }>;
}

export interface OrchestratorOutput {
  plan: LearningResponsePlan;
  updatedTwin: CognitiveTwin;
  updatedMemory: LearningMemory;
  aiContext: string;
  events: LearningEvent[];
}

export function buildLearningContext(input: OrchestratorInput): LearningContext {
  return {
    learnerId: input.learnerId,
    learnerName: input.learnerName,
    subject: input.subject,
    currentMessage: input.message,
    recentMessages: input.recentMessages || [],
    cognitiveTwin: input.cognitiveTwin,
    learningMemory: input.learningMemory,
  };
}

export function buildAiContext(params: {
  context: LearningContext;
  plan: LearningResponsePlan;
}): string {
  const { context, plan } = params;
  const twinSummary = summarizeCognitiveTwin(context.cognitiveTwin);
  const memorySummary = summarizeLearningMemory(context.learningMemory);

  return [
    'You are MindSteps, a learning companion powered by a pedagogical engine.',
    'Never give a direct answer when the learner can be guided to think.',
    'Use the selected pedagogical strategy below.',
    '',
    `Learner: ${context.learnerName || context.learnerId}`,
    `Subject: ${context.subject}`,
    `Cognitive Twin: ${twinSummary}`,
    `Learning Memory: ${memorySummary || 'No relevant long-term memory yet.'}`,
    '',
    `Selected Strategy: ${plan.strategy.type}`,
    `Goal: ${plan.strategy.goal}`,
    `Reasoning: ${plan.strategy.reasoning}`,
    `Instruction: ${plan.strategy.instructionForAi}`,
    plan.strategy.suggestedQuestion ? `Suggested Question: ${plan.strategy.suggestedQuestion}` : '',
    plan.strategy.suggestedAnalogy ? `Suggested Analogy: ${plan.strategy.suggestedAnalogy}` : '',
    '',
    `Learner message: ${context.currentMessage}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function runLearningOrchestrator(input: OrchestratorInput): OrchestratorOutput {
  const context = buildLearningContext(input);
  const plan = createLearningResponsePlan(context);
  const events = plan.memoryUpdates;
  const updatedTwin = applyLearningEventsToTwin(input.cognitiveTwin, events);
  const updatedMemory = applyLearningEventsToMemory(input.learningMemory, events);
  const aiContext = buildAiContext({ context, plan });

  return {
    plan,
    updatedTwin,
    updatedMemory,
    aiContext,
    events,
  };
}
