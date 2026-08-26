import { supabase } from '../db/index.js'
import type { AuthorshipEventInput, InterventionEvidence } from './learningSafety.js'

export async function appendAuthorshipEvent(userId:string,workId:string,event:AuthorshipEventInput){
 const {data,error}=await supabase.from('mindsteps_authorship_events').insert({user_id:userId,work_id:workId,event_type:event.type,content:event.content||null,metadata:event.metadata||{},created_at:event.createdAt||new Date().toISOString()}).select('*').single()
 if(error)throw new Error(error.message);return data
}
export async function listAuthorshipEvents(userId:string,workId:string){
 const {data,error}=await supabase.from('mindsteps_authorship_events').select('*').eq('user_id',userId).eq('work_id',workId).order('created_at',{ascending:true})
 if(error)throw new Error(error.message);return data||[]
}
export async function saveInterventionEvidence(userId:string,row:InterventionEvidence){
 const {data,error}=await supabase.from('mindsteps_intervention_evidence').upsert({user_id:userId,intervention_id:row.interventionId,skill:row.skill,before_score:row.before??null,after_score:row.after??null,completed:row.completed,minutes:row.minutes??null,context:row.context??null,updated_at:new Date().toISOString()},{onConflict:'user_id,intervention_id'}).select('*').single()
 if(error)throw new Error(error.message);return data
}
export async function listInterventionEvidence(userId:string,limit=100){
 const {data,error}=await supabase.from('mindsteps_intervention_evidence').select('*').eq('user_id',userId).order('updated_at',{ascending:false}).limit(limit)
 if(error)throw new Error(error.message);return (data||[]).map((r:any)=>({interventionId:r.intervention_id,skill:r.skill,before:r.before_score??undefined,after:r.after_score??undefined,completed:r.completed,minutes:r.minutes??undefined,context:r.context??undefined})) as InterventionEvidence[]
}
