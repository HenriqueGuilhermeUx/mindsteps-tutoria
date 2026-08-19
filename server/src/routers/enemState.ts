import { Router } from 'express'
import { authMiddleware } from './auth.js'
import { getEnemState, saveEnemState } from '../services/enemState.js'

const router = Router()
router.use(authMiddleware)

router.get('/state', async (req, res) => {
  try {
    const state = await getEnemState(req.userId)
    res.json({ state })
  } catch (error) {
    console.error('Get ENEM state error:', error)
    res.status(500).json({ message: 'Não foi possível carregar seu estado ENEM' })
  }
})

router.put('/state', async (req, res) => {
  try {
    const payload = req.body || {}
    const result = await saveEnemState(req.userId, {
      profile: payload.profile ?? null,
      diagnostic: payload.diagnostic ?? null,
      attempts: Array.isArray(payload.attempts) ? payload.attempts.slice(-500) : [],
      simulations: Array.isArray(payload.simulations) ? payload.simulations.slice(0, 50) : [],
      dailyCompleted: Array.isArray(payload.dailyCompleted) ? payload.dailyCompleted.slice(-1000) : [],
      updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : undefined,
    })
    res.json(result)
  } catch (error) {
    console.error('Save ENEM state error:', error)
    res.status(500).json({ message: 'Não foi possível sincronizar seu estado ENEM' })
  }
})

export default router
