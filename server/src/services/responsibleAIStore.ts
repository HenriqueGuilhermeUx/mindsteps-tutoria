import { supabase } from '../db/index.js'
import type { ResponsibleAIContext } from './responsibleAI.js'

export async function logResponsibleAIEvent(input:{ userId:string; sessionId?:string|null; systemKey:string; action:string; context?:ResponsibleAIContext; metadata?:Record<string,unknown> }) {
  const { error } = await supabase.from('mindsteps_responsible_ai_events').insert({
    user_id: input.userId,
    session_id: input.sessionId || null,
    system_key: input.systemKey,
    action: input.action,
    education_stage: input.context?.policy.stage || null,
    assistance_mode: input.context?.policy.assistanceMode || null,
    intent: input.context?.intent || null,
    confidence: input.context?.confidence || null,
    explanation: input.context?.explanation || null,
    policy: input.context?.policy || {},
    metadata: input.metadata || {},
  })
  if (error) console.error('Responsible AI audit error:', error.message)
}

export async function createHumanOverride(input:{ userId:string; systemKey:string; recommendationId?:string|null; decision:'accepted'|'adjusted'|'rejected'; reason?:string|null; original?:Record<string,unknown>; replacement?:Record<string,unknown> }) {
  const { data, error } = await supabase.from('mindsteps_ai_human_overrides').insert({
    user_id: input.userId,
    system_key: input.systemKey,
    recommendation_id: input.recommendationId || null,
    decision: input.decision,
    reason: input.reason || null,
    original_payload: input.original || {},
    replacement_payload: input.replacement || {},
  }).select('*').single()
  if (error) throw new Error(error.message)
  return data
}

export async function listHumanOverrides(userId:string,limit=100){
  const {data,error}=await supabase.from('mindsteps_ai_human_overrides').select('*').eq('user_id',userId).order('created_at',{ascending:false}).limit(limit)
  if(error)throw new Error(error.message)
  return data||[]
}

export async function saveAILiteracyProgress(input:{ userId:string; learningId:number; missionId:string; status:'started'|'completed'; evidence?:string|null; reflection?:string|null }) {
  const { data, error } = await supabase.from('mindsteps_ai_literacy_progress').upsert({
    user_id: input.userId,
    learning_id: input.learningId,
    mission_id: input.missionId,
    status: input.status,
    evidence: input.evidence || null,
    reflection: input.reflection || null,
    completed_at: input.status === 'completed' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }, { onConflict:'user_id,mission_id' }).select('*').single()
  if (error) throw new Error(error.message)
  return data
}

export async function listAILiteracyProgress(userId:string) {
  const { data, error } = await supabase.from('mindsteps_ai_literacy_progress').select('*').eq('user_id',userId).order('updated_at',{ascending:false})
  if (error) throw new Error(error.message)
  return data || []
}
