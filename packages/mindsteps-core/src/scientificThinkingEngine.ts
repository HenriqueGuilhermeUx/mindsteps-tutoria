import type { LearningEvent, Subject } from './types';
import type { LearningDecision } from './learningDecisionEngine';
import type { LearningState } from './learningState';

export type ScientificThinkingStage =
  | 'observe'
  | 'question'
  | 'hypothesize'
  | 'test'
  | 'compare_evidence'
  | 'revise'
  | 'conclude';

export interface ScientificThinkingEvidence {
  stage: ScientificThinkingStage;
  description: string;
  strength: number;
  source: 'message' | 'event' | 'state';
  observedAt: string;
}

export interface ScientificThinkingIndicator {
  stage: ScientificThinkingStage;
  score: number;
  confidence: number;
  status: 'not_observed' | 'emerging' | 'developing' | 'consistent';
  evidence: ScientificThinkingEvidence[];
}

export interface ScientificInquiryPrompt {
  stage: ScientificThinkingStage;
  question: string;
  purpose: string;
  successCriteria: string[];
}

export interface ScientificThinkingPlan {
  learnerId: string;
  subject: Subject;
  indicators: ScientificThinkingIndicator[];
  strongestObservedStage?: ScientificThinkingStage;
  nextStage: ScientificThinkingStage;
  shouldPromptNow: boolean;
  prompt: ScientificInquiryPrompt;
  summary: string;
  safeguards: string[];
  generatedAt: string;
}

const STAGES: ScientificThinkingStage[] = [
  'observe',
  'question',
  'hypothesize',
  'test',
  'compare_evidence',
  'revise',
  'conclude',
];

const PROMPTS: Record<ScientificThinkingStage, ScientificInquiryPrompt> = {
  observe: {
    stage: 'observe',
    question: 'O que você percebe neste caso antes de tentar explicar?',
    purpose: 'Separar observação de interpretação.',
    successCriteria: ['Descrever algo observável', 'Evitar concluir antes de examinar o caso'],
  },
  question: {
    stage: 'question',
    question: 'Qual pergunta investigável ajudaria a entender melhor isso?',
    purpose: 'Transformar curiosidade em uma pergunta que possa ser examinada.',
    successCriteria: ['Formular uma pergunta clara', 'Relacionar a pergunta ao fenômeno ou problema'],
  },
  hypothesize: {
    stage: 'hypothesize',
    question: 'Qual é sua hipótese e o que faria você considerá-la plausível?',
    purpose: 'Construir uma explicação provisória que possa ser testada.',
    successCriteria: ['Propor uma hipótese', 'Indicar uma justificativa ou previsão'],
  },
  test: {
    stage: 'test',
    question: 'Como poderíamos testar essa ideia de forma justa e simples?',
    purpose: 'Planejar uma verificação capaz de produzir evidência útil.',
    successCriteria: ['Definir o que será comparado ou observado', 'Evitar um teste que apenas confirme a resposta desejada'],
  },
  compare_evidence: {
    stage: 'compare_evidence',
    question: 'Qual evidência favorece cada explicação e qual parece mais forte?',
    purpose: 'Comparar explicações usando evidências, não preferência pessoal.',
    successCriteria: ['Citar evidências relevantes', 'Comparar pelo menos duas possibilidades quando existirem'],
  },
  revise: {
    stage: 'revise',
    question: 'O que você mudaria na sua hipótese depois dessas evidências?',
    purpose: 'Normalizar revisão de ideias como parte do pensamento rigoroso.',
    successCriteria: ['Reconhecer o que mudou', 'Revisar a hipótese sem tratar mudança como fracasso'],
  },
  conclude: {
    stage: 'conclude',
    question: 'Qual conclusão é sustentada pelas evidências e o que ainda permanece incerto?',
    purpose: 'Produzir uma conclusão proporcional à força das evidências.',
    successCriteria: ['Relacionar conclusão e evidência', 'Explicitar limites ou incertezas'],
  },
};

function clamp(value: number): number {
  return Math.max(0, Math.min(10, Math.round(value)));
}

function collectMessageEvidence(message: string, now: string): ScientificThinkingEvidence[] {
  const text = message.toLowerCase();
  const evidence: ScientificThinkingEvidence[] = [];
  const add = (stage: ScientificThinkingStage, description: string, strength: number) => {
    evidence.push({ stage, description, strength, source: 'message', observedAt: now });
  };

  if (/observei|percebi|notei|aconteceu|mudou/.test(text)) add('observe', 'O estudante descreveu uma observação ou mudança percebida.', 6);
  if (/por que|como podemos saber|qual seria a pergunta|o que aconteceria/.test(text)) add('question', 'O estudante formulou uma pergunta investigativa.', 7);
  if (/minha hip[oó]tese|acho que|talvez aconte[cç]a|prevejo que/.test(text)) add('hypothesize', 'O estudante propôs uma hipótese ou previsão.', 7);
  if (/testar|experimento|comparar|controlar|medir/.test(text)) add('test', 'O estudante sugeriu uma forma de testar ou medir.', 7);
  if (/evid[eê]ncia|dados|resultado|isso apoia|isso contradiz/.test(text)) add('compare_evidence', 'O estudante usou evidência para avaliar uma explicação.', 8);
  if (/mudei de ideia|revisaria|agora penso|minha hip[oó]tese mudou/.test(text)) add('revise', 'O estudante revisou uma ideia diante de nova evidência.', 8);
  if (/concluo|portanto|a conclus[aã]o|ainda n[aã]o sabemos|permanece incerto/.test(text)) add('conclude', 'O estudante formulou uma conclusão ou reconheceu incerteza.', 7);

  return evidence;
}

function collectEventEvidence(events: LearningEvent[]): ScientificThinkingEvidence[] {
  return events.flatMap((event) => {
    const result: ScientificThinkingEvidence[] = [];
    const add = (stage: ScientificThinkingStage, description: string, strength: number) => {
      result.push({ stage, description, strength, source: 'event', observedAt: event.createdAt });
    };

    if (event.type === 'QuestionAsked') add('question', event.evidence || 'Pergunta registrada durante a aprendizagem.', 5);
    if (event.type === 'CuriositySignalDetected') add('question', event.evidence || 'Curiosidade investigativa observada.', 6);
    if (event.type === 'ReflectionCompleted') add('revise', event.evidence || 'Reflexão concluída após nova evidência.', 6);
    if (event.type === 'ConceptUnderstood') add('conclude', event.evidence || 'Conclusão conceitual registrada.', 5);

    return result;
  });
}

function status(score: number, evidenceCount: number): ScientificThinkingIndicator['status'] {
  if (evidenceCount === 0) return 'not_observed';
  if (score >= 8) return 'consistent';
  if (score >= 5) return 'developing';
  return 'emerging';
}

export function createScientificThinkingPlan(params: {
  learnerId: string;
  subject: Subject;
  message: string;
  events: LearningEvent[];
  learningState: LearningState;
  decision: LearningDecision;
}): ScientificThinkingPlan {
  const now = new Date().toISOString();
  const allEvidence = [
    ...collectMessageEvidence(params.message, now),
    ...collectEventEvidence(params.events),
  ];

  if (params.learningState.curiosity >= 7) {
    allEvidence.push({
      stage: 'question',
      description: 'O estado de aprendizagem indica curiosidade elevada nesta interação.',
      strength: params.learningState.curiosity,
      source: 'state',
      observedAt: now,
    });
  }

  const indicators = STAGES.map((stage): ScientificThinkingIndicator => {
    const evidence = allEvidence.filter((item) => item.stage === stage);
    const score = clamp(evidence.length ? evidence.reduce((sum, item) => sum + item.strength, 0) / evidence.length : 0);
    return {
      stage,
      score,
      confidence: clamp(Math.min(10, evidence.length * 2 + 2)),
      status: status(score, evidence.length),
      evidence,
    };
  });

  const observed = indicators.filter((item) => item.status !== 'not_observed');
  const strongestObservedStage = [...observed].sort((a, b) => b.score - a.score)[0]?.stage;
  const nextStage = STAGES.find((stage) => indicators.find((item) => item.stage === stage)?.status === 'not_observed')
    || [...indicators].sort((a, b) => a.score - b.score)[0].stage;
  const overloaded = params.learningState.cognitiveLoad >= 8 || params.learningState.label === 'frustrated';
  const shouldPromptNow = !overloaded && params.decision.type !== 'recovery';
  const prompt = PROMPTS[nextStage];
  const summary = observed.length
    ? `Pensamento científico observado em ${observed.map((item) => `${item.stage} (${item.score}/10)`).join(', ')}. Próxima etapa: ${nextStage}.`
    : `Ainda não há evidência suficiente do ciclo investigativo. A próxima oportunidade deve desenvolver ${nextStage}.`;

  return {
    learnerId: params.learnerId,
    subject: params.subject,
    indicators,
    strongestObservedStage,
    nextStage,
    shouldPromptNow,
    prompt,
    summary,
    safeguards: [
      'Não tratar uma opinião como evidência apenas porque está bem formulada.',
      'Não exigir linguagem científica sofisticada para reconhecer bom raciocínio.',
      'Não transformar revisão de hipótese em punição ou sinal de fracasso.',
      'Não apresentar conclusão com certeza maior do que as evidências permitem.',
      'Não simular experimento perigoso, antiético ou inadequado à idade.',
      'Separar claramente observação, inferência, hipótese, evidência e conclusão.',
    ],
    generatedAt: now,
  };
}

export function summarizeScientificThinking(plan: ScientificThinkingPlan): string {
  return [
    plan.summary,
    `Maior etapa observada: ${plan.strongestObservedStage || 'ainda não definida'}.`,
    `Próxima etapa: ${plan.nextStage}.`,
    `Perguntar agora: ${plan.shouldPromptNow ? 'sim' : 'não'}.`,
  ].join(' ');
}
