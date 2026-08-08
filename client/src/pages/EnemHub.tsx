import { useNavigate } from 'react-router-dom'
import { BookOpenCheck, ChevronRight, Clock3, Dna, FileText, GraduationCap, Shuffle, Sparkles, Target, TimerReset } from 'lucide-react'

const tools = [
  { title: 'Redação', subtitle: 'Aprenda a pensar, escrever e revisar', icon: FileText, path: '/enem/redacao', tone: 'bg-violet-50 text-violet-700' },
  { title: 'DNA da Escrita', subtitle: 'Veja padrões, forças e próximo salto', icon: Dna, path: '/enem/redacao/dna', tone: 'bg-fuchsia-50 text-fuchsia-700' },
  { title: 'Motor de Temas', subtitle: 'Treine diversidade e fuja da decoreba', icon: Shuffle, path: '/enem/redacao/temas', tone: 'bg-rose-50 text-rose-700' },
  { title: 'Questões', subtitle: 'Prática adaptativa por habilidade', icon: BookOpenCheck, path: '/missoes', tone: 'bg-cyan-50 text-cyan-700' },
  { title: 'Simulado', subtitle: 'Treine estratégia e tempo de prova', icon: TimerReset, path: '/missoes', tone: 'bg-amber-50 text-amber-700' },
  { title: 'Meu mapa ENEM', subtitle: 'Veja forças, lacunas e próximos passos', icon: Target, path: '/journey', tone: 'bg-emerald-50 text-emerald-700' },
]

export function EnemHubPage() {
  const navigate = useNavigate()
  return <main className="ms-screen space-y-5 py-4">
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-600 p-5 text-white shadow-xl shadow-violet-200/60">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between"><span className="text-xs font-black uppercase tracking-[.2em] text-violet-100">MindSteps ENEM</span><GraduationCap className="h-7 w-7 text-white/90" /></div>
        <h1 className="mt-4 text-3xl font-black tracking-tight">Seu ENEM, um passo por vez.</h1>
        <p className="mt-3 text-sm leading-6 text-white/80">O MindSteps organiza o que estudar, identifica lacunas e transforma cada treino em um próximo passo claro.</p>
        <button onClick={() => navigate('/enem/redacao')} className="ms-pressable mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-violet-700">Começar pela redação <ChevronRight className="h-5 w-5" /></button>
      </div>
    </section>

    <section><div className="mb-3"><p className="text-xs font-black uppercase tracking-wider text-violet-600">Seu kit ENEM</p><h2 className="text-xl font-black text-slate-950">Treine o que realmente precisa</h2></div><div className="grid grid-cols-2 gap-3">{tools.map(({title,subtitle,icon:Icon,path,tone}) => <button key={title} onClick={() => navigate(path)} className="ms-card-soft ms-pressable min-h-[148px] p-4 text-left"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></span><h2 className="mt-4 text-sm font-black text-slate-950">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p></button>)}</div></section>

    <section className="ms-card-soft p-5"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Clock3 className="h-5 w-5" /></span><div><p className="text-xs font-black uppercase tracking-wider text-indigo-600">Meu dia ENEM</p><h2 className="font-black text-slate-950">25 minutos já fazem diferença.</h2></div></div><div className="mt-4 grid grid-cols-4 gap-2 text-center text-[11px] font-bold text-slate-500"><div className="rounded-2xl bg-slate-50 p-2">8 min<br/><span className="text-slate-900">Aprender</span></div><div className="rounded-2xl bg-slate-50 p-2">7 min<br/><span className="text-slate-900">Praticar</span></div><div className="rounded-2xl bg-slate-50 p-2">5 min<br/><span className="text-slate-900">Revisar</span></div><div className="rounded-2xl bg-slate-50 p-2">5 min<br/><span className="text-slate-900">Escrever</span></div></div></section>

    <section className="rounded-3xl bg-slate-950 p-5 text-white"><div className="flex items-center gap-2 text-violet-300"><Sparkles className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-wider">Freemium de verdade</span></div><p className="mt-2 text-lg font-black">Aprender não fica atrás de um paywall.</p><p className="mt-2 text-sm leading-6 text-slate-400">O plano gratuito oferece diagnóstico, treino diário e acesso real ao aprendizado. O Pro amplia intensidade, personalização, simulados e acompanhamento.</p></section>
  </main>
}
