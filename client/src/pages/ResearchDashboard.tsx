import { Link } from 'react-router-dom'
import { BarChart3, Beaker, Brain, Database, FlaskConical, Lightbulb, Network, ShieldCheck, Sparkles, Target } from 'lucide-react'

const QUESTIONS = [
  {
    question: 'Qual estratégia ajuda mais alunos com dificuldade em frações?',
    finding: 'Analogias concretas seguidas de uma pergunta socrática curta apresentaram melhor resposta no cenário demonstrativo.',
    confidence: 'Moderada',
  },
  {
    question: 'Quando a confiança começa a cair?',
    finding: 'A queda tende a aparecer após repetição de erro sem mudança de estratégia ou sem apoio concreto.',
    confidence: 'Forte',
  },
  {
    question: 'Que tipo de missão aumenta curiosidade?',
    finding: 'Missões investigativas e offline mostram maior potencial quando partem de interesses reais do aluno.',
    confidence: 'Inicial',
  },
]

const COHORTS = [
  { label: 'Matemática 8–10 anos', learners: 126, engagement: 78, recovery: 64 },
  { label: 'Ciências 11–13 anos', learners: 94, engagement: 86, recovery: 71 },
  { label: 'Português 14–16 anos', learners: 81, engagement: 69, recovery: 58 },
]

export function ResearchDashboardPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-primary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5">
              <FlaskConical className="w-4 h-4" /> Learning Research Alpha
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
              Transformando aprendizagem em evidência.
            </h1>
            <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
              Esta demonstração mostra como o MindSteps poderá comparar estratégias, identificar padrões e gerar conhecimento pedagógico sem reduzir o aluno a uma nota.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <Link to="/inteligencia" className="inline-flex items-center justify-center rounded-xl bg-white text-primary-800 px-6 py-3 font-bold hover:bg-primary-50 transition-colors">
                Ver trilha de evidências
              </Link>
              <Link to="/simulador" className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white px-6 py-3 font-bold hover:bg-white/15 transition-colors">
                Comparar cenários
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric icon={<Database className="w-5 h-5" />} label="Interações analisadas" value="18.420" />
        <Metric icon={<Brain className="w-5 h-5" />} label="Estratégias comparadas" value="27" />
        <Metric icon={<Target className="w-5 h-5" />} label="Conceitos observados" value="64" />
        <Metric icon={<Sparkles className="w-5 h-5" />} label="Hipóteses ativas" value="11" />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Beaker className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Perguntas de pesquisa</h2>
              <p className="text-sm text-slate-500">Resultados demonstrativos para validar a experiência.</p>
            </div>
          </div>

          <div className="space-y-4">
            {QUESTIONS.map((item) => (
              <article key={item.question} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <h3 className="font-bold text-slate-900">{item.question}</h3>
                  <span className="rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-bold whitespace-nowrap">{item.confidence}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">{item.finding}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
              <h2 className="font-bold text-lg">Princípios de pesquisa</h2>
            </div>
            <div className="space-y-3 text-sm text-slate-200">
              <p>• Dados agregados e consentimento apropriado.</p>
              <p>• Evidências explicáveis, não decisões opacas.</p>
              <p>• Hipóteses revisáveis, nunca rótulos permanentes.</p>
              <p>• Fator humano preservado em todas as decisões.</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-slate-900">Valor estratégico</h2>
            </div>
            <p className="text-sm text-slate-600">
              A plataforma poderá descobrir quais sequências, analogias e intervenções funcionam melhor por idade, contexto e conceito — sempre tratando os resultados como suporte à decisão humana.
            </p>
          </div>
        </aside>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <BarChart3 className="w-6 h-6 text-primary-700" />
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Coortes demonstrativas</h2>
              <p className="text-sm text-slate-500">Engajamento e recuperação após mudança de estratégia.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {COHORTS.map((cohort) => (
              <div key={cohort.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Network className="w-4 h-4 text-primary-600" />
                  <p className="font-bold text-slate-800">{cohort.label}</p>
                </div>
                <p className="text-sm text-slate-500 mb-3">{cohort.learners} alunos</p>
                <Progress label="Engajamento" value={cohort.engagement} />
                <Progress label="Recuperação" value={cohort.recovery} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm">
      <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

function Progress({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-bold text-slate-800">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full rounded-full bg-primary-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
