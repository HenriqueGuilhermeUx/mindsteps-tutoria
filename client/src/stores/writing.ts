import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WritingSkill = 'tese' | 'argumentacao' | 'repertorio' | 'coesao' | 'intervencao' | 'clareza'
export interface WritingVersion { id: string; createdAt: string; text: string; wordCount: number }
export interface WritingDrillResult { id: string; projectId: string; skill: WritingSkill; createdAt: string; answer: string; completed: boolean; sourceVersionId?: string }
export interface WritingInterventionEffect { id: string; projectId: string; drillResultId: string; skill: WritingSkill; beforeVersionId: string; afterVersionId: string; beforeScore: number; afterScore: number; delta: number; createdAt: string }
export interface WritingProject { id: string; theme: string; area: string; createdAt: string; updatedAt: string; versions: WritingVersion[]; focus: WritingSkill; status: 'draft' | 'review' | 'complete' }

interface WritingState {
  projects: WritingProject[]
  drillResults: WritingDrillResult[]
  interventionEffects: WritingInterventionEffect[]
  activeProjectId: string | null
  createProject: (theme: string, area: string) => string
  saveVersion: (projectId: string, text: string) => void
  setFocus: (projectId: string, focus: WritingSkill) => void
  setStatus: (projectId: string, status: WritingProject['status']) => void
  setActiveProject: (id: string | null) => void
  completeDrill: (projectId: string, skill: WritingSkill, answer: string, sourceVersionId?: string) => void
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const wordList = (text:string) => text.trim().split(/\s+/).filter(Boolean)
const paragraphs = (text:string) => text.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean)
const sentences = (text:string) => text.split(/[.!?]+/).map(s=>s.trim()).filter(Boolean)
const countAny = (text:string,list:string[]) => { const t=text.toLowerCase(); return list.filter(x=>t.includes(x)).length }
const connectors=['portanto','porém','além disso','nesse sentido','assim','desse modo','todavia','entretanto','logo','consequentemente','porque','visto que','uma vez que']
const repertoire=['segundo','conforme','constituição','onu','ibge','unesco','filósofo','sociólogo','obra','livro','filme','dados','pesquisa','história','artigo']
const intervention=['governo','estado','escola','sociedade','mídia','instituição','ministério','prefeitura','projeto','política pública','deve','devem','por meio de','a fim de','com o objetivo de']
function score(text:string,skill:WritingSkill){ const w=wordList(text),p=paragraphs(text),s=sentences(text),c=countAny(text,connectors),r=countAny(text,repertoire),i=countAny(text,intervention),avg=s.length?Math.round(w.length/s.length):0,unique=new Set(w.map(x=>x.toLowerCase().replace(/[^a-záàâãéèêíïóôõöúçñ]/gi,''))).size,div=w.length?Math.round(unique/w.length*100):0; const scores:Record<WritingSkill,number>={tese:Math.min(100,40+(p.length>=3?25:5)+(w.length>=180?20:5)),argumentacao:Math.min(100,30+p.length*10+c*7),repertorio:Math.min(100,25+r*22),coesao:Math.min(100,30+c*9+(p.length>=4?18:5)),intervencao:Math.min(100,25+i*18+(text.toLowerCase().includes('para')?8:0)),clareza:Math.max(25,Math.min(100,90-Math.max(0,avg-24)*2+Math.min(15,Math.round(div/6))))}; return scores[skill] }

export const useWritingStore = create<WritingState>()(persist((set) => ({
  projects: [], drillResults: [], interventionEffects: [], activeProjectId: null,
  createProject: (theme, area) => { const id=uid(),now=new Date().toISOString(); set(state=>({projects:[{id,theme,area,createdAt:now,updatedAt:now,versions:[],focus:'argumentacao',status:'draft'},...state.projects],activeProjectId:id})); return id },
  saveVersion: (projectId, text) => set((state) => {
    const project=state.projects.find(p=>p.id===projectId); if(!project) return state
    const version:WritingVersion={id:uid(),createdAt:new Date().toISOString(),text,wordCount:wordList(text).length}; const previous=project.versions.at(-1)
    const newEffects:WritingInterventionEffect[]=[]
    if(previous){ state.drillResults.filter(d=>d.projectId===projectId&&d.sourceVersionId===previous.id).forEach(d=>{ if(state.interventionEffects.some(e=>e.drillResultId===d.id&&e.afterVersionId===version.id)) return; const beforeScore=score(previous.text,d.skill),afterScore=score(text,d.skill); newEffects.push({id:uid(),projectId,drillResultId:d.id,skill:d.skill,beforeVersionId:previous.id,afterVersionId:version.id,beforeScore,afterScore,delta:afterScore-beforeScore,createdAt:new Date().toISOString()}) }) }
    return { projects:state.projects.map(p=>p.id===projectId?{...p,updatedAt:new Date().toISOString(),versions:[...p.versions,version]}:p), interventionEffects:[...newEffects,...state.interventionEffects] }
  }),
  setFocus: (projectId, focus) => set(state=>({projects:state.projects.map(p=>p.id===projectId?{...p,focus,updatedAt:new Date().toISOString()}:p)})),
  setStatus: (projectId, status) => set(state=>({projects:state.projects.map(p=>p.id===projectId?{...p,status,updatedAt:new Date().toISOString()}:p)})),
  setActiveProject: (activeProjectId) => set({activeProjectId}),
  completeDrill: (projectId, skill, answer, sourceVersionId) => set(state=>({drillResults:[{id:uid(),projectId,skill,answer,sourceVersionId,completed:true,createdAt:new Date().toISOString()},...state.drillResults]})),
}), { name:'mindsteps-writing-portfolio' }))
