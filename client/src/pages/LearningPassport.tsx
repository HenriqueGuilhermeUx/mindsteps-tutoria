import { Link } from 'react-router-dom'
import { useAuthStore, useChatStore } from '@/stores'
import { Award, Brain, CalendarDays, CheckCircle2, Compass, Flame, HeartHandshake, Map, Rocket, Sparkles, Target, Trophy } from 'lucide-react'

const SKILLS = [
  { name: 'Frações', level: 72, status: 'em consolidação' },
  { name: 'Interpretação textual', level: 58, status: 'precisa evidências' },
  { name: 'Curiosidade científica', level: 86, status: 'força ativa' },
  { name: 'Persistência', level: 79, status: 'evoluindo bem' },
]

const TIMELINE = [
  { title: 'Fez uma pergunta importante', text: 'Transformou dúvida em investigação.', icon: Sparkles },
  { title: 'Superou uma dificuldade', text: 'Persistiu mesmo quando o conteúdo ficou difícil.', icon: Flame },
  { title: 'Recebeu nova missão', text: 'Aplicar o aprendizado fora da tela.', icon: Rocket },
  { title: 'DNA atualizado', text: 'O sistema refinou hipóteses sobre como aprende melhor.', icon: Brain },
]

const BADGES = ['Explorador', 'Persistente', 'Curioso', 'Pensador Socrático']

export function LearningPassportPage() {
  const { profile } = useAuthStore()
  const { subject, messages } = useChatStore()
  const userMessages = messages.filter((message) => message.role === 'user').length

  return (
    <main className="flex-1 bg-slate-50">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 via-primary-800 to-secondary-800 text-white shadow-xl">
          <div className="p-6 sm:p-8 grid lg:grid-cols-[1fr_0.8fr] gap-6 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm mb-4">
                <Award className="w-4 h-4" /> Learning Passport Alpha
              </p>
              <h1 className="text-3xl sm:text-5xl font-bold mb-3">Passaporte de Aprendizagem</h1>
              <p className="text-slate-200 max-w-2xl">
                Uma identidade viva de aprendizagem: como o aluno aprende, evolui, persiste, pergunta, descobre e aplica conhecimento.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/15 p-5 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-3xl bg-white text-primary-700 flex items-center justify-center text-4xl font-bold">
                  {(profile?.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-slate-200">Estudante</p>
                  <h2 className="text-2xl font-bold">{profile?.name || 'Aluno MindSteps'}</h2>
                  <p className="text-slate-200">Nível {profile?.level ?? 1} • {profile?.xp ?? 0} XP</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                <PassportStat label="Streak" value={profile?.streak ?? 0} />
                <PassportStat label="Interações" value={userMessages} />
                <PassportStat label="Foco" value={subject} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Meu jeito de aprender</h2>
                <p className="text-sm text-slate-500">Hipóteses iniciais do Learning DNA.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Trait icon={<Map className="w-4 h-4" />} label="Visual" value="82%" />
              <Trait icon={<Sparkles className="w-4 h-4" />} label="Curiosidade" value="88%" />
              <Trait icon={<Compass className="w-4 h-4" />} label="Analogias" value="76%" />
              <Trait icon={<HeartHandshake className="w-4 h-4" />} label="Projetos" value="68%" />
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 text-lg mb-4">Conquistas</h2>
            <div className="flex flex-wrap gap-2">
              {BADGES.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 px-3 py-2 text-sm font-semibold">
                  <Trophy className="w-4 h-4" /> {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-accent-100 text-accent-700 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Competências em evolução</h2>
              <p className="text-sm text-slate-500">Visual Alpha para testar a experiência do Passport.</p>
            </div>
          </div>

          <div className="space-y-5">
            {SKILLS.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <p className="font-semibold text-slate-800">{skill.name}</p>
                    <p className="text-xs text-slate-500">{skill.status}</p>
                  </div>
                  <span className="text-sm font-bold text-primary-700">{skill.level}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-primary-500" style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <CalendarDays className="w-6 h-6 text-primary-600" />
            <h2 className="font-bold text-slate-900 text-lg">Timeline de aprendizagem</h2>
          </div>
          <div className="space-y-4">
            {TIMELINE.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    {index < TIMELINE.length - 1 && <div className="w-px flex-1 bg-slate-200 my-2" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-sm">
          <h2 className="font-bold text-xl mb-3">Próxima missão</h2>
          <p className="text-slate-300 mb-5">
            Escolha um conceito difícil e explique para alguém usando um objeto real. Depois volte ao Tutor e conte como foi.
          </p>
          <div className="rounded-2xl bg-white/10 border border-white/10 p-4 mb-5">
            <p className="text-sm text-slate-300 mb-1">Objetivo pedagógico</p>
            <p className="font-semibold">Transformar conhecimento em explicação própria.</p>
          </div>
          <Link to="/chat" className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 font-semibold px-5 py-3 hover:bg-slate-100 transition-colors">
            <CheckCircle2 className="w-5 h-5" /> Registrar no Tutor
          </Link>
        </div>
      </section>
    </main>
  )
}

function PassportStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
      <p className="text-xs text-slate-300">{label}</p>
      <p className="font-bold text-lg capitalize">{value}</p>
    </div>
  )
}

function Trait({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
