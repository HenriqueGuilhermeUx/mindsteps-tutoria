import { Link } from 'react-router-dom'
import { Building2, CheckCircle2, Compass, Lightbulb, Rocket, ShieldCheck, Sparkles, Target } from 'lucide-react'

const PRINCIPLES = [
  {
    title: 'Tecnologia com propósito',
    text: 'Criamos produtos digitais que resolvem problemas reais e ampliam acesso, autonomia e capacidade de decisão.',
    icon: Lightbulb,
  },
  {
    title: 'Construção de longo prazo',
    text: 'O foco não é apenas lançar funcionalidades, mas formar ativos tecnológicos, marcas e plataformas sustentáveis.',
    icon: Compass,
  },
  {
    title: 'Segurança e responsabilidade',
    text: 'Produtos que lidam com dados, educação e inteligência artificial precisam ser explicáveis, cuidadosos e auditáveis.',
    icon: ShieldCheck,
  },
]

const PORTFOLIO = [
  'Tecnologia educacional e inteligência pedagógica',
  'Plataformas de dados pessoais e saúde digital',
  'Fintech, identidade e infraestrutura financeira',
  'Automação, inteligência artificial e produtos digitais',
]

export function CompanyPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-950 to-secondary-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm mb-5">
              <Building2 className="w-4 h-4" /> Empresa desenvolvedora
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">Alternative Ventures Ltda.</h1>
            <p className="text-lg text-slate-200 leading-relaxed max-w-2xl">
              Venture studio brasileira dedicada à criação de produtos digitais, inteligência artificial e plataformas tecnológicas com potencial de impacto amplo e crescimento sustentável.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link to="/testes" className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-950 px-5 py-3 font-bold hover:bg-slate-100 transition-colors">
                <Rocket className="w-5 h-5" /> Explorar MindSteps
              </Link>
              <Link to="/piloto" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15 transition-colors">
                Ver plano do piloto
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-primary-200">Identificação empresarial</p>
            <h2 className="text-2xl font-bold mt-2">Alternative Ventures Ltda.</h2>
            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">CNPJ</p>
              <p className="text-xl font-semibold mt-1">61.920.356/0001-38</p>
            </div>
            <p className="text-sm text-slate-300 mt-5">
              O MindSteps é desenvolvido e evoluído pela Alternative Ventures Ltda., responsável pela visão de produto, arquitetura, tecnologia e expansão da plataforma.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-primary-700 font-semibold mb-2">Nossa forma de construir</p>
          <h2 className="text-3xl font-bold text-slate-900">Produtos completos, ambiciosos e úteis.</h2>
          <p className="text-slate-600 mt-3">
            A Alternative Ventures combina estratégia, design, engenharia e inteligência artificial para criar negócios digitais desde a fundação até a operação.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PRINCIPLES.map((principle) => {
            const Icon = principle.icon
            return (
              <article key={principle.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{principle.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{principle.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
          <div>
            <p className="text-secondary-700 font-semibold mb-2">Áreas de atuação</p>
            <h2 className="text-3xl font-bold text-slate-900">Um portfólio conectado por tecnologia e impacto.</h2>
            <p className="text-slate-600 mt-3">
              Os produtos compartilham visão estratégica, engenharia moderna e uma busca constante por experiências simples sobre sistemas complexos.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {PORTFOLIO.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="font-medium text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="rounded-[2rem] bg-gradient-to-br from-primary-600 to-secondary-700 text-white p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-primary-100 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Produto em evolução contínua</span>
            </div>
            <h2 className="text-3xl font-bold">O MindSteps é uma das plataformas desenvolvidas pela Alternative Ventures.</h2>
            <p className="text-primary-100 mt-3 max-w-3xl">
              A missão é transformar inteligência pedagógica avançada em uma experiência acessível, poderosa e útil para estudantes, educadores, famílias e redes de ensino.
            </p>
          </div>
          <Link to="/inteligencia" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-primary-700 px-5 py-3 font-bold hover:bg-primary-50 transition-colors flex-shrink-0">
            <Target className="w-5 h-5" /> Conhecer o Core
          </Link>
        </div>
      </section>
    </main>
  )
}
