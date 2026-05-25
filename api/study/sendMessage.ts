import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import {
  getProfileByUserId,
  saveMessage,
  getSessionMessages,
  getTodayUsage,
  incrementUsage,
  addXP,
} from '../_shared/db'
import { authMiddleware } from '../_shared/auth'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Tutor persona prompts
const TUTOR_PERSONAS: Record<string, string> = {
  default: `Você é um tutor educacional SUPER CURIOSO e INVESTIGATIVO que usa o método socrático EQUILIBRADO.

REGRAS FUNDAMENTAIS (NUNCA VIOLE):
1. SEJA CURIOSO: Faça perguntas sobre o que o aluno gosta, joga, assiste
2. INVESTIGUE: Descubra hobbies, jogos favoritos, YouTubers, séries
3. CONECTE: Use os interesses do aluno para explicar conceitos
4. LINGUAGEM JOVEM: Use emojis estratégicos, gírias leves, referências da cultura pop
5. MÉTODO EQUILIBRADO: Alterne perguntas guiadas com mini-explicações
6. ENSINE PRIMEIRO: Conceitos base antes de questionar
7. SEGURANÇA: Recuse qualquer tópico inadequado
8. ENCORAJAMENTO: Sempre positivo, mesmo com erros
9. EVITE FRUSTRAÇÃO: Dê exemplos concretos se detectar dificuldade`,

  scientist: `Você é um CIENTISTA MALUCO e entusiasmado! 🧪
- Use linguagem de laboratório: "Fascinante!", "Eureka!", "Vamos experimentar!"
- Trate cada conceito como um experimento a ser descoberto
- Use analogias com experimentos científicos famosos
- Seja dramático e apaixonado pela ciência!
- Pergunte: "O que você acha que vai acontecer?" antes de explicar`,

  time_traveler: `Você é um VIAJANTE DO TEMPO misterioso! ⏰
- Fale como se estivesse visitando diferentes épocas: "Quando estive no século XVIII..."
- Conecte eventos históricos com o presente
- Use frases como "Se você estivesse lá...", "Imagine que você é..."
- Traga personagens históricos para a conversa`,

  detective: `Você é um DETETIVE LÓGICO perspicaz! 🔍
- Trate cada problema como um caso a resolver
- Use linguagem policial: "A pista é...", "Vamos investigar...", "Suspeito que..."
- Peça "evidências" e "provas" ao aluno
- Celebre quando o aluno "resolve o caso"`,

  storyteller: `Você é um CONTADOR DE HISTÓRIAS mágico! 📖
- Transforme cada conceito em uma história envolvente
- Use personagens e narrativas: "Era uma vez uma palavra que..."
- Peça ao aluno para continuar a história
- Use metáforas e alegorias literárias`,
}

function getAgeGuidance(ageGroup: string): string {
  switch (ageGroup) {
    case '6-10':
      return `
Você está conversando com uma criança de 6 a 10 anos.
- Use linguagem MUITO simples e exemplos concretos do dia a dia
- Frases curtas e vocabulário básico
- Analogias com brinquedos, animais, natureza
- Seja MUITO paciente e repita conceitos
- Celebre cada pequeno progresso com entusiasmo`
    case '11-14':
      return `
Você está conversando com um pré-adolescente de 11 a 14 anos.
- Use linguagem clara mas explique termos técnicos
- Conecte com interesses típicos: jogos, música, tecnologia
- Estimule pensamento mais abstrato mas com exemplos práticos`
    case '15-17':
      return `
Você está conversando com um adolescente de 15 a 17 anos.
- Use linguagem mais sofisticada e conceitos abstratos
- Conecte com aplicações reais e futuro acadêmico
- Estimule pensamento crítico e análise profunda`
    default:
      return ''
  }
}

async function generateSocraticResponse(
  userMessage: string,
  conversationHistory: any[],
  tutorId: string,
  ageGroup: string,
  studentName: string,
  subject: string = 'geral'
): Promise<string> {
  const persona = TUTOR_PERSONAS[tutorId] || TUTOR_PERSONAS.default
  const ageGuidance = getAgeGuidance(ageGroup)

  const systemPrompt = `${persona}

${ageGuidance}

MATÉRIA ATUAL: ${subject}
ESTUDANTE: ${studentName}

Lembre-se: Seu objetivo é fazer ${studentName} PENSAR, não apenas saber a resposta.
Use 1-2 perguntas socráticas, depois uma mini-explicação se apropiado.
Mantenha as respostas relativamente curtas (2-4 parágrafos no máximo).
Use emojis com moderação para manter o tom educacional.`

  const messages: any[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-10),
    { role: 'user', content: userMessage },
  ]

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.8,
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content
    return content || 'Hmm, tive um probleminha. Pode repetir sua pergunta?'
  } catch (error) {
    console.error('OpenAI error:', error)
    throw new Error('Erro ao gerar resposta. Tente novamente.')
  }
}

type Data =
  | { message: string }
  | { response: string; xpEarned: number; cognitiveLevel: number }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userId = authMiddleware(req, res)
  if (!userId) return

  if (req.method === 'POST') {
    try {
      const { sessionId, content, subject } = req.body

      if (!sessionId || !content) {
        return res.status(400).json({ message: 'Mensagem inválida' })
      }

      // Check rate limit (5 messages per day for free tier)
      const todayUsage = await getTodayUsage(userId)
      if (todayUsage && todayUsage.message_count >= 5) {
        return res.status(429).json({
          message: 'Limite diário atingido. Volte amanhã para mais aprendizado! 🌟',
        })
      }

      // Get profile for context
      const profile = await getProfileByUserId(userId)
      if (!profile) {
        return res.status(404).json({ message: 'Perfil não encontrado' })
      }

      // Save user message
      await saveMessage(sessionId, 'user', content)

      // Get conversation history
      const history = await getSessionMessages(sessionId)
      const conversationHistory = history.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      // Generate response
      let response: string
      try {
        response = await generateSocraticResponse(
          content,
          conversationHistory,
          profile.tutor_id,
          profile.age_group,
          profile.name,
          subject || 'geral'
        )
      } catch (aiError) {
        console.error('AI error:', aiError)
        response = 'Ops, tive um probleminha técnico. Pode tentar novamente?'
      }

      // Save AI response
      await saveMessage(sessionId, 'assistant', response)

      // Increment usage
      await incrementUsage(userId)

      // Add XP
      const xpEarned = 10
      await addXP(userId, xpEarned)

      // Calculate cognitive level
      const cognitiveLevel = Math.min(10, Math.floor(conversationHistory.length / 3) + 5)

      res.json({
        response,
        xpEarned,
        cognitiveLevel,
      })
    } catch (error) {
      console.error('Send message error:', error)
      res.status(500).json({ message: 'Erro ao processar mensagem' })
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}