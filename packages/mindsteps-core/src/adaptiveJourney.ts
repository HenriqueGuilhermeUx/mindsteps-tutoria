import type { CognitiveTwin, LearningMemory, Subject } from './types';

export type JourneyActionType =
  | 'review'
  | 'challenge'
  | 'recover_confidence'
  | 'spark_curiosity'
  | 'reflect'
  | 'offline_mission';

export interface JourneyStep {
  type: JourneyActionType;
  title: string;
  description: string;
  reason: string;
  subject?: Subject;
  concept?: string;
}

export function planNextJourneyStep(params: {
  twin: CognitiveTwin;
  memory: LearningMemory;
  subject: Subject;
}): JourneyStep {
  const { twin, memory, subject } = params;
  const fragileConcept = twin.fragileConcepts[twin.fragileConcepts.length - 1];
  const masteredConcept = twin.masteredConcepts[twin.masteredConcepts.length - 1];
  const recentInterest = twin.interests[0] || memory.interestMemory[memory.interestMemory.length - 1];

  if (twin.confidenceLevel <= 3) {
    return {
      type: 'recover_confidence',
      title: 'Reconstruir confiança',
      description: 'Comece com uma pergunta pequena, concreta e sem pressão antes de avançar.',
      reason: 'A confiança está baixa; o próximo passo deve reduzir ansiedade e restaurar segurança.',
      subject,
      concept: fragileConcept,
    };
  }

  if (fragileConcept) {
    return {
      type: 'review',
      title: `Revisar ${fragileConcept}`,
      description: 'Retome o conceito frágil usando exemplo concreto e pergunta guiada.',
      reason: 'O Cognitive Twin indica conceito frágil que precisa de consolidação.',
      subject,
      concept: fragileConcept,
    };
  }

  if (twin.confidenceLevel >= 7 && masteredConcept) {
    return {
      type: 'challenge',
      title: `Aplicar ${masteredConcept}`,
      description: 'Ofereça um desafio um pouco mais complexo ou peça uma explicação com as próprias palavras.',
      reason: 'O aluno demonstra confiança e domínio suficiente para transferência.',
      subject,
      concept: masteredConcept,
    };
  }

  if (recentInterest) {
    return {
      type: 'spark_curiosity',
      title: `Conectar com ${recentInterest}`,
      description: 'Use o interesse do aluno para abrir uma pergunta investigativa.',
      reason: 'Interesses pessoais aumentam significado e engajamento saudável.',
      subject,
    };
  }

  return {
    type: 'reflect',
    title: 'Refletir sobre a aprendizagem',
    description: 'Peça ao aluno para dizer o que entendeu, o que confundiu e qual estratégia ajudou.',
    reason: 'A reflexão fortalece metacognição e ajuda o sistema a personalizar melhor.',
    subject,
  };
}
