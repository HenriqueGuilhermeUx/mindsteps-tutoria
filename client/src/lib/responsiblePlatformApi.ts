import { useAuthStore } from '@/stores'

const API_BASE=import.meta.env.VITE_API_URL||'https://mindsteps-backend.onrender.com'
async function call<T>(path:string,options:{method?:'GET'|'POST'|'PUT'|'PATCH';body?:unknown}={}):Promise<T>{const {token}=useAuthStore.getState();const response=await fetch(`${API_BASE}${path}`,{method:options.method||'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:options.body?JSON.stringify(options.body):undefined});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.message||`HTTP ${response.status}`);return payload as T}

export type LiteracyLearning={id:number;title:string;cluster:'computacional'|'digital_midiatico'|'etico_social';description:string}
export type LiteracyMission={id:string;learningId:number;stage:string;title:string;objective:string;mode:'offline'|'guided_digital'|'project';activity:string;evidence:string}
export type LearningDecision={id:string;system_key:string;decision_type:string;subject?:string|null;skill?:string|null;confidence:number;explanation:string;human_review_required:boolean;created_at:string;evidence?:Record<string,unknown>}
export type ManagedInstitution={id:string;name:string;type:string;role:string;city?:string|null;state?:string|null}

export const platformResponsibleApi={
 literacy:()=>call<{stage:string;learnings:LiteracyLearning[];missions:LiteracyMission[];principles:string[];progress:Array<{learning_id:number;mission_id:string;status:string;updated_at?:string}>}>('/api/responsible-ai/literacy'),
 mission:(learningId:number)=>call<{mission:LiteracyMission|null}>(`/api/responsible-ai/literacy/mission?learningId=${learningId}`),
 saveProgress:(body:{learningId:number;missionId:string;status:'started'|'completed';evidence?:string;reflection?:string})=>call('/api/responsible-ai/literacy/progress',{method:'POST',body}),
 decisions:(limit=30)=>call<{decisions:LearningDecision[]}>(`/api/learning-governance/decisions?limit=${limit}`),
 runs:(limit=20)=>call<{runs:Array<Record<string,unknown>>}>(`/api/learning-os/runs?limit=${limit}`),
 registry:()=>call<{systems:Array<{key:string;name:string;purpose:string;humanOversight:boolean;riskLevel:string;data:string[];safeguards:string[]}>}>('/api/responsible-ai/registry'),
 override:(body:{systemKey:string;recommendationId?:string;decision:'accepted'|'adjusted'|'rejected';reason?:string})=>call('/api/responsible-ai/overrides',{method:'POST',body}),
 institutions:()=>call<{institutions:ManagedInstitution[]}>('/api/institutions/manage'),
 teacherCompetencies:()=>call<{domains:Array<Record<string,unknown>>}>('/api/learning-governance/teacher/competencies'),
 teacherSignals:(institutionId?:string)=>call<{events:Array<Record<string,unknown>>}>(`/api/learning-governance/teacher/signals${institutionId?`?institutionId=${encodeURIComponent(institutionId)}`:''}`),
 schoolPolicy:(id:string)=>call<{policy:Record<string,unknown>|null}>(`/api/school-governance/${encodeURIComponent(id)}/policy`),
 saveSchoolPolicy:(id:string,body:Record<string,unknown>)=>call<{policy:Record<string,unknown>}>(`/api/school-governance/${encodeURIComponent(id)}/policy`,{method:'PUT',body}),
 readiness:(id:string)=>call<Record<string,unknown>>(`/api/school-governance/${encodeURIComponent(id)}/readiness`),
 incidents:(id:string)=>call<{incidents:Array<Record<string,unknown>>}>(`/api/school-governance/${encodeURIComponent(id)}/incidents`),
 registerIncident:(id:string,body:{systemKey?:string;severity:'low'|'medium'|'high'|'critical';category:string;description:string})=>call(`/api/school-governance/${encodeURIComponent(id)}/incidents`,{method:'POST',body}),
 learningPolicy:(id:string)=>call<{policy:Record<string,unknown>|null}>(`/api/learning-os/institutions/${encodeURIComponent(id)}/policy`),
 saveLearningPolicy:(id:string,body:Record<string,unknown>)=>call(`/api/learning-os/institutions/${encodeURIComponent(id)}/policy`,{method:'PUT',body}),
}
