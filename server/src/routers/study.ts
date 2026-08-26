import { Router } from 'express'
import {
  getProfileByUserId,
  updateProfile,
  createSession,
  endSession,
  saveMessage,
  getSessionMessages,
  addXP,
  getTodayUsage,
  incrementUsage,
} from '../db/index.js'
import { generateSocraticResponse, calculateCognitiveLevel } from '../services/ai.js'
import { buildLearningCoreContext } from '../services/learningCoreContext.js'
import { buildResponsibleAIContext, responsibleAIPrompt } from '../services/responsibleAI.js'
import { logResponsibleAIEvent } from '../services/responsibleAIStore.js'
import { buildLearningOSPlan, learningOSPrompt, persistLearningOSRun } from '../services/learningOperatingSystem.js'
import { authMiddleware } from './auth.js'

const router = Router()
router.use(authMiddleware)

router.get('/profile', async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.userId)
    if (!profile) return res.status(404).json({ message: 'Perfil não encontrado' })
    res.json(profile)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Erro ao buscar perfil' })
  }
})

router.post('/profile/update', async (req, res) => {
  try {
    const { name, tutorId, petType, petName } = req.body
    const updates: any = {}
    if (name) updates.name = name
    if (tutorId) updates.tutor_id = tutorId
    if (petType) updates.pet_type = petType
    if (petName) updates.pet_name = petName
    const profile = await updateProfile(req.userId, updates)
    res.json(profile)
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Erro ao atualizar perfil' })
  }
})

router.post('/study/startSession', async (req, res) => {
  try {
    const { tutorId } = req.body
    const profile = await getProfileByUserId(req.userId)
    if (!profile) return res.status(404).json({ message: 'Perfil não encontrado' })
    const session = await createSession(profile.id, tutorId || 'default')
    res.json({ sessionId: session.id })
  } catch (error) {
    console.error('Start session error:', error)
    res.status(500).json({ message: 'Erro ao iniciar sessão' })
  }
})

router.post('/study/sendMessage', async (req, res) => {
  try {
    const { sessionId, content, subject, skill } = req.body
    if (!sessionId || !content) return res.status(400).json({ message: 'Mensagem inválida' })

    const todayUsage = await getTodayUsage(req.userId)
    if (todayUsage && todayUsage.message_count >= 5) {
      return res.status(429).json({ message: 'Limite diário atingido. Volte amanhã para mais aprendizado! 🌟' })
    }

    const profile = await getProfileByUserId(req.userId)
    if (!profile) return res.status(404).json({ message: 'Perfil não encontrado' })

    await saveMessage(sessionId, 'user', content)
    const history = await getSessionMessages(sessionId)
    const conversationHistory = history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    const learningCoreContext = buildLearningCoreContext({
      profile,
      subject: subject || 'geral',
      message: content,
      history: conversationHistory,
    })
    const responsibleAI = buildResponsibleAIContext(profile, content)
    const learningOSInput = {
      userId: req.userId,
      profile,
      actor: 'student' as const,
      intent: 'learn' as const,
      message: content,
      subject: subject || 'geral',
      skill: skill ? String(skill) : undefined,
      interactionCount: conversationHistory.length,
      frustration: responsibleAI.intent === 'frustrated',
      requestedSystemKey: 'socratic_tutor',
      evidence: { conversationTurns: conversationHistory.length },
    }
    const learningOS = await buildLearningOSPlan(learningOSInput)
    const combinedCoreContext = `${learningCoreContext}\n\n${responsibleAIPrompt(responsibleAI)}\n\n${learningOSPrompt(learningOS)}`

    let response: string
    try {
      response = await generateSocraticResponse(
        content,
        conversationHistory,
        profile.tutor_id,
        profile.age_group,
        profile.name,
        subject || 'geral',
        combinedCoreContext
      )
    } catch (aiError) {
      console.error('AI error:', aiError)
      response = 'Ops, tive um probleminha técnico. Pode tentar novamente?'
    }

    await saveMessage(sessionId, 'assistant', response)
    await incrementUsage(req.userId)
    const xpEarned = 10
    await addXP(req.userId, xpEarned)
    const cognitiveLevel = calculateCognitiveLevel(conversationHistory)

    void logResponsibleAIEvent({
      userId: req.userId,
      sessionId,
      systemKey: 'socratic_tutor',
      action: 'tutor_response',
      context: responsibleAI,
      metadata: { subject: subject || 'geral', cognitiveLevel, responseLength: response.length, learningOSIntervention: learningOS.intervention },
    })
    void persistLearningOSRun(learningOSInput, learningOS).catch(error => console.error('Learning OS persistence error:', error))

    res.json({
      response,
      xpEarned,
      cognitiveLevel,
      learningCore: {
        enabled: true,
        contextPreview: learningCoreContext.split('\n').slice(0, 4),
      },
      responsibleAI: {
        enabled: true,
        stage: responsibleAI.policy.stage,
        assistanceMode: responsibleAI.policy.assistanceMode,
        confidence: responsibleAI.confidence,
        explanation: responsibleAI.explanation,
        humanReviewAvailable: true,
      },
      learningOS: {
        enabled: true,
        intervention: learningOS.intervention,
        confidence: learningOS.confidence,
        confidenceBand: learningOS.confidenceBand,
        explanation: learningOS.explanation,
        safeguards: learningOS.safeguards,
        nextAction: learningOS.nextAction,
      },
    })
  } catch (error) {
    console.error('Send message error:', error)
    res.status(500).json({ message: 'Erro ao processar mensagem' })
  }
})

router.get('/study/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    const messages = await getSessionMessages(sessionId)
    res.json({ messages: messages.map(m => ({ role: m.role, content: m.content, createdAt: m.created_at })) })
  } catch (error) {
    console.error('Get history error:', error)
    res.status(500).json({ message: 'Erro ao buscar histórico' })
  }
})

router.post('/study/endSession', async (req, res) => {
  try {
    const { sessionId } = req.body
    await endSession(sessionId)
    res.json({ success: true })
  } catch (error) {
    console.error('End session error:', error)
    res.status(500).json({ message: 'Erro ao encerrar sessão' })
  }
})

router.get('/usage/check', async (req, res) => {
  try {
    const todayUsage = await getTodayUsage(req.userId)
    const messageCount = todayUsage?.message_count || 0
    const limit = 5
    res.json({ remaining: Math.max(0, limit - messageCount), limit })
  } catch (error) {
    console.error('Check usage error:', error)
    res.json({ remaining: 5, limit: 5 })
  }
})

router.post('/profile/claimDaily', async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.userId)
    if (!profile) return res.status(404).json({ message: 'Perfil não encontrado' })
    const bonus = profile.streak * 10
    await addXP(req.userId, bonus)
    res.json({ streak: profile.streak, bonus })
  } catch (error) {
    console.error('Claim daily error:', error)
    res.status(500).json({ message: 'Erro ao resgatar bônus' })
  }
})

export default router
