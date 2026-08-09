import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpenCheck, Check, ChevronRight, FileText, RefreshCw, Sparkles, Target } from 'lucide-react'
import { useWritingStore } from '@/stores/writing'

const baseAreas = [
  { name:'Natureza', value:48, path:'/enem/questoes', skill:'Ecologia e interpretação científica' },
  { name:'Humanas', value:55, path:'/enem/questoes', skill:'Leitura de contexto e fontes' },
  { name:'Matemática', value:58, path:'/enem/questoes', skill:'Proporção e resolução de problemas' },
  { name:'Linguagens', value:62, path:'/enem/questoes', skill:'Inferência e leitura crítica' },
]

export function EnemTodayPage(){
 const navigate=useNavigate(); const {projects,drillResults}=useWritingStore(); const [done,setDone]=useState<number[]>([])
 const writingSignal=useMemo(()=>{const versions=projects.reduce((n,p)=>n+p.versions.length,0);return Math.min(78,42+versions*4+drillResults.length*3)},[projects,drillResults])
 const focus=useMemo(()=>[...baseAreas,{name:'Redação',value:writingSignal,path:'/enem/redacao/coach',skill:'Escrita e argumentação'}].sort((a,b)=>a.value-b.value)[0],[writingSignal])
 const plan=useMemo(()=>[
  {minutes:8,label:'Aprender',title:`Entenda ${focus.skill}`,text:'Comece pelo conceito e explique com suas próprias palavras.',path:focus.path,icon:Sparkles},
  {minutes:7,label:'Praticar',title:`Questões de ${focus.name}`,text:'Poucas questões, escolhidas para gerar um sinal útil.',path:'/enem/questoes',icon:BookOpenCheck},
  {minutes:5,label:'Revisar',title:'Recupere sem consultar',text:'Tente lembrar antes de rever. Memória também precisa de treino.',path:'/enem/mapa',icon:RefreshCw},
  {minutes:5,label:'Escrever',title:'Uma ideia bem defendida',text:'Treine tese, argumento ou repertório em poucos minutos.',path:'/enem/redacao/coach',icon:FileText},
 ],[focus])
 const total=plan.reduce((n,p)=>n+p.minutes,0),completed=plan.filter((_,i)=>done.includes(i)).reduce((n,p)=>n+p.minutes,0)
 return <main className="ms-screen space-y-4 py-4">
  <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-600 p-5 text-white shadow-xl shadow-violet-100"><div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"/><div className="relative"><p className="text-xs font-black uppercase tracking-[.18em] text-violet-100">Meu Dia ENEM</p><h1 className="mt-2 text-3xl font-black">Hoje, só o próximo passo.</h1><p className="mt-2 text-sm leading-6 text-white/80">Um plano curto que combina foco, prática, recuperação e escrita.</p><div className="mt-5 flex items-end justify-between"><div><p className="text-3xl font-black">{completed}/{total}</p><p className="text-xs font-bold text-white/70">minutos concluídos</p></div><div className="rounded-2xl bg-white/15 px-3 py-2 text-right"><p className="text-[10px] font-black uppercase tracking-wider text-white/70">foco de hoje</p><p className="text-sm font-black">{focus.name}</p></div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-white transition-all" style={{width:`${Math.round(completed/total*100)}%`}}/></div></div></section>
  <section className="rounded-3xl bg-amber-50 p-5"><div className="flex items-center gap-2 text-amber-700"><Target className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-wider">Por que este foco?</span></div><h2 className="mt-2 text-lg font-black text-amber-950">{focus.name} mostra maior espaço para evolução.</h2><p className="mt-1 text-sm leading-6 text-amber-900/70">O plano usa os sinais disponíveis e deve mudar conforme você aprende. Não é um rótulo nem um boletim.</p></section>
  <section className="space-y-3">{plan.map((item,i)=>{const Icon=item.icon;const finished=done.includes(i);return <article key={item.label} className={`rounded-3xl border p-4 shadow-sm ${finished?'border-emerald-100 bg-emerald-50':'border-slate-100 bg-white'}`}><div className="flex items-start gap-3"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${finished?'bg-emerald-600 text-white':'bg-indigo-50 text-indigo-700'}`}>{finished?<Check className="h-5 w-5"/>:<Icon className="h-5 w-5"/>}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="text-xs font-black uppercase tracking-wider text-slate-400">{item.label} · {item.minutes} min</p>{finished&&<span className="text-[10px] font-black text-emerald-700">FEITO</span>}</div><h2 className="mt-1 text-base font-black">{item.title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{item.text}</p><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={()=>navigate(item.path)} className="rounded-xl bg-slate-950 py-2.5 text-xs font-black text-white">Abrir <ChevronRight className="ml-1 inline h-3 w-3"/></button><button onClick={()=>setDone(d=>finished?d.filter(x=>x!==i):[...d,i])} className="rounded-xl bg-slate-100 py-2.5 text-xs font-black text-slate-700">{finished?'Desmarcar':'Concluir etapa'}</button></div></div></div></article>})}</section>
  <section className="rounded-3xl bg-slate-950 p-5 text-white"><p className="text-xs font-black uppercase tracking-wider text-violet-300">Princípio MindSteps</p><p className="mt-2 text-lg font-black">Consistência vence sobrecarga.</p><p className="mt-2 text-sm leading-6 text-slate-400">O objetivo do dia não é estudar tudo. É escolher um próximo passo útil, aprender, praticar e voltar amanhã com um mapa melhor.</p></section>
 </main>
}
