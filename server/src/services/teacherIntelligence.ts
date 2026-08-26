import { supabase } from '../db/index.js'

export type TeacherSignal={type:'learning_gap'|'engagement'|'strategy'|'writing'|'wellbeing';priority:'low'|'medium'|'high';title:string;detail:string;evidence:Record<string,unknown>;suggestedAction:string}

export function buildTeacherSignals(input:{student:{name?:string;grade?:string;xp?:number;streak?:number;last_study_date?:string|null};skillScores?:Array<{skill:string;score:number;evidenceCount:number}>;recentErrors?:number;strategyScore?:number;writingScore?:number}):TeacherSignal[]{
 const signals:TeacherSignal[]=[]
 const weak=(input.skillScores||[]).filter(s=>s.evidenceCount>=2&&s.score<50).sort((a,b)=>a.score-b.score)[0]
 if(weak)signals.push({type:'learning_gap',priority:weak.score<35?'high':'medium',title:`Atenção em ${weak.skill}`,detail:`Sinal atual ${Math.round(weak.score)}/100 com ${weak.evidenceCount} evidências.`,evidence:{skill:weak.skill,score:weak.score,evidenceCount:weak.evidenceCount},suggestedAction:'Revisar evidências e planejar uma intervenção curta antes de aumentar a dificuldade.'})
 if((input.recentErrors||0)>=4)signals.push({type:'learning_gap',priority:'medium',title:'Erros recentes recorrentes',detail:`Foram registrados ${input.recentErrors} erros recentes.`,evidence:{recentErrors:input.recentErrors},suggestedAction:'Investigar se os erros vêm do mesmo conceito, leitura do enunciado ou estratégia de resolução.'})
 if((input.strategyScore??100)<55)signals.push({type:'strategy',priority:'medium',title:'Estratégia de prova merece atenção',detail:`Strategy Score em ${input.strategyScore}.`,evidence:{strategyScore:input.strategyScore},suggestedAction:'Treinar decisão de pular, revisar e controlar tempo sem reduzir a sessão a conteúdo.'})
 if((input.writingScore??100)<55)signals.push({type:'writing',priority:'medium',title:'Escrita pede mediação',detail:`Sinal de escrita em ${input.writingScore}.`,evidence:{writingScore:input.writingScore},suggestedAction:'Escolher uma única habilidade de escrita para feedback formativo e solicitar nova versão do estudante.'})
 if((input.student.streak??0)===0&&input.student.last_study_date)signals.push({type:'engagement',priority:'low',title:'Ritmo de estudo interrompido',detail:'A sequência atual está zerada.',evidence:{lastStudyDate:input.student.last_study_date},suggestedAction:'Checar contexto antes de interpretar como desengajamento e oferecer uma retomada curta.'})
 return signals.slice(0,5)
}

export async function saveTeacherSignal(input:{teacherUserId:string;institutionId?:string|null;studentUserId?:string|null;signal:TeacherSignal}){const {data,error}=await supabase.from('mindsteps_teacher_intelligence_events').insert({teacher_user_id:input.teacherUserId,institution_id:input.institutionId||null,student_user_id:input.studentUserId||null,event_type:input.signal.type,evidence:input.signal.evidence,recommendation:{title:input.signal.title,detail:input.signal.detail,priority:input.signal.priority,suggestedAction:input.signal.suggestedAction},status:'open'}).select('*').single();if(error)throw new Error(error.message);return data}
export async function listTeacherSignals(teacherUserId:string,institutionId?:string){let q=supabase.from('mindsteps_teacher_intelligence_events').select('*').eq('teacher_user_id',teacherUserId).order('created_at',{ascending:false}).limit(100);if(institutionId)q=q.eq('institution_id',institutionId);const {data,error}=await q;if(error)throw new Error(error.message);return data||[]}
export async function updateTeacherSignal(teacherUserId:string,id:string,status:'accepted'|'adjusted'|'dismissed'|'completed',replacement?:Record<string,unknown>){const patch:any={status,updated_at:new Date().toISOString()};if(replacement)patch.recommendation=replacement;const {data,error}=await supabase.from('mindsteps_teacher_intelligence_events').update(patch).eq('id',id).eq('teacher_user_id',teacherUserId).select('*').single();if(error)throw new Error(error.message);return data}

export const TEACHER_AI_COMPETENCY_PATH=[
 {id:'critical-ai',title:'Compreensão crítica da IA',goal:'Entender capacidades, limites, vieses e alucinações.'},
 {id:'intentional-use',title:'Uso pedagógico intencional',goal:'Escolher quando usar IA e quando preservar esforço sem IA.'},
 {id:'rights-wellbeing',title:'Direitos e bem-estar',goal:'Proteger dados, autoria, segurança e equilíbrio digital.'},
 {id:'professional-growth',title:'Desenvolvimento profissional',goal:'Usar IA como apoio ao planejamento e reflexão sem perder autonomia docente.'},
] as const
