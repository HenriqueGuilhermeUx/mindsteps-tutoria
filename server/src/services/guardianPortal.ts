import { supabase } from '../db/index.js'
import {getChildRightsPreferences} from './learningGovernance.js'
import {listTransferChecks,summarizeIndependence} from './independentLearning.js'

async function requireGuardianStudent(guardianUserId:string,studentUserId:string,institutionId?:string){let q=supabase.from('mindsteps_guardian_links').select('id,institution_id,student_user_id,relationship,status,created_at').eq('guardian_user_id',guardianUserId).eq('student_user_id',studentUserId).eq('status','active');if(institutionId)q=q.eq('institution_id',institutionId);const{data,error}=await q.limit(1).maybeSingle();if(error||!data)throw new Error('Você não tem vínculo ativo com este estudante');return data}

export async function getGuardianStudents(guardianUserId:string){
  const{data:links,error}=await supabase.from('mindsteps_guardian_links').select('id,institution_id,student_user_id,relationship,status,created_at').eq('guardian_user_id',guardianUserId).eq('status','active').order('created_at',{ascending:false})
  if(error)throw new Error(error.message)
  const rows=links||[]
  if(!rows.length)return{students:[],count:0}
  const studentIds=[...new Set(rows.map((r:any)=>r.student_user_id))]
  const institutionIds=[...new Set(rows.map((r:any)=>r.institution_id))]
  const[{data:profiles,error:profilesError},{data:institutions,error:institutionsError},{data:classes,error:classesError},{data:studentLinks,error:studentLinksError}]=await Promise.all([
    supabase.from('student_profiles').select('user_id,name,grade,xp,level,streak,last_study_date').in('user_id',studentIds),
    supabase.from('mindsteps_institutions').select('id,name').in('id',institutionIds),
    supabase.from('mindsteps_school_classes').select('id,institution_id,name,grade,school_year,shift').in('institution_id',institutionIds).eq('status','active'),
    supabase.from('mindsteps_student_links').select('user_id,institution_id,class_id,status').in('user_id',studentIds).in('institution_id',institutionIds).eq('status','active')
  ])
  for(const e of [profilesError,institutionsError,classesError,studentLinksError])if(e)throw new Error(e.message)
  const byStudent=new Map((profiles||[]).map((p:any)=>[p.user_id,p])),byInstitution=new Map((institutions||[]).map((i:any)=>[i.id,i])),byClass=new Map((classes||[]).map((c:any)=>[c.id,c]))
  const enrollment=new Map((studentLinks||[]).map((s:any)=>[`${s.institution_id}:${s.user_id}`,s]))
  return{students:rows.map((r:any)=>{const enrolled:any=enrollment.get(`${r.institution_id}:${r.student_user_id}`),profile:any=byStudent.get(r.student_user_id)||null;return{linkId:r.id,studentUserId:r.student_user_id,institutionId:r.institution_id,relationship:r.relationship,linkedAt:r.created_at,student:profile?{userId:r.student_user_id,name:profile.name,grade:profile.grade,xp:profile.xp,level:profile.level,streak:profile.streak,lastStudyDate:profile.last_study_date}:null,institution:byInstitution.get(r.institution_id)||null,class:enrolled?.class_id?byClass.get(enrolled.class_id)||null:null}}),count:rows.length}
}

export async function getGuardianStudentLearningOverview(guardianUserId:string,studentUserId:string,institutionId?:string){
 const link=await requireGuardianStudent(guardianUserId,studentUserId,institutionId)
 const[{data:profile,error:profileError},rights]=await Promise.all([supabase.from('student_profiles').select('user_id,name,grade,xp,level,streak,last_study_date').eq('user_id',studentUserId).maybeSingle(),getChildRightsPreferences(studentUserId)])
 if(profileError)throw new Error(profileError.message)
 const sharingAllowed=Boolean((rights as any).institution_sharing_allowed),guardianRecorded=(rights as any).guardian_user_id||null
 const consent={institutionSharingAllowed:sharingAllowed,guardianRecorded,noticeVersion:(rights as any).data_processing_notice_version||null}
 if(!sharingAllowed)return{student:profile||null,institutionId:link.institution_id,relationship:link.relationship,consent,learning:null,notice:'O compartilhamento de métricas de aprendizagem está desativado para este estudante.'}
 const checks=await listTransferChecks(studentUserId,100),summary=summarizeIndependence(checks)
 return{student:profile||null,institutionId:link.institution_id,relationship:link.relationship,consent,learning:{independence:summary},notice:summary.comparableChecks<3?'Sinal preliminar: acompanhe a evolução sem interpretar como diagnóstico.':'Tendência de aprendizagem disponível para acompanhamento, sempre com contexto humano.'}
}
