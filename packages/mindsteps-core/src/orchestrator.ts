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
import { detectMisconceptionPatterns, summarizeMisconceptions, type MisconceptionPattern } from './misconceptionEngine';
import { extractLearningSignals, summarizeLearningSignals, type LearningSignal } from './learningSignals';
import { generateTeacherInsights, summarizeTeacherInsights, type TeacherInsight } from './teacherCopilot';
import { generateFamilyCompanionMessages, summarizeFamilyCompanionMessages, type FamilyCompanionMessage } from './familyCompanion';
import { planInterventions, summarizeInterventionPlans, type InterventionPlan } from './interventionEngine';
import { analyzeFlow, type FlowInsight } from './flowEngine';
import { generateLearningDNA, summarizeLearningDNA, type LearningDNAProfile } from './learningDNA';
import { BASIC_LEARNING_GRAPH } from './learningGraph';
import { predictLearningRisks, summarizeLearningPredictions, type LearningPrediction } from './predictionEngine';
import { buildEvidenceBundle, explainEvidence, type EvidenceBundle } from './evidenceEngine';
import { decideNextLearningMove, summarizeLearningDecision, type LearningDecision } from './learningDecisionEngine';

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
  flow: FlowInsight;
  learningDNA: LearningDNAProfile;
  predictions: LearningPrediction[];
  evidence: EvidenceBundle;
  decision: LearningDecision;
  reflection: ReflectionPrompt;
  recommendations: LearningRecommendation[];
  nextJourneyStep: JourneyStep;
  misconceptions: MisconceptionPattern[];
  signals: LearningSignal[];
  teacherInsights: TeacherInsight[];
  familyMessages: FamilyCompanionMessage[];
  interventions: InterventionPlan[];
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
  flow: FlowInsight;
  learningDNA: LearningDNAProfile;
  predictions: LearningPrediction[];
  evidence: EvidenceBundle;
  decision: LearningDecision;
  reflection: ReflectionPrompt;
  recommendations: LearningRecommendation[];
  nextJourneyStep: JourneyStep;
  misconceptions: MisconceptionPattern[];
  signals: LearningSignal[];
  teacherInsights: TeacherInsight[];
  familyMessages: FamilyCompanionMessage[];
  interventions: InterventionPlan[];
}): string {
  const {
    context,
    plan,
    confidence,
    curiosity,
    learningState,
    flow,
    learningDNA,
    predictions,
    evidence,
    decision,
    reflection,
    recommendations,
    nextJourneyStep,
    misconceptions,
    signals,
    teacherInsights,
    familyMessages,
    interventions,
  } = params;
  const twinSummary = summarizeCognitiveTwin(context.cognitiveTwin);
  const memorySummary = summarizeLearningMemory(context.learningMemory);
  const recommendationSummary = recommendations
    .map((item) => `${item.target}/${item.priority}: ${item.title} - ${item.description}`)
    .join(' | ');
  const misconceptionSummary = summarizeMisconceptions(misconceptions);
  const signalSummary = summarizeLearningSignals(signals);
  const teacherSummary = summarizeTeacherInsights(teacherInsights);
  const familySummary = summarizeFamilyCompanionMessages(familyMessages);
  const interventionSummary = summarizeInterventionPlans(interventions);
  const dnaSummary = summarizeLearningDNA(learningDNA);
  const predictionSummary = summarizeLearningPredictions(predictions);
  const evidenceSummary = explainEvidence(evidence, 4);
  const decisionSummary = summarizeLearningDecision(decision);

  return [
    'You are MindSteps, a learning companion powered by a pedagogical engine.',
    'Never give a direct answer when the learner can be guided to think.',
    'Follow the Learning Decision before any lower-priority suggestion.',
    'Use only one main pedagogical move per response.',
    'Treat hypotheses as provisional and do not label the learner permanently.',
    '',
    `Learner: ${context.learnerName || context.learnerId}`,
    `Subject: ${context.subject}`,
    `Cognitive Twin: ${twinSummary}`,
    `Learning Memory: ${memorySummary || 'No relevant long-term memory yet.'}`,
    `Learning DNA: ${dnaSummary}`,
    learningDNA.summary,
    '',
    `LEARNING DECISION: ${decisionSummary}`,
    `Decision objective: ${decision.objective}`,
    `Required teaching move: ${decision.teachingMove}`,
    `Required response shape: ${decision.responseShape.join(' -> ')}`,
    `Success criteria: ${decision.successCriteria.join(' | ')}`,
    `Avoid: ${decision.avoid.join(' | ')}`,
    `Decision reason: ${decision.reason}`,
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
    `Flow Zone: ${flow.zone}. ${flow.recommendedAdjustment}`,
    `Predicted Risks: ${predictionSummary}`,
    `Evidence Confidence: ${evidence.confidenceScore}/10. ${evidence.summary}`,
    `Evidence Trail: ${evidenceSummary}`,
    `Confidence State: ${confidence.state}. ${confidence.recommendedAction}`,
    `Curiosity State: ${curiosity.state}. ${curiosity.recommendedAction}`,
    `Misconceptions: ${misconceptionSummary}`,
    `Learning Signals: ${signalSummary}`,
    `Teacher Copilot: ${teacherSummary}`,
    `Family Companion: ${familySummary}`,
    `Intervention Plan: ${interventionSummary}`,
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
  const misconceptions = detectMisconceptionPatterns({
    subject: input.subject,
    message: input.message,
    events,
  });
  const signals = extractLearningSignals({
    learnerId: input.learnerId,
    subject: input.subject,
    events,
    learningState,
    misconceptions,
  });
  const flow = analyzeFlow({ learningState, signals });
  const predictions = predictLearningRisks({
    subject: input.subject,
    learningState,
    flow,
    misconceptions,
    graph: BASIC_LEARNING_GRAPH,
  });
  const learningDNA = generateLearningDNA({
    learnerId: input.learnerId,
    twin: updatedTwin,
    memory: updatedMemory,
    learningState,
    flow,
  });
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
  const teacherInsights = generateTeacherInsights({
    learnerName: input.learnerName,
    subject: input.subject,
    learningState,
    signals,
    misconceptions,
  });
  const familyMessages = generateFamilyCompanionMessages({
    learnerName: input.learnerName,
    subject: input.subject,
    learningState,
    signals,
  });
  const interventions = planInterventions({
    learnerName: input.learnerName,
    subject: input.subject,
    learningState,
    signals,
    teacherInsights,
    familyMessages,
  });
  const evidence = buildEvidenceBundle({
    learnerId: input.learnerId,
    subject: input.subject,
    events,
    signals,
    misconceptions,
    predictions,
    interventions,
  });
  const decision = decideNextLearningMove({
    learningState,
    flow,
    misconceptions,
    predictions,
    evidence,
  });
  const aiContext = buildAiContext({
    context: { ...context, cognitiveTwin: updatedTwin, learningMemory: updatedMemory },
    plan,
    confidence,
    curiosity,
    learningState,
    flow,
    learningDNA,
    predictions,
    evidence,
    decision,
    reflection,
    recommendations,
    nextJourneyStep,
    misconceptions,
    signals,
    teacherInsights,
    familyMessages,
    interventions,
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
    flow,
    learningDNA,
    predictions,
    evidence,
    decision,
    reflection,
    recommendations,
    nextJourneyStep,
    misconceptions,
    signals,
    teacherInsights,
    familyMessages,
    interventions,
  };
}
