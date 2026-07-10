import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useAuthStore, useChatStore } from '@/stores'
import { CheckCircle2, Clock3, Compass, FlaskConical, HeartHandshake, Lightbulb, MessageSquareText, Rocket, Sparkles, Trophy } from 'lucide-react'

type MissionStatus = 'available' | 'active' | 'completed'

type Mission = {
  id: string
  title: string
  description: string
  category: string
  xp: number
  time: string
  status: MissionStatus
  icon: React.ComponentType<{ className?: string }>
  prompt: string
}

const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'offline-object',
    title: 'Explique com um objeto real',
    description: 'Escolha um conceito difícil e use um objeto da sua casa para explicar como ele funciona.',
    category: 'Offline',
    xp: 30,
    time: '10 min',
    status: 'available',
    icon: Compass,
    prompt: 'Quero fazer a missão offline: explicar um conceito usando um objeto real.',
  },
  {
    id: 'family-story',
    title: 'Pergunte como alguém aprendeu',
    description: 'Converse com uma pessoa da família sobre algo difícil que ela aprendeu e como conseguiu.',
    category: 'Família',
    xp: 25,
    time: '15 min',
    status: 'available',
    icon: HeartHandshake,
    prompt: 'Quero fazer a missão família: descobrir como alguém aprendeu algo difícil.',
  },
  {
    id: 'curiosity-question',
    title: 'Crie uma pergunta investigativa',
    description: 'Observe algo ao seu redor e crie uma pergunta que não possa ser respondida apenas com sim ou não.',
    category: 'Curiosidade',
    xp: 20,
    time: '5 min',
    status: 'available',
    icon: Sparkles,
    prompt: 'Quero fazer a missão curiosidade e criar uma pergunta investigativa.',
  },
  {
    id: 'mini-experiment',
    title: 'Mini experimento seguro',
    description: 'Escolha um fenômeno simples, faça uma hipótese e registre o que aconteceu.',
    category: 'Ciências',
    xp: 40,
    time: '20 min',
    status: 'available',
    icon: FlaskConical,
    prompt: 'Quero montar um mini experimento seguro com hipótese, observação e conclusão.',
  },
]

export function MissionCenterPage() {
  const { profile, addXP } = useAuthStore()
  const { setSubject } = useChatStore()
  const [missions, setMissions] = useState(INITIAL_MISSIONS)

  const stats = useMemo(() => {
    const completed = missions.filter((mission) => mission.status === 'completed').length
    const active = missions.filter((mission) => mission.status === 'active').length
    const totalXp = missions.filter((mission) => mission.status === 'completed').reduce((sum, mission) => sum + mission.xp, 0)
    return { completed, active, totalXp }
  }, [missions])

  const activateMission = (id: string) => {
    setMissions((current) => current.map((mission) => mission.id === id ? { ...mission, status: 'active' } : mission))
  }

  const completeMission = (id: string) => {
    const mission = missions.find((item) => item.id === id)
    if (!mission || mission.status === 'completed') return

    setMissions((current) => current.map((item) => item.id === id ? { ...item, status: 'completed' } : item))
    addXP(mission.xp)
  }

  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[1.3fr_0.7fr] gap-6 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm mb-4">
              <Rocket className="w-4 h-4" /> Mission Center Alpha
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">Aprender também acontece fora da tela.</h1>
            <p className="text-primary-100 max-w-2xl">
              As missões transformam conceitos em investigação, conversa, criação, prática e explicação própria.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 border border-white/15 p-5">
            <p className="text-sm text-primary-100">Progresso de {profile?.name || 'estudante'}</p>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <MissionStat label="Ativas" value={stats.active} />
              <MissionStat label="Concluídas" value={stats.completed} />
              <MissionStat label="XP ganho" value={stats.totalXp} />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-5">
          {missions.map((mission) => {
            const Icon = mission.icon
            return (
              <article key={mission.id} className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <StatusPill status={mission.status} />
                </div>

                <div className="mt-5">
                  <p className="text-xs uppercase tracking-wide font-semibold text-primary-600">{mission.category}</p>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{mission.title}</h2>
                  <p className="text-slate-600 mt-2">{mission.description}</p>
                </div>

                <div className="flex flex-wrap gap-3 mt-4 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1"><Clock3 className="w-4 h-4" /> {mission.time}</span>
                  <span className="inline-flex items-center gap-1"><Trophy className="w-4 h-4" /> +{mission.xp} XP</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {mission.status === 'available' && (
                    <button onClick={() => activateMission(mission.id)} className="rounded-xl bg-primary-600 text-white px-4 py-2.5 font-semibold hover:bg-primary-700 transition-colors">
                      Começar missão
                    </button>
                  )}
                  {mission.status === 'active' && (
                    <button onClick={() => completeMission(mission.id)} className="inline-flex items-center gap-2 rounded-xl bg-accent-600 text-white px-4 py-2.5 font-semibold hover:bg-accent-700 transition-colors">
                      <CheckCircle2 className="w-5 h-5" /> Marcar como concluída
                    </button>
                  )}
                  <Link
                    to="/chat"
                    onClick={() => setSubject(mission.category === 'Ciências' ? 'ciencias' : 'geral')}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 text-slate-700 px-4 py-2.5 font-semibold hover:bg-slate-200 transition-colors"
                    state={{ suggestedPrompt: mission.prompt }}
                  >
                    <MessageSquareText className="w-5 h-5" /> Fazer com o Tutor
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-amber-700 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-amber-900">Como validar esta tela</h2>
              <p className="text-sm text-amber-800 mt-1">Teste se as missões parecem claras, realizáveis, interessantes e adequadas para diferentes idades.</p>
            </div>
          </div>
          <Link to="/passport" className="font-semibold text-amber-900 hover:underline">Ver no Passport →</Link>
        </div>
      </section>
    </main>
  )
}

function MissionStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
      <p className="text-xs text-primary-100">{label}</p>
      <p className="font-bold text-xl">{value}</p>
    </div>
  )
}

function StatusPill({ status }: { status: MissionStatus }) {
  const styles = status === 'completed'
    ? 'bg-green-50 text-green-700'
    : status === 'active'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-slate-100 text-slate-600'

  const label = status === 'completed' ? 'Concluída' : status === 'active' ? 'Em andamento' : 'Disponível'

  return <span className={`rounded-full px-3 py-1 text-sm font-semibold ${styles}`}>{label}</span>
}
