import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpenCheck, BrainCircuit, Check, ChevronRight, FileText, RefreshCw, Sparkles, Target } from 'lucide-react'
import { useWritingStore } from '@/stores/writing'
import { useEnemStore, type EnemArea } from '@/stores/enem'
import { buildEnemSkillMap, findPrioritySkill } from '@/lib/enemSkillMap'
import { decideDailyPlan } from '@/lib/enemDailyPlanner'

export function EnemTodayPage(){
 const navigate=useNavigate(); const {projects}=useWritingStore(); const {profile,diagnostic,attempts,simulations,dailyCompleted,toggleDailyStep}=useEnemStore()
 const today=new Date().toISOString().slice(0,10)
 const focus=useMemo(()=>{
   const map=buildEnemSkillMap(attempts,projects); let priority=findPrioritySkill(map)
   if(!map.some(area=>area.evidenceCount>0)&&profile){const weakest=(Object.entries(profile.confidence) as [EnemArea,number][]).sort((a,b)=>a[1]-b[1])[0][0];const area=map.find(item=>item.area===weakest);if(area)priority={...area.skills[0],score:profile.confidence[weakest]*20}}
   return priority
 },[attempts,projects,profile])
 const decision=useMemo(()=>decideDailyPlan(focus,simulations),[focus,simulations])
 const contentPath=focus.area==='Redação'?'/enem/redacao/coach':'/enem/questoes'
 const plan=useMemo(()=>{
   if(decision.mode==='strategy')return[
    {minutes:8,label:'Decidir',title:'Treine quando insistir e quando seguir',text:decision.strategyInsight?.action||'Use o Coach de Estratégia para transformar padrões de prova em um protocolo simples.',path:'/enem/estrategia',icon:BrainCircuit},
    {minutes:7,label:'Simular',title:'Teste sua decisão sob tempo',text:'Faça um simulado curto aplicando apenas uma regra estratégica de cada vez.',path:'/enem/simulado',icon:Target},
    {minutes:5,label:'Revisar',title:'Revise suas escolhas, não só respostas',text:'Observe marcações, pulos, mudanças e tempo. Procure evidência do que funcionou.',path:'/enem/estrategia',icon:RefreshCw},
    {minutes:5,label:'Manter',title:`Mantenha ${focus.skill} ativo`,text:'Faça uma prática curta para não abandonar o conteúdo enquanto trabalha estratégia.',path:contentPath,icon:BookOpenCheck},
   ]
   if(decision.mode==='hybrid')return[
    {minutes:8,label:'Aprender',title:`Fortaleça ${focus.skill}`,text:`Comece pelo ponto de conteúdo com maior necessidade atual em ${focus.area}.`,path:contentPath,icon:Sparkles},
    {minutes:7,label:'Praticar',title:`Treino adaptativo de ${focus.skill}`,text:'Produza evidência nova e deixe o mapa recalcular sua prioridade.',path:contentPath,icon:BookOpenCheck},
    {minutes:5,label:'Estratégia',title:'Treine uma decisão de prova',text:decision.strategyInsight?.action||'Use o Coach para escolher uma regra de tempo, marcação ou revisão.',path:'/enem/estrategia',icon:BrainCircuit},
    {minutes:5,label:'Transferir',title:'Leve a habilidade para contexto de prova',text:'Aplique o conteúdo em uma sessão curta com atenção ao seu comportamento.',path:'/enem/simulado',icon:Target},
   ]
   return[
    {minutes:8,label:'Aprender',title:`Entenda ${focus.skill}`,text:`Hoje o conceito central é ${focus.skill}. Tente explicá-lo com suas próprias palavras antes de praticar.`,path:contentPath,icon:Sparkles},
    {minutes:7,label:'Praticar',title:`Treino de ${focus.skill}`,text:`Pratique a habilidade, não apenas a matéria ${focus.area}. Cada resposta atualiza esse sinal.`,path:contentPath,icon:BookOpenCheck},
    {minutes:5,label:'Revisar',title:`Recupere ${focus.skill} sem consultar`,text:'Tente reconstruir o raciocínio antes de rever. Recuperação ativa fortalece memória e compreensão.',path:'/enem/mapa',icon:RefreshCw},
    {minutes:5,label:'Escrever',title:'Transforme raciocínio em palavras',text:focus.area==='Redação'?`Aplique ${focus.skill} em uma nova tentativa.`:'Explique o que aprendeu como se estivesse ensinando outra pessoa.',path:focus.area==='Redação'?'/enem/redacao/coach':'/enem/redacao/escrever',icon:FileText},
   ]
 },[decision,focus,contentPath])
 const modeLabel=decision.mode==='strategy'?'Estratégia':decision.mode==='hybrid'?'Conteúdo + estratégia':'Aprendizagem'
 const stepKey=(i:number)=>`${today}:${decision.mode}:${focus.area}:${focus.skill}:${i}`; const total=plan.reduce((n,p)=>n+p.minutes,0); const completed=plan.reduce((n,p,i)=>n+(dailyCompleted.includes(stepKey(i))?p.minutes:0),0)
 return <main className="ms-screen space-y-4 py-4">
  <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-600 p-5 text-white shadow-xl shadow-violet-100"><div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"/><div className="relative"><p className="text-xs font-black uppercase tracking-[.18em] text-violet-100">Meu Dia ENEM</p><h1 className="mt-2 text-3xl font-black">Hoje, só o próximo passo.</h1><p className="mt-2 text-sm leading-6 text-white/80">{profile?`Meta ${profile.targetScore}${profile.targetCourse?` · ${profile.targetCourse}`:''}. `:''}O plano agora escolhe entre conteúdo, estratégia ou uma combinação dos dois.</p><div className="mt-5 flex items-end justify-between"><div><p className="text-3xl font-black">{completed}/{total}</p><p className="text-xs font-bold text-white/70">minutos concluídos hoje</p></div><div className="max-w-[52%] rounded-2xl bg-white/15 px-3 py-2 text-right"><p className="text-[10px] font-black uppercase tracking-wider text-white/70">modo de hoje</p><p className="text-sm font-black">{modeLabel}</p><p className="text-[10px] font-bold text-white/60">{focus.skill} · {focus.area}</p></div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-white transition-all" style={{width:`${Math.round(completed/total*100)}%`}}/></div></div></section>
  {!profile&&<section className="rounded-3xl border border-violet-100 bg-violet-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-violet-700">Personalize seu ENEM</p><h2 className="mt-2 font-black text-violet-950">Seu plano ainda está usando um ponto de partida neutro.</h2><button onClick={()=>navigate('/enem/configurar')} className="mt-3 rounded-2xl bg-violet-700 px-4 py-3 text-sm font-black text-white">Montar meu plano →</button></section>}
  {profile&&!diagnostic&&<section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-cyan-700">Falta um passo curto</p><h2 className="mt-2 font-black text-cyan-950">Troque autopercepção por evidências iniciais.</h2><p className="mt-1 text-sm leading-6 text-cyan-900/70">O diagnóstico adaptativo cria os primeiros sinais por habilidade.</p><button onClick={()=>navigate('/enem/diagnostico')} className="mt-3 rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white">Fazer diagnóstico →</button></section>}
  <section className="rounded-3xl bg-amber-50 p-5"><div className="flex items-center gap-2 text-amber-700"><Target className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-wider">Por que este plano?</span></div><h2 className="mt-2 text-lg font-black text-amber-950">{modeLabel}</h2><p className="mt-1 text-sm leading-6 text-amber-900/70">{decision.reason}</p><div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-2xl bg-white/70 p-3"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">necessidade conteúdo</p><p className="mt-1 text-xl font-black text-slate-900">{decision.learningNeed}</p></div><div className="rounded-2xl bg-white/70 p-3"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">necessidade estratégia</p><p className="mt-1 text-xl font-black text-slate-900">{simulations.length?decision.strategyNeed:'—'}</p></div></div></section>
  <section className="space-y-3">{plan.map((item,i)=>{const Icon=item.icon;const key=stepKey(i);const finished=dailyCompleted.includes(key);return <article key={item.label} className={`rounded-3xl border p-4 shadow-sm ${finished?'border-emerald-100 bg-emerald-50':'border-slate-100 bg-white'}`}><div className="flex items-start gap-3"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${finished?'bg-emerald-600 text-white':'bg-indigo-50 text-indigo-700'}`}>{finished?<Check className="h-5 w-5"/>:<Icon className="h-5 w-5"/>}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="text-xs font-black uppercase tracking-wider text-slate-400">{item.label} · {item.minutes} min</p>{finished&&<span className="text-[10px] font-black text-emerald-700">FEITO</span>}</div><h2 className="mt-1 text-base font-black">{item.title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{item.text}</p><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={()=>navigate(item.path)} className="rounded-xl bg-slate-950 py-2.5 text-xs font-black text-white">Abrir <ChevronRight className="ml-1 inline h-3 w-3"/></button><button onClick={()=>toggleDailyStep(key)} className="rounded-xl bg-slate-100 py-2.5 text-xs font-black text-slate-700">{finished?'Desmarcar':'Concluir etapa'}</button></div></div></div></article>})}</section>
  <section className="rounded-3xl bg-slate-950 p-5 text-white"><p className="text-xs font-black uppercase tracking-wider text-violet-300">Princípio MindSteps</p><p className="mt-2 text-lg font-black">Nem todo problema de prova é falta de conteúdo.</p><p className="mt-2 text-sm leading-6 text-slate-400">O sistema compara sinais de aprendizagem e estratégia para escolher o tipo de intervenção que parece mais útil agora — e pode mudar de ideia conforme surgem novas evidências.</p></section>
 </main>
}
