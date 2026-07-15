import type { LearningEvent, Subject } from './types';
import type { LearningDecision } from './learningDecisionEngine';
import type { IntellectualGrowthProfile } from './intellectualGrowthEngine';

export type MetacognitionPhase = 'plan' | 'monitor' | 'evaluate' | 'transfer';

export interface MetacognitionEvidence {
  phase: MetacognitionPhase;
  description: string;
  strength: number;
  source: 'message' | 'event' | 'growth_profile';
  observedAt: string;
}

export interface MetacognitionPrompt {
  phase: MetacognitionPhase;
  question: string;
  purpose: string;
  responseExpectation: string;
}

export interface MetacognitionPlan {
  learnerId: string;
  subject: Subject;
  currentPhase: MetacognitionPhase;
  phaseScores: Record<MetacognitionPhase, number>;
  evidence: MetacognitionEvidence[];
  prompt: MetacognitionPrompt;
  shouldPromptNow: boolean;
  reason: string;
  safeguards: string[];
  generatedAt: string;
}

function clamp(value: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function collectMessageEvidence(message: string, now: string): MetacognitionEvidence[] {
  const text = message.toLowerCase();
  const evidence: MetacognitionEvidence[] = [];
  const add = (phase: MetacognitionPhase, description: string, strength: number) => {
    evidence.push({ phase, description, strength, source: 'message', observedAt: now });
  };

  if (/vou tentar|primeiro eu|meu plano|come[cç]o por|acho melhor/.test(text)) {
    add('plan', 'O estudante explicitou um plano ou escolheu uma estratégia antes de agir.', 7);
  }
  if (/estou percebendo|ainda n[aã]o entendi|estou confuso|isso est[aá] funcionando|preciso de ajuda/.test(text)) {
    add('monitor', 'O estudante monitorou a própria compreensão durante a atividade.', 8);
  }
  if (/agora entendi|eu errei porque|o que funcionou|aprendi que|mudou meu racioc[ií]nio/.test(text)) {
    add('evaluate', 'O estudante avaliou o resultado e descreveu mudança no próprio raciocínio.', 8);
  }
  if (/tamb[eé]m serve|em outra situa[cç][aã]o|outro exemplo|posso usar isso|parece com/.test(text)) {
    add('transfer', 'O estudante conectou a aprendizagem a outro contexto.', 8);
  }

  return evidence;
}

function collectEventEvidence(events: LearningEvent[]): MetacognitionEvidence[] {
  return events.flatMap((event) => {
    const evidence: MetacognitionEvidence[] = [];
    const add = (phase: MetacognitionPhase, description: string, strength: number) => {
      evidence.push({ phase, description, strength, source: 'event', observedAt: event.createdAt });
    };

    if (event.type === 'QuestionAsked') add('monitor', event.evidence || 'O estudante fez nova tentativa ou pediu esclarecimento.', 5);
    if (event.type === 'HintRequested') add('monitor', event.evidence || 'O estudante identificou necessidade de apoio.', 6);
    if (event.type === 'ReflectionCompleted') add('evaluate', event.evidence || 'Uma reflexão sobre a aprendizagem foi concluída.', 9);
    if (event.type === 'ConceptMastered') add('transfer', event.evidence || 'Houve evidência de consolidação conceitual.', 5);

    return evidence;
  });
}

const PROMPTS: Record<MetacognitionPhase, MetacognitionPrompt> = {
  plan: {
    phase: 'plan',
    question: 'Antes de começar, qual caminho você pretende tentar primeiro — e por quê?',
    purpose: 'Tornar a estratégia inicial consciente sem impor um único método.',
    responseExpectation: 'Uma escolha simples de estratégia acompanhada de uma justificativa curta.',
  },
  monitor: {
    phase: 'monitor',
    question: 'Neste ponto, o que você já entende e onde ainda sente dúvida?',
    purpose: 'Ajudar o estudante a acompanhar a própria compreensão durante a atividade.',
    responseExpectation: 'Uma distinção entre o que está claro e o que ainda precisa de apoio.',
  },
  evaluate: {
    phase: 'evaluate',
    question: 'O que mudou no seu raciocínio e qual estratégia mais ajudou?',
    purpose: 'Consolidar aprendizagem consciente e identificar estratégias úteis.',
    responseExpectation: 'Uma breve explicação sobre mudança de pensamento e estratégia utilizada.',
  },
  transfer: {
    phase: 'transfer',
    question: 'Onde mais essa ideia poderia ser usada, fora deste exemplo?',
    purpose: 'Verificar se o conhecimento pode ser levado para outro contexto.',
    responseExpectation: 'Um novo contexto plausível e uma explicação de como o conceito se aplica.',
  },
};

function choosePhase(params: {
  phaseScores: Record<MetacognitionPhase, number>;
  decision: LearningDecision;
}): MetacognitionPhase {
  if (params.decision.type === 'recover_confidence' || params.decision.type === 'scaffold') return 'monitor';
  if (params.decision.type === 'challenge') return 'transfer';
  if (params.decision.type === 'reflect') return 'evaluate';

  return (Object.entries(params.phaseScores) as Array<[MetacognitionPhase, number]>)
    .sort((a, b) => a[1] - b[1])[0][0];
}

export function createMetacognitionPlan(params: {
  learnerId: string;
  subject: Subject;
  message: string;
  events: LearningEvent[];
  decision: LearningDecision;
  intellectualGrowth: IntellectualGrowthProfile;
}): MetacognitionPlan {
  const now = new Date().toISOString();
  const evidence = [
    ...collectMessageEvidence(params.message, now),
    ...collectEventEvidence(params.events),
  ];

  const metacognitionIndicator = params.intellectualGrowth.indicators.find(
    (indicator) => indicator.dimension === 'metacognition'
  );
  const transferIndicator = params.intellectualGrowth.indicators.find(
    (indicator) => indicator.dimension === 'transfer'
  );

  if (metacognitionIndicator?.status !== 'insufficient_evidence') {
    evidence.push({
      phase: 'evaluate',
      description: 'O perfil de crescimento intelectual contém evidência de metacognição.',
      strength: metacognitionIndicator.score,
      source: 'growth_profile',
      observedAt: now,
    });
  }
  if (transferIndicator?.status !== 'insufficient_evidence') {
    evidence.push({
      phase: 'transfer',
      description: 'O perfil de crescimento intelectual contém evidência de transferência.',
      strength: transferIndicator.score,
      source: 'growth_profile',
      observedAt: now,
    });
  }

  const phases: MetacognitionPhase[] = ['plan', 'monitor', 'evaluate', 'transfer'];
  const phaseScores = phases.reduce((scores, phase) => {
    const phaseEvidence = evidence.filter((item) => item.phase === phase);
    const average = phaseEvidence.length
      ? phaseEvidence.reduce((sum, item) => sum + item.strength, 0) / phaseEvidence.length
      : 0;
    scores[phase] = clamp(average);
    return scores;
  }, {} as Record<MetacognitionPhase, number>);

  const currentPhase = choosePhase({ phaseScores, decision: params.decision });
  const shouldPromptNow = params.decision.type !== 'recover_confidence' || currentPhase === 'monitor';

  return {
    learnerId: params.learnerId,
    subject: params.subject,
    currentPhase,
    phaseScores,
    evidence,
    prompt: PROMPTS[currentPhase],
    shouldPromptNow,
    reason: shouldPromptNow
      ? `A próxima oportunidade metacognitiva é ${currentPhase}, respeitando a decisão pedagógica ${params.decision.type}.`
      : 'A recuperação emocional e cognitiva tem prioridade; a reflexão explícita deve esperar uma pequena vitória.',
    safeguards: [
      'Não transformar reflexão em interrogatório ou prova adicional.',
      'Não exigir vocabulário sofisticado para reconhecer consciência do próprio processo.',
      'Aceitar respostas por fala, texto, exemplo, desenho ou escolha guiada quando apropriado.',
      'Não confundir silêncio, lentidão ou dificuldade de expressão com ausência de pensamento.',
      'Usar no máximo uma oportunidade metacognitiva principal por resposta.',
    ],
    generatedAt: now,
  };
}

export function summarizeMetacognitionPlan(plan: MetacognitionPlan): string {
  return [
    `Phase: ${plan.currentPhase}`,
    `Prompt now: ${plan.shouldPromptNow ? 'yes' : 'no'}`,
    `Scores: plan ${plan.phaseScores.plan}/10, monitor ${plan.phaseScores.monitor}/10, evaluate ${plan.phaseScores.evaluate}/10, transfer ${plan.phaseScores.transfer}/10`,
    plan.reason,
  ].join(' | ');
}
