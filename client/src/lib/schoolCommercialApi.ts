import {useAuthStore} from '@/stores'
const API_BASE=import.meta.env.VITE_API_URL||'https://mindsteps-backend.onrender.com'
async function call<T>(path:string,method='GET',body?:unknown):Promise<T>{const{token}=useAuthStore.getState();const response=await fetch(`${API_BASE}/api/school-commercial${path}`,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body===undefined?undefined:JSON.stringify(body)});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.message||'Não foi possível concluir a operação');return payload as T}
export type SchoolClass={id:string;name:string;grade:string|null;school_year:number;shift:string|null;status:string}
export type SchoolStaff={id:string;user_id:string;email:string|null;role:'owner'|'admin'|'coordinator'|'teacher';status:string;classesCount:number;subjects:string[];teachingScope:Array<{classId:string;className:string|null;subject:string|null}>}
export type SchoolInvite={id:string;email:string;role:string;class_id:string|null;status:string;expires_at:string;metadata?:Record<string,unknown>}
export type SchoolStudent={id:string;user_id:string;status:string;class_id:string|null;external_id:string|null;profile:{name?:string;grade?:string;age_group?:string}|null;class:SchoolClass|null;guardians:number}
export const schoolOpsApi={
 setup:(institutionId:string)=>call<Record<string,unknown>>(`/${institutionId}/setup`),
 updateSetup:(institutionId:string,data:Record<string,unknown>)=>call(`/${institutionId}/setup`,'PUT',data),
 classes:(institutionId:string)=>call<{classes:SchoolClass[]}>(`/${institutionId}/classes`),
 createClass:(institutionId:string,data:{name:string;grade?:string;schoolYear?:number;shift?:string})=>call<{class:SchoolClass}>(`/${institutionId}/classes`,'POST',data),
 updateClass:(institutionId:string,classId:string,data:Record<string,unknown>)=>call(`/${institutionId}/classes/${classId}`,'PUT',data),
 archiveClass:(institutionId:string,classId:string)=>call(`/${institutionId}/classes/${classId}/archive`,'PUT'),reactivateClass:(institutionId:string,classId:string)=>call(`/${institutionId}/classes/${classId}/reactivate`,'PUT'),
 students:(institutionId:string,status='active')=>call<{students:SchoolStudent[];count:number}>(`/${institutionId}/students?status=${encodeURIComponent(status)}`),
 moveStudent:(institutionId:string,userId:string,classId:string|null)=>call(`/${institutionId}/students/${userId}/class`,'PUT',{classId}),
 setStudentEnrollment:(institutionId:string,userId:string,status:'active'|'inactive')=>call(`/${institutionId}/students/${userId}/enrollment`,'PUT',{status}),
 staff:(institutionId:string)=>call<{staff:SchoolStaff[];count:number}>(`/${institutionId}/staff`),
 setStaffRole:(institutionId:string,userId:string,role:string)=>call(`/${institutionId}/staff/${userId}/role`,'PUT',{role}),
 setStaffStatus:(institutionId:string,userId:string,status:'active'|'inactive')=>call(`/${institutionId}/staff/${userId}/status`,'PUT',{status}),
 invites:(institutionId:string)=>call<{invites:SchoolInvite[]}>(`/${institutionId}/invites`),
 createInvite:(institutionId:string,data:{email:string;role:string;classId?:string|null;studentUserId?:string|null;metadata?:Record<string,unknown>})=>call<{invite:SchoolInvite&{token:string}}>(`/${institutionId}/invites`,'POST',data),
 resendInvite:(institutionId:string,inviteId:string)=>call<{invite:SchoolInvite&{token:string}}>(`/${institutionId}/invites/${inviteId}/resend`,'POST',{}),revokeInvite:(institutionId:string,inviteId:string)=>call(`/${institutionId}/invites/${inviteId}/revoke`,'PUT',{}),expireStaleInvites:(institutionId:string)=>call(`/${institutionId}/invites/expire-stale`,'POST',{}),
 guardians:(institutionId:string)=>call<{guardians:Array<Record<string,unknown>>}>(`/${institutionId}/guardians`),
 teachingScope:(institutionId:string)=>call<{assignments:Array<Record<string,unknown>>;count:number}>(`/${institutionId}/teaching-scope`),assignTeacher:(institutionId:string,data:{teacherUserId:string;classId:string;subject?:string|null})=>call(`/${institutionId}/teaching-scope`,'POST',data),setTeachingScopeStatus:(institutionId:string,assignmentId:string,status:'active'|'inactive')=>call(`/${institutionId}/teaching-scope/${assignmentId}/status`,'PUT',{status}),
 validateProvisioning:(institutionId:string,rows:Array<Record<string,unknown>>)=>call<Record<string,unknown>>(`/${institutionId}/provisioning/validate`,'POST',{rows}),executeProvisioning:(institutionId:string,rows:Array<Record<string,unknown>>)=>call<Record<string,unknown>>(`/${institutionId}/provisioning/execute`,'POST',{rows}),bulkImport:(institutionId:string,rows:Array<Record<string,unknown>>)=>call(`/${institutionId}/import`,'POST',{rows})
}
