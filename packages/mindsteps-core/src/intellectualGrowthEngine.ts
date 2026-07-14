import type { LearningEvent, Subject } from './types';
import type { LearningState } from './learningState';
import type { LearningSignal } from './learningSignals';
import type { EvidenceBundle } from './evidenceEngine';

export type IntellectualGrowthDimension =
  | 'curiosity'
  | 'persistence'
  | 'autonomy'
  | 'metacognition'
  | 'critical_thinking'
  | 'argumentation'
  | 'intellectual_humility'
  | 'transfer';

export interface GrowthEvidence {
  dimension: IntellectualGrowthDimension;
  description: string;
  source: 'event' | 'signal' | 'message' | 'evidence_bundle';
  strength: number;
  observedAt: string;
}

export interface IntellectualGrowthIndicator {
  dimension: IntellectualGrowthDimension;
  score: number;
  confidence: number;
  status: 'emerging' | 'developing' | 'consistent' | 'insufficient_evidence';
  evidence: GrowthEvidence[];
  nextOpportunity: string;
}

export interface IntellectualGrowthProfile {
  learnerId: string;
  subject: Subject;
  indicators: IntellectualGrowthIndicator[];
  strongestObservedDimension?: IntellectualGrowthDimension;
  nextDevelopmentPriority: IntellectualGrowthDimension;
  summary: string;
  safeguards: string[];
  generatedAt: string;
}

function clamp(value: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function statusFrom(score: number, evidenceCount: number): IntellectualGrowthIndicator['status'] {
  if (evidenceCount === 0) return 'insufficient_evidence';
  if (score >= 8) return 'consistent';
  if (score >= 5) return 'developing';
  return 'emerging';
}

function messageEvidence(message: string, now: string): GrowthEvidence[] {
  const text = message.toLowerCase();
  const result: GrowthEvidence[] = [];

  const add = (dimension: IntellectualGrowthDimension, description: string, strength: number) => {
    result.push({ dimension, description, source: 'message', strength, observedAt: now });
  };

  if (/por qu[eê]|como funciona|e se|o que aconteceria/.test(text)) {
    add('curiosity', 'O estudante formulou uma pergunta investigativa.', 7);
  }
  if (/acho que|minha hip[oó]tese|talvez|pode ser/.test(text)) {
    add('critical_thinking', 'O estudante apresentou uma hipótese própria.', 6);
  }
  if (/porque|pois|minha justificativa|eu escolhi/.test(text)) {
    add('argumentation', 'O estudante tentou justificar uma conclusão ou escolha.', 7);
  }
  if (/n[aã]o sei|posso estar errado|mudei de ideia|agora percebi/.test(text)) {
    add('intellectual_humility', 'O estudante reconheceu incerteza ou revisou a própria posição.', 8);
  }
  if (/usei|primeiro eu|minha estrat[eé]gia|aprendi que|eu percebi/.test(text)) {
    add('metacognition', 'O estudante descreveu parte do próprio processo de raciocínio.', 7);
  }
  if (/sozinho|sem ajuda|vou tentar|deixa eu tentar/.test(text)) {
    add('autonomy', 'O estudante demonstrou iniciativa para tentar de forma independente.', 6);
  }
  if (/outro exemplo|tamb[eé]m serve|parece com|em outra situa[cç][aã]o/.test(text)) {
    add('transfer', 'O estudante conectou a ideia a outro contexto.', 7);
  }

  return result;
}

function eventEvidence(events: LearningEvent[]): GrowthEvidence[] {
  return events.flatMap((event) => {
    const observedAt = event.createdAt;
    const evidence: GrowthEvidence[] = [];
    const add = (dimension: IntellectualGrowthDimension, description: string, strength: number) => {
      evidence.push({ dimension, description, source: 'event', strength, observedAt });
    };

    if (event.type === 'CuriositySignalDetected') add('curiosity', event.evidence || 'Sinal de curiosidade observado.', 7);
    if (event.type === 'QuestionAsked') add('persistence', event.evidence || 'Nova tentativa ou pergunta registrada.', 5);
    if (event.type === 'ReflectionCompleted') add('metacognition', event.evidence || 'Reflexão sobre a aprendizagem concluída.', 8);
    if (event.type === 'ConfidenceImproved') add('autonomy', event.evidence || 'Confiança melhorou após participação ativa.', 5);
    if (event.type === 'ConceptMastered') add('transfer', event.evidence || 'Evidência de consolidação conceitual.', 5);

    return evidence;
  });
}

function signalEvidence(signals: LearningSignal[]): GrowthEvidence[] {
  return signals.flatMap((signal) => {
    const evidence: GrowthEvidence[] = [];
    const add = (dimension: IntellectualGrowthDimension, description: string, strength: number) => {
      evidence.push({ dimension, description, source: 'signal', strength, observedAt: signal.createdAt });
    };

    if (signal.type === 'CuriosityDetected') add('curiosity', signal.reason, signal.strength);
    if (signal.type === 'ReflectionSuggested') add('metacognition', signal.reason, Math.min(5, signal.strength));
    if (signal.type === 'ChallengeReady') add('autonomy', signal.reason, signal.strength);

    return evidence;
  });
}

const NEXT_OPPORTUNITIES: Record<IntellectualGrowthDimension, string> = {
  curiosity: 'Convidar o estudante a formular uma pergunta própria sobre o conceito.',
  persistence: 'Oferecer uma nova representação e registrar uma nova tentativa consciente.',
  autonomy: 'Permitir que escolha entre duas estratégias e justifique a escolha.',
  metacognition: 'Perguntar o que mudou no raciocínio e qual estratégia ajudou.',
  critical_thinking: 'Apresentar duas explicações possíveis e pedir comparação de evidências.',
  argumentation: 'Pedir uma conclusão acompanhada de motivo, exemplo ou evidência.',
  intellectual_humility: 'Criar espaço seguro para dizer “não sei ainda” e revisar uma hipótese.',
  transfer: 'Aplicar o conceito em um contexto diferente do exemplo original.',
};

export function analyzeIntellectualGrowth(params: {
  learnerId: string;
  subject: Subject;
  message: string;
  events: LearningEvent[];
  signals: LearningSignal[];
  learningState: LearningState;
  evidence: EvidenceBundle;
}): IntellectualGrowthProfile {
  const now = new Date().toISOString();
  const allEvidence = [
    ...messageEvidence(params.message, now),
    ...eventEvidence(params.events),
    ...signalEvidence(params.signals),
  ];

  if (params.learningState.persistence >= 7) {
    allEvidence.push({
      dimension: 'persistence',
      description: 'A persistência estimada na interação está acima do nível intermediário.',
      source: 'evidence_bundle',
      strength: params.learningState.persistence,
      observedAt: now,
    });
  }

  const dimensions: IntellectualGrowthDimension[] = [
    'curiosity',
    'persistence',
    'autonomy',
    'metacognition',
    'critical_thinking',
    'argumentation',
    'intellectual_humility',
    'transfer',
  ];

  const indicators = dimensions.map((dimension): IntellectualGrowthIndicator => {
    const evidence = allEvidence.filter((item) => item.dimension === dimension);
    const average = evidence.length
      ? evidence.reduce((sum, item) => sum + item.strength, 0) / evidence.length
      : 0;
    const score = clamp(average);
    const confidence = clamp(Math.min(10, evidence.length * 2 + params.evidence.confidenceScore / 2));

    return {
      dimension,
      score,
      confidence,
      status: statusFrom(score, evidence.length),
      evidence,
      nextOpportunity: NEXT_OPPORTUNITIES[dimension],
    };
  });

  const observed = indicators.filter((item) => item.status !== 'insufficient_evidence');
  const strongestObservedDimension = observed.sort((a, b) => b.score - a.score)[0]?.dimension;
  const nextDevelopmentPriority = [...indicators]
    .sort((a, b) => {
      if (a.status === 'insufficient_evidence' && b.status !== 'insufficient_evidence') return -1;
      if (b.status === 'insufficient_evidence' && a.status !== 'insufficient_evidence') return 1;
      return a.score - b.score;
    })[0].dimension;

  const summary = observed.length
    ? `Crescimento observado em ${observed.map((item) => `${item.dimension} (${item.score}/10)`).join(', ')}. Próxima oportunidade: ${nextDevelopmentPriority}.`
    : `Ainda não há evidência suficiente para descrever crescimento intelectual. A próxima interação deve criar uma oportunidade observável de ${nextDevelopmentPriority}.`;

  return {
    learnerId: params.learnerId,
    subject: params.subject,
    indicators,
    strongestObservedDimension,
    nextDevelopmentPriority,
    summary,
    safeguards: [
      'Descrever comportamentos observáveis, nunca personalidade ou valor pessoal.',
      'Não usar estes indicadores como diagnóstico psicológico.',
      'Não transformar uma interação isolada em rótulo permanente.',
      'Permitir múltiplas formas de demonstrar pensamento e crescimento.',
      'Revisar as hipóteses quando novas evidências surgirem.',
    ],
    generatedAt: now,
  };
}

export function summarizeIntellectualGrowth(profile: IntellectualGrowthProfile): string {
  return [
    profile.summary,
    `Maior sinal observado: ${profile.strongestObservedDimension || 'ainda não definido'}.`,
    `Próxima prioridade: ${profile.nextDevelopmentPriority}.`,
  ].join(' ');
}
