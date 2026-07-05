import type {
  CognitiveTwin,
  LearningContext,
  LearningEvent,
  LearningMemory,
  LearningResponsePlan,
  Subject,
} from './types';
import { createLearningResponsePlan } from './pedagogicalEngine';
import { applyLearningEventsToMemory, summarizeLearningMemory } from './learningMemory';
import { applyLearningEventsToTwin, summarizeCognitiveTwin } from './cognitiveTwin';
import { analyzeConfidence, type ConfidenceInsight } from './confidenceEngine';
import { analyzeCuriosity, type CuriosityInsight } from './curiosityEngine';
import { createReflectionPrompt, type ReflectionPrompt } from './reflectionEngine';
import { generateRecommendations, type LearningRecommendation } from './recommendationEngine';
import { planNextJourneyStep, type JourneyStep } from './adaptiveJourney';
import { analyzeLearningState, type LearningState } from './learningState';

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
  confidence: ConfidenceInsight;
  curiosity: CuriosityInsight;
  learningState: LearningState;
  reflection: ReflectionPrompt;
  recommendations: LearningRecommendation[];
  nextJourneyStep: JourneyStep;
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
  confidence: ConfidenceInsight;
  curiosity: CuriosityInsight;
  learningState: LearningState;
  reflection: ReflectionPrompt;
  recommendations: LearningRecommendation[];
  nextJourneyStep: JourneyStep;
}): string {
  const { context, plan, confidence, curiosity, learningState, reflection, recommendations, nextJourneyStep } = params;
  const twinSummary = summarizeCognitiveTwin(context.cognitiveTwin);
  const memorySummary = summarizeLearningMemory(context.learningMemory);
  const recommendationSummary = recommendations
    .map((item) => `${item.target}/${item.priority}: ${item.title} - ${item.description}`)
    .join(' | ');

  return [
    'You are MindSteps, a learning companion powered by a pedagogical engine.',
    'Never give a direct answer when the learner can be guided to think.',
    'Use the selected pedagogical strategy and learning insights below.',
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
    `Learning State: ${learningState.label}. ${learningState.recommendedTeachingMove}`,
    `Learning Energy: ${learningState.energy}. Cognitive Load: ${learningState.cognitiveLoad}/10. Persistence: ${learningState.persistence}/10.`,
    `Confidence State: ${confidence.state}. ${confidence.recommendedAction}`,
    `Curiosity State: ${curiosity.state}. ${curiosity.recommendedAction}`,
    `Reflection Prompt: ${reflection.question}`,
    `Next Journey Step: ${nextJourneyStep.type} - ${nextJourneyStep.title}. ${nextJourneyStep.description}`,
    recommendationSummary ? `Recommendations: ${recommendationSummary}` : '',
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
  const confidence = analyzeConfidence(updatedTwin, events);
  const curiosity = analyzeCuriosity(updatedTwin, events);
  const learningState = analyzeLearningState(updatedTwin, events);
  const reflection = createReflectionPrompt({
    subject: input.subject,
    twin: updatedTwin,
    memory: updatedMemory,
  });
  const recommendations = generateRecommendations({ twin: updatedTwin, memory: updatedMemory });
  const nextJourneyStep = planNextJourneyStep({
    twin: updatedTwin,
    memory: updatedMemory,
    subject: input.subject,
  });
  const aiContext = buildAiContext({
    context: { ...context, cognitiveTwin: updatedTwin, learningMemory: updatedMemory },
    plan,
    confidence,
    curiosity,
    learningState,
    reflection,
    recommendations,
    nextJourneyStep,
  });

  return {
    plan,
    updatedTwin,
    updatedMemory,
    aiContext,
    events,
    confidence,
    curiosity,
    learningState,
    reflection,
    recommendations,
    nextJourneyStep,
  };
}
