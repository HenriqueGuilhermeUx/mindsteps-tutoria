import { Link } from 'react-router-dom'
import { useAuthStore, useChatStore } from '@/stores'
import { Brain, Compass, Flame, HeartHandshake, Lightbulb, Rocket, Sparkles, Target, Trophy, Zap } from 'lucide-react'

const DNA_ITEMS = [
  { label: 'Visual', value: 82 },
  { label: 'Analogias', value: 76 },
  { label: 'Projetos', value: 68 },
  { label: 'Curiosidade', value: 88 },
]

const MISSIONS = [
  {
    title: 'Missão Matemática',
    description: 'Explique uma fração usando um objeto da sua casa.',
    icon: Target,
  },
  {
    title: 'Missão Curiosidade',
    description: 'Faça uma pergunta sobre algo que você viu hoje.',
    icon: Sparkles,
  },
  {
    title: 'Missão Offline',
    description: 'Converse com alguém da família sobre como essa pessoa aprendeu algo difícil.',
    icon: HeartHandshake,
  },
]

export function LearningDashboardPage() {
  const { profile } = useAuthStore()
  const { subject, messages } = useChatStore()

  const interactionCount = messages.filter((message) => message.role === 'user').length
  const hasStarted = interactionCount > 0

  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm mb-4">
                <Brain className="w-4 h-4" /> Painel Alpha do Aluno
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Olá, {profile?.name || 'estudante'}! Este é o seu mapa de aprendizagem.
              </h1>
              <p className="text-primary-50 max-w-2xl">
                Aqui vamos transformar as conversas com o tutor em sinais claros: confiança, curiosidade, ritmo, missões e próximos passos.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/chat" className="bg-white text-primary-700 font-semibold rounded-xl px-5 py-3 hover:bg-primary-50 transition-colors">
                  Abrir Tutor
                </Link>
                <a href="#missoes" className="bg-white/10 text-white font-semibold rounded-xl px-5 py-3 hover:bg-white/20 transition-colors">
                  Ver missões
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/15 p-5 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-primary-700 flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-primary-100">Status de hoje</p>
                  <p className="font-bold text-xl">{hasStarted ? 'Aprendizagem ativa' : 'Pronto para começar'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <HeroStat label="XP" value={profile?.xp ?? 0} />
                <HeroStat label="Nível" value={profile?.level ?? 1} />
                <HeroStat label="Interações" value={interactionCount} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-3 gap-5">
        <DashboardCard
          icon={<Flame className="w-5 h-5" />}
          title="Ritmo"
          value={`${profile?.streak ?? 0} dias`}
          description="Sequência de uso e constância de aprendizagem."
        />
        <DashboardCard
          icon={<Compass className="w-5 h-5" />}
          title="Matéria atual"
          value={subject}
          description="O Core ajusta a estratégia conforme o tema da conversa."
        />
        <DashboardCard
          icon={<Lightbulb className="w-5 h-5" />}
          title="Próximo passo"
          value={hasStarted ? 'Refletir e praticar' : 'Começar conversa'}
          description="A próxima ação será refinada pelos sinais do tutor."
        />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 grid lg:grid-cols-[1fr_1fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg">Learning DNA</h2>
              <p className="text-sm text-slate-500">Hipóteses iniciais, não rótulos fixos.</p>
            </div>
          </div>

          <div className="space-y-4">
            {DNA_ITEMS.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{item.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-primary-500" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="missoes" className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-accent-100 text-accent-700 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg">Missões de hoje</h2>
              <p className="text-sm text-slate-500">Atividades simples para levar o aprendizado para a vida real.</p>
            </div>
          </div>

          <div className="space-y-3">
            {MISSIONS.map((mission) => {
              const Icon = mission.icon
              return (
                <div key={mission.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{mission.title}</p>
                    <p className="text-sm text-slate-600">{mission.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="rounded-3xl bg-slate-900 text-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-bold text-xl mb-1">Pronto para testar o Core?</h2>
            <p className="text-slate-300">Converse com o tutor e observe como os sinais pedagógicos aparecem no chat.</p>
          </div>
          <Link to="/chat" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 font-semibold px-5 py-3 hover:bg-slate-100 transition-colors">
            <Zap className="w-5 h-5" /> Começar agora
          </Link>
        </div>
      </section>
    </main>
  )
}

function HeroStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
      <p className="text-xs text-primary-100">{label}</p>
      <p className="font-bold text-xl">{value}</p>
    </div>
  )
}

function DashboardCard({ icon, title, value, description }: { icon: React.ReactNode; title: string; value: string | number; description: string }) {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm">
      <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800 capitalize">{value}</p>
      <p className="text-sm text-slate-500 mt-2">{description}</p>
    </div>
  )
}
