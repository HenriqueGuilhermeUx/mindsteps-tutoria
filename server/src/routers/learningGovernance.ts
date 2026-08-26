import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware } from './auth.js'
import { getProfileByUserId } from '../db/index.js'
import { buildLearningDecision, buildUnpluggedMission, getChildRightsPreferences, listLearningDecisions, saveChildRightsPreferences, saveFairnessObservation, saveLearningDecision } from '../services/learningGovernance.js'
import { TEACHER_AI_COMPETENCY_PATH, buildTeacherSignals, listTeacherSignals, saveTeacherSignal, updateTeacherSignal } from '../services/teacherIntelligence.js'

const router=Router();router.use(authMiddleware)

router.get('/child-rights',async(req,res)=>{try{res.json({preferences:await getChildRightsPreferences(req.userId)})}catch(e){res.status(500).json({message:e instanceof Error?e.message:'Erro ao carregar preferências'})}})
router.put('/child-rights',async(req,res)=>{try{res.json({preferences:await saveChildRightsPreferences(req.userId,req.body||{})})}catch(e){res.status(400).json({message:e instanceof Error?e.message:'Erro ao salvar preferências'})}})

router.get('/unplugged/mission',async(req,res)=>{const profile=await getProfileByUserId(req.userId);if(!profile)return res.status(404).json({message:'Perfil não encontrado'});const learningId=req.query.learningId?Number(req.query.learningId):undefined;res.json({mission:buildUnpluggedMission(profile,learningId)})})

const decisionSchema=z.object({systemKey:z.string().min(2),decisionType:z.string().min(2),recommendationId:z.string().optional(),subject:z.string().optional(),skill:z.string().optional(),evidence:z.record(z.unknown()).optional(),confidence:z.number().min(0).max(1).optional(),explanation:z.string().min(5).max(4000),humanReviewRequired:z.boolean().optional()})
router.post('/decisions',async(req,res)=>{try{const body=decisionSchema.parse(req.body);const built=buildLearningDecision(body);res.json({decision:await saveLearningDecision(req.userId,built),explainability:built})}catch(e){if(e instanceof z.ZodError)return res.status(400).json({message:e.errors[0].message});res.status(500).json({message:e instanceof Error?e.message:'Erro ao salvar decisão'})}})
router.get('/decisions',async(req,res)=>{try{res.json({decisions:await listLearningDecisions(req.userId,Math.min(100,Number(req.query.limit)||30))})}catch(e){res.status(500).json({message:e instanceof Error?e.message:'Erro ao carregar decisões'})}})

const fairnessSchema=z.object({institutionId:z.string().uuid().nullable().optional(),systemKey:z.string().min(2),metricKey:z.string().min(2),cohortKey:z.string().min(2),cohortValue:z.string().min(1),sampleSize:z.number().int().min(0),metricValue:z.number(),baselineValue:z.number().nullable().optional(),metadata:z.record(z.unknown()).optional()})
router.post('/fairness/observations',async(req,res)=>{try{res.json(await saveFairnessObservation(fairnessSchema.parse(req.body)))}catch(e){if(e instanceof z.ZodError)return res.status(400).json({message:e.errors[0].message});res.status(500).json({message:e instanceof Error?e.message:'Erro ao registrar observação'})}})

router.get('/teacher/competencies',(_req,res)=>res.json({domains:TEACHER_AI_COMPETENCY_PATH}))
router.post('/teacher/signals/preview',async(req,res)=>{try{res.json({signals:buildTeacherSignals(req.body)})}catch(e){res.status(400).json({message:e instanceof Error?e.message:'Entrada inválida'})}})
router.post('/teacher/signals',async(req,res)=>{try{const signal=buildTeacherSignals(req.body.input||{})[0];if(!signal)return res.status(400).json({message:'Nenhum sinal pedagógico suficiente foi identificado'});res.json({event:await saveTeacherSignal({teacherUserId:req.userId,institutionId:req.body.institutionId||null,studentUserId:req.body.studentUserId||null,signal})})}catch(e){res.status(400).json({message:e instanceof Error?e.message:'Não foi possível registrar o sinal'})}})
router.get('/teacher/signals',async(req,res)=>{try{res.json({events:await listTeacherSignals(req.userId,req.query.institutionId?String(req.query.institutionId):undefined)})}catch(e){res.status(500).json({message:e instanceof Error?e.message:'Erro ao carregar sinais'})}})
router.patch('/teacher/signals/:id',async(req,res)=>{try{const status=z.enum(['accepted','adjusted','dismissed','completed']).parse(req.body.status);res.json({event:await updateTeacherSignal(req.userId,req.params.id,status,req.body.recommendation)})}catch(e){res.status(400).json({message:e instanceof Error?e.message:'Não foi possível atualizar o sinal'})}})

export default router
