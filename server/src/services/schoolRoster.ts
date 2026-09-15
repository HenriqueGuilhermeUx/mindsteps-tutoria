import { supabase } from '../db/index.js'

type Role='owner'|'admin'|'coordinator'|'teacher'
async function access(userId:string,institutionId:string,roles?:Role[]){const{data,error}=await supabase.from('mindsteps_institution_members').select('role').eq('user_id',userId).eq('institution_id',institutionId).eq('status','active').maybeSingle();if(error||!data)throw new Error('Você não tem acesso a esta instituição');if(roles&&!roles.includes(data.role as Role))throw new Error('Seu perfil não tem permissão para esta ação');return data as{role:Role}}
async function audit(institutionId:string,userId:string,action:string,entityId:string,metadata:Record<string,unknown>={}){await supabase.from('mindsteps_school_audit_log').insert({institution_id:institutionId,actor_user_id:userId,action,entity_type:'student',entity_id:entityId,metadata})}

export async function getRoster(userId:string,institutionId:string,status='active'){
  const actor=await access(userId,institutionId)
  let query=supabase.from('mindsteps_student_links').select('id,user_id,status,joined_at,left_at,class_id,external_id',{count:'exact'}).eq('institution_id',institutionId).eq('status',status)
  if(actor.role==='teacher'){
    const{data:scopes,error:scopeError}=await supabase.from('mindsteps_school_class_teachers').select('class_id').eq('institution_id',institutionId).eq('teacher_user_id',userId).eq('status','active')
    if(scopeError)throw new Error(scopeError.message)
    const classIds=[...new Set((scopes||[]).map((s:any)=>s.class_id).filter(Boolean))]
    if(!classIds.length)return{students:[],count:0}
    query=query.in('class_id',classIds)
  }
  const{data:links,error,count}=await query.order('joined_at',{ascending:false});if(error)throw new Error(error.message)
  const rows=links||[],userIds=rows.map((r:any)=>r.user_id),classIds=[...new Set(rows.map((r:any)=>r.class_id).filter(Boolean))]
  const [profilesResult,classesResult,guardianResult]=await Promise.all([
    userIds.length?supabase.from('student_profiles').select('user_id,name,grade,age_group,xp,level,streak,last_study_date').in('user_id',userIds):Promise.resolve({data:[],error:null} as any),
    classIds.length?supabase.from('mindsteps_school_classes').select('id,name,grade,school_year,shift').eq('institution_id',institutionId).in('id',classIds):Promise.resolve({data:[],error:null} as any),
    userIds.length?supabase.from('mindsteps_guardian_links').select('student_user_id,id,status').eq('institution_id',institutionId).eq('status','active').in('student_user_id',userIds):Promise.resolve({data:[],error:null} as any)
  ])
  if(profilesResult.error)throw new Error(profilesResult.error.message);if(classesResult.error)throw new Error(classesResult.error.message);if(guardianResult.error)throw new Error(guardianResult.error.message)
  const profiles=new Map((profilesResult.data||[]).map((p:any)=>[p.user_id,p])),classes=new Map((classesResult.data||[]).map((c:any)=>[c.id,c])),guardianCounts=new Map<string,number>();for(const g of guardianResult.data||[])guardianCounts.set((g as any).student_user_id,(guardianCounts.get((g as any).student_user_id)||0)+1)
  return{students:rows.map((row:any)=>({...row,profile:profiles.get(row.user_id)||null,class:row.class_id?classes.get(row.class_id)||null:null,guardians:guardianCounts.get(row.user_id)||0})),count:Number(count||0)}
}
export async function moveStudent(userId:string,institutionId:string,studentUserId:string,classId:string|null){await access(userId,institutionId,['owner','admin','coordinator']);if(classId){const{data}=await supabase.from('mindsteps_school_classes').select('id').eq('institution_id',institutionId).eq('id',classId).eq('status','active').maybeSingle();if(!data)throw new Error('Turma não encontrada nesta instituição')}const{data,error}=await supabase.from('mindsteps_student_links').update({class_id:classId}).eq('institution_id',institutionId).eq('user_id',studentUserId).select('*').single();if(error)throw new Error(error.message);await audit(institutionId,userId,'student.class.change',studentUserId,{classId});return data}
export async function setStudentEnrollment(userId:string,institutionId:string,studentUserId:string,status:'active'|'inactive'){await access(userId,institutionId,['owner','admin','coordinator']);const{data,error}=await supabase.from('mindsteps_student_links').update({status,left_at:status==='inactive'?new Date().toISOString():null}).eq('institution_id',institutionId).eq('user_id',studentUserId).select('*').single();if(error)throw new Error(error.message);await audit(institutionId,userId,status==='inactive'?'student.enrollment.end':'student.enrollment.restore',studentUserId);return data}
