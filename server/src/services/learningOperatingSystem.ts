import { supabase, type StudentProfile } from '../db/index.js'
import { buildResponsibleAIContext } from './responsibleAI.js'
import { evaluateWellbeing } from './learningSafety.js'
import { buildLearningDecision, buildUnpluggedMission, getChildRightsPreferences, saveLearningDecision } from './learningGovernance.js'

export type LearningOSActor='student'|'teacher'|'guardian'|'institution'
export type LearningOSIntent='learn'|'practice'|'verify'|'create'|'review'|'plan'|'reflect'
export type LearningOSIntervention='tutor'|'practice'|'explanation'|'verification'|'offline_mission'|'teacher_review'|'no_ai'

export interface LearningOSInput{
  userId:string
  profile:StudentProfile
  actor?:LearningOSActor
  intent?:LearningOSIntent
  message?:string
  subject?:string
  skill?:string
  sessionMinutes?:number
  interactionCount?:number
  frustration?:boolean
  evidence?:Record<string,unknown>
  requestedSystemKey?:string
  forceHumanReview?:boolean
}

export interface LearningOSPlan{
  intervention:LearningOSIntervention
  systemKey:string
  stage:string
  assistanceMode:string
  confidence:number
  confidenceBand:'low'|'medium'|'high'
  explanation:string
  reasons:string[]
  safeguards:{
    humanReviewRequired:boolean
    aiPersonalizationAllowed:boolean
    institutionSharingAllowed:boolean
    screenBreak:boolean
    offlineAlternative:boolean
    preserveStudentAttempt:boolean
    directAnswerAllowed:boolean
    sourceReminder:boolean
  }
  nextAction:{type:string;label:string;payload?:Record<string,unknown>}
  policy:ReturnType<typeof buildResponsibleAIContext>['policy']
}

function scoreConfidence(input:LearningOSInput,ctx:ReturnType<typeof buildResponsibleAIContext>){
  let score=.55
  if(input.skill)score+=.08
  if(input.subject)score+=.05
  if(input.evidence&&Object.keys(input.evidence).length)score+=.12
  if(ctx.intent!=='general')score+=.08
  if(input.forceHumanReview)score-=.12
  return Math.max(.25,Math.min(.95,Number(score.toFixed(2))))
}

function chooseIntervention(input:LearningOSInput,ctx:ReturnType<typeof buildResponsibleAIContext>,wellbeing:ReturnType<typeof evaluateWellbeing>,aiAllowed:boolean):LearningOSIntervention{
  if(!aiAllowed)return 'no_ai'
  if(input.forceHumanReview)return 'teacher_review'
  if(wellbeing.screenBreak||ctx.policy.encourageOfflineActivity&&input.intent==='practice')return 'offline_mission'
  if(ctx.intent==='verification'||input.intent==='verify')return 'verification'
  if(ctx.intent==='frustrated')return 'explanation'
  if(input.intent==='practice')return 'practice'
  return 'tutor'
}

export async function buildLearningOSPlan(input:LearningOSInput):Promise<LearningOSPlan>{
  const rights=await getChildRightsPreferences(input.userId)
  const ctx=buildResponsibleAIContext(input.profile,input.message||'')
  const wellbeing=evaluateWellbeing({ageGroup:input.profile.age_group,sessionMinutes:input.sessionMinutes||0,messages:input.interactionCount||0,frustrated:input.frustration||ctx.intent==='frustrated'})
  const aiAllowed=rights.ai_personalization_allowed!==false
  const confidence=scoreConfidence(input,ctx)
  const built=buildLearningDecision({systemKey:input.requestedSystemKey||'learning_os',decisionType:'intervention_selection',subject:input.subject,skill:input.skill,evidence:input.evidence,confidence,explanation:ctx.explanation,humanReviewRequired:input.forceHumanReview||confidence<.7})
  const intervention=chooseIntervention(input,ctx,wellbeing,aiAllowed)
  const reasons=[...ctx.policy.rationale]
  if(!aiAllowed)reasons.push('A personalização por IA está desativada nas preferências de direitos e dados.')
  if(wellbeing.screenBreak)reasons.push('O motor de bem-estar recomenda reduzir o tempo de tela nesta sessão.')
  if(input.forceHumanReview)reasons.push('A solicitação exige revisão humana antes de uma intervenção automatizada.')
  const offline=intervention==='offline_mission'?buildUnpluggedMission(input.profile):null
  const nextAction=intervention==='offline_mission'?{type:'offline_mission',label:offline!.title,payload:{mission:offline}}:intervention==='teacher_review'?{type:'human_review',label:'Encaminhar para revisão humana'}:intervention==='no_ai'?{type:'manual_learning',label:'Continuar sem personalização por IA'}:{type:intervention,label:intervention==='verification'?'Verificar com evidências':intervention==='explanation'?'Explicar em passos':intervention==='practice'?'Praticar habilidade':'Iniciar tutoria guiada'}
  return{intervention,systemKey:input.requestedSystemKey||'learning_os',stage:ctx.policy.stage,assistanceMode:ctx.policy.assistanceMode,confidence,confidenceBand:built.confidenceBand,explanation:ctx.explanation,reasons,safeguards:{humanReviewRequired:built.humanReviewRequired,aiPersonalizationAllowed:aiAllowed,institutionSharingAllowed:rights.institution_sharing_allowed===true,screenBreak:wellbeing.screenBreak,offlineAlternative:wellbeing.offlineAlternative,preserveStudentAttempt:ctx.policy.requireStudentAttempt,directAnswerAllowed:ctx.policy.directAnswerAllowed,sourceReminder:ctx.policy.requireSourceReminder},nextAction,policy:ctx.policy}
}

export async function persistLearningOSRun(input:LearningOSInput,plan:LearningOSPlan){
  const decision=await saveLearningDecision(input.userId,buildLearningDecision({systemKey:plan.systemKey,decisionType:'learning_os_intervention',subject:input.subject,skill:input.skill,evidence:{...(input.evidence||{}),intervention:plan.intervention,stage:plan.stage},confidence:plan.confidence,explanation:plan.explanation,humanReviewRequired:plan.safeguards.humanReviewRequired}))
  const {data,error}=await supabase.from('mindsteps_learning_os_runs').insert({user_id:input.userId,actor:input.actor||'student',intent:input.intent||'learn',subject:input.subject||null,skill:input.skill||null,message_excerpt:(input.message||'').slice(0,500)||null,intervention:plan.intervention,system_key:plan.systemKey,stage:plan.stage,assistance_mode:plan.assistanceMode,confidence:plan.confidence,explanation:plan.explanation,safeguards:plan.safeguards,next_action:plan.nextAction,decision_id:(decision as any).id||null}).select('*').single()
  if(error)throw new Error(error.message)
  return{run:data,decision}
}

export async function listLearningOSRuns(userId:string,limit=30){
  const {data,error}=await supabase.from('mindsteps_learning_os_runs').select('*').eq('user_id',userId).order('created_at',{ascending:false}).limit(limit)
  if(error)throw new Error(error.message)
  return data||[]
}
