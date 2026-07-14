import {
  runLearningOrchestrator,
  type OrchestratorInput,
  type OrchestratorOutput,
} from './orchestrator';
import {
  analyzeSessionMemory,
  summarizeSessionMemory,
  type SessionMemoryInsight,
} from './sessionMemoryEngine';
import type { LearningDecision } from './learningDecisionEngine';
import {
  createLearningEquityPlan,
  summarizeLearningEquityPlan,
  type CommonCycleOutcome,
  type CulturalLearningContext,
  type LearnerCycleProgress,
  type LearningEquityPlan,
} from './learningEquityEngine';
import {
  createConstitutionalContract,
  summarizeConstitutionalContract,
  type ConstitutionalContract,
  type MindStepsPrincipleId,
} from './mindstepsConstitution';
import {
  analyzeIntellectualGrowth,
  summarizeIntellectualGrowth,
  type IntellectualGrowthProfile,
} from './intellectualGrowthEngine';

export interface PedagogicalBrainInput extends OrchestratorInput {
  previousDecision?: LearningDecision;
  commonCycleOutcome?: CommonCycleOutcome;
  culturalContext?: CulturalLearningContext;
  cycleProgress?: LearnerCycleProgress;
  activePrinciples?: MindStepsPrincipleId[];
}

export interface PedagogicalBrainOutput extends OrchestratorOutput {
  sessionMemory: SessionMemoryInsight;
  equityPlan?: LearningEquityPlan;
  constitution: ConstitutionalContract;
  intellectualGrowth: IntellectualGrowthProfile;
  brainContext: string;
  responseContract: {
    primaryMove: LearningDecision['type'];
    maxQuestions: number;
    maxParagraphs: number;
    mustChangeApproach: boolean;
    mustReferencePreviousAttempt: boolean;
    mustConnectToCommonOutcome: boolean;
    mustPromoteCriticalThinking: boolean;
    mustPreserveLearnerDignity: boolean;
    mustRemainExplainable: boolean;
    mustCreateGrowthOpportunity: boolean;
    prohibitedBehaviors: string[];
  };
}

function createResponseContract(params: {
  decision: LearningDecision;
  sessionMemory: SessionMemoryInsight;
  equityPlan?: LearningEquityPlan;
  constitution: ConstitutionalContract;
  intellectualGrowth: IntellectualGrowthProfile;
}): PedagogicalBrainOutput['responseContract'] {
  const { decision, sessionMemory, equityPlan, constitution } = params;
  const maxQuestions = sessionMemory.shouldAvoidAnotherQuestion ? 0 : 1;
  const maxParagraphs = sessionMemory.shouldReduceLength ? 2 : decision.type === 'challenge' ? 4 : 3;

  return {
    primaryMove: decision.type,
    maxQuestions,
    maxParagraphs,
    mustChangeApproach: sessionMemory.shouldChangeApproach,
    mustReferencePreviousAttempt: sessionMemory.hintCount > 0 || sessionMemory.unresolvedAttempts > 1,
    mustConnectToCommonOutcome: Boolean(equityPlan),
    mustPromoteCriticalThinking: true,
    mustPreserveLearnerDignity: true,
    mustRemainExplainable: true,
    mustCreateGrowthOpportunity: true,
    prohibitedBehaviors: Array.from(
      new Set([
        ...decision.avoid,
        ...constitution.prohibitedBehaviors,
        ...(sessionMemory.shouldChangeApproach ? ['Repeat the previous explanation or analogy'] : []),
        ...(sessionMemory.shouldAvoidAnotherQuestion ? ['Ask another open question before giving concrete support'] : []),
        ...(equityPlan ? ['Lower the common knowledge expectation because of origin, locality or pace'] : []),
        'Demand a single learning path, speed, example or expression from every learner',
        'Reward passive repetition without understanding, justification or independent thought',
        'Describe a temporary learning behavior as a fixed personality trait',
        'Present intellectual-growth indicators as psychological diagnosis',
      ])
    ),
  };
}

export function runPedagogicalBrain(input: PedagogicalBrainInput): PedagogicalBrainOutput {
  const orchestration = runLearningOrchestrator(input);
  const sessionMemory = analyzeSessionMemory({
    recentMessages: input.recentMessages,
    events: orchestration.events,
    previousDecision: input.previousDecision,
  });
  const equityPlan = input.commonCycleOutcome
    ? createLearningEquityPlan({
        outcome: input.commonCycleOutcome,
        localContext: input.culturalContext,
        progress: input.cycleProgress,
        decision: orchestration.decision,
      })
    : undefined;
  const constitution = createConstitutionalContract(input.activePrinciples);
  const intellectualGrowth = analyzeIntellectualGrowth({
    learnerId: input.learnerId,
    subject: input.subject,
    message: input.message,
    events: orchestration.events,
    signals: orchestration.signals,
    learningState: orchestration.learningState,
    evidence: orchestration.evidence,
  });
  const responseContract = createResponseContract({
    decision: orchestration.decision,
    sessionMemory,
    equityPlan,
    constitution,
    intellectualGrowth,
  });

  const priorityIndicator = intellectualGrowth.indicators.find(
    (indicator) => indicator.dimension === intellectualGrowth.nextDevelopmentPriority
  );

  const brainContext = [
    orchestration.aiContext,
    '',
    'MINDSTEPS CONSTITUTION — NON-NEGOTIABLE NORTH STAR',
    summarizeConstitutionalContract(constitution),
    `North star: ${constitution.northStar}`,
    `Active principles: ${constitution.activePrinciples.map((principle) => `${principle.id}: ${principle.commitment}`).join(' | ')}`,
    `Mandatory behaviors: ${constitution.mandatoryInstructions.join(' | ')}`,
    'These principles outrank convenience, engagement metrics, speed, gamification and stylistic preferences.',
    'When principles conflict, protect learner dignity and safety first, then preserve the right to knowledge, independent thought and human agency.',
    '',
    'PEDAGOGICAL BRAIN — CLOSED LOOP RULES',
    `Session Memory: ${summarizeSessionMemory(sessionMemory)}`,
    `Response contract: execute ${responseContract.primaryMove} as the only primary move.`,
    `Maximum questions: ${responseContract.maxQuestions}. Maximum short paragraphs: ${responseContract.maxParagraphs}.`,
    responseContract.mustChangeApproach
      ? 'You MUST use a meaningfully different representation, example or teaching method from the recent assistant turns.'
      : 'You may continue the current representation, but monitor the learner response.',
    responseContract.mustReferencePreviousAttempt
      ? 'Explicitly connect the next support to something the learner already tried.'
      : '',
    '',
    'INTELLECTUAL GROWTH — OBSERVABLE DEVELOPMENT, NEVER LABELS',
    summarizeIntellectualGrowth(intellectualGrowth),
    `Next growth opportunity: ${priorityIndicator?.nextOpportunity || 'Create a short opportunity for independent reasoning.'}`,
    `Safeguards: ${intellectualGrowth.safeguards.join(' | ')}`,
    'Measure only observable learning behavior. Never infer worth, intelligence, personality or future potential from one interaction.',
    'Whenever pedagogically appropriate, create one small opportunity for the learner to question, justify, reflect, transfer, revise or choose a strategy.',
    '',
    'EQUITY AND COMMON KNOWLEDGE PRINCIPLE',
    'Personalize the path, pace, support, language and examples. Do not personalize away the learner’s right to essential knowledge.',
    'Use local culture and lived experience as a bridge to understanding, never as a ceiling or permanent label.',
    'The common destination is knowledge plus the ability to question, justify, compare evidence, transfer ideas and think independently.',
    equityPlan ? `Learning Equity Plan: ${summarizeLearningEquityPlan(equityPlan)}` : '',
    equityPlan ? `Contextualization guidance: ${equityPlan.contextualizationGuidance.join(' | ')}` : '',
    equityPlan ? `Equity safeguards: ${equityPlan.equitySafeguards.join(' | ')}` : '',
    equityPlan ? `Learner-facing direction: ${equityPlan.learnerMessage}` : '',
    'Never confuse equal opportunity with identical instruction. Equal opportunity requires whatever responsible support is needed to reach meaningful common outcomes.',
    'Always leave space for the learner to reason, disagree, test an idea and form an individual conclusion.',
    '',
    `Prohibited behaviors: ${responseContract.prohibitedBehaviors.join(' | ')}`,
    'After the learner replies, treat the result as new evidence and reconsider the strategy instead of defending the previous response.',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    ...orchestration,
    sessionMemory,
    equityPlan,
    constitution,
    intellectualGrowth,
    brainContext,
    responseContract,
  };
}

export function summarizePedagogicalBrain(output: PedagogicalBrainOutput): string {
  return [
    `Decision: ${output.decision.type}/${output.decision.priority}`,
    `Session stuck score: ${output.sessionMemory.stuckScore}/10`,
    `Change approach: ${output.responseContract.mustChangeApproach ? 'yes' : 'no'}`,
    `Question limit: ${output.responseContract.maxQuestions}`,
    `Paragraph limit: ${output.responseContract.maxParagraphs}`,
    `Constitutional principles: ${output.constitution.activePrinciples.length}`,
    `Intellectual-growth priority: ${output.intellectualGrowth.nextDevelopmentPriority}`,
    output.equityPlan ? `Common outcome convergence: ${output.equityPlan.convergenceStatus}` : '',
    output.equityPlan ? `Critical-thinking coverage: ${output.equityPlan.criticalThinkingCoverage}%` : '',
  ].filter(Boolean).join(' | ');
}
