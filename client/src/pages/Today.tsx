import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Camera,
  ChevronRight,
  Flame,
  Gamepad2,
  GraduationCap,
  Loader2,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react'
import { operationsApi, type TodayOverview } from '@/lib/api'
import { useAuthStore } from '@/stores'

const quickActions = [
  { title: 'Mandar uma questão', subtitle: 'Foto ou texto', icon: Camera, path: '/chat', tone: 'from-cyan-400 to-sky-500' },
  { title: 'Estudar pra prova', subtitle: 'Plano rápido', icon: GraduationCap, path: '/missoes', tone: 'from-violet-500 to-purple-500' },
  { title: 'Falar com o tutor', subtitle: 'Pergunte sem medo', icon: MessageCircle, path: '/chat', tone: 'from-indigo-500 to-blue-500' },
  { title: 'Revisão relâmpago', subtitle: 'Só alguns minutos', icon: RefreshCw, path: '/missoes', tone: 'from-amber-400 to-orange-500' },
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
    return <div className="flex min-h-[60dvh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
  }

  const mission = overview?.mission
  const firstName = profile?.name?.split(' ')[0] || 'estudante'
  const completed = overview?.stats?.missionsCompleted || 0

  return (
    <div className="mx-auto w-full max-w-md space-y-5 px-4 py-4">
      <section className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Vamos nessa, {firstName}?</p>
          <h2 className="mt-0.5 text-2xl font-black tracking-tight text-slate-950">Seu próximo passo está aqui.</h2>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center rounded-3xl bg-yellow-100 sm:flex">
          <Sparkles className="h-6 w-6 text-yellow-600" />
        </div>
      </section>

      {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">{error}</div>}

      <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-5 text-white shadow-xl shadow-violet-200/70">
        <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/15" />
        <div className="absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-indigo-300/20" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-extrabold backdrop-blur">
              <Target className="h-4 w-4" /> Missão de hoje
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">{mission?.estimated_minutes || 10} min</span>
          </div>

          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
              <Gamepad2 className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-black leading-tight">{mission?.title || 'Descobrir seu próximo desafio'}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-5 text-white/85">{mission?.description || 'Uma atividade curta para aprender, praticar e avançar.'}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/85">
            <BookOpen className="h-4 w-4" />
            <span>{mission?.subject || overview?.learningProfile?.subjects?.[0] || 'Aprendizagem'}</span>
          </div>

          <button
            onClick={() => navigate('/chat', { state: { mission } })}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-base font-black text-violet-700 shadow-lg active:scale-[0.98]"
          >
            Começar agora <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-950">O que você quer fazer?</h3>
          <span className="text-xs font-bold text-slate-400">toque para abrir</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ title, subtitle, icon: Icon, path, tone }) => (
            <button
              key={title}
              onClick={() => navigate(path)}
              className="rounded-[26px] bg-white p-3.5 text-left shadow-sm ring-1 ring-slate-200/70 active:scale-[0.97]"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-sm`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="mt-3 block text-sm font-black leading-tight text-slate-900">{title}</span>
              <span className="mt-1 block text-xs font-medium text-slate-500">{subtitle}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-[26px] bg-orange-50 p-4 ring-1 ring-orange-100">
          <div className="flex items-center gap-2 text-orange-600"><Flame className="h-5 w-5" /><span className="text-xs font-extrabold uppercase tracking-wide">Seu ritmo</span></div>
          <p className="mt-3 text-3xl font-black text-slate-950">{completed}</p>
          <p className="text-xs font-semibold text-slate-500">missões concluídas</p>
        </div>
        <div className="rounded-[26px] bg-emerald-50 p-4 ring-1 ring-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600"><Trophy className="h-5 w-5" /><span className="text-xs font-extrabold uppercase tracking-wide">Próxima meta</span></div>
          <p className="mt-3 text-3xl font-black text-slate-950">{Math.max(1, 3 - (completed % 3))}</p>
          <p className="text-xs font-semibold text-slate-500">passos para avançar</p>
        </div>
      </section>

      <section className="space-y-3">
        <button onClick={() => navigate('/journey')} className="flex w-full items-center gap-3 rounded-[26px] bg-white p-4 text-left shadow-sm ring-1 ring-slate-200/70 active:scale-[0.99]">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50"><Target className="h-6 w-6 text-indigo-600" /></span>
          <span className="min-w-0 flex-1"><span className="block font-black text-slate-950">Meu mapa</span><span className="block truncate text-sm font-medium text-slate-500">Veja o que você já desbloqueou.</span></span>
          <ChevronRight className="h-5 w-5 text-slate-300" />
        </button>
        <button onClick={() => navigate('/passport')} className="flex w-full items-center gap-3 rounded-[26px] bg-white p-4 text-left shadow-sm ring-1 ring-slate-200/70 active:scale-[0.99]">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-50"><Sparkles className="h-6 w-6 text-fuchsia-600" /></span>
          <span className="min-w-0 flex-1"><span className="block font-black text-slate-950">Meu passaporte</span><span className="block truncate text-sm font-medium text-slate-500">Sua história crescendo com você.</span></span>
          <ChevronRight className="h-5 w-5 text-slate-300" />
        </button>
      </section>
    </div>
  )
}
