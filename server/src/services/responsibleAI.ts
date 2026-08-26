import type { StudentProfile } from '../db/index.js'

export type EducationStage = 'anos_iniciais' | 'anos_finais' | 'ensino_medio'
export type AssistanceMode = 'discover' | 'guided' | 'explain' | 'verify'
export type ConfidenceLevel = 'low' | 'medium' | 'high'

export interface ResponsibleAIPolicy {
  stage: EducationStage
  assistanceMode: AssistanceMode
  requireStudentAttempt: boolean
  directAnswerAllowed: boolean
  maxAnswerDepth: 'short' | 'medium' | 'deep'
  requireSourceReminder: boolean
  requireHumanSupervision: boolean
  encourageOfflineActivity: boolean
  principles: string[]
  rationale: string[]
}

export interface ResponsibleAIContext {
  policy: ResponsibleAIPolicy
  intent: 'answer_seeking' | 'frustrated' | 'verification' | 'exploration' | 'general'
  confidence: ConfidenceLevel
  explanation: string
}

const DIRECT_ANSWER = /(?:me dá|me de|diga|fala|qual é|responde|resposta pronta|faz pra mim|faça pra mim|resolve|resolva|gabarito)/i
const FRUSTRATION = /(?:não sei|não entendi|não consigo|difícil|travado|me perdi|socorro|complicado)/i
const VERIFY = /(?:confere|verifica|está certo|ta certo|é verdade|fonte|comprove|checa)/i
const EXPLORE = /(?:por que|como funciona|me explica|quero entender|qual a diferença|o que aconteceria|imagine)/i

function parseGrade(grade?: string | null): number | null {
  if (!grade) return null
  const match = String(grade).match(/\d+/)
  return match ? Number(match[0]) : null
}

export function getEducationStage(profile: Pick<StudentProfile, 'age_group' | 'grade'>): EducationStage {
  const grade = parseGrade(profile.grade)
  if (grade !== null) {
    if (grade <= 5) return 'anos_iniciais'
    if (grade <= 9) return 'anos_finais'
    return 'ensino_medio'
  }
  if (profile.age_group === '6-10') return 'anos_iniciais'
  if (profile.age_group === '11-14') return 'anos_finais'
  return 'ensino_medio'
}

export function detectLearningIntent(message: string): ResponsibleAIContext['intent'] {
  if (FRUSTRATION.test(message)) return 'frustrated'
  if (VERIFY.test(message)) return 'verification'
  if (DIRECT_ANSWER.test(message)) return 'answer_seeking'
  if (EXPLORE.test(message)) return 'exploration'
  return 'general'
}

export function buildResponsibleAIContext(profile: Pick<StudentProfile, 'age_group' | 'grade'>, message: string): ResponsibleAIContext {
  const stage = getEducationStage(profile)
  const intent = detectLearningIntent(message)
  const early = stage === 'anos_iniciais'
  const finalYears = stage === 'anos_finais'

  const requireStudentAttempt = intent === 'answer_seeking' && !early
  const directAnswerAllowed = intent === 'frustrated' || intent === 'verification'
  const assistanceMode: AssistanceMode = intent === 'verification' ? 'verify' : intent === 'frustrated' ? 'explain' : intent === 'answer_seeking' ? 'guided' : 'discover'

  const rationale = [
    `Etapa pedagógica: ${stage.replace('_', ' ')}.`,
    intent === 'answer_seeking' ? 'O pedido parece buscar uma solução pronta; o motor deve preservar esforço cognitivo.' : 'O pedido não indica necessidade de resposta pronta.',
    early ? 'Para anos iniciais, priorizar linguagem concreta, mediação, atividades curtas e equilíbrio com experiências fora da tela.' : 'Priorizar autonomia, verificação e progressão do raciocínio.',
  ]

  const policy: ResponsibleAIPolicy = {
    stage,
    assistanceMode,
    requireStudentAttempt,
    directAnswerAllowed,
    maxAnswerDepth: early ? 'short' : finalYears ? 'medium' : 'deep',
    requireSourceReminder: stage === 'ensino_medio' || intent === 'verification',
    requireHumanSupervision: true,
    encourageOfflineActivity: early,
    principles: [
      'intencionalidade_pedagogica',
      'centralidade_humana',
      'salvaguarda_aprendizagem',
      'transparencia_explicabilidade',
      'protecao_dados',
      'equidade',
      'bem_estar',
      'reversibilidade',
    ],
    rationale,
  }

  const confidence: ConfidenceLevel = intent === 'general' ? 'medium' : 'high'
  const explanation = directAnswerAllowed
    ? 'O MindSteps pode explicar diretamente porque há sinal de frustração ou pedido de verificação, mantendo estímulo à compreensão.'
    : requireStudentAttempt
      ? 'O MindSteps vai pedir uma tentativa ou raciocínio inicial antes de entregar a solução completa, para proteger a aprendizagem ativa.'
      : 'O MindSteps vai priorizar descoberta guiada e perguntas curtas antes de aprofundar a explicação.'

  return { policy, intent, confidence, explanation }
}

export function responsibleAIPrompt(context: ResponsibleAIContext): string {
  const p = context.policy
  return `RESPONSIBLE AI CORE\n- Etapa: ${p.stage}\n- Modo de assistência: ${p.assistanceMode}\n- Exigir tentativa do estudante antes de solução completa: ${p.requireStudentAttempt ? 'sim' : 'não'}\n- Resposta direta permitida neste turno: ${p.directAnswerAllowed ? 'sim, se pedagogicamente necessária' : 'não como primeira ação'}\n- Profundidade máxima: ${p.maxAnswerDepth}\n- Lembrar verificação de fontes quando houver afirmação factual relevante: ${p.requireSourceReminder ? 'sim' : 'quando necessário'}\n- Supervisão humana permanece possível e decisões são reversíveis.\n- Não substitua julgamento docente, não rotule o aluno e não apresente inferências como fatos.\n- Evite descarga cognitiva: peça previsão, tentativa, evidência, comparação ou explicação do próprio estudante quando adequado.\n- Se detectar dificuldade persistente, reduza a complexidade e explique; não transforme o método socrático em frustração.\n- Se anos iniciais, prefira exemplos concretos, poucas etapas e sugira atividade fora da tela quando fizer sentido.\n- Explique incertezas e limites quando relevantes.`
}

export const AI_SYSTEM_REGISTRY = [
  { key: 'socratic_tutor', name: 'Tutor Socrático', purpose: 'Apoio dialogado à aprendizagem', humanOversight: true, riskLevel: 'medium', data: ['perfil educacional','mensagens','contexto de estudo'], safeguards: ['age_policy','cognitive_effort_guard','human_override','explainability'] },
  { key: 'adaptive_planner', name: 'Planejador Adaptativo', purpose: 'Priorizar habilidades e intervenções de aprendizagem', humanOversight: true, riskLevel: 'medium', data: ['tentativas','habilidades','progresso'], safeguards: ['confidence','evidence_count','human_override','reversibility'] },
  { key: 'writing_coach', name: 'Coach de Escrita', purpose: 'Feedback formativo e desenvolvimento de autoria', humanOversight: true, riskLevel: 'medium', data: ['versões de texto','drills','feedback'], safeguards: ['provenance','authorship_preservation','human_override'] },
  { key: 'school_insights', name: 'School Insights', purpose: 'Apoiar professores e gestores na leitura de sinais agregados', humanOversight: true, riskLevel: 'high', data: ['atividade','aprendizagem','vínculos institucionais'], safeguards: ['no_automated_high_impact_decision','explainability','human_review','minimum_data'] },
] as const
