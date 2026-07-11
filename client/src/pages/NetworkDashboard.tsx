import { Link } from 'react-router-dom'
import { Activity, AlertTriangle, BarChart3, Building2, CheckCircle2, Globe2, Network, School, ShieldCheck, TrendingUp, Users } from 'lucide-react'

const REGIONS = [
  { name: 'Região Central', schools: 12, students: 4280, confidence: 76, attention: 11, growth: '+8%' },
  { name: 'Zona Norte', schools: 9, students: 3160, confidence: 69, attention: 18, growth: '+4%' },
  { name: 'Zona Sul', schools: 11, students: 3970, confidence: 81, attention: 7, growth: '+11%' },
  { name: 'Zona Leste', schools: 8, students: 2740, confidence: 72, attention: 14, growth: '+6%' },
]

const PRIORITIES = [
  {
    title: 'Reforço em razão antes de porcentagem',
    scope: '6 escolas • 18 turmas',
    reason: 'O Core detectou fragilidade recorrente em um pré-requisito crítico.',
    action: 'Aplicar sequência curta de recuperação e medir resposta em 7 dias.',
  },
  {
    title: 'Recuperação de confiança em Matemática',
    scope: '312 estudantes',
    reason: 'Há combinação de carga cognitiva alta, desistência precoce e pouca persistência.',
    action: 'Reduzir dificuldade inicial e usar exemplos concretos com progressão gradual.',
  },
  {
    title: 'Expandir práticas investigativas em Ciências',
    scope: '4 escolas com alto crescimento',
    reason: 'Turmas com missões e perguntas abertas apresentam maior curiosidade e permanência.',
    action: 'Replicar a prática nas demais escolas e acompanhar evidências de impacto.',
  },
]

export function NetworkDashboardPage() {
  const totalSchools = REGIONS.reduce((sum, region) => sum + region.schools, 0)
  const totalStudents = REGIONS.reduce((sum, region) => sum + region.students, 0)

  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-950 to-secondary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5">
                <Network className="w-4 h-4" /> Network Intelligence Alpha
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
                Inteligência pedagógica para uma rede inteira de ensino.
              </h1>
              <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
                Uma visão executiva para secretarias, mantenedoras e redes escolares acompanharem aprendizagem, riscos, oportunidades e impacto das intervenções.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <Link to="/escola" className="inline-flex items-center justify-center rounded-xl bg-white text-primary-900 px-6 py-3 font-bold hover:bg-primary-50 transition-colors">
                  Ver nível escola
                </Link>
                <Link to="/inteligencia" className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 px-6 py-3 font-bold hover:bg-white/15 transition-colors">
                  Abrir Intelligence Lab
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/10 p-6 backdrop-blur">
              <p className="text-sm text-slate-300 mb-4">Visão consolidada da rede</p>
              <div className="grid grid-cols-2 gap-4">
                <HeroMetric icon={<School className="w-5 h-5" />} label="Escolas" value={totalSchools.toString()} />
                <HeroMetric icon={<Users className="w-5 h-5" />} label="Estudantes" value={totalStudents.toLocaleString('pt-BR')} />
                <HeroMetric icon={<TrendingUp className="w-5 h-5" />} label="Evolução média" value="+7,2%" />
                <HeroMetric icon={<ShieldCheck className="w-5 h-5" />} label="Confiança média" value="74%" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-4 gap-4">
        <MetricCard icon={<Building2 className="w-5 h-5" />} label="Escolas acompanhadas" value="40" note="4 regiões" />
        <MetricCard icon={<Activity className="w-5 h-5" />} label="Interações analisadas" value="128 mil" note="últimos 30 dias" />
        <MetricCard icon={<AlertTriangle className="w-5 h-5" />} label="Prioridades críticas" value="3" note="exigem ação coordenada" />
        <MetricCard icon={<CheckCircle2 className="w-5 h-5" />} label="Intervenções positivas" value="68%" note="com melhora observada" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Mapa regional de aprendizagem</h2>
                <p className="text-sm text-slate-500">Dados demonstrativos para validar o produto institucional.</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {REGIONS.map((region) => (
              <div key={region.name} className="p-5 grid sm:grid-cols-[1fr_auto] gap-4 items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-900">{region.name}</h3>
                    <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-xs font-bold">{region.growth}</span>
                  </div>
                  <p className="text-sm text-slate-500">{region.schools} escolas • {region.students.toLocaleString('pt-BR')} estudantes</p>
                  <div className="mt-3 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: `${region.confidence}%` }} />
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm text-slate-500">Confiança média</p>
                  <p className="text-2xl font-bold text-slate-900">{region.confidence}%</p>
                  <p className="text-xs text-amber-700 mt-1">{region.attention}% precisam atenção</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <BarChart3 className="w-6 h-6 text-primary-300" />
            <div>
              <h2 className="font-bold text-lg">Prioridades da rede</h2>
              <p className="text-sm text-slate-300">O que merece coordenação central agora.</p>
            </div>
          </div>
          <div className="space-y-4">
            {PRIORITIES.map((priority, index) => (
              <div key={priority.title} className="rounded-2xl bg-white/10 border border-white/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-bold text-primary-200">{index + 1}</div>
                  <div>
                    <h3 className="font-bold">{priority.title}</h3>
                    <p className="text-xs text-primary-200 mt-1">{priority.scope}</p>
                    <p className="text-sm text-slate-300 mt-2">{priority.reason}</p>
                    <p className="text-sm text-white mt-2"><strong>Ação:</strong> {priority.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 grid md:grid-cols-3 gap-5">
          <Capability title="Política baseada em evidências" text="A rede enxerga quais intervenções funcionam, onde e para quais perfis de estudantes." />
          <Capability title="Equidade operacional" text="O sistema ajuda a localizar escolas, turmas e grupos que precisam de apoio antes que a defasagem aumente." />
          <Capability title="Escala com contexto local" text="A coordenação central acompanha tendências sem perder a realidade específica de cada escola e turma." />
        </div>
      </section>
    </main>
  )
}

function HeroMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
      <div className="text-primary-200 mb-3">{icon}</div>
      <p className="text-xs text-slate-300">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

function MetricCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm">
      <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{note}</p>
    </div>
  )
}

function Capability({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-2">{text}</p>
    </div>
  )
}
