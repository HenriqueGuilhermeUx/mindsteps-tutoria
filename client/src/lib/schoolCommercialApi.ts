import {useAuthStore} from '@/stores'
const API_BASE=import.meta.env.VITE_API_URL||'https://mindsteps-backend.onrender.com'
async function call<T>(path:string,method='GET',body?:unknown):Promise<T>{const{token}=useAuthStore.getState();const response=await fetch(`${API_BASE}/api/school-commercial${path}`,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body===undefined?undefined:JSON.stringify(body)});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.message||'Não foi possível concluir a operação');return payload as T}
export type SchoolClass={id:string;name:string;grade:string|null;school_year:number;shift:string|null;status:string}
export type SchoolStaff={id:string;user_id:string;email:string|null;role:'owner'|'admin'|'coordinator'|'teacher';status:string;classesCount:number;subjects:string[];teachingScope:Array<{classId:string;className:string|null;subject:string|null}>}
export type SchoolInvite={id:string;email:string;role:string;class_id:string|null;status:string;expires_at:string;metadata?:Record<string,unknown>}
export const schoolOpsApi={
 classes:(institutionId:string)=>call<{classes:SchoolClass[]}>(`/${institutionId}/classes`),
 createClass:(institutionId:string,data:{name:string;grade?:string;schoolYear?:number;shift?:string})=>call<{class:SchoolClass}>(`/${institutionId}/classes`,'POST',data),
 archiveClass:(institutionId:string,classId:string)=>call(`/${institutionId}/classes/${classId}/archive`,'PUT'),
 reactivateClass:(institutionId:string,classId:string)=>call(`/${institutionId}/classes/${classId}/reactivate`,'PUT'),
 staff:(institutionId:string)=>call<{staff:SchoolStaff[];count:number}>(`/${institutionId}/staff`),
 invites:(institutionId:string)=>call<{invites:SchoolInvite[]}>(`/${institutionId}/invites`),
 createInvite:(institutionId:string,data:{email:string;role:string;classId?:string|null;studentUserId?:string|null;metadata?:Record<string,unknown>})=>call<{invite:SchoolInvite&{token:string}}>(`/${institutionId}/invites`,'POST',data),
 resendInvite:(institutionId:string,inviteId:string)=>call<{invite:SchoolInvite&{token:string}}>(`/${institutionId}/invites/${inviteId}/resend`,'POST',{}),
 revokeInvite:(institutionId:string,inviteId:string)=>call(`/${institutionId}/invites/${inviteId}/revoke`,'PUT',{}),
 teachingScope:(institutionId:string)=>call<{assignments:Array<Record<string,unknown>>;count:number}>(`/${institutionId}/teaching-scope`),
 assignTeacher:(institutionId:string,data:{teacherUserId:string;classId:string;subject?:string|null})=>call(`/${institutionId}/teaching-scope`,'POST',data),
 validateProvisioning:(institutionId:string,rows:Array<Record<string,unknown>>)=>call<Record<string,unknown>>(`/${institutionId}/provisioning/validate`,'POST',{rows}),
 executeProvisioning:(institutionId:string,rows:Array<Record<string,unknown>>)=>call<Record<string,unknown>>(`/${institutionId}/provisioning/execute`,'POST',{rows})
}
