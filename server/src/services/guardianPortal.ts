import { supabase } from '../db/index.js'

export async function getGuardianStudents(guardianUserId:string){
  const{data:links,error}=await supabase.from('mindsteps_guardian_links').select('id,institution_id,student_user_id,relationship,status,created_at').eq('guardian_user_id',guardianUserId).eq('status','active').order('created_at',{ascending:false})
  if(error)throw new Error(error.message)
  const rows=links||[]
  if(!rows.length)return{students:[],count:0}
  const studentIds=[...new Set(rows.map((r:any)=>r.student_user_id))]
  const institutionIds=[...new Set(rows.map((r:any)=>r.institution_id))]
  const[{data:profiles},{data:institutions}]=await Promise.all([
    supabase.from('student_profiles').select('user_id,name,grade').in('user_id',studentIds),
    supabase.from('mindsteps_institutions').select('id,name').in('id',institutionIds)
  ])
  const byStudent=new Map((profiles||[]).map((p:any)=>[p.user_id,p]))
  const byInstitution=new Map((institutions||[]).map((i:any)=>[i.id,i]))
  return{students:rows.map((r:any)=>({linkId:r.id,studentUserId:r.student_user_id,institutionId:r.institution_id,relationship:r.relationship,linkedAt:r.created_at,student:byStudent.get(r.student_user_id)||null,institution:byInstitution.get(r.institution_id)||null})),count:rows.length}
}
