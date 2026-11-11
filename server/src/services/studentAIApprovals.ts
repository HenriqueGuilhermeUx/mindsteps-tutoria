import { supabase } from '../db/index.js'
import { getProfileByUserId } from '../db/index.js'
import { authorizeStudentGenerativeAI } from './generativeAccessPolicy.js'

type SystemKey = 'socratic_tutor' | 'independent_assessment'
async function requireManager(actorId:string,institutionId:string){
  const {data,error}=await supabase.from('mindsteps_institution_members')
    .select('role').eq('user_id',actorId).eq('institution_id',institutionId)
    .eq('status','active').maybeSingle()
  if(error||!data||!['owner','admin','coordinator'].includes(data.role))
    throw new Error('Apenas gestores escolares ativos podem autorizar IA generativa')
}
async function requireStudent(institutionId:string,studentUserId:string){
  const {data,error}=await supabase.from('mindsteps_student_links')
    .select('id').eq('institution_id',institutionId).eq('user_id',studentUserId)
    .eq('status','active').limit(1).maybeSingle()
  if(error||!data)throw new Error('Estudante sem vínculo ativo com a escola')
  const profile=await getProfileByUserId(studentUserId)
  if(!profile)throw new Error('Perfil do estudante não encontrado')
  const decision=authorizeStudentGenerativeAI(profile)
  if(!decision.allowed||decision.stage!=='anos_finais')
    throw new Error('Aprovação individual disponível somente para estudantes elegíveis dos anos finais')
}
export async function listStudentAIApprovals(actorId:string,institutionId:string,studentUserId:string){
  await requireManager(actorId,institutionId)
  await requireStudent(institutionId,studentUserId)
  const {data,error}=await supabase.from('mindsteps_ai_student_approvals')
    .select('id,student_user_id,institution_id,system_key,status,approved_by,expires_at,reason,updated_at')
    .eq('institution_id',institutionId).eq('student_user_id',studentUserId)
  if(error)throw new Error('Não foi possível consultar as aprovações')
  return data||[]
}
export async function setStudentAIApproval(actorId:string,institutionId:string,studentUserId:string,systemKey:SystemKey,decision:'approved'|'revoked',reason:string){
  await requireManager(actorId,institutionId)
  await requireStudent(institutionId,studentUserId)
  if(!reason.trim()||reason.length>500)throw new Error('Informe justificativa de até 500 caracteres')
  const now=new Date()
  const expiry=new Date(now.getTime()+7*24*60*60*1000).toISOString()
  const {data,error}=await supabase.from('mindsteps_ai_student_approvals').upsert({
    institution_id:institutionId,student_user_id:studentUserId,system_key:systemKey,
    status:decision,approved_by:actorId,expires_at:decision==='approved'?expiry:now.toISOString(),
    reason:reason.trim(),updated_at:now.toISOString()
  },{onConflict:'institution_id,student_user_id,system_key'})
    .select('id,student_user_id,institution_id,system_key,status,approved_by,expires_at,reason,updated_at').single()
  if(error||!data)throw new Error('Não foi possível registrar a decisão')
  return data
}

export async function listStudentAIApprovalHistory(actorId:string,institutionId:string,studentUserId:string){
  await requireManager(actorId,institutionId)
  await requireStudent(institutionId,studentUserId)
  const {data,error}=await supabase.from('mindsteps_ai_student_approval_events')
    .select('id,approval_id,system_key,decision,actor_user_id,reason,expires_at,recorded_at')
    .eq('institution_id',institutionId).eq('student_user_id',studentUserId)
    .order('recorded_at',{ascending:false}).limit(100)
  if(error)throw new Error('Não foi possível consultar o histórico de decisões')
  return data||[]
}
