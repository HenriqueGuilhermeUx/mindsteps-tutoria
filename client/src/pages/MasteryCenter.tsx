import { Link } from 'react-router-dom'
import { Award, BookOpenCheck, CheckCircle2, Circle, GraduationCap, Lightbulb, LockKeyhole, MessageSquareText, Repeat2, Sparkles, Target, Trophy } from 'lucide-react'

const CONCEPTS = [
  {
    name: 'Parte e todo',
    subject: 'Matemática',
    score: 94,
    stage: 'Dominado',
    next: 'Aplicar em problemas novos para manter a retenção.',
  },
  {
    name: 'Frações',
    subject: 'Matemática',
    score: 72,
    stage: 'Explicou',
    next: 'Ensinar outra pessoa usando um exemplo próprio.',
  },
  {
    name: 'Razão',
    subject: 'Matemática',
    score: 48,
    stage: 'Praticou',
    next: 'Aplicar o conceito em uma situação diferente.',
  },
  {
    name: 'Porcentagem',
    subject: 'Matemática',
    score: 18,
    stage: 'Introduzido',
    next: 'Revisar razão antes de avançar.',
  },
]

const STAGES = [
  { label: 'Aprendeu', icon: Lightbulb },
  { label: 'Praticou', icon: Repeat2 },
  { label: 'Aplicou', icon: Target },
  { label: 'Explicou', icon: MessageSquareText },
  { label: 'Ensinou', icon: GraduationCap },
  { label: 'Dominou', icon: Trophy },
]

export function MasteryCenterPage() {
  const mastered = CONCEPTS.filter((concept) => concept.score >= 90).length
  const inProgress = CONCEPTS.filter((concept) => concept.score >= 25 && concept.score < 90).length
  const fragile = CONCEPTS.filter((concept) => concept.score < 25).length

  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-900 to-secondary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm mb-4">
                <Award className="w-4 h-4" /> Mastery Center Alpha
              </p>
              <h1 className="text-3xl sm:text-5xl font-bold mb-3">Domínio é mais do que acertar.</h1>
              <p className="text-slate-200 max-w-2xl">
                O MindSteps acompanha se o aluno apenas viu, praticou, aplicou, explicou, ensinou e reteve um conceito antes de considerá-lo realmente dominado.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/15 p-5 backdrop-blur">
              <div className="grid grid-cols-3 gap-3">
                <HeroMetric label="Dominados" value={mastered} />
                <HeroMetric label="Em evolução" value={inProgress} />
                <HeroMetric label="Frágeis" value={fragile} />
              </div>
              <div className="mt-4 rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Próxima prioridade</p>
                <p className="font-bold text-lg">Consolidar Razão antes de Porcentagem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Escada de domínio</h2>
              <p className="text-sm text-slate-500">Cada etapa exige evidências mais fortes de aprendizagem.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {STAGES.map((stage, index) => {
              const Icon = stage.icon
              return (
                <div key={stage.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center relative">
                  <div className="w-10 h-10 rounded-2xl bg-white text-primary-700 flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-slate-800">{stage.label}</p>
                  <p className="text-xs text-slate-500 mt-1">Etapa {index + 1}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 grid lg:grid-cols-[1fr_0.42fr] gap-6">
        <div className="space-y-4">
          {CONCEPTS.map((concept) => (
            <div key={concept.name} className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 text-lg">{concept.name}</h3>
                    <span className="rounded-full bg-primary-50 text-primary-700 px-2 py-1 text-xs font-semibold">{concept.subject}</span>
                    <StageBadge score={concept.score} stage={concept.stage} />
                  </div>
                  <p className="text-sm text-slate-500 mb-3">Próxima evidência: {concept.next}</p>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: `${concept.score}%` }} />
                  </div>
                </div>
                <div className="text-right min-w-20">
                  <p className="text-3xl font-bold text-slate-900">{concept.score}%</p>
                  <p className="text-xs text-slate-500">evidência acumulada</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <Sparkles className="w-6 h-6 text-primary-600 mb-3" />
            <h2 className="font-bold text-slate-900 text-lg mb-2">Por que não usar só nota?</h2>
            <p className="text-sm text-slate-600">
              Uma nota pode mostrar desempenho momentâneo. O Mastery Engine exige aplicação, explicação, ensino e retenção para comprovar domínio real.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-2">Gerar nova evidência</h2>
            <p className="text-sm text-slate-300 mb-4">
              Converse com o tutor, explique um conceito ou conte como aplicou algo fora da tela.
            </p>
            <Link to="/chat" className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-4 py-3 font-semibold hover:bg-slate-100 transition-colors">
              <CheckCircle2 className="w-5 h-5" /> Abrir Tutor
            </Link>
          </div>
        </aside>
      </section>
    </main>
  )
}

function HeroMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-3 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-300">{label}</p>
    </div>
  )
}

function StageBadge({ score, stage }: { score: number; stage: string }) {
  if (score >= 90) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-1 text-xs font-semibold"><CheckCircle2 className="w-3 h-3" /> {stage}</span>
  }

  if (score < 25) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 px-2 py-1 text-xs font-semibold"><LockKeyhole className="w-3 h-3" /> {stage}</span>
  }

  return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-2 py-1 text-xs font-semibold"><Circle className="w-3 h-3" /> {stage}</span>
}
