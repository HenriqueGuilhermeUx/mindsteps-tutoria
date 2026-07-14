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

export interface PedagogicalBrainInput extends OrchestratorInput {
  previousDecision?: LearningDecision;
}

export interface PedagogicalBrainOutput extends OrchestratorOutput {
  sessionMemory: SessionMemoryInsight;
  brainContext: string;
  responseContract: {
    primaryMove: LearningDecision['type'];
    maxQuestions: number;
    maxParagraphs: number;
    mustChangeApproach: boolean;
    mustReferencePreviousAttempt: boolean;
    prohibitedBehaviors: string[];
  };
}

function createResponseContract(params: {
  decision: LearningDecision;
  sessionMemory: SessionMemoryInsight;
}): PedagogicalBrainOutput['responseContract'] {
  const { decision, sessionMemory } = params;
  const maxQuestions = sessionMemory.shouldAvoidAnotherQuestion ? 0 : decision.type === 'diagnose' ? 1 : 1;
  const maxParagraphs = sessionMemory.shouldReduceLength ? 2 : decision.type === 'challenge' ? 4 : 3;

  return {
    primaryMove: decision.type,
    maxQuestions,
    maxParagraphs,
    mustChangeApproach: sessionMemory.shouldChangeApproach,
    mustReferencePreviousAttempt: sessionMemory.hintCount > 0 || sessionMemory.unresolvedAttempts > 1,
    prohibitedBehaviors: Array.from(
      new Set([
        ...decision.avoid,
        ...(sessionMemory.shouldChangeApproach ? ['Repeat the previous explanation or analogy'] : []),
        ...(sessionMemory.shouldAvoidAnotherQuestion ? ['Ask another open question before giving concrete support'] : []),
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
  const responseContract = createResponseContract({
    decision: orchestration.decision,
    sessionMemory,
  });

  const brainContext = [
    orchestration.aiContext,
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
    `Prohibited behaviors: ${responseContract.prohibitedBehaviors.join(' | ')}`,
    'After the learner replies, treat the result as new evidence and reconsider the strategy instead of defending the previous response.',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    ...orchestration,
    sessionMemory,
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
  ].join(' | ');
}
