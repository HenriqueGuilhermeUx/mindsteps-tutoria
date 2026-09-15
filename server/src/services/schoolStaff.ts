import { supabase } from '../db/index.js'

type Role='owner'|'admin'|'coordinator'|'teacher'
type Status='active'|'inactive'
type UserIdentity={id:string;email:string|null}
type TeacherAssignment={teacher_user_id:string;class_id:string;subject:string|null;status:string}
type SchoolClass={id:string;name:string;grade:string|null;school_year:number|string|null;shift:string|null}

async function actor(userId:string,institutionId:string){const{data,error}=await supabase.from('mindsteps_institution_members').select('id,role,status').eq('user_id',userId).eq('institution_id',institutionId).eq('status','active').maybeSingle();if(error||!data)throw new Error('Você não tem acesso a esta instituição');return data as{id:string;role:Role;status:string}}
async function requireRole(userId:string,institutionId:string,allowed:Role[]){const a=await actor(userId,institutionId);if(!allowed.includes(a.role))throw new Error('Seu perfil não tem permissão para esta ação');return a}
async function log(institutionId:string,userId:string,action:string,target:string,metadata:Record<string,unknown>={}){await supabase.from('mindsteps_school_audit_log').insert({institution_id:institutionId,actor_user_id:userId,action,entity_type:'staff',entity_id:target,metadata})}

export async function listStaff(userId:string,institutionId:string,status?:string){
 await actor(userId,institutionId)
 let q=supabase.from('mindsteps_institution_members').select('id,user_id,role,status,created_at').eq('institution_id',institutionId).order('created_at',{ascending:true})
 if(status==='active'||status==='inactive')q=q.eq('status',status)
 const{data,error}=await q;if(error)throw new Error(error.message)
 const members=data||[],userIds=members.map((m:any)=>m.user_id)
 if(!userIds.length)return{staff:[],count:0}
 const [usersR,assignmentsR,classesR]=await Promise.all([
  supabase.from('users').select('id,email').in('id',userIds),
  supabase.from('mindsteps_school_class_teachers').select('teacher_user_id,class_id,subject,status').eq('institution_id',institutionId).eq('status','active').in('teacher_user_id',userIds),
  supabase.from('mindsteps_school_classes').select('id,name,grade,school_year,shift').eq('institution_id',institutionId).eq('status','active')
 ])
 if(usersR.error)throw new Error(usersR.error.message);if(assignmentsR.error)throw new Error(assignmentsR.error.message);if(classesR.error)throw new Error(classesR.error.message)
 const users=new Map<string,UserIdentity>(((usersR.data||[]) as UserIdentity[]).map(u=>[u.id,u]))
 const classes=new Map<string,SchoolClass>(((classesR.data||[]) as SchoolClass[]).map(c=>[c.id,c]))
 const assignments=(assignmentsR.data||[]) as TeacherAssignment[]
 const staff=members.map((member:any)=>{const teaching=assignments.filter(a=>a.teacher_user_id===member.user_id).map(a=>({classId:a.class_id,className:classes.get(a.class_id)?.name||null,grade:classes.get(a.class_id)?.grade||null,schoolYear:classes.get(a.class_id)?.school_year||null,shift:classes.get(a.class_id)?.shift||null,subject:a.subject}));return{...member,email:users.get(member.user_id)?.email||null,teachingScope:teaching,classesCount:new Set(teaching.map(t=>t.classId)).size,subjects:[...new Set(teaching.map(t=>t.subject).filter(Boolean))]}})
 return{staff,count:staff.length}
}

export async function changeStaffRole(userId:string,institutionId:string,targetUserId:string,nextRole:Role){const a=await requireRole(userId,institutionId,['owner','admin']);if(!['owner','admin','coordinator','teacher'].includes(nextRole))throw new Error('Papel inválido');const{data:target,error}=await supabase.from('mindsteps_institution_members').select('id,user_id,role,status').eq('institution_id',institutionId).eq('user_id',targetUserId).maybeSingle();if(error||!target)throw new Error('Membro não encontrado');if(target.role==='owner'&&a.role!=='owner')throw new Error('Somente um owner pode alterar outro owner');if(nextRole==='owner'&&a.role!=='owner')throw new Error('Somente um owner pode promover outro owner');if(target.role==='owner'&&nextRole!=='owner'){const{count}=await supabase.from('mindsteps_institution_members').select('id',{count:'exact',head:true}).eq('institution_id',institutionId).eq('role','owner').eq('status','active');if(Number(count||0)<=1)throw new Error('A instituição precisa manter ao menos um owner ativo')}const{data,error:updateError}=await supabase.from('mindsteps_institution_members').update({role:nextRole}).eq('id',target.id).select('id,user_id,role,status,created_at').single();if(updateError)throw new Error(updateError.message);await log(institutionId,userId,'staff.role.change',targetUserId,{from:target.role,to:nextRole});return data}

export async function setStaffStatus(userId:string,institutionId:string,targetUserId:string,status:Status){const a=await requireRole(userId,institutionId,['owner','admin']);const{data:target,error}=await supabase.from('mindsteps_institution_members').select('id,user_id,role,status').eq('institution_id',institutionId).eq('user_id',targetUserId).maybeSingle();if(error||!target)throw new Error('Membro não encontrado');if(target.role==='owner'&&a.role!=='owner')throw new Error('Somente um owner pode desativar outro owner');if(status==='inactive'&&target.role==='owner'){const{count}=await supabase.from('mindsteps_institution_members').select('id',{count:'exact',head:true}).eq('institution_id',institutionId).eq('role','owner').eq('status','active');if(Number(count||0)<=1)throw new Error('A instituição precisa manter ao menos um owner ativo')}const{data,error:updateError}=await supabase.from('mindsteps_institution_members').update({status}).eq('id',target.id).select('id,user_id,role,status,created_at').single();if(updateError)throw new Error(updateError.message);await log(institutionId,userId,status==='active'?'staff.restore':'staff.deactivate',targetUserId,{role:target.role});return data}
