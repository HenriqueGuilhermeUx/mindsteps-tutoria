import { supabase } from '../db/index.js'

export type EscalationLevel='normal'|'human_review'|'incident'|'blocked'

export type InstitutionalLearningPolicy={
  institutionId:string
  enabled:boolean
  allowedSystems:string[]
  blockedSystems:string[]
  forceHumanReviewFor:string[]
  maxConfidenceForAutonomy:number
  requireSourceReminder:boolean
  requireOfflineBalance:boolean
  notes?:string|null
}

export async function resolveInstitutionalPolicy(userId:string,institutionId?:string|null){
  if(!institutionId)return null
  const {data:link}=await supabase.from('mindsteps_student_links').select('institution_id,status').eq('user_id',userId).eq('institution_id',institutionId).eq('status','active').maybeSingle()
  if(!link)return null
  const {data,error}=await supabase.from('mindsteps_learning_os_policies').select('*').eq('institution_id',institutionId).eq('enabled',true).maybeSingle()
  if(error)throw new Error(error.message)
  if(!data)return null
  return {
    institutionId,
    enabled:true,
    allowedSystems:Array.isArray(data.allowed_systems)?data.allowed_systems:[],
    blockedSystems:Array.isArray(data.blocked_systems)?data.blocked_systems:[],
    forceHumanReviewFor:Array.isArray(data.force_human_review_for)?data.force_human_review_for:[],
    maxConfidenceForAutonomy:Number(data.max_confidence_for_autonomy??.85),
    requireSourceReminder:Boolean(data.require_source_reminder),
    requireOfflineBalance:Boolean(data.require_offline_balance),
    notes:data.notes||null,
  } satisfies InstitutionalLearningPolicy
}

export function applyInstitutionalPolicy(input:{systemKey:string;confidence:number;policy:InstitutionalLearningPolicy|null}){
  const p=input.policy
  if(!p)return {blocked:false,forceHumanReview:false,requireSourceReminder:false,requireOfflineBalance:false,reasons:[] as string[]}
  const reasons:string[]=[]
  const blocked=p.blockedSystems.includes(input.systemKey)||(p.allowedSystems.length>0&&!p.allowedSystems.includes(input.systemKey))
  if(blocked)reasons.push('A política institucional não autoriza este sistema para esta finalidade.')
  const forceHumanReview=p.forceHumanReviewFor.includes(input.systemKey)||input.confidence>p.maxConfidenceForAutonomy
  if(forceHumanReview)reasons.push('A política institucional exige revisão humana para este sistema ou nível de autonomia.')
  return {blocked,forceHumanReview,requireSourceReminder:p.requireSourceReminder,requireOfflineBalance:p.requireOfflineBalance,reasons}
}

export function assessEscalation(input:{confidence:number;humanReviewRequired:boolean;blockedByPolicy?:boolean;highImpact?:boolean;rightsConflict?:boolean;incidentSignal?:boolean}){
  let level:EscalationLevel='normal'
  const reasons:string[]=[]
  if(input.blockedByPolicy||input.rightsConflict){level='blocked';reasons.push(input.blockedByPolicy?'A política institucional bloqueia a ação.':'Há conflito com preferências ou direitos aplicáveis.')}
  else if(input.incidentSignal){level='incident';reasons.push('Foi identificado um sinal que deve ser tratado como incidente e não como recomendação comum.')}
  else if(input.highImpact||input.humanReviewRequired||input.confidence<.55){level='human_review';reasons.push(input.highImpact?'A decisão tem potencial de alto impacto.':input.confidence<.55?'A confiança é baixa.':'O motor exige revisão humana.')}
  return {level,reasons,allowAutomation:level==='normal'}
}

export async function saveEscalation(input:{userId:string;institutionId?:string|null;runId?:string|null;systemKey:string;level:EscalationLevel;reasons:string[];metadata?:Record<string,unknown>}){
  const {data,error}=await supabase.from('mindsteps_learning_os_escalations').insert({user_id:input.userId,institution_id:input.institutionId||null,run_id:input.runId||null,system_key:input.systemKey,level:input.level,reasons:input.reasons,metadata:input.metadata||{}}).select('*').single()
  if(error)throw new Error(error.message)
  return data
}

export async function recordOutcome(input:{userId:string;runId:string;before?:number|null;after?:number|null;completed?:boolean;studentFeedback?:'helped'|'neutral'|'did_not_help'|null;teacherFeedback?:'confirmed'|'adjusted'|'rejected'|null;notes?:string|null}){
  const delta=typeof input.before==='number'&&typeof input.after==='number'?Number((input.after-input.before).toFixed(2)):null
  const {data,error}=await supabase.from('mindsteps_learning_os_outcomes').insert({user_id:input.userId,run_id:input.runId,before_score:input.before??null,after_score:input.after??null,delta,completed:input.completed??false,student_feedback:input.studentFeedback||null,teacher_feedback:input.teacherFeedback||null,notes:input.notes||null}).select('*').single()
  if(error)throw new Error(error.message)
  return data
}

export async function getOutcomeSummary(userId:string,systemKey?:string){
  let query=supabase.from('mindsteps_learning_os_outcomes').select('*,mindsteps_learning_os_runs!inner(system_key,intervention)').eq('user_id',userId)
  if(systemKey)query=query.eq('mindsteps_learning_os_runs.system_key',systemKey)
  const {data,error}=await query.order('created_at',{ascending:false}).limit(100)
  if(error)throw new Error(error.message)
  const rows=data||[]
  const comparable=rows.filter((r:any)=>typeof r.delta==='number')
  const avgDelta=comparable.length?Number((comparable.reduce((n:number,r:any)=>n+Number(r.delta),0)/comparable.length).toFixed(2)):0
  const helped=rows.filter((r:any)=>r.student_feedback==='helped').length
  const rejected=rows.filter((r:any)=>r.teacher_feedback==='rejected').length
  return {evidenceCount:rows.length,comparableCount:comparable.length,averageDelta:avgDelta,helpedShare:rows.length?Math.round(helped/rows.length*100):0,teacherRejectedShare:rows.length?Math.round(rejected/rows.length*100):0,status:comparable.length<5?'insufficient_evidence':avgDelta>=5?'promising':avgDelta<=-2?'review_needed':'neutral'}
}
