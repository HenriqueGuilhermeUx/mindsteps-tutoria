import {supabase} from '../db/index.js'

type Role='owner'|'admin'|'coordinator'|'teacher'
async function manager(userId:string,institutionId:string){const{data,error}=await supabase.from('mindsteps_institution_members').select('role').eq('user_id',userId).eq('institution_id',institutionId).eq('status','active').maybeSingle();if(error||!data)throw new Error('Você não tem acesso a esta instituição');if(!['owner','admin','coordinator'].includes(data.role as Role))throw new Error('Seu perfil não tem acesso ao painel de gestão');return data as{role:Role}}

export async function getDirectorDashboard(userId:string,institutionId:string){
 const actor=await manager(userId,institutionId)
 const today=new Date().toISOString().slice(0,10)
 const [institutionR,licenseR,classesR,studentsR,staffR,teachersR,guardiansR,invitesR]=await Promise.all([
  supabase.from('mindsteps_institutions').select('id,name,legal_name,logo_url,onboarding_status,plan_code,seat_limit').eq('id',institutionId).single(),
  supabase.from('mindsteps_school_licenses').select('plan_code,seat_limit,status,starts_at,ends_at').eq('institution_id',institutionId).maybeSingle(),
  supabase.from('mindsteps_school_classes').select('id,name,grade,school_year,shift').eq('institution_id',institutionId).eq('status','active').order('name'),
  supabase.from('mindsteps_student_links').select('user_id,class_id,joined_at').eq('institution_id',institutionId).eq('status','active'),
  supabase.from('mindsteps_institution_members').select('user_id,role,status').eq('institution_id',institutionId).eq('status','active'),
  supabase.from('mindsteps_school_class_teachers').select('id,class_id,teacher_user_id,subject').eq('institution_id',institutionId).eq('status','active'),
  supabase.from('mindsteps_guardian_links').select('id,student_user_id').eq('institution_id',institutionId).eq('status','active'),
  supabase.from('mindsteps_school_invites').select('id,role,status,expires_at').eq('institution_id',institutionId).eq('status','pending')
 ])
 if(institutionR.error||!institutionR.data)throw new Error('Instituição não encontrada')
 const students=studentsR.data||[],studentIds=students.map((s:any)=>s.user_id)
 const{data:profiles,error:profileError}=studentIds.length?await supabase.from('student_profiles').select('user_id,name,grade,xp,level,streak,last_study_date').in('user_id',studentIds):{data:[],error:null} as any
 if(profileError)throw new Error(profileError.message)
 const profileMap=new Map((profiles||[]).map((p:any)=>[p.user_id,p]))
 const classes=(classesR.data||[]).map((c:any)=>{const enrolled=students.filter((s:any)=>s.class_id===c.id);const activeToday=enrolled.filter((s:any)=>profileMap.get(s.user_id)?.last_study_date===today).length;const teacherAssignments=(teachersR.data||[]).filter((t:any)=>t.class_id===c.id);return{...c,students:enrolled.length,activeToday,teachers:new Set(teacherAssignments.map((t:any)=>t.teacher_user_id)).size,subjects:[...new Set(teacherAssignments.map((t:any)=>t.subject).filter(Boolean))]}})
 const activeToday=students.filter((s:any)=>profileMap.get(s.user_id)?.last_study_date===today).length
 const withGuardian=new Set((guardiansR.data||[]).map((g:any)=>g.student_user_id)).size
 const seatLimit=Number(licenseR.data?.seat_limit||institutionR.data.seat_limit||100)
 const staff=staffR.data||[]
 return{institution:{...institutionR.data,role:actor.role},license:licenseR.data||null,metrics:{students:students.length,activeToday,activeTodayRate:students.length?Math.round(activeToday/students.length*100):0,classes:classes.length,staff:staff.length,teachers:staff.filter((s:any)=>s.role==='teacher').length,coordinators:staff.filter((s:any)=>s.role==='coordinator').length,guardiansLinked:withGuardian,guardianCoverage:students.length?Math.round(withGuardian/students.length*100):0,pendingInvites:(invitesR.data||[]).length,seatLimit,seatsAvailable:Math.max(0,seatLimit-students.length),seatUsageRate:seatLimit?Math.round(students.length/seatLimit*100):0},classes,attention:{classesWithoutTeacher:classes.filter((c:any)=>c.teachers===0).map((c:any)=>({id:c.id,name:c.name})),studentsWithoutGuardian:Math.max(0,students.length-withGuardian),expiredPendingInvites:(invitesR.data||[]).filter((i:any)=>new Date(i.expires_at).getTime()<Date.now()).length}}
}
