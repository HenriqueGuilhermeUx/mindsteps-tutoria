import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpenCheck, Check, ChevronRight, FileText, RefreshCw, Sparkles, Target } from 'lucide-react'
import { useWritingStore } from '@/stores/writing'
import { useEnemStore, type EnemArea } from '@/stores/enem'
import { analyzeWriting } from '@/lib/writingAnalysis'

const areaMeta:Record<Exclude<EnemArea,'Redação'>,{path:string;skill:string}>={
 Natureza:{path:'/enem/questoes',skill:'Ecologia e interpretação científica'},
 Humanas:{path:'/enem/questoes',skill:'Leitura de contexto e fontes'},
 Matemática:{path:'/enem/questoes',skill:'Proporção e resolução de problemas'},
 Linguagens:{path:'/enem/questoes',skill:'Inferência e leitura crítica'},
}

export function EnemTodayPage(){
 const navigate=useNavigate(); const {projects}=useWritingStore(); const {profile,diagnostic,attempts,dailyCompleted,toggleDailyStep}=useEnemStore()
 const today=new Date().toISOString().slice(0,10)
 const focus=useMemo(()=>{
   const candidates:Array<{name:EnemArea;value:number;path:string;skill:string;source:'evidência'|'diagnóstico'|'autopercepção'|'neutro'}>=[]
   ;(Object.keys(areaMeta) as Array<Exclude<EnemArea,'Redação'>>).forEach(name=>{
     const list=attempts.filter(a=>a.area===name&&!a.questionId.startsWith('d-')).slice(-20)
     const hasEvidence=list.length>=2
     const fallback=diagnostic?.areaScores[name] ?? (profile ? profile.confidence[name]*20 : 50)
     const value=hasEvidence?Math.round(30+(list.filter(a=>a.correct).length/list.length)*70):fallback
     const source=hasEvidence?'evidência':diagnostic?'diagnóstico':profile?'autopercepção':'neutro'
     candidates.push({name,value,...areaMeta[name],source})
   })
   const writing=projects.filter(p=>p.versions.length).slice(0,5)
   let writingValue=diagnostic?.areaScores.Redação ?? (profile ? profile.confidence.Redação*20 : 50)
   let writingSource:'evidência'|'diagnóstico'|'autopercepção'|'neutro'=diagnostic?'diagnóstico':profile?'autopercepção':'neutro'
   if(writing.length){writingValue=Math.round(writing.reduce((sum,p)=>{const s=analyzeWriting(p.versions[p.versions.length-1]!.text).scores;return sum+Object.values(s).reduce((a,b)=>a+b,0)/6},0)/writing.length);writingSource='evidência'}
   candidates.push({name:'Redação',value:writingValue,path:'/enem/redacao/coach',skill:'Escrita e argumentação',source:writingSource})
   return candidates.sort((a,b)=>a.value-b.value)[0]
 },[attempts,projects,profile,diagnostic])
 const plan=useMemo(()=>[
  {minutes:8,label:'Aprender',title:`Entenda ${focus.skill}`,text:'Comece pelo conceito e tente explicar com suas próprias palavras.',path:focus.path,icon:Sparkles},
  {minutes:7,label:'Praticar',title:`Prática guiada de ${focus.name}`,text:'Poucas questões ou exercícios para produzir um sinal útil.',path:focus.name==='Redação'?'/enem/redacao/coach':'/enem/questoes',icon:BookOpenCheck},
  {minutes:5,label:'Revisar',title:'Recupere sem consultar',text:'Tente lembrar antes de rever. Memória também precisa de treino.',path:'/enem/mapa',icon:RefreshCw},
  {minutes:5,label:'Escrever',title:'Uma ideia bem defendida',text:'Treine tese, argumento ou repertório em poucos minutos.',path:'/enem/redacao/coach',icon:FileText},
 ],[focus])
 const stepKey=(i:number)=>`${today}:${i}`; const total=plan.reduce((n,p)=>n+p.minutes,0); const completed=plan.reduce((n,p,i)=>n+(dailyCompleted.includes(stepKey(i))?p.minutes:0),0)
 return <main className="ms-screen space-y-4 py-4">
  <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-600 p-5 text-white shadow-xl shadow-violet-100"><div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"/><div className="relative"><p className="text-xs font-black uppercase tracking-[.18em] text-violet-100">Meu Dia ENEM</p><h1 className="mt-2 text-3xl font-black">Hoje, só o próximo passo.</h1><p className="mt-2 text-sm leading-6 text-white/80">{profile?`Meta ${profile.targetScore}${profile.targetCourse?` · ${profile.targetCourse}`:''}. `:''}O plano ganha precisão conforme você pratica.</p><div className="mt-5 flex items-end justify-between"><div><p className="text-3xl font-black">{completed}/{total}</p><p className="text-xs font-bold text-white/70">minutos concluídos hoje</p></div><div className="rounded-2xl bg-white/15 px-3 py-2 text-right"><p className="text-[10px] font-black uppercase tracking-wider text-white/70">foco de hoje</p><p className="text-sm font-black">{focus.name}</p></div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-white transition-all" style={{width:`${Math.round(completed/total*100)}%`}}/></div></div></section>
  {!profile&&<section className="rounded-3xl border border-violet-100 bg-violet-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-violet-700">Personalize seu ENEM</p><h2 className="mt-2 font-black text-violet-950">Seu plano ainda está usando um ponto de partida neutro.</h2><button onClick={()=>navigate('/enem/configurar')} className="mt-3 rounded-2xl bg-violet-700 px-4 py-3 text-sm font-black text-white">Montar meu plano →</button></section>}
  {profile&&!diagnostic&&<section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-cyan-700">Falta um passo curto</p><h2 className="mt-2 font-black text-cyan-950">Troque autopercepção por evidências iniciais.</h2><p className="mt-1 text-sm leading-6 text-cyan-900/70">O diagnóstico leva poucos minutos e deixa seu primeiro plano muito mais útil.</p><button onClick={()=>navigate('/enem/diagnostico')} className="mt-3 rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white">Fazer diagnóstico →</button></section>}
  <section className="rounded-3xl bg-amber-50 p-5"><div className="flex items-center gap-2 text-amber-700"><Target className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-wider">Por que este foco?</span></div><h2 className="mt-2 text-lg font-black text-amber-950">{focus.name} está com sinal {focus.value}/100.</h2><p className="mt-1 text-sm leading-6 text-amber-900/70">{focus.source==='evidência'?'Este sinal já usa resultados reais das suas atividades.':focus.source==='diagnóstico'?'Este sinal vem do seu diagnóstico inicial e será substituído gradualmente por prática real.':focus.source==='autopercepção'?'Por enquanto usamos sua autopercepção inicial.':'Ainda não temos dados suficientes; começamos de forma neutra e ajustamos com a prática.'}</p></section>
  <section className="space-y-3">{plan.map((item,i)=>{const Icon=item.icon;const key=stepKey(i);const finished=dailyCompleted.includes(key);return <article key={item.label} className={`rounded-3xl border p-4 shadow-sm ${finished?'border-emerald-100 bg-emerald-50':'border-slate-100 bg-white'}`}><div className="flex items-start gap-3"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${finished?'bg-emerald-600 text-white':'bg-indigo-50 text-indigo-700'}`}>{finished?<Check className="h-5 w-5"/>:<Icon className="h-5 w-5"/>}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="text-xs font-black uppercase tracking-wider text-slate-400">{item.label} · {item.minutes} min</p>{finished&&<span className="text-[10px] font-black text-emerald-700">FEITO</span>}</div><h2 className="mt-1 text-base font-black">{item.title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{item.text}</p><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={()=>navigate(item.path)} className="rounded-xl bg-slate-950 py-2.5 text-xs font-black text-white">Abrir <ChevronRight className="ml-1 inline h-3 w-3"/></button><button onClick={()=>toggleDailyStep(key)} className="rounded-xl bg-slate-100 py-2.5 text-xs font-black text-slate-700">{finished?'Desmarcar':'Concluir etapa'}</button></div></div></div></article>})}</section>
  <section className="rounded-3xl bg-slate-950 p-5 text-white"><p className="text-xs font-black uppercase tracking-wider text-violet-300">Princípio MindSteps</p><p className="mt-2 text-lg font-black">Consistência vence sobrecarga.</p><p className="mt-2 text-sm leading-6 text-slate-400">O objetivo não é estudar tudo. É aprender algo útil, produzir evidência e voltar amanhã com um mapa um pouco mais inteligente.</p></section>
 </main>
}
