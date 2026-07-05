interface ConversationMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface StudentProfileContext {
  name: string
  age_group: string
  grade?: string
  tutor_id?: string
}

function hasFrustrationSignal(text: string): boolean {
  const normalized = text.toLowerCase()
  return [
    'não sei',
    'nao sei',
    'não entendi',
    'nao entendi',
    'difícil',
    'dificil',
    'não consigo',
    'nao consigo',
    'me ajuda',
  ].some(pattern => normalized.includes(pattern))
}

function hasCuriositySignal(text: string): boolean {
  const normalized = text.toLowerCase()
  return [
    'por que',
    'porque',
    'como funciona',
    'e se',
    'quero saber',
    'curioso',
    'descobrir',
  ].some(pattern => normalized.includes(pattern))
}

function inferLearningStrategy(message: string, history: ConversationMessage[]): string {
  if (hasFrustrationSignal(message)) {
    return 'guided_hint'
  }

  const recentUserMessages = history.filter(item => item.role === 'user').slice(-3)
  const repeatedDifficulty = recentUserMessages.filter(item => hasFrustrationSignal(item.content)).length >= 2
  if (repeatedDifficulty) {
    return 'recovery_before_challenge'
  }

  if (hasCuriositySignal(message)) {
    return 'curiosity_expansion'
  }

  return 'socratic_questioning'
}

function strategyInstruction(strategy: string): string {
  switch (strategy) {
    case 'guided_hint':
      return 'Acolha a dificuldade, ofereça uma dica pequena e faça uma pergunta simples. Não entregue a resposta final.'
    case 'recovery_before_challenge':
      return 'Reduza a carga cognitiva. Use exemplo concreto, linguagem simples e reforce que errar faz parte do processo.'
    case 'curiosity_expansion':
      return 'Aproveite a curiosidade do aluno. Faça uma pergunta investigativa e conecte com uma descoberta interessante.'
    default:
      return 'Use maiêutica socrática: faça uma pergunta curta que ajude o aluno a dar o próximo passo de raciocínio.'
  }
}

export function buildLearningCoreContext(params: {
  profile: StudentProfileContext
  subject: string
  message: string
  history: ConversationMessage[]
}): string {
  const strategy = inferLearningStrategy(params.message, params.history)
  const frustration = hasFrustrationSignal(params.message)
  const curiosity = hasCuriositySignal(params.message)
  const recentUserMessages = params.history.filter(item => item.role === 'user').slice(-5)

  return [
    `Learning Strategy: ${strategy}`,
    `Strategy Instruction: ${strategyInstruction(strategy)}`,
    `Learner: ${params.profile.name}`,
    `Age Group: ${params.profile.age_group}`,
    `Grade: ${params.profile.grade || 'unknown'}`,
    `Subject: ${params.subject}`,
    `Frustration Signal: ${frustration ? 'yes' : 'no'}`,
    `Curiosity Signal: ${curiosity ? 'yes' : 'no'}`,
    `Recent Learner Messages: ${recentUserMessages.map(item => item.content).join(' | ') || 'none'}`,
    'Learning Rule: pedagogy decides the strategy; AI only generates language.',
  ].join('\n')
}
