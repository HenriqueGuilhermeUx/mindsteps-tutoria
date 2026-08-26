import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware } from './auth.js'
import { getGovernancePolicy,governanceReadiness,listIncidents,registerIncident,saveGovernancePolicy } from '../services/schoolGovernance.js'
const router=Router();router.use(authMiddleware)
const policy=z.object({title:z.string().max(200).optional(),status:z.enum(['draft','active','archived']).optional(),allowedSystems:z.array(z.string()).optional(),prohibitedUses:z.array(z.string()).optional(),ageRules:z.record(z.unknown()).optional(),dataRules:z.record(z.unknown()).optional(),humanReviewRules:z.record(z.unknown()).optional(),incidentContact:z.string().max(300).optional().nullable()})
router.get('/:institutionId/policy',async(req,res)=>{try{res.json({policy:await getGovernancePolicy(req.userId,req.params.institutionId)})}catch(e){res.status(403).json({message:e instanceof Error?e.message:'Acesso negado'})}})
router.put('/:institutionId/policy',async(req,res)=>{try{const b=policy.parse(req.body);res.json({policy:await saveGovernancePolicy(req.userId,req.params.institutionId,b)})}catch(e){if(e instanceof z.ZodError)return res.status(400).json({message:e.errors[0].message});res.status(403).json({message:e instanceof Error?e.message:'Não foi possível salvar a política'})}})
const incident=z.object({systemKey:z.string().optional(),severity:z.enum(['low','medium','high','critical']).default('low'),category:z.string().min(2).max(120),description:z.string().min(5).max(5000),metadata:z.record(z.unknown()).optional()})
router.post('/:institutionId/incidents',async(req,res)=>{try{const b=incident.parse(req.body);res.json({incident:await registerIncident(req.userId,req.params.institutionId,b)})}catch(e){if(e instanceof z.ZodError)return res.status(400).json({message:e.errors[0].message});res.status(403).json({message:e instanceof Error?e.message:'Não foi possível registrar o incidente'})}})
router.get('/:institutionId/incidents',async(req,res)=>{try{res.json({incidents:await listIncidents(req.userId,req.params.institutionId)})}catch(e){res.status(403).json({message:e instanceof Error?e.message:'Acesso negado'})}})
router.get('/:institutionId/readiness',async(req,res)=>{try{res.json(await governanceReadiness(req.userId,req.params.institutionId))}catch(e){res.status(403).json({message:e instanceof Error?e.message:'Acesso negado'})}})
export default router
