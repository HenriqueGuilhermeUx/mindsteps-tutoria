import type { LearningEvent } from './types';
import type { LearningDecision } from './learningDecisionEngine';

export interface SessionMessage {
  role: 'learner' | 'assistant';
  content: string;
}

export interface SessionMemoryInsight {
  turnCount: number;
  learnerTurns: number;
  assistantTurns: number;
  recentQuestions: string[];
  repeatedAssistantOpenings: string[];
  hintCount: number;
  frustrationCount: number;
  unresolvedAttempts: number;
  stuckScore: number;
  shouldChangeApproach: boolean;
  shouldReduceLength: boolean;
  shouldAvoidAnotherQuestion: boolean;
  constraints: string[];
  summary: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9áàâãéêíóôõúç\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function opening(text: string): string {
  return normalize(text).split(' ').slice(0, 8).join(' ');
}

function extractQuestions(messages: SessionMessage[]): string[] {
  return messages
    .filter((message) => message.role === 'assistant')
    .flatMap((message) => message.content.split(/(?<=[?])/g))
    .map((item) => item.trim())
    .filter((item) => item.endsWith('?'))
    .slice(-6);
}

export function analyzeSessionMemory(params: {
  recentMessages?: SessionMessage[];
  events?: LearningEvent[];
  previousDecision?: LearningDecision;
}): SessionMemoryInsight {
  const messages = params.recentMessages || [];
  const events = params.events || [];
  const learnerTurns = messages.filter((message) => message.role === 'learner').length;
  const assistantMessages = messages.filter((message) => message.role === 'assistant');
  const recentQuestions = extractQuestions(messages);
  const openings = assistantMessages.map((message) => opening(message.content)).filter(Boolean);
  const repeatedAssistantOpenings = Array.from(
    new Set(openings.filter((value, index) => openings.indexOf(value) !== index))
  );

  const hintCount = events.filter((event) => ['HintRequested', 'HintAccepted'].includes(event.type)).length;
  const frustrationCount = events.filter((event) => event.type === 'FrustrationDetected').length;
  const unresolvedAttempts = events.filter((event) => event.type === 'QuestionAsked').length;
  const repeatedQuestionCount = recentQuestions.filter(
    (question, index) => recentQuestions.findIndex((candidate) => normalize(candidate) === normalize(question)) !== index
  ).length;

  const stuckScore = Math.min(
    10,
    frustrationCount * 3 + Math.min(3, hintCount) + Math.min(3, unresolvedAttempts) + repeatedQuestionCount * 2
  );

  const shouldChangeApproach = stuckScore >= 6 || repeatedAssistantOpenings.length > 0;
  const shouldReduceLength = frustrationCount > 0 || stuckScore >= 7;
  const shouldAvoidAnotherQuestion = recentQuestions.length >= 3 && learnerTurns <= assistantMessages.length;
  const constraints: string[] = [];

  if (shouldChangeApproach) constraints.push('Do not repeat the same explanation or analogy; switch representation or teaching approach.');
  if (shouldReduceLength) constraints.push('Keep the next response short, concrete and limited to one learning step.');
  if (shouldAvoidAnotherQuestion) constraints.push('Do not stack another open question; provide a concrete micro-example or selectable next step first.');
  if (hintCount >= 2) constraints.push('Use the smallest possible hint and explicitly connect it to the learner previous attempt.');
  if (params.previousDecision) constraints.push(`Do not repeat decision ${params.previousDecision.type} unchanged unless new evidence supports it.`);
  if (constraints.length === 0) constraints.push('Continue the current approach while observing the next learner response.');

  const summary = `Session has ${messages.length} recent turns, stuck score ${stuckScore}/10, ${hintCount} hint signals and ${frustrationCount} frustration signals. ${shouldChangeApproach ? 'A meaningful strategy change is recommended.' : 'The current approach can continue with monitoring.'}`;

  return {
    turnCount: messages.length,
    learnerTurns,
    assistantTurns: assistantMessages.length,
    recentQuestions,
    repeatedAssistantOpenings,
    hintCount,
    frustrationCount,
    unresolvedAttempts,
    stuckScore,
    shouldChangeApproach,
    shouldReduceLength,
    shouldAvoidAnotherQuestion,
    constraints,
    summary,
  };
}

export function summarizeSessionMemory(insight: SessionMemoryInsight): string {
  return `${insight.summary} Constraints: ${insight.constraints.join(' | ')}`;
}
