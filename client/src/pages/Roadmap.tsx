import { Link } from 'react-router-dom'
import { ArrowRight, Brain, CheckCircle2, CircleDashed, Flag, Rocket, ShieldCheck, Sparkles, Target } from 'lucide-react'

const PHASES = [
  {
    title: 'Fundação do Learning OS',
    status: 'Concluído',
    description: 'Arquitetura, autenticação, Tutor IA, Learning Core e primeiros motores pedagógicos.',
    items: ['Tutor Socrático', 'Learning Memory', 'Learning DNA', 'Flow Engine', 'Confidence e Curiosity', 'Orchestrator'],
  },
  {
    title: 'Experiência Alpha',
    status: 'Em andamento',
    description: 'Transformar a inteligência do Core em produto visual, navegável e testável.',
    items: ['Dashboard do aluno', 'Learning Passport', 'Jornada', 'Missões', 'Domínio', 'Professor e Família'],
  },
  {
    title: 'Inteligência conectada',
    status: 'Próximo',
    description: 'Trocar dados demonstrativos por dados reais persistidos e produzidos pelo Core.',
    items: ['Eventos reais', 'Mastery persistido', 'Previsões reais', 'Evidence Trail', 'Teacher Copilot real', 'Family Companion real'],
  },
  {
    title: 'Piloto educacional',
    status: 'Planejado',
    description: 'Validar segurança, clareza, impacto e rotina com alunos, professores e responsáveis.',
    items: ['Cohort inicial', 'Protocolo de testes', 'Consentimento', 'Métricas', 'Feedback estruturado', 'Relatório do piloto'],
  },
]

const NOW = [
  { title: 'Navegação e identidade premium', progress: 92 },
  { title: 'Áreas públicas de demonstração', progress: 88 },
  { title: 'Experiência autenticada do aluno', progress: 76 },
  { title: 'Integração real Core → interfaces', progress: 48 },
  { title: 'Prontidão para piloto', progress: 42 },
]

export function RoadmapPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-950 to-secondary-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5">
              <Rocket className="w-4 h-4" /> Roadmap público do MindSteps
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-5">
              Estamos construindo uma infraestrutura de aprendizagem, não apenas um chatbot.
            </h1>
            <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
              Este roadmap mostra o que já foi construído, o que está sendo integrado agora e o caminho até os primeiros pilotos educacionais reais.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link to="/testes" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-950 px-6 py-3 font-bold hover:bg-slate-100 transition-colors">
                Explorar o Alpha <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/piloto" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-bold hover:bg-white/15 transition-colors">
                Ver plano do piloto <Flag className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-white text-primary-700 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-300">Marco atual</p>
                <p className="font-bold text-xl">Alpha integrado e testável</p>
              </div>
            </div>
            <div className="space-y-4">
              {NOW.map((item) => (
                <div key={item.title}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-200">{item.title}</span>
                    <span className="font-bold">{item.progress}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-white" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-5">
          {PHASES.map((phase, index) => (
            <article key={phase.title} className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <StatusBadge status={phase.status} />
              </div>
              <h2 className="font-bold text-slate-900 text-xl">{phase.title}</h2>
              <p className="text-sm text-slate-600 mt-2 mb-5">{phase.description}</p>
              <div className="space-y-2 mt-auto">
                {phase.items.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 grid lg:grid-cols-3 gap-5">
        <RoadmapPrinciple icon={<Brain className="w-5 h-5" />} title="Inteligência antes de volume" text="Cada nova tela deve se conectar a decisões pedagógicas úteis e explicáveis." />
        <RoadmapPrinciple icon={<ShieldCheck className="w-5 h-5" />} title="Segurança antes de escala" text="Crianças, famílias e escolas exigem privacidade, consentimento e limites claros." />
        <RoadmapPrinciple icon={<Sparkles className="w-5 h-5" />} title="Produto completo e acessível" text="Alta potência pedagógica com experiência simples, inclusive em celulares modestos." />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-3xl bg-slate-900 text-white p-7 sm:p-9 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-primary-300 font-semibold mb-2">Próximo grande salto</p>
            <h2 className="text-2xl sm:text-3xl font-bold">Conectar dashboards, Passport, Jornada e Copilots aos dados reais do Core.</h2>
            <p className="text-slate-300 mt-3 max-w-3xl">
              Essa integração transforma as demonstrações atuais em memória pedagógica persistente e prepara o produto para validação longitudinal.
            </p>
          </div>
          <Link to="/inteligencia" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-950 px-6 py-3 font-bold hover:bg-slate-100 transition-colors flex-shrink-0">
            Ver Intelligence Lab <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 text-sm text-slate-500 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p>MindSteps é desenvolvido por Alternative Ventures Ltda.</p>
          <p className="font-medium text-slate-700">CNPJ 61.920.356/0001-38</p>
        </div>
      </section>
    </main>
  )
}

function StatusBadge({ status }: { status: string }) {
  const active = status === 'Concluído' || status === 'Em andamento'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
      {active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CircleDashed className="w-3.5 h-3.5" />}
      {status}
    </span>
  )
}

function RoadmapPrinciple({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
      <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">{icon}</div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-2">{text}</p>
    </div>
  )
}
