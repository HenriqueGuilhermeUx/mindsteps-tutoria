import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, Clock3, GraduationCap, Sparkles, Target } from 'lucide-react'
import { useEnemStore, type EnemArea } from '@/stores/enem'

const areas: EnemArea[] = ['Linguagens', 'Humanas', 'Natureza', 'Matemática', 'Redação']
const presets = [
  { id: 'curto' as const, label: 'Ritmo leve', minutes: 25, days: 5, text: 'Para criar constância sem sobrecarga.' },
  { id: 'equilibrado' as const, label: 'Ritmo equilibrado', minutes: 45, days: 5, text: 'Bom equilíbrio entre teoria, prática e revisão.' },
  { id: 'intensivo' as const, label: 'Ritmo intensivo', minutes: 90, days: 6, text: 'Para quem quer acelerar com mais tempo disponível.' },
]

export function EnemSetupPage() {
  const navigate = useNavigate()
  const { profile, saveProfile } = useEnemStore()
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState(profile?.goal || 'Melhorar minha nota no ENEM')
  const [targetCourse, setTargetCourse] = useState(profile?.targetCourse || '')
  const [targetScore, setTargetScore] = useState(profile?.targetScore || 700)
  const [mode, setMode] = useState(profile?.preferredMode || 'curto')
  const [confidence, setConfidence] = useState<Record<EnemArea, number>>(profile?.confidence || { Linguagens: 3, Humanas: 3, Natureza: 3, Matemática: 3, Redação: 3 })
  const preset = presets.find((item) => item.id === mode) || presets[0]

  const finish = () => {
    saveProfile({ goal, targetCourse, targetScore, dailyMinutes: preset.minutes, studyDaysPerWeek: preset.days, preferredMode: mode, confidence })
    navigate('/enem/diagnostico')
  }

  return <main className="ms-screen space-y-4 py-4">
    <section className="rounded-[32px] bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-600 p-5 text-white shadow-xl shadow-violet-100">
      <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-violet-100">Seu ENEM começa aqui</p><h1 className="mt-2 text-2xl font-black">Vamos montar seu ponto de partida.</h1></div><GraduationCap className="h-8 w-8"/></div>
      <p className="mt-3 text-sm leading-6 text-white/80">Não é prova de nível. É só contexto para o primeiro plano já nascer mais útil.</p>
      <div className="mt-5 flex gap-2">{[0,1,2].map((item)=><div key={item} className={`h-2 flex-1 rounded-full ${item<=step?'bg-white':'bg-white/20'}`}/>)}</div>
    </section>

    {step===0 && <section className="space-y-3">
      <div className="rounded-3xl bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-indigo-700"><Target className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-wider">Objetivo</span></div><label className="mt-4 block text-sm font-black">O que você quer conquistar?</label><input value={goal} onChange={(e)=>setGoal(e.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400"/><label className="mt-4 block text-sm font-black">Curso ou área que te interessa</label><input value={targetCourse} onChange={(e)=>setTargetCourse(e.target.value)} placeholder="Ex.: Medicina, Direito, Ciência da Computação..." className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400"/><label className="mt-4 block text-sm font-black">Nota que você gostaria de alcançar</label><input type="range" min="500" max="900" step="10" value={targetScore} onChange={(e)=>setTargetScore(Number(e.target.value))} className="mt-3 w-full"/><div className="mt-2 text-center text-3xl font-black text-indigo-700">{targetScore}</div></div>
      <button onClick={()=>setStep(1)} className="w-full rounded-2xl bg-slate-950 py-4 text-sm font-black text-white">Continuar <ChevronRight className="ml-1 inline h-4 w-4"/></button>
    </section>}

    {step===1 && <section className="space-y-3"><div className="rounded-3xl bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-violet-700"><Clock3 className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-wider">Seu ritmo</span></div><h2 className="mt-2 text-xl font-black">Quanto cabe na sua rotina?</h2><p className="mt-1 text-sm leading-6 text-slate-500">Você poderá mudar isso depois. O importante é escolher algo sustentável.</p><div className="mt-4 space-y-2">{presets.map((item)=><button key={item.id} onClick={()=>setMode(item.id)} className={`w-full rounded-2xl border p-4 text-left ${mode===item.id?'border-violet-400 bg-violet-50':'border-slate-100 bg-slate-50'}`}><div className="flex items-center justify-between"><div><p className="text-sm font-black">{item.label}</p><p className="mt-1 text-xs text-slate-500">{item.minutes} min/dia · {item.days} dias/semana</p></div>{mode===item.id&&<Check className="h-5 w-5 text-violet-700"/>}</div><p className="mt-2 text-xs leading-5 text-slate-500">{item.text}</p></button>)}</div></div><div className="grid grid-cols-2 gap-3"><button onClick={()=>setStep(0)} className="rounded-2xl border border-slate-200 bg-white py-4 text-sm font-black">Voltar</button><button onClick={()=>setStep(2)} className="rounded-2xl bg-slate-950 py-4 text-sm font-black text-white">Continuar</button></div></section>}

    {step===2 && <section className="space-y-3"><div className="rounded-3xl bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-fuchsia-700"><Sparkles className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-wider">Autopercepção inicial</span></div><h2 className="mt-2 text-xl font-black">Como você se sente hoje?</h2><p className="mt-1 text-sm leading-6 text-slate-500">Isso não define seu nível. Serve apenas como um sinal inicial até termos dados reais de questões, escrita e simulados.</p><div className="mt-4 space-y-4">{areas.map((area)=><div key={area}><div className="flex items-center justify-between"><span className="text-sm font-black">{area}</span><span className="text-xs font-bold text-slate-400">{confidence[area]}/5</span></div><div className="mt-2 grid grid-cols-5 gap-2">{[1,2,3,4,5].map((value)=><button key={value} onClick={()=>setConfidence({...confidence,[area]:value})} className={`h-10 rounded-xl text-xs font-black ${confidence[area]===value?'bg-fuchsia-600 text-white':'bg-slate-100 text-slate-500'}`}>{value}</button>)}</div></div>)}</div></div><div className="grid grid-cols-2 gap-3"><button onClick={()=>setStep(1)} className="rounded-2xl border border-slate-200 bg-white py-4 text-sm font-black">Voltar</button><button onClick={finish} className="rounded-2xl bg-fuchsia-600 py-4 text-sm font-black text-white">Ir para diagnóstico</button></div></section>}

    <section className="rounded-3xl bg-emerald-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-emerald-700">Importante</p><p className="mt-1 text-xs leading-5 text-emerald-900/70">O MindSteps usa esses dados como contexto inicial. Em seguida, um diagnóstico curto começa a substituir autopercepção por evidências reais.</p></section>
  </main>
}
