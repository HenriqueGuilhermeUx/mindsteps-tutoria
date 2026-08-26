import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware } from './auth.js'
import { getProfileByUserId } from '../db/index.js'
import { buildLearningOSPlan, listLearningOSRuns, persistLearningOSRun } from '../services/learningOperatingSystem.js'

const router=Router();router.use(authMiddleware)
const schema=z.object({actor:z.enum(['student','teacher','guardian','institution']).optional(),intent:z.enum(['learn','practice','verify','create','review','plan','reflect']).optional(),message:z.string().max(8000).optional(),subject:z.string().max(120).optional(),skill:z.string().max(160).optional(),sessionMinutes:z.number().min(0).max(600).optional(),interactionCount:z.number().int().min(0).max(1000).optional(),frustration:z.boolean().optional(),evidence:z.record(z.unknown()).optional(),requestedSystemKey:z.string().max(120).optional(),forceHumanReview:z.boolean().optional()})

router.post('/plan',async(req,res)=>{try{const body=schema.parse(req.body||{});const profile=await getProfileByUserId(req.userId);if(!profile)return res.status(404).json({message:'Perfil não encontrado'});const input={userId:req.userId,profile,...body};res.json({plan:await buildLearningOSPlan(input)})}catch(e){if(e instanceof z.ZodError)return res.status(400).json({message:e.errors[0].message});res.status(500).json({message:e instanceof Error?e.message:'Não foi possível gerar o plano'})}})
router.post('/execute',async(req,res)=>{try{const body=schema.parse(req.body||{});const profile=await getProfileByUserId(req.userId);if(!profile)return res.status(404).json({message:'Perfil não encontrado'});const input={userId:req.userId,profile,...body};const plan=await buildLearningOSPlan(input);const persisted=await persistLearningOSRun(input,plan);res.json({plan,...persisted})}catch(e){if(e instanceof z.ZodError)return res.status(400).json({message:e.errors[0].message});res.status(500).json({message:e instanceof Error?e.message:'Não foi possível executar o Learning OS'})}})
router.get('/runs',async(req,res)=>{try{res.json({runs:await listLearningOSRuns(req.userId,Math.min(100,Number(req.query.limit)||30))})}catch(e){res.status(500).json({message:e instanceof Error?e.message:'Não foi possível carregar execuções'})}})

export default router
