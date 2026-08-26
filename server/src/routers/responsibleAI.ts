import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware } from './auth.js'
import { getProfileByUserId } from '../db/index.js'
import { AI_SYSTEM_REGISTRY, buildResponsibleAIContext } from '../services/responsibleAI.js'
import { getAILiteracyCurriculum, getAILiteracyMission } from '../services/aiLiteracy.js'
import { createHumanOverride, listAILiteracyProgress, saveAILiteracyProgress } from '../services/responsibleAIStore.js'

const router = Router()
router.use(authMiddleware)

router.get('/policy', async (req,res) => {
  const profile = await getProfileByUserId(req.userId)
  if (!profile) return res.status(404).json({message:'Perfil não encontrado'})
  const message = String(req.query.message || '')
  res.json(buildResponsibleAIContext(profile,message))
})

router.get('/registry', (_req,res) => res.json({systems:AI_SYSTEM_REGISTRY}))

router.get('/literacy', async (req,res) => {
  const profile = await getProfileByUserId(req.userId)
  if (!profile) return res.status(404).json({message:'Perfil não encontrado'})
  const [curriculum,progress] = await Promise.all([Promise.resolve(getAILiteracyCurriculum(profile)),listAILiteracyProgress(req.userId)])
  res.json({...curriculum,progress})
})

router.get('/literacy/mission', async (req,res) => {
  const profile = await getProfileByUserId(req.userId)
  if (!profile) return res.status(404).json({message:'Perfil não encontrado'})
  const learningId = req.query.learningId ? Number(req.query.learningId) : undefined
  res.json({mission:getAILiteracyMission(profile,learningId)})
})

const progressSchema=z.object({learningId:z.number().int().min(1).max(12),missionId:z.string().min(2),status:z.enum(['started','completed']),evidence:z.string().max(4000).optional(),reflection:z.string().max(4000).optional()})
router.post('/literacy/progress', async (req,res) => {
  try { const body=progressSchema.parse(req.body); const progress=await saveAILiteracyProgress({userId:req.userId,...body}); res.json({progress}) }
  catch(error){ if(error instanceof z.ZodError)return res.status(400).json({message:error.errors[0].message}); res.status(500).json({message:error instanceof Error?error.message:'Não foi possível salvar o progresso'}) }
})

const overrideSchema=z.object({systemKey:z.string().min(2),recommendationId:z.string().optional(),decision:z.enum(['accepted','adjusted','rejected']),reason:z.string().max(2000).optional(),original:z.record(z.unknown()).optional(),replacement:z.record(z.unknown()).optional()})
router.post('/overrides', async (req,res) => {
  try { const body=overrideSchema.parse(req.body); const override=await createHumanOverride({userId:req.userId,...body}); res.json({override}) }
  catch(error){ if(error instanceof z.ZodError)return res.status(400).json({message:error.errors[0].message}); res.status(500).json({message:error instanceof Error?error.message:'Não foi possível registrar a revisão humana'}) }
})

export default router
