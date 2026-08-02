import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Brain,
  Camera,
  ChevronRight,
  Flame,
  GraduationCap,
  Loader2,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Target,
} from 'lucide-react'
import { operationsApi, type TodayOverview } from '@/lib/api'
import { useAuthStore } from '@/stores'

const quickActions = [
  { title: 'Enviar questão', icon: Camera, path: '/chat', tone: 'bg-cyan-50 text-cyan-700' },
  { title: 'Estudar para prova', icon: GraduationCap, path: '/missoes', tone: 'bg-violet-50 text-violet-700' },
  { title: 'Perguntar ao tutor', icon: MessageCircle, path: '/chat', tone: 'bg-primary-50 text-primary-700' },
  { title: 'Revisão rápida', icon: RefreshCw, path: '/missoes', tone: 'bg-amber-50 text-amber-700' },
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

  if (loading) {
    return <div className="min-h-[60dvh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
  }

  const mission = overview?.mission
  const firstName = profile?.name?.split(' ')[0] || 'estudante'

  return (
    <div className="mx-auto w-full max-w-md px-4 py-5 space-y-5">
      <section>
        <p className="text-sm font-medium text-slate-500">Bom ter você aqui, {firstName}.</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">Qual passo vamos dar hoje?</h2>
      </section>

      {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{error}</div>}

      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-primary-700 p-5 text-white shadow-xl shadow-primary-200/40">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100"><Target className="h-4 w-4" /> Missão de hoje</span>
            <span className="text-xs font-semibold text-indigo-100">{mission?.estimated_minutes || 10} min</span>
          </div>
          <h3 className="mt-5 text-2xl font-bold leading-tight">{mission?.title || 'Descubra seu próximo passo de aprendizagem'}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-indigo-100/90">{mission?.description || 'Uma atividade breve para entender onde você está e construir o melhor caminho.'}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-indigo-100">
            <BookOpen className="h-4 w-4" />
            <span>{mission?.subject || overview?.learningProfile?.subjects?.[0] || 'Aprendizagem'}</span>
          </div>
          <button onClick={() => navigate('/chat', { state: { mission } })} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-bold text-slate-950 active:scale-[0.98] transition-transform">
            Começar missão <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-600">Acesso rápido</p>
            <h3 className="text-lg font-bold text-slate-950">O que você precisa?</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ title, icon: Icon, path, tone }) => (
            <button key={title} onClick={() => navigate(path)} className="min-h-28 rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm active:scale-[0.98] transition-transform">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></span>
              <span className="mt-3 block text-sm font-bold leading-tight text-slate-900">{title}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50"><Flame className="h-5 w-5 text-orange-500" /></span>
            <div><p className="text-sm font-bold text-slate-900">Seu ritmo esta semana</p><p className="text-xs text-slate-500">Pequenos passos contam.</p></div>
          </div>
          <div className="text-right"><p className="text-xl font-black text-slate-950">{overview?.stats?.missionsCompleted || 0}</p><p className="text-[11px] text-slate-500">missões</p></div>
        </div>
      </section>

      <section className="space-y-3">
        <button onClick={() => navigate('/journey')} className="flex w-full items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm active:scale-[0.99]">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50"><Brain className="h-6 w-6 text-primary-600" /></span>
          <span className="min-w-0 flex-1"><span className="block font-bold text-slate-950">Meu mapa de aprendizagem</span><span className="block truncate text-sm text-slate-500">Veja o que está em construção.</span></span>
          <ChevronRight className="h-5 w-5 text-slate-300" />
        </button>
        <button onClick={() => navigate('/passport')} className="flex w-full items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm active:scale-[0.99]">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50"><Sparkles className="h-6 w-6 text-violet-600" /></span>
          <span className="min-w-0 flex-1"><span className="block font-bold text-slate-950">Meu passaporte</span><span className="block truncate text-sm text-slate-500">Sua história de aprendizagem.</span></span>
          <ChevronRight className="h-5 w-5 text-slate-300" />
        </button>
      </section>
    </div>
  )
}
