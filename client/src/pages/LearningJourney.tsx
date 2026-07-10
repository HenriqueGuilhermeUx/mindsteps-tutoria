import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { ArrowRight, BookOpen, CheckCircle2, Circle, Compass, Lock, Map, Rocket, Sparkles, Target } from 'lucide-react'

const JOURNEY = [
  { title: 'Números e operações', status: 'mastered', progress: 100, description: 'Base consolidada para avançar.' },
  { title: 'Frações', status: 'learning', progress: 72, description: 'Em consolidação com exemplos concretos.' },
  { title: 'Razão', status: 'next', progress: 28, description: 'Próximo conceito recomendado pelo mapa.' },
  { title: 'Porcentagem', status: 'locked', progress: 0, description: 'Será liberado após maior segurança em razão.' },
  { title: 'Probabilidade', status: 'locked', progress: 0, description: 'Depende de frações e comparação de quantidades.' },
]

const STATUS_STYLES = {
  mastered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  learning: 'bg-primary-100 text-primary-700 border-primary-200',
  next: 'bg-amber-100 text-amber-700 border-amber-200',
  locked: 'bg-slate-100 text-slate-500 border-slate-200',
}

export function LearningJourneyPage() {
  const { profile } = useAuthStore()

  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-900 to-secondary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm mb-4">
              <Map className="w-4 h-4" /> Learning Journey Alpha
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">Sua jornada de aprendizagem</h1>
            <p className="text-slate-200 max-w-2xl">
              O MindSteps conecta conceitos, identifica pré-requisitos e sugere o próximo passo sem transformar aprendizagem em uma corrida por notas.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 border border-white/15 p-5">
            <p className="text-sm text-slate-300">Jornada atual de</p>
            <p className="text-2xl font-bold">{profile?.name || 'Aluno MindSteps'}</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <JourneyStat label="Dominados" value="1" />
              <JourneyStat label="Em curso" value="1" />
              <JourneyStat label="Próximos" value="3" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Mapa de Matemática</h2>
              <p className="text-sm text-slate-500">Primeira visualização do Learning Graph.</p>
            </div>
          </div>

          <div className="space-y-4">
            {JOURNEY.map((step, index) => (
              <div key={step.title} className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${STATUS_STYLES[step.status as keyof typeof STATUS_STYLES]}`}>
                    {step.status === 'mastered' ? <CheckCircle2 className="w-5 h-5" /> :
                     step.status === 'locked' ? <Lock className="w-5 h-5" /> :
                     step.status === 'next' ? <Target className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  {index < JOURNEY.length - 1 && <div className="w-px flex-1 min-h-10 bg-slate-200 my-2" />}
                </div>

                <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-4 mb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <p className="font-bold text-slate-900">{step.title}</p>
                      <p className="text-sm text-slate-500">{step.description}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-600">{step.progress}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white overflow-hidden border border-slate-100">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: `${step.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <h2 className="font-bold text-slate-900 text-lg">Próxima melhor ação</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Antes de avançar para porcentagem, fortaleça a relação entre fração e razão usando uma situação real.
            </p>
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 mb-4">
              <p className="text-sm text-amber-700 font-semibold mb-1">Missão sugerida</p>
              <p className="text-sm text-amber-900">Compare 2 copos de água para cada 1 copo de suco e explique a relação.</p>
            </div>
            <Link to="/chat" className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:underline">
              Abrir no Tutor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="w-6 h-6 text-primary-300" />
              <h2 className="font-bold text-lg">Como o mapa decide</h2>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <p>1. Observa conceitos já praticados.</p>
              <p>2. Verifica confiança e carga cognitiva.</p>
              <p>3. Analisa pré-requisitos no Learning Graph.</p>
              <p>4. Recomenda o próximo passo mais seguro.</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <h2 className="font-bold text-slate-900">Importante</h2>
            </div>
            <p className="text-sm text-slate-600">
              Esta versão Alpha usa dados demonstrativos. A próxima etapa é alimentar o mapa com eventos reais persistidos pelo backend.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}

function JourneyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
      <p className="text-xs text-slate-300">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}
