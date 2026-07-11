import { Link } from 'react-router-dom'
import { Award, Brain, CheckCircle2, ClipboardCheck, Eye, FlaskConical, GraduationCap, HeartHandshake, Map, MessageCircle, Rocket, ShieldCheck, SlidersHorizontal, Target } from 'lucide-react'

const TESTS = [
  {
    title: 'Simulador de Cenários',
    description: 'Compare como o Core reage a perfis diferentes de alunos, sem login.',
    route: '/simulador',
    icon: SlidersHorizontal,
    status: 'Público',
  },
  {
    title: 'Intelligence Lab',
    description: 'Veja previsões, evidências e o raciocínio pedagógico do Core sem precisar entrar.',
    route: '/inteligencia',
    icon: Eye,
    status: 'Público',
  },
  {
    title: 'Feedback Lab',
    description: 'Avalie clareza, utilidade, visual e confiança; salve e exporte os resultados.',
    route: '/feedback',
    icon: ClipboardCheck,
    status: 'Público',
  },
  {
    title: 'Tutor Socrático',
    description: 'Converse com a IA e observe perguntas, dicas e sinais do Core.',
    route: '/chat',
    icon: MessageCircle,
    status: 'Disponível',
  },
  {
    title: 'Painel do Aluno',
    description: 'Veja ritmo, foco, Learning DNA e próximos passos.',
    route: '/dashboard',
    icon: Brain,
    status: 'Alpha',
  },
  {
    title: 'Jornada de Aprendizagem',
    description: 'Explore o mapa de conceitos, pré-requisitos e progresso.',
    route: '/journey',
    icon: Map,
    status: 'Alpha',
  },
  {
    title: 'Central de Missões',
    description: 'Teste missões offline, familiares, investigativas e criativas.',
    route: '/missoes',
    icon: Rocket,
    status: 'Alpha',
  },
  {
    title: 'Centro de Domínio',
    description: 'Acompanhe a evolução: aprender, praticar, aplicar, explicar e ensinar.',
    route: '/dominio',
    icon: Target,
    status: 'Alpha',
  },
  {
    title: 'Learning Passport',
    description: 'Visualize identidade pedagógica, competências, conquistas e timeline.',
    route: '/passport',
    icon: Award,
    status: 'Alpha',
  },
  {
    title: 'Teacher Copilot',
    description: 'Conheça os primeiros alertas e recomendações para professores.',
    route: '/professor',
    icon: GraduationCap,
    status: 'Alpha',
  },
  {
    title: 'Family Companion',
    description: 'Veja mensagens positivas e sugestões práticas para responsáveis.',
    route: '/familia',
    icon: HeartHandshake,
    status: 'Alpha',
  },
]

export function TestLabPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-900 to-secondary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5">
              <FlaskConical className="w-4 h-4" /> MindSteps Alpha Lab
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
              O produto já está aberto para testes internos.
            </h1>
            <p className="text-lg text-slate-200 leading-relaxed">
              Agora existem demonstrações públicas, simulador de cenários e coleta estruturada de feedback. Para testar as áreas pessoais, crie uma conta e percorra as experiências abaixo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <Link to="/simulador" className="inline-flex items-center justify-center rounded-xl bg-white text-primary-800 px-6 py-3 font-bold hover:bg-primary-50 transition-colors">
                Abrir simulador público
              </Link>
              <Link to="/feedback" className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white px-6 py-3 font-bold hover:bg-white/15 transition-colors">
                Registrar avaliação
              </Link>
              <Link to="/auth?mode=register" className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white px-6 py-3 font-bold hover:bg-white/15 transition-colors">
                Criar conta de teste
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 sm:p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Como testar melhor</h2>
              <p className="text-sm text-slate-600 mt-1">
                Comece pelo Simulador e pelo Intelligence Lab sem login. Depois crie uma conta, use perguntas reais, simule dificuldade, peça dicas e navegue pelas telas. Ao terminar, registre tudo no Feedback Lab.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTS.map((test) => {
            const Icon = test.icon
            return (
              <div key={test.route} className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold">
                    {test.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{test.title}</h3>
                <p className="text-sm text-slate-600 mt-2 flex-1">{test.description}</p>
                <Link to={test.route} className="inline-flex items-center gap-2 mt-5 text-primary-700 font-bold hover:underline">
                  <CheckCircle2 className="w-4 h-4" /> Abrir teste
                </Link>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
