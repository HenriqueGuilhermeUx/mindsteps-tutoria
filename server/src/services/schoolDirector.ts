import {supabase} from '../db/index.js'
import {getSchoolEntitlements} from './schoolEntitlements.js'

type Role='owner'|'admin'|'coordinator'|'teacher'
type DirectorStudentProfile={user_id:string;name:string|null;grade:string|null;xp:number|null;level:number|null;streak:number|null;last_study_date:string|null}
async function manager(userId:string,institutionId:string){const{data,error}=await supabase.from('mindsteps_institution_members').select('role').eq('user_id',userId).eq('institution_id',institutionId).eq('status','active').maybeSingle();if(error||!data)throw new Error('Você não tem acesso a esta instituição');if(!['owner','admin','coordinator'].includes(data.role as Role))throw new Error('Seu perfil não tem acesso ao painel de gestão');return data as{role:Role}}
const dateKey=(daysAgo:number)=>{const d=new Date();d.setUTCDate(d.getUTCDate()-daysAgo);return d.toISOString().slice(0,10)}
export async function getDirectorDashboard(userId:string,institutionId:string){
 const actor=await manager(userId,institutionId),today=dateKey(0),since7=dateKey(6),since30=dateKey(29)
 const [entitlements,institutionR,licenseR,classesR,studentsR,staffR,teachersR,guardiansR,invitesR]=await Promise.all([
  getSchoolEntitlements(institutionId),
  supabase.from('mindsteps_institutions').select('id,name,legal_name,logo_url,onboarding_status,plan_code,seat_limit,status').eq('id',institutionId).single(),
  supabase.from('mindsteps_school_licenses').select('plan_code,seat_limit,status,starts_at,ends_at').eq('institution_id',institutionId).maybeSingle(),
  supabase.from('mindsteps_school_classes').select('id,name,grade,school_year,shift').eq('institution_id',institutionId).eq('status','active').order('name'),
  supabase.from('mindsteps_student_links').select('user_id,class_id,joined_at').eq('institution_id',institutionId).eq('status','active'),
  supabase.from('mindsteps_institution_members').select('user_id,role,status').eq('institution_id',institutionId).eq('status','active'),
  supabase.from('mindsteps_school_class_teachers').select('id,class_id,teacher_user_id,subject').eq('institution_id',institutionId).eq('status','active'),
  supabase.from('mindsteps_guardian_links').select('id,student_user_id').eq('institution_id',institutionId).eq('status','active'),
  supabase.from('mindsteps_school_invites').select('id,role,status,expires_at').eq('institution_id',institutionId).eq('status','pending')
 ])
 if(institutionR.error||!institutionR.data)throw new Error('Instituição não encontrada')
 for(const r of [classesR,studentsR,staffR,teachersR,guardiansR,invitesR])if(r.error)throw new Error(r.error.message)
 const students=studentsR.data||[],studentIds=students.map((s:any)=>s.user_id)
 const{data:profiles,error:profileError}=studentIds.length?await supabase.from('student_profiles').select('user_id,name,grade,xp,level,streak,last_study_date').in('user_id',studentIds):{data:[] as DirectorStudentProfile[],error:null}
 if(profileError)throw new Error(profileError.message)
 const typedProfiles=(profiles||[]) as DirectorStudentProfile[]
 const profileMap=new Map<string,DirectorStudentProfile>(typedProfiles.map(p=>[p.user_id,p]))
 const activeSince=(student:any,since:string)=>{const last=profileMap.get(student.user_id)?.last_study_date;return Boolean(last&&last>=since&&last<=today)}
 const classes=(classesR.data||[]).map((c:any)=>{const enrolled=students.filter((s:any)=>s.class_id===c.id),teacherAssignments=(teachersR.data||[]).filter((t:any)=>t.class_id===c.id);const activeToday=enrolled.filter((s:any)=>profileMap.get(s.user_id)?.last_study_date===today).length,active7d=enrolled.filter((s:any)=>activeSince(s,since7)).length,active30d=enrolled.filter((s:any)=>activeSince(s,since30)).length;return{...c,students:enrolled.length,activeToday,active7d,active30d,active7dRate:enrolled.length?Math.round(active7d/enrolled.length*100):0,active30dRate:enrolled.length?Math.round(active30d/enrolled.length*100):0,teachers:new Set(teacherAssignments.map((t:any)=>t.teacher_user_id)).size,subjects:[...new Set(teacherAssignments.map((t:any)=>t.subject).filter(Boolean))]}})
 const activeToday=students.filter((s:any)=>profileMap.get(s.user_id)?.last_study_date===today).length,active7d=students.filter((s:any)=>activeSince(s,since7)).length,active30d=students.filter((s:any)=>activeSince(s,since30)).length
 const withGuardian=new Set((guardiansR.data||[]).map((g:any)=>g.student_user_id)).size,seatLimit=entitlements.seatLimit,staff=staffR.data||[],pending=invitesR.data||[]
 const withoutClass=students.filter((s:any)=>!s.class_id).length,classesWithoutTeacher=classes.filter((c:any)=>c.teachers===0),classesWithoutStudents=classes.filter((c:any)=>c.students===0)
 return{institution:{...institutionR.data,role:actor.role},license:{...(licenseR.data||{}),licensed:entitlements.licensed,withinDates:entitlements.withinDates},entitlements:{schoolAccess:entitlements.entitlements.school_access,inviteStudents:entitlements.entitlements.invite_students,learningAccess:entitlements.entitlements.learning_access,managementAccess:entitlements.entitlements.management_access},metrics:{students:students.length,activeToday,activeTodayRate:students.length?Math.round(activeToday/students.length*100):0,active7d,active7dRate:students.length?Math.round(active7d/students.length*100):0,active30d,active30dRate:students.length?Math.round(active30d/students.length*100):0,classes:classes.length,staff:staff.length,teachers:staff.filter((s:any)=>s.role==='teacher').length,coordinators:staff.filter((s:any)=>s.role==='coordinator').length,guardiansLinked:withGuardian,guardianCoverage:students.length?Math.round(withGuardian/students.length*100):0,pendingInvites:pending.length,seatLimit,seatsAvailable:entitlements.seatsAvailable,seatUsageRate:seatLimit?Math.round(students.length/seatLimit*100):0},classes,attention:{classesWithoutTeacher:classesWithoutTeacher.map((c:any)=>({id:c.id,name:c.name})),classesWithoutStudents:classesWithoutStudents.map((c:any)=>({id:c.id,name:c.name})),studentsWithoutClass:withoutClass,studentsWithoutGuardian:Math.max(0,students.length-withGuardian),expiredPendingInvites:pending.filter((i:any)=>new Date(i.expires_at).getTime()<Date.now()).length,licenseInactive:!entitlements.licensed,seatsExhausted:entitlements.seatsAvailable<=0}}
}
