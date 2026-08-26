import { supabase } from '../db/index.js'

async function requireManager(userId:string,institutionId:string){
  const {data,error}=await supabase.from('mindsteps_institution_members').select('role,status').eq('user_id',userId).eq('institution_id',institutionId).eq('status','active').maybeSingle()
  if(error||!data)throw new Error('Você não tem acesso a esta instituição')
  if(!['owner','admin','coordinator'].includes(data.role))throw new Error('Seu perfil não pode alterar a política do Learning OS')
}

export async function getInstitutionLearningPolicy(userId:string,institutionId:string){
  await requireManager(userId,institutionId)
  const {data,error}=await supabase.from('mindsteps_learning_os_policies').select('*').eq('institution_id',institutionId).maybeSingle()
  if(error)throw new Error(error.message)
  return data
}

export async function saveInstitutionLearningPolicy(userId:string,institutionId:string,input:{enabled?:boolean;allowedSystems?:string[];blockedSystems?:string[];forceHumanReviewFor?:string[];maxConfidenceForAutonomy?:number;requireSourceReminder?:boolean;requireOfflineBalance?:boolean;notes?:string|null}){
  await requireManager(userId,institutionId)
  const payload={institution_id:institutionId,enabled:input.enabled??true,allowed_systems:input.allowedSystems??[],blocked_systems:input.blockedSystems??[],force_human_review_for:input.forceHumanReviewFor??[],max_confidence_for_autonomy:input.maxConfidenceForAutonomy??.85,require_source_reminder:input.requireSourceReminder??false,require_offline_balance:input.requireOfflineBalance??false,notes:input.notes??null,updated_at:new Date().toISOString()}
  const {data,error}=await supabase.from('mindsteps_learning_os_policies').upsert(payload,{onConflict:'institution_id'}).select('*').single()
  if(error)throw new Error(error.message)
  return data
}
