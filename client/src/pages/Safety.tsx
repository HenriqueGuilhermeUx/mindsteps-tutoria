import { Link } from 'react-router-dom'
import { AlertTriangle, Brain, CheckCircle2, Eye, FileCheck2, HeartHandshake, LockKeyhole, ShieldCheck, Sparkles, UserCheck } from 'lucide-react'

const PRINCIPLES = [
  {
    title: 'Proteção por padrão',
    text: 'O produto deve coletar apenas o necessário, reduzir exposição e evitar uso de dados para finalidades incompatíveis com aprendizagem.',
    icon: LockKeyhole,
  },
  {
    title: 'IA que orienta, não sentencia',
    text: 'Sinais, previsões e perfis são hipóteses pedagógicas revisáveis. Nunca devem virar rótulos permanentes sobre uma criança.',
    icon: Brain,
  },
  {
    title: 'Adultos no circuito',
    text: 'Professores e responsáveis recebem contexto, evidências e sugestões para apoiar decisões humanas, não para substituí-las.',
    icon: UserCheck,
  },
  {
    title: 'Transparência proporcional',
    text: 'O sistema deve explicar, em linguagem compreensível, quais sinais foram usados e por que uma recomendação foi apresentada.',
    icon: Eye,
  },
]

const SAFEGUARDS = [
  'Dados de demonstração claramente identificados nas áreas públicas.',
  'Predições acompanhadas por nível de confiança e trilha de evidências.',
  'Perfis pedagógicos tratados como dinâmicos e corrigíveis.',
  'Separação entre experiência do aluno e visões institucionais.',
  'Testes progressivos antes de qualquer piloto com crianças.',
  'Revisão humana para decisões pedagógicas relevantes.',
]

const ROADMAP = [
  { title: 'Agora', text: 'Ambiente Alpha, dados simulados em demonstrações, protocolo de testes e feedback estruturado.' },
  { title: 'Antes do piloto', text: 'Políticas formais, consentimento, controles de acesso, retenção de dados, auditoria e resposta a incidentes.' },
  { title: 'Durante o piloto', text: 'Acompanhamento próximo, canal de suporte, métricas de segurança e revisão periódica das recomendações.' },
  { title: 'Em escala', text: 'Governança contínua, relatórios de impacto, revisão independente e melhoria baseada em evidências.' },
]

export function SafetyPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-950 to-secondary-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm mb-5">
                <ShieldCheck className="w-4 h-4" /> Segurança e IA responsável
              </p>
              <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-5">
                Crescer com potência, sem abrir mão de proteção.
              </h1>
              <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
                O MindSteps foi concebido para crianças, adolescentes, famílias e educadores. Por isso, segurança, transparência e supervisão humana precisam evoluir junto com o produto.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link to="/protocolo" className="inline-flex items-center justify-center rounded-xl bg-white text-slate-950 px-6 py-3 font-bold hover:bg-slate-100 transition-colors">
                  Ver protocolo de testes
                </Link>
                <Link to="/piloto" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-bold hover:bg-white/15 transition-colors">
                  Ver critérios do piloto
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="w-14 h-14 rounded-2xl bg-emerald-400/15 text-emerald-300 flex items-center justify-center mb-5">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Princípio central</h2>
              <p className="text-slate-200 leading-relaxed">
                A IA pode ampliar a capacidade de perceber, personalizar e apoiar. A responsabilidade pelas decisões importantes continua sendo humana.
              </p>
              <div className="mt-5 rounded-2xl bg-slate-950/40 p-4 text-sm text-slate-300">
                Desenvolvido por Alternative Ventures Ltda.<br />CNPJ 61.920.356/0001-38
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-primary-700 font-bold mb-2">Fundamentos</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950">Como queremos construir</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {PRINCIPLES.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
                <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-600 mt-2 leading-relaxed">{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
          <div>
            <p className="text-emerald-700 font-bold mb-2">Proteções já incorporadas ao Alpha</p>
            <h2 className="text-3xl font-bold text-slate-950 mb-4">Segurança como parte do produto</h2>
            <p className="text-slate-600 leading-relaxed">
              Esta página não representa uma certificação ou política jurídica final. Ela registra compromissos de produto e o caminho de maturidade necessário antes de uso amplo.
            </p>
            <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-100 p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                As demonstrações públicas podem utilizar dados simulados. Nenhuma decisão escolar real deve ser tomada com base nelas.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {SAFEGUARDS.map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-secondary-100 text-secondary-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Maturidade progressiva</p>
            <h2 className="text-2xl font-bold text-slate-950">Caminho de governança</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {ROADMAP.map((item, index) => (
            <div key={item.title} className="rounded-3xl bg-slate-900 text-white p-5">
              <span className="inline-flex w-8 h-8 rounded-xl bg-white/10 items-center justify-center text-sm font-bold mb-4">{index + 1}</span>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-[2rem] bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-primary-100 mb-2">
              <HeartHandshake className="w-5 h-5" /> Compromisso público
            </div>
            <h2 className="text-3xl font-bold">Tecnologia poderosa precisa merecer confiança.</h2>
            <p className="text-white/80 mt-2 max-w-2xl">A evolução da segurança será publicada junto com o roadmap do produto.</p>
          </div>
          <Link to="/roadmap" className="inline-flex items-center justify-center rounded-xl bg-white text-primary-700 px-6 py-3 font-bold hover:bg-primary-50 transition-colors flex-shrink-0">
            Acompanhar evolução
          </Link>
        </div>
      </section>
    </main>
  )
}
