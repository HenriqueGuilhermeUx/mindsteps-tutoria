import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Brain, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'

const skills = [
  { label: 'Tese', value: 72, note: 'Você costuma deixar sua posição clara logo no início.' },
  { label: 'Argumentação', value: 54, note: 'Seu próximo salto está em aprofundar causa, consequência e evidência.' },
  { label: 'Repertório', value: 61, note: 'Você traz referências, mas ainda pode conectá-las melhor ao argumento.' },
  { label: 'Coesão', value: 78, note: 'Boa continuidade entre ideias. Atenção a conectivos repetidos.' },
  { label: 'Intervenção', value: 49, note: 'Falta detalhar melhor meio e finalidade em algumas propostas.' },
  { label: 'Clareza', value: 81, note: 'Seu texto é fácil de acompanhar e tem boa organização.' },
]

const history = [
  { title: 'Tecnologia e inclusão', date: 'Hoje', delta: '+8', focus: 'Argumentação' },
  { title: 'Juventude e participação social', date: 'Há 6 dias', delta: '+5', focus: 'Tese' },
  { title: 'Eventos climáticos extremos', date: 'Há 12 dias', delta: '+11', focus: 'Intervenção' },
]

export function WritingDNAPage() {
  const navigate = useNavigate()
  const strongest = useMemo(() => [...skills].sort((a,b)=>b.value-a.value)[0], [])
  const next = useMemo(() => [...skills].sort((a,b)=>a.value-b.value)[0], [])

  return <main className="mx-auto w-full max-w-md px-4 pb-28 pt-2 text-slate-900">
    <section className="flex items-center gap-3"><button onClick={() => navigate('/enem/redacao')} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"><ArrowLeft className="h-5 w-5"/></button><div><p className="text-xs font-black uppercase tracking-[.18em] text-violet-600">Redação ENEM</p><h1 className="text-2xl font-black">Seu DNA da Escrita</h1></div></section>

    <section className="mt-5 overflow-hidden rounded-[30px] bg-[#17152f] p-5 text-white shadow-xl shadow-violet-100"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-violet-300">Sua voz está tomando forma</p><h2 className="mt-2 text-2xl font-black">Você escreve com clareza.</h2></div><Brain className="h-8 w-8 text-cyan-300"/></div><p className="mt-3 text-sm leading-6 text-white/70">O MindSteps observa padrões entre versões para descobrir como você pensa, organiza ideias e evolui. Não é um rótulo: é um mapa que muda com você.</p></section>

    <section className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-3xl bg-emerald-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-emerald-700">Seu ponto forte</p><p className="mt-2 text-xl font-black">{strongest.label}</p><p className="mt-1 text-xs leading-5 text-emerald-900/70">{strongest.note}</p></div><div className="rounded-3xl bg-amber-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-amber-700">Próximo salto</p><p className="mt-2 text-xl font-black">{next.label}</p><p className="mt-1 text-xs leading-5 text-amber-900/70">{next.note}</p></div></section>

    <section className="mt-6"><div className="flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-indigo-600">Mapa vivo</p><h2 className="text-xl font-black">Como sua escrita está hoje</h2></div><span className="text-xs font-semibold text-slate-400">estimativa pedagógica</span></div><div className="mt-3 space-y-3">{skills.map(skill => <div key={skill.label} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-black">{skill.label}</span><span className="text-sm font-black text-indigo-600">{skill.value}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{width:`${skill.value}%`}}/></div><p className="mt-2 text-xs leading-5 text-slate-500">{skill.note}</p></div>)}</div></section>

    <section className="mt-6 rounded-3xl bg-indigo-50 p-5"><div className="flex items-center gap-2 text-indigo-700"><Sparkles className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-wider">Treino recomendado</span></div><h2 className="mt-2 text-lg font-black">Intervenção completa em 7 minutos</h2><p className="mt-2 text-sm leading-6 text-indigo-900/70">Vamos treinar agente, ação, meio, finalidade e detalhamento usando um tema que você ainda não viu.</p><button onClick={() => navigate('/enem/redacao')} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-700 py-3.5 text-sm font-black text-white">Começar treino <ChevronRight className="h-4 w-4"/></button></section>

    <section className="mt-6"><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald-600"/><h2 className="text-lg font-black">Sua evolução</h2></div><div className="mt-3 space-y-3">{history.map(item => <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-black text-emerald-700">{item.delta}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{item.title}</p><p className="text-xs text-slate-500">{item.date} · foco em {item.focus}</p></div></div>)}</div></section>
  </main>
}
