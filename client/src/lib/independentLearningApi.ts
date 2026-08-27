import { useAuthStore } from '@/stores'

const API_BASE=import.meta.env.VITE_API_URL||'https://mindsteps-backend.onrender.com'
async function call<T>(path:string,options:{method?:'GET'|'POST';body?:unknown}={}):Promise<T>{const {token}=useAuthStore.getState();const r=await fetch(`${API_BASE}${path}`,{method:options.method||'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:options.body?JSON.stringify(options.body):undefined});const p=await r.json().catch(()=>({}));if(!r.ok)throw new Error(p.message||`HTTP ${r.status}`);return p as T}
export interface IndependenceSummary{checks:number;comparableChecks:number;assistedScore:number;independentScore:number;assistanceGap:number;attemptBeforeHelpShare:number;averageHelpLevel:number;independenceScore:number;offloadingRisk:'low'|'medium'|'high'|'unknown';notice:string}
export interface TransferCheck{id:string;subject?:string|null;skill?:string|null;source:string;assisted_score?:number|null;independent_score?:number|null;help_level:number;attempt_before_help:boolean;completed:boolean;created_at:string}
export const independentLearningApi={
 summary:()=>call<{checks:TransferCheck[];summary:IndependenceSummary}>('/api/learning-os/transfer-checks'),
 save:(data:{subject?:string;skill?:string;source?:string;assistedScore?:number;independentScore?:number;helpLevel?:number;attemptBeforeHelp?:boolean;completed?:boolean;metadata?:Record<string,unknown>})=>call<{check:TransferCheck}>('/api/learning-os/transfer-checks',{method:'POST',body:data}),
}
