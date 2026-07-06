import type { Subject } from './types';
import type { LearningSignal } from './learningSignals';
import type { LearningState } from './learningState';

export type FamilyMessageTone = 'encouraging' | 'supportive' | 'celebratory' | 'attention';

export interface FamilyCompanionMessage {
  tone: FamilyMessageTone;
  title: string;
  message: string;
  suggestedAction: string;
  subject?: Subject;
}

export function generateFamilyCompanionMessages(params: {
  learnerName?: string;
  subject: Subject;
  learningState: LearningState;
  signals: LearningSignal[];
}): FamilyCompanionMessage[] {
  const learner = params.learnerName || 'o estudante';
  const messages: FamilyCompanionMessage[] = [];

  const curiositySignal = params.signals.find((signal) => signal.type === 'CuriosityDetected');
  if (curiositySignal) {
    messages.push({
      tone: 'celebratory',
      title: 'Curiosidade em alta',
      message: `Hoje ${learner} demonstrou curiosidade em ${params.subject}. Isso é um ótimo sinal de aprendizagem ativa.`,
      suggestedAction: 'Pergunte o que foi descoberto hoje e incentive uma explicação com as próprias palavras.',
      subject: params.subject,
    });
  }

  const recoverySignal = params.signals.find((signal) => signal.type === 'RecoveryNeeded');
  if (recoverySignal) {
    messages.push({
      tone: 'supportive',
      title: 'Apoio sem pressão',
      message: `${learner} pode ter sentido dificuldade ou insegurança durante o estudo.`,
      suggestedAction: 'Valorize o esforço e pergunte qual parte ficou mais difícil, sem cobrar resposta imediata.',
      subject: params.subject,
    });
  }

  const challengeSignal = params.signals.find((signal) => signal.type === 'ChallengeReady');
  if (challengeSignal) {
    messages.push({
      tone: 'encouraging',
      title: 'Pronto para um novo desafio',
      message: `${learner} parece pronto para tentar algo um pouco mais difícil em ${params.subject}.`,
      suggestedAction: 'Convide o estudante a criar um exemplo próprio ou explicar o assunto para alguém da família.',
      subject: params.subject,
    });
  }

  if (params.learningState.cognitiveLoad >= 8) {
    messages.push({
      tone: 'attention',
      title: 'Hora de simplificar',
      message: `O estudo pode ter ficado pesado para ${learner}. Uma pausa curta pode ajudar.`,
      suggestedAction: 'Faça uma pausa e retome com uma pergunta pequena e concreta.',
      subject: params.subject,
    });
  }

  if (messages.length === 0) {
    messages.push({
      tone: 'encouraging',
      title: 'Pequeno passo de aprendizagem',
      message: `${learner} deu mais um passo no processo de aprendizagem hoje.`,
      suggestedAction: 'Pergunte o que ficou mais claro depois do estudo.',
      subject: params.subject,
    });
  }

  return messages;
}

export function summarizeFamilyCompanionMessages(messages: FamilyCompanionMessage[]): string {
  return messages
    .slice(0, 3)
    .map((message) => `${message.title}: ${message.suggestedAction}`)
    .join(' | ');
}
