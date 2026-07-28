import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Brain,
  Camera,
  Compass,
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
  { title: 'Enviar uma questão', subtitle: 'Foto, texto ou exercício', icon: Camera, path: '/chat' },
  { title: 'Estudar para uma prova', subtitle: 'Crie um plano simples', icon: GraduationCap, path: '/missoes' },
  { title: 'Perguntar ao tutor', subtitle: 'Aprenda sem medo de errar', icon: MessageCircle, path: '/chat' },
  { title: 'Revisão rápida', subtitle: 'Reforce antes de esquecer', icon: RefreshCw, path: '/missoes' },
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
    return <div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
  }

  const mission = overview?.mission
  const firstName = profile?.name?.split(' ')[0] || 'estudante'

  return (
    <main className="flex-1 bg-[radial-gradient(circle_at_top_left,_#eef2ff,_transparent_34%),radial-gradient(circle_at_top_right,_#ecfeff,_transparent_32%),#f8fafc]">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-28">
        <section className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary-600" /> Seu próximo passo já está pronto
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-slate-950">
            Olá, {firstName}. <span className="text-primary-600">O que vamos descobrir hoje?</span>
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 text-lg">Uma missão curta, ajuda instantânea e um caminho que aprende com você.</p>
        </section>

        {error && <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">{error}</div>}

        <section className="grid lg:grid-cols-[1.55fr_.85fr] gap-6 mb-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 md:p-9 text-white shadow-2xl">
            <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-primary-500/30 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-cyan-200 mb-6"><Target className="w-4 h-4" /> Missão de hoje</div>
              <h2 className="text-2xl md:text-4xl font-bold leading-tight max-w-2xl">{mission?.title || 'Descubra seu próximo passo de aprendizagem'}</h2>
              <p className="mt-4 text-slate-300 max-w-xl">{mission?.description || 'Uma atividade breve para entender onde você está e construir o melhor caminho.'}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-white/10 px-4 py-2">{mission?.subject || overview?.learningProfile?.subjects?.[0] || 'Aprendizagem'}</span>
                <span className="rounded-full bg-white/10 px-4 py-2">{mission?.estimated_minutes || 10} min</span>
                <span className="rounded-full bg-white/10 px-4 py-2">Feita para você</span>
              </div>
              <button onClick={() => navigate('/chat', { state: { mission } })} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-slate-950 hover:scale-[1.02] transition-transform">
                Começar missão <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white bg-white/80 backdrop-blur p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-slate-500">Seu ritmo</p><h3 className="text-xl font-bold text-slate-900">Esta semana</h3></div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center"><Flame className="w-6 h-6 text-orange-500" /></div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-2xl font-bold text-slate-950">{overview?.stats?.missionsCompleted || 0}</div><div className="text-sm text-slate-500">missões concluídas</div></div>
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-2xl font-bold text-slate-950">{overview?.stats?.activePlans || 0}</div><div className="text-sm text-slate-500">plano ativo</div></div>
            </div>
            <div className="mt-5 rounded-2xl border border-primary-100 bg-primary-50 p-4">
              <div className="flex gap-3"><Brain className="w-5 h-5 text-primary-600 mt-0.5" /><div><p className="font-semibold text-slate-900">Seu mapa está crescendo</p><p className="text-sm text-slate-600 mt-1">Cada conversa, missão e revisão ajuda o MindSteps a entender melhor como você aprende.</p></div></div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-end justify-between mb-4"><div><p className="text-sm text-primary-600 font-semibold">Comece em segundos</p><h2 className="text-2xl font-bold text-slate-950">O que você precisa agora?</h2></div></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(({ title, subtitle, icon: Icon, path }) => (
              <button key={title} onClick={() => navigate(path)} className="group text-left rounded-3xl border border-white bg-white/85 p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-primary-50 flex items-center justify-center transition-colors"><Icon className="w-6 h-6 text-slate-700 group-hover:text-primary-600" /></div>
                <h3 className="mt-5 font-bold text-slate-950">{title}</h3><p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          <button onClick={() => navigate('/journey')} className="rounded-3xl bg-white p-6 text-left border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"><Compass className="w-7 h-7 text-primary-600" /><h3 className="mt-4 font-bold text-lg">Meu caminho</h3><p className="mt-1 text-sm text-slate-500">Veja como suas descobertas estão se conectando.</p></button>
          <button onClick={() => navigate('/missoes')} className="rounded-3xl bg-white p-6 text-left border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"><BookOpen className="w-7 h-7 text-cyan-600" /><h3 className="mt-4 font-bold text-lg">Minhas missões</h3><p className="mt-1 text-sm text-slate-500">Continue planos, desafios e revisões.</p></button>
          <button onClick={() => navigate('/passport')} className="rounded-3xl bg-white p-6 text-left border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"><GraduationCap className="w-7 h-7 text-violet-600" /><h3 className="mt-4 font-bold text-lg">Meu passaporte</h3><p className="mt-1 text-sm text-slate-500">Seu histórico pessoal, pronto para acompanhar você.</p></button>
        </section>
      </div>

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl rounded-2xl border border-white/80 bg-white/90 backdrop-blur-xl shadow-2xl px-2 py-2">
        <div className="grid grid-cols-5">
          {[['Hoje', Sparkles, '/hoje'], ['Tutor', MessageCircle, '/chat'], ['Mapa', Compass, '/journey'], ['Missões', Target, '/missoes'], ['Eu', Brain, '/perfil']].map(([label, Icon, path]) => {
            const IconComponent = Icon as typeof Sparkles
            return <button key={label as string} onClick={() => navigate(path as string)} className={`flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium ${path === '/hoje' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-slate-50'}`}><IconComponent className="w-5 h-5" />{label as string}</button>
          })}
        </div>
      </nav>
    </main>
  )
}
