import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Network,
  School,
  Sparkles,
  Users,
} from 'lucide-react'

type AudienceId = 'aluno' | 'familia' | 'professor' | 'coordenacao' | 'direcao' | 'rede'

type Audience = {
  id: AudienceId
  label: string
  subtitle: string
  icon: typeof BookOpen
  headline: string
  description: string
  outcomes: string[]
  steps: Array<{ title: string; text: string; route: string; cta: string }>
}

const AUDIENCES: Audience[] = [
  {
    id: 'aluno',
    label: 'Aluno',
    subtitle: 'Aprender, descobrir e avançar',
    icon: BookOpen,
    headline: 'Uma jornada que se adapta ao jeito de cada aluno aprender.',
    description: 'O aluno conversa com o Tutor Socrático, recebe pistas em vez de respostas prontas e acompanha domínio, missões, progresso e conquistas.',
    outcomes: ['Mais autonomia', 'Menos medo de errar', 'Próximo passo claro'],
    steps: [
      { title: 'Converse com o Tutor', text: 'O Tutor pergunta, orienta e ajuda o aluno a construir a própria resposta.', route: '/chat', cta: 'Abrir Tutor' },
      { title: 'Veja seu mapa', text: 'A Jornada mostra conceitos dominados, em evolução e os próximos desbloqueios.', route: '/journey', cta: 'Ver Jornada' },
      { title: 'Transforme em ação', text: 'Missões conectam o aprendizado à vida real, à família e a pequenos projetos.', route: '/missoes', cta: 'Abrir Missões' },
    ],
  },
  {
    id: 'familia',
    label: 'Pais e responsáveis',
    subtitle: 'Acompanhar sem pressionar',
    icon: HeartHandshake,
    headline: 'Entender evolução, confiança e persistência — não apenas notas.',
    description: 'A família recebe uma leitura clara do processo de aprendizagem, com sugestões de conversas positivas e atividades simples para apoiar em casa.',
    outcomes: ['Evolução compreensível', 'Conversas melhores', 'Apoio prático em casa'],
    steps: [
      { title: 'Entenda a semana', text: 'Veja sinais de curiosidade, persistência, confiança e autonomia.', route: '/familia', cta: 'Ver visão da família' },
      { title: 'Conheça o perfil', text: 'O Learning Genome mostra hipóteses revisáveis sobre como o aluno aprende melhor.', route: '/genoma', cta: 'Ver Genome' },
      { title: 'Acompanhe a trajetória', text: 'O Passport organiza conquistas, competências, evolução e próximos passos.', route: '/passport', cta: 'Ver Passport' },
    ],
  },
  {
    id: 'professor',
    label: 'Professor',
    subtitle: 'Decidir com mais contexto',
    icon: GraduationCap,
    headline: 'Um copiloto pedagógico para enxergar quem precisa de quê — e por quê.',
    description: 'O professor visualiza sinais de dificuldade, alunos prontos para avançar, grupos possíveis e intervenções sugeridas com trilha de evidências.',
    outcomes: ['Menos tempo em relatórios', 'Intervenções mais precisas', 'Turma mais visível'],
    steps: [
      { title: 'Leia a turma', text: 'O painel destaca riscos, oportunidades e mudanças de confiança.', route: '/professor', cta: 'Abrir Teacher Copilot' },
      { title: 'Entenda as evidências', text: 'O Intelligence Lab mostra como previsões e recomendações são justificadas.', route: '/inteligencia', cta: 'Ver Intelligence Lab' },
      { title: 'Explore conceitos', text: 'O Knowledge Graph conecta pré-requisitos, domínio e próximos conceitos.', route: '/grafo', cta: 'Abrir Knowledge Graph' },
    ],
  },
  {
    id: 'coordenacao',
    label: 'Coordenação',
    subtitle: 'Apoiar professores e turmas',
    icon: Users,
    headline: 'Visão pedagógica para orientar formação, acompanhamento e intervenção.',
    description: 'A coordenação identifica padrões entre turmas, temas críticos, necessidades de apoio e práticas que estão funcionando melhor.',
    outcomes: ['Prioridades claras', 'Apoio ao professor', 'Acompanhamento contínuo'],
    steps: [
      { title: 'Observe as turmas', text: 'Compare confiança, lacunas, alunos em atenção e oportunidades de avanço.', route: '/escola', cta: 'Ver School Intelligence' },
      { title: 'Teste cenários', text: 'Simule diferentes perfis e observe como o Core adapta a estratégia.', route: '/simulador', cta: 'Abrir Simulador' },
      { title: 'Prepare o piloto', text: 'Use o plano de prontidão para organizar critérios, papéis e métricas.', route: '/piloto', cta: 'Ver Pilot Center' },
    ],
  },
  {
    id: 'direcao',
    label: 'Direção escolar',
    subtitle: 'Decidir com visão sistêmica',
    icon: School,
    headline: 'Uma leitura da escola que conecta aprendizagem, confiança e ação pedagógica.',
    description: 'A direção acompanha turmas, identifica gargalos, observa impacto de intervenções e organiza prioridades sem reduzir alunos a um único indicador.',
    outcomes: ['Visão consolidada', 'Gestão pedagógica', 'Critérios para investimento'],
    steps: [
      { title: 'Veja a escola', text: 'Acompanhe indicadores pedagógicos, alertas e oportunidades por turma.', route: '/escola', cta: 'Abrir visão da escola' },
      { title: 'Conheça o roadmap', text: 'Entenda o que já está pronto, o que está em validação e os próximos marcos.', route: '/roadmap', cta: 'Ver Roadmap' },
      { title: 'Valide segurança', text: 'Conheça princípios de IA responsável, supervisão humana e proteção infantil.', route: '/seguranca', cta: 'Ver Segurança' },
    ],
  },
  {
    id: 'rede',
    label: 'Prefeituras e redes',
    subtitle: 'Escalar com governança',
    icon: Landmark,
    headline: 'Inteligência educacional para redes que precisam priorizar, acompanhar e aprender.',
    description: 'Secretarias e mantenedoras visualizam escolas, regiões, prioridades sistêmicas, impacto das intervenções e prontidão para expansão responsável.',
    outcomes: ['Prioridade territorial', 'Governança de piloto', 'Aprendizado em escala'],
    steps: [
      { title: 'Leia a rede', text: 'Compare regiões, escolas, lacunas e oportunidades de intervenção sistêmica.', route: '/rede', cta: 'Abrir Network Intelligence' },
      { title: 'Explore pesquisa', text: 'Veja hipóteses agregadas, coortes e perguntas de pesquisa educacional.', route: '/pesquisa', cta: 'Ver Learning Research' },
      { title: 'Planeje implantação', text: 'Conheça fases, critérios, métricas e salvaguardas do primeiro piloto.', route: '/piloto', cta: 'Planejar piloto' },
    ],
  },
]

export function ProductTourPage() {
  const [selected, setSelected] = useState<AudienceId>('aluno')
  const audience = useMemo(() => AUDIENCES.find((item) => item.id === selected) ?? AUDIENCES[0], [selected])
  const Icon = audience.icon

  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-950 to-secondary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5">
              <Sparkles className="w-4 h-4" /> Tour guiado do MindSteps
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight">Veja o produto pelo olhar de quem vai usá-lo.</h1>
            <p className="text-lg sm:text-xl text-slate-300 mt-6 max-w-3xl leading-relaxed">
              Escolha um perfil e percorra uma jornada curta por aluno, família, professor, coordenação, direção escolar ou rede de ensino.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-10">
          {AUDIENCES.map((item) => {
            const ItemIcon = item.icon
            const active = item.id === selected
            return (
              <button
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`text-left rounded-2xl border p-4 transition-all ${active ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300 hover:shadow-sm'}`}
              >
                <ItemIcon className={`w-5 h-5 mb-3 ${active ? 'text-primary-300' : 'text-primary-600'}`} />
                <p className="font-bold text-sm">{item.label}</p>
                <p className={`text-xs mt-1 ${active ? 'text-slate-300' : 'text-slate-500'}`}>{item.subtitle}</p>
              </button>
            )
          })}
        </div>

        <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-6 sm:p-9 bg-slate-900 text-white">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Icon className="w-7 h-7 text-primary-300" />
              </div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary-300 font-bold">{audience.label}</p>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 leading-tight">{audience.headline}</h2>
              <p className="text-slate-300 mt-5 leading-relaxed">{audience.description}</p>

              <div className="space-y-3 mt-8">
                {audience.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>

              <div className="mt-9 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Acesso ao produto</p>
                <p className="font-semibold mt-1">Login com email e senha já disponível no Alpha.</p>
                <Link to="/auth" className="inline-flex items-center gap-2 mt-4 text-primary-300 font-bold hover:text-white">
                  Entrar ou criar conta <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-9">
              <div className="flex items-center justify-between gap-4 mb-7">
                <div>
                  <p className="text-sm text-slate-500">Tour recomendado</p>
                  <h3 className="text-2xl font-bold text-slate-900">3 passos para conhecer</h3>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                  <Network className="w-4 h-4" /> Produto integrado
                </div>
              </div>

              <div className="space-y-5">
                {audience.steps.map((step, index) => (
                  <div key={step.title} className="rounded-2xl border border-slate-200 p-5 hover:border-primary-300 transition-colors">
                    <div className="flex gap-4">
                      <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold flex-shrink-0">{index + 1}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{step.title}</h4>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">{step.text}</p>
                        <Link to={step.route} className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-primary-700 hover:underline">
                          {step.cta} <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <TourSignal icon={<Building2 className="w-5 h-5" />} title="Para instituições" text="Use o tour para apresentar o MindSteps a escolas, redes e parceiros." />
          <TourSignal icon={<School className="w-5 h-5" />} title="Para pilotos" text="Cada perfil já aponta as telas e critérios mais relevantes para validação." />
          <TourSignal icon={<Landmark className="w-5 h-5" />} title="Para escala pública" text="Rede, segurança, acessibilidade e governança aparecem na mesma jornada." />
        </div>

        <div className="mt-10 rounded-2xl bg-slate-900 text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-bold">Desenvolvido por Alternative Ventures Ltda.</p>
            <p className="text-sm text-slate-400 mt-1">CNPJ 61.920.356/0001-38</p>
          </div>
          <Link to="/testes" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 px-5 py-3 font-bold hover:bg-slate-100">
            Abrir Alpha Lab <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}

function TourSignal({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 flex gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div>
        <p className="font-bold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600 mt-1">{text}</p>
      </div>
    </div>
  )
}
