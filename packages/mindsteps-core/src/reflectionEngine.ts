import type { CognitiveTwin, LearningMemory, Subject } from './types';

export interface ReflectionPrompt {
  question: string;
  reason: string;
}

export function createReflectionPrompt(params: {
  subject: Subject;
  twin: CognitiveTwin;
  memory: LearningMemory;
}): ReflectionPrompt {
  const latestFragileConcept = params.twin.fragileConcepts[params.twin.fragileConcepts.length - 1];
  const latestMasteredConcept = params.twin.masteredConcepts[params.twin.masteredConcepts.length - 1];

  if (latestFragileConcept) {
    return {
      question: `O que ficou mais confuso em ${latestFragileConcept}: a ideia, as palavras do problema ou o passo a passo?`,
      reason: 'The learner has a fragile concept and needs metacognitive awareness before more practice.',
    };
  }

  if (latestMasteredConcept) {
    return {
      question: `Como você explicaria ${latestMasteredConcept} para alguém que está vendo isso pela primeira vez?`,
      reason: 'Explaining a mastered concept strengthens transfer and metacognition.',
    };
  }

  if (params.memory.strategyMemory.length > 0) {
    return {
      question: 'Qual tipo de explicação te ajudou mais hoje: pergunta, exemplo, desenho, analogia ou desafio?',
      reason: 'The platform should learn which strategies the learner perceives as useful.',
    };
  }

  return {
    question: 'O que você descobriu hoje que não sabia antes?',
    reason: 'General reflection helps learners build awareness of progress.',
  };
}
