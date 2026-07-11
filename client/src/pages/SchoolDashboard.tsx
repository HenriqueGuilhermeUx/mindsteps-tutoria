import { Link } from 'react-router-dom'
import { AlertTriangle, BarChart3, BookOpenCheck, Brain, Building2, CheckCircle2, GraduationCap, Layers3, Network, Sparkles, Users } from 'lucide-react'

const CLASSES = [
  { name: '5º Ano A', students: 28, attention: 6, ready: 5, confidence: 74 },
  { name: '6º Ano B', students: 31, attention: 4, ready: 8, confidence: 81 },
  { name: '7º Ano A', students: 29, attention: 9, ready: 3, confidence: 62 },
]

const INSIGHTS = [
  'Frações e razão concentram a maior parte das lacunas de pré-requisito.',
  'Perguntas investigativas aumentam o engajamento em Ciências.',
  'A turma 7º Ano A precisa de intervenção curta antes de avançar em porcentagem.',
  'Cinco alunos podem atuar como pares de apoio em atividades colaborativas.',
]

export function SchoolDashboardPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-900 to-secondary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5">
                <Building2 className="w-4 h-4" /> School Intelligence Alpha
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">Inteligência pedagógica para a escola inteira.</h1>
              <p className="text-lg text-slate-200 max-w-2xl">
                Uma visão consolidada de turmas, riscos, oportunidades, confiança e próximos passos — sem reduzir aprendizagem a nota.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <Link to="/professor" className="inline-flex items-center justify-center rounded-xl bg-white text-primary-800 px-6 py-3 font-bold hover:bg-primary-50 transition-colors">
                  Ver Teacher Copilot
                </Link>
                <Link to="/inteligencia" className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white px-6 py-3 font-bold hover:bg-white/15 transition-colors">
                  Abrir Intelligence Lab
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/15 p-6 backdrop-blur">
              <div className="grid grid-cols-2 gap-4">
                <HeroMetric label="Alunos" value="88" icon={<Users className="w-5 h-5" />} />
                <HeroMetric label="Turmas" value="3" icon={<Layers3 className="w-5 h-5" />} />
                <HeroMetric label="Alertas" value="19" icon={<AlertTriangle className="w-5 h-5" />} />
                <HeroMetric label="Prontos p/ desafio" value="16" icon={<Sparkles className="w-5 h-5" />} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-4 gap-4">
        <MetricCard icon={<Brain className="w-5 h-5" />} label="Confiança média" value="72%" />
        <MetricCard icon={<BookOpenCheck className="w-5 h-5" />} label="Conceitos consolidados" value="41" />
        <MetricCard icon={<Network className="w-5 h-5" />} label="Lacunas críticas" value="7" />
        <MetricCard icon={<GraduationCap className="w-5 h-5" />} label="Intervenções sugeridas" value="12" />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 grid lg:grid-cols-[1.25fr_0.75fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Mapa das turmas</h2>
              <p className="text-sm text-slate-500">Dados demonstrativos para validação de UX.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {CLASSES.map((item) => (
              <div key={item.name} className="p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{item.students} alunos • {item.attention} precisam atenção • {item.ready} prontos para desafio</p>
                  </div>
                  <div className="md:w-64">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Confiança coletiva</span>
                      <span>{item.confidence}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-primary-500" style={{ width: `${item.confidence}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl bg-slate-900 text-white p-6">
            <h2 className="font-bold text-xl mb-4">Insights da rede</h2>
            <div className="space-y-3">
              {INSIGHTS.map((insight) => (
                <div key={insight} className="rounded-2xl bg-white/10 border border-white/10 p-3 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-100">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-2">Próximo avanço</h2>
            <p className="text-sm text-slate-600">
              Conectar este painel aos sinais reais do Orchestrator, agregando dados por turma, escola e rede com explicabilidade.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}

function HeroMetric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
      <div className="text-primary-200 mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-300 mt-1">{label}</p>
    </div>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm">
      <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
