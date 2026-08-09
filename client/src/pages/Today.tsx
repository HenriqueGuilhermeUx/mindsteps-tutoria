import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BrainCircuit,
  Camera,
  ChevronRight,
  Compass,
  Dna,
  FileText,
  Flame,
  GraduationCap,
  Loader2,
  MessageCircle,
  RefreshCw,
  Shuffle,
  Sparkles,
  Target,
} from 'lucide-react'
import { operationsApi, type TodayOverview } from '@/lib/api'
import { features } from '@/lib/features'
import { useAuthStore } from '@/stores'

const actions = [
  { title: 'Resolver uma questão', subtitle: 'Foto ou texto', icon: Camera, path: '/chat', className: 'bg-cyan-50 text-cyan-700' },
  { title: 'Estudar pra prova', subtitle: 'Monte um plano', icon: GraduationCap, path: '/missoes', className: 'bg-violet-50 text-violet-700' },
  { title: 'Perguntar qualquer coisa', subtitle: 'Converse com a Lumi', icon: MessageCircle, path: '/chat', className: 'bg-indigo-50 text-indigo-700' },
  { title: 'Revisar rapidinho', subtitle: 'Poucos minutos', icon: RefreshCw, path: '/missoes', className: 'bg-amber-50 text-amber-700' },
]

const enemWriting = [
  { title: 'Escrever', icon: FileText, path: '/enem/redacao/escrever', cls: 'bg-violet-100 text-violet-700' },
  { title: 'Meu Coach', icon: BrainCircuit, path: '/enem/redacao/coach', cls: 'bg-indigo-100 text-indigo-700' },
  { title: 'DNA', icon: Dna, path: '/enem/redacao/dna', cls: 'bg-fuchsia-100 text-fuchsia-700' },
  { title: 'Temas', icon: Shuffle, path: '/enem/redacao/temas', cls: 'bg-rose-100 text-rose-700' },
]

export function TodayPage() {
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const [overview, setOverview] = useState<TodayOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    operationsApi.today()
      .then(setOverview)
      .catch((err) => setError(err instanceof Error ? err.message : 'Não foi possível carregar seu dia'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex min-h-[58dvh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary-600" /></div>

  const mission = overview?.mission
  const firstName = profile?.name?.split(' ')[0] || 'estudante'
  const completed = overview?.stats?.missionsCompleted || 0

  return <div className="ms-screen space-y-5 py-4">
    <section><p className="ms-kicker">Seu espaço</p><h2 className="ms-title mt-2">O que vamos descobrir hoje, {firstName}?</h2><p className="ms-body mt-2">Escolha um caminho. O MindSteps cuida do próximo passo.</p></section>
    {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">{error}</div>}

    <section className="relative overflow-hidden rounded-[32px] bg-[#17152f] p-5 text-white shadow-[0_24px_60px_rgba(63,54,150,0.30)]"><div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-violet-500/35 blur-2xl" /><div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" /><div className="relative"><div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-xs font-extrabold text-violet-200"><Sparkles className="h-4 w-4" /> Sua missão</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">{mission?.estimated_minutes || 8} min</span></div><div className="mt-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10"><Compass className="h-7 w-7 text-cyan-300" /></div><h3 className="mt-5 text-[26px] font-black leading-[1.05] tracking-[-0.03em]">{mission?.title || 'Descubra algo novo em poucos minutos'}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-white/70">{mission?.description || 'Uma experiência curta feita para o seu jeito de aprender.'}</p><button onClick={() => navigate('/chat', { state: { mission } })} className="ms-pressable mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-[15px] font-black text-slate-950">Continuar missão <ArrowRight className="h-5 w-5" /></button></div></section>

    <section><div className="mb-3 flex items-center justify-between"><h3 className="text-lg font-black tracking-tight text-slate-950">Ou escolha outro caminho</h3><span className="text-[11px] font-bold text-slate-400">um toque</span></div><div className="grid grid-cols-2 gap-3">{actions.map(({ title, subtitle, icon: Icon, path, className }) => <button key={title} onClick={() => navigate(path)} className="ms-card-soft ms-pressable min-h-[142px] p-4 text-left"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${className}`}><Icon className="h-5 w-5" /></span><span className="mt-4 block text-[14px] font-black leading-tight text-slate-950">{title}</span><span className="mt-1 block text-xs font-medium text-slate-500">{subtitle}</span></button>)}</div></section>

    {features.enemV2 && <section className="relative overflow-hidden rounded-[30px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-5"><div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-violet-100/70 blur-xl"/><div className="relative"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white"><GraduationCap className="h-6 w-6"/></span><div className="min-w-0 flex-1"><p className="text-xs font-black uppercase tracking-wider text-violet-600">Destaque · MindSteps ENEM</p><h3 className="mt-1 text-lg font-black text-slate-950">Redação que ensina você a escrever melhor.</h3><p className="mt-1 text-sm leading-5 text-slate-500">Estúdio com versões, Coach adaptativo, DNA da Escrita e temas variados.</p></div></div><div className="mt-4 grid grid-cols-4 gap-2">{enemWriting.map(({title,icon:Icon,path,cls})=><button key={title} onClick={()=>navigate(path)} className="ms-pressable rounded-2xl bg-white p-2.5 text-center shadow-sm ring-1 ring-slate-100"><span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl ${cls}`}><Icon className="h-4 w-4"/></span><span className="mt-1.5 block text-[10px] font-black text-slate-700">{title}</span></button>)}</div><button onClick={() => navigate('/enem')} className="mt-4 inline-flex items-center gap-1 text-sm font-black text-violet-700">Explorar todo o ENEM <ChevronRight className="h-4 w-4"/></button></div></section>}

    <section className="ms-card-soft overflow-hidden p-4"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500"><Flame className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="text-sm font-black text-slate-950">Você já fez {completed} {completed === 1 ? 'descoberta' : 'descobertas'}</p><p className="mt-0.5 text-xs font-medium text-slate-500">Pequenos passos constroem coisas grandes.</p></div><button onClick={() => navigate('/journey')} className="ms-pressable flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500" aria-label="Abrir mapa"><ChevronRight className="h-5 w-5" /></button></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-400" style={{ width: `${Math.min(100, 18 + (completed % 5) * 17)}%` }} /></div></section>

    <section className="pb-2"><button onClick={() => navigate('/journey')} className="ms-card-soft ms-pressable flex w-full items-center gap-3 p-4 text-left"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"><Target className="h-6 w-6" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-black text-slate-950">Abrir meu universo</span><span className="mt-0.5 block truncate text-xs font-medium text-slate-500">Veja o que já está aceso no seu mapa.</span></span><ChevronRight className="h-5 w-5 text-slate-300" /></button></section>
  </div>
}
