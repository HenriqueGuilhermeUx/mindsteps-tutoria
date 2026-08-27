import { useAuthStore } from '@/stores'
import type { LearningCoreMetadata,LearningOSMetadata,ResponsibleAIMetadata } from '@/lib/api'
const API_BASE=import.meta.env.VITE_API_URL||'https://mindsteps-backend.onrender.com'
export type TutorHelpMode='hint'|'guided'|'explain'
export interface TutorResponse{response:string;xpEarned:number;cognitiveLevel:number;learningCore?:LearningCoreMetadata;responsibleAI?:ResponsibleAIMetadata;learningOS?:LearningOSMetadata;assistance?:{requested:TutorHelpMode;effective:TutorHelpMode;attemptFirstApplied:boolean;reason:string}}
export async function sendTutorMessage(data:{sessionId:string;content:string;subject?:string;skill?:string;helpMode:TutorHelpMode}){const{token}=useAuthStore.getState();const r=await fetch(`${API_BASE}/api/study/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(data)});const p=await r.json().catch(()=>({}));if(!r.ok)throw new Error(p.message||`HTTP ${r.status}`);return p as TutorResponse}
