import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware } from './auth.js'
import { getProfileByUserId } from '../db/index.js'
import { appendAuthorshipEvent,listAuthorshipEvents,listInterventionEvidence,saveInterventionEvidence } from '../services/learningSafetyStore.js'
import { buildAccessibilityInstruction,evaluateInterventionEvidence,evaluateWellbeing,summarizeAuthorship } from '../services/learningSafety.js'

const router=Router();router.use(authMiddleware)
const authorship=z.object({workId:z.string().min(2),type:z.enum(['student_original','ai_feedback','ai_suggestion','student_revision','teacher_feedback','final_submission']),content:z.string().max(30000).optional(),metadata:z.record(z.unknown()).optional()})
router.post('/authorship/events',async(req,res)=>{try{const b=authorship.parse(req.body);res.json({event:await appendAuthorshipEvent(req.userId,b.workId,b)})}catch(e){if(e instanceof z.ZodError)return res.status(400).json({message:e.errors[0].message});res.status(500).json({message:e instanceof Error?e.message:'Falha ao registrar autoria'})}})
router.get('/authorship/:workId',async(req,res)=>{try{const rows=await listAuthorshipEvents(req.userId,req.params.workId);const events=rows.map((r:any)=>({type:r.event_type,content:r.content||'',metadata:r.metadata,createdAt:r.created_at}));res.json({events,summary:summarizeAuthorship(events)})}catch(e){res.status(500).json({message:e instanceof Error?e.message:'Falha ao carregar autoria'})}})
router.get('/accessibility/instruction',async(req,res)=>{const profile=await getProfileByUserId(req.userId);if(!profile)return res.status(404).json({message:'Perfil não encontrado'});const mode=String(req.query.mode||'plain_language') as any;res.json({mode,instruction:buildAccessibilityInstruction(mode,profile.age_group)})})
router.get('/wellbeing',async(req,res)=>{const profile=await getProfileByUserId(req.userId);if(!profile)return res.status(404).json({message:'Perfil não encontrado'});const sessionMinutes=Number(req.query.sessionMinutes||0),messages=Number(req.query.messages||0),frustrated=String(req.query.frustrated||'false')==='true';res.json(evaluateWellbeing({ageGroup:profile.age_group,sessionMinutes,messages,frustrated}))})
const evidence=z.object({interventionId:z.string().min(2),skill:z.string().min(2),before:z.number().min(0).max(100).optional(),after:z.number().min(0).max(100).optional(),completed:z.boolean(),minutes:z.number().nonnegative().optional(),context:z.string().max(1000).optional()})
router.post('/evidence',async(req,res)=>{try{const b=evidence.parse(req.body);res.json({evidence:await saveInterventionEvidence(req.userId,b)})}catch(e){if(e instanceof z.ZodError)return res.status(400).json({message:e.errors[0].message});res.status(500).json({message:e instanceof Error?e.message:'Falha ao salvar evidência'})}})
router.get('/evidence/summary',async(req,res)=>{try{const rows=await listInterventionEvidence(req.userId);res.json({summary:evaluateInterventionEvidence(rows),evidence:rows})}catch(e){res.status(500).json({message:e instanceof Error?e.message:'Falha ao avaliar evidências'})}})
export default router
