import type {
  LearningContext,
  LearningEvent,
  LearningResponsePlan,
  PedagogicalStrategy,
} from './types';

function hasFrustrationSignal(message: string): boolean {
  const normalized = message.toLowerCase().trim();
  return [
    'nao sei',
    'não sei',
    'nao entendi',
    'não entendi',
    'dificil',
    'difícil',
    'nao consigo',
    'não consigo',
    'me ajuda',
  ].some((pattern) => normalized.includes(pattern));
}

function chooseAnalogy(context: LearningContext): string | undefined {
  const interest = context.cognitiveTwin.interests[0] || context.learningMemory.interestMemory[0];
  if (!interest) return undefined;
  return `Use an analogy connected to ${interest}, but keep it short and age-appropriate.`;
}

export function selectPedagogicalStrategy(context: LearningContext): PedagogicalStrategy {
  const isFrustrated = hasFrustrationSignal(context.currentMessage);
  const analogy = chooseAnalogy(context);

  if (isFrustrated) {
    return {
      type: 'guided_hint',
      goal: 'Reduce frustration and restore confidence while keeping the learner thinking.',
      reasoning: 'The learner expressed frustration or inability. The safest strategy is a gentle hint, not a direct answer.',
      instructionForAi:
        'Acolha a dificuldade, normalize o erro e ofereça uma dica pequena. Não entregue a resposta final. Faça uma pergunta simples para o próximo passo.',
      avoidDirectAnswer: true,
      suggestedQuestion: 'Qual é a menor parte do problema que conseguimos resolver primeiro?',
      suggestedAnalogy: analogy,
    };
  }

  if (context.cognitiveTwin.misconceptions.length > 0) {
    return {
      type: 'socratic_questioning',
      goal: 'Surface and correct a misconception through guided reasoning.',
      reasoning: 'The learner has known misconception patterns, so a Socratic question should target reasoning rather than provide the answer.',
      instructionForAi:
        'Identifique com cuidado o provável padrão de erro e faça uma pergunta socrática específica. Evite julgamento. Não dê a resposta pronta.',
      avoidDirectAnswer: true,
      suggestedQuestion: 'O que fez você escolher esse caminho? Vamos olhar esse passo juntos?',
      suggestedAnalogy: analogy,
    };
  }

  if (context.learningMemory.strategyMemory.some((item) => item.worked && item.strategy === 'analogy')) {
    return {
      type: 'analogy',
      goal: 'Connect the new idea to a familiar context that worked before.',
      reasoning: 'Learning Memory shows analogies have helped this learner before.',
      instructionForAi:
        'Use uma analogia curta ligada aos interesses do aluno e depois faça uma pergunta para verificar compreensão. Não encerre com resposta pronta.',
      avoidDirectAnswer: true,
      suggestedAnalogy: analogy,
    };
  }

  return {
    type: 'socratic_questioning',
    goal: 'Help the learner think before receiving explanation.',
    reasoning: 'Default MindSteps strategy: curiosity and reasoning before answers.',
    instructionForAi:
      'Responda como um tutor socrático. Faça uma pergunta clara, curta e conectada ao que o aluno escreveu. Não entregue a resposta final.',
    avoidDirectAnswer: true,
    suggestedQuestion: 'O que você acha que acontece primeiro nesse problema?',
    suggestedAnalogy: analogy,
  };
}

export function createLearningResponsePlan(context: LearningContext): LearningResponsePlan {
  const strategy = selectPedagogicalStrategy(context);
  const now = new Date().toISOString();

  const memoryUpdates: LearningEvent[] = [
    {
      learnerId: context.learnerId,
      type: 'QuestionAsked',
      subject: context.subject,
      evidence: context.currentMessage,
      metadata: {
        selectedStrategy: strategy.type,
        strategyReasoning: strategy.reasoning,
      },
      createdAt: now,
    },
  ];

  if (strategy.type === 'guided_hint') {
    memoryUpdates.push({
      learnerId: context.learnerId,
      type: 'FrustrationDetected',
      subject: context.subject,
      evidence: context.currentMessage,
      createdAt: now,
    });
  }

  return {
    strategy,
    memoryUpdates,
  };
}
