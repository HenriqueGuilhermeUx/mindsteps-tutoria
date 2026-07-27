import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  Landmark,
  PlayCircle,
  School,
  Sparkles,
  Users,
} from 'lucide-react'

type AudienceId = 'aluno' | 'familia' | 'professor' | 'coordenacao' | 'direcao' | 'rede'

type Journey = {
  label: string
  icon: typeof BookOpen
  promise: string
  destination: string
  registration: string[]
  firstWeek: string[]
  modules: Array<{ title: string; description: string; duration: string }>
}

const JOURNEYS: Record<AudienceId, Journey> = {
  aluno: {
    label: 'Aluno', icon: Sparkles, destination: '/dashboard',
    promise: 'Aprenda com um tutor que adapta o apoio e mostra seu progresso sem comparar você com outras pessoas.',
    registration: ['Escolha “Aluno” no cadastro', 'Confirme seu acesso', 'Conte seus objetivos de aprendizagem', 'Faça a primeira missão guiada'],
    firstWeek: ['Conversar com o tutor', 'Pedir outro exemplo quando necessário', 'Entender domínio, missões e trilhas', 'Revisar uma aprendizagem'],
    modules: [
      { title: 'Primeiros passos', description: 'Conheça o tutor, o painel e sua primeira missão.', duration: '5 min' },
      { title: 'Como pedir ajuda', description: 'Aprenda a explicar sua tentativa e pedir outra abordagem.', duration: '10 min' },
      { title: 'Meu progresso', description: 'Entenda evidências, domínio e próximos passos.', duration: '7 min' },
    ],
  },
  familia: {
    label: 'Pais e responsáveis', icon: Users, destination: '/familia',
    promise: 'Acompanhe a aprendizagem com clareza e saiba como apoiar sem transformar o estudo em pressão.',
    registration: ['Receba o convite da escola', 'Escolha “Pais e responsáveis”', 'Confirme o vínculo com o estudante', 'Conheça o painel da família'],
    firstWeek: ['Interpretar o resumo de evolução', 'Identificar prioridades', 'Conhecer limites de privacidade', 'Aplicar uma orientação de apoio em casa'],
    modules: [
      { title: 'Painel da família', description: 'Leia progresso, forças e prioridades com segurança.', duration: '8 min' },
      { title: 'Apoiar sem dar a resposta', description: 'Use perguntas simples que favorecem autonomia.', duration: '8 min' },
      { title: 'Privacidade e responsabilidade', description: 'Entenda quais dados aparecem e por quê.', duration: '6 min' },
    ],
  },
  professor: {
    label: 'Professor', icon: GraduationCap, destination: '/professor',
    promise: 'Transforme evidências em intervenções, avaliações e trilhas, mantendo a decisão pedagógica em suas mãos.',
    registration: ['Aceite o convite institucional', 'Escolha “Professor”', 'Confirme escola, função e turmas', 'Faça a leitura inicial da turma'],
    firstWeek: ['Interpretar alertas', 'Validar recomendações do Copilot', 'Criar uma intervenção', 'Publicar uma atividade ou avaliação'],
    modules: [
      { title: 'Leitura da turma', description: 'Interprete domínio, fragilidades e prontidão.', duration: '30 min' },
      { title: 'Teacher Copilot', description: 'Valide, edite ou rejeite recomendações.', duration: '20 min' },
      { title: 'Planos, avaliações e trilhas', description: 'Crie experiências alinhadas ao currículo.', duration: '35 min' },
    ],
  },
  coordenacao: {
    label: 'Coordenação', icon: Building2, destination: '/escola',
    promise: 'Organize prioridades pedagógicas, apoie professores e acompanhe currículo, intervenções e adoção.',
    registration: ['Aceite o convite da escola', 'Escolha “Coordenação pedagógica”', 'Configure componentes e permissões', 'Revise as prioridades iniciais'],
    firstWeek: ['Ler cobertura curricular', 'Acompanhar adoção docente', 'Organizar ciclos de apoio', 'Criar uma pauta pedagógica baseada em evidências'],
    modules: [
      { title: 'Configuração pedagógica', description: 'Organize escola, turmas, componentes e acessos.', duration: '25 min' },
      { title: 'Analytics para ação', description: 'Diferencie sinal, tendência e alerta.', duration: '40 min' },
      { title: 'Apoio ao professor', description: 'Use evidências em conversas formativas.', duration: '30 min' },
    ],
  },
  direcao: {
    label: 'Direção', icon: School, destination: '/escola',
    promise: 'Acompanhe impacto, adoção, equidade e riscos sem reduzir a aprendizagem a rankings.',
    registration: ['Aceite o convite institucional', 'Escolha “Direção escolar”', 'Confirme metas e responsáveis', 'Conheça o painel executivo'],
    firstWeek: ['Ler indicadores institucionais', 'Definir governança', 'Confirmar metas do piloto', 'Agendar a revisão de 30 dias'],
    modules: [
      { title: 'Painel executivo', description: 'Leia adoção, cobertura, progresso e equidade.', duration: '15 min' },
      { title: 'Governança e segurança', description: 'Defina acessos, responsáveis e revisão de riscos.', duration: '45 min' },
      { title: 'Gestão do piloto', description: 'Registre metas e critérios de sucesso.', duration: '25 min' },
    ],
  },
  rede: {
    label: 'Rede de ensino', icon: Landmark, destination: '/rede',
    promise: 'Acompanhe escolas e territórios com equidade, transparência e autonomia local.',
    registration: ['Configure a organização mantenedora', 'Cadastre unidades e responsáveis', 'Defina perfis de acesso', 'Estabeleça objetivos sistêmicos'],
    firstWeek: ['Interpretar visão territorial', 'Planejar suporte às escolas', 'Definir governança federada', 'Organizar implantação por ondas'],
    modules: [
      { title: 'Estrutura da rede', description: 'Configure escolas, regiões e responsabilidades.', duration: '40 min' },
      { title: 'Equidade territorial', description: 'Compare necessidades sem criar rankings simplistas.', duration: '50 min' },
      { title: 'Expansão responsável', description: 'Planeje formação, suporte e avaliação por ondas.', duration: '45 min' },
    ],
  },
}

export function LearningCenterPage() {
  const initialAudience = (localStorage.getItem('mindsteps_audience') || 'aluno') as AudienceId
  const [audience, setAudience] = useState<AudienceId>(initialAudience in JOURNEYS ? initialAudience : 'aluno')
  const journey = useMemo(() => JOURNEYS[audience], [audience])
  const Icon = journey.icon

  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-300">Academia MindSteps</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Cada perfil aprende a usar o produto no próprio contexto.</h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">Cadastro guiado, tour por função, prática real e acompanhamento dos primeiros 30 dias para alunos, famílias, educadores e gestores.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {(Object.keys(JOURNEYS) as AudienceId[]).map((id) => {
            const ItemIcon = JOURNEYS[id].icon
            return (
              <button key={id} onClick={() => setAudience(id)} className={`rounded-2xl border p-4 text-left transition ${audience === id ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <ItemIcon className={`h-5 w-5 ${audience === id ? 'text-primary-700' : 'text-slate-500'}`} />
                <span className="mt-3 block text-sm font-bold text-slate-900">{JOURNEYS[id].label}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100"><Icon className="h-6 w-6 text-primary-700" /></div>
            <p className="mt-5 text-sm font-bold text-primary-700">Jornada de {journey.label}</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">O que você ganha com o MindSteps</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{journey.promise}</p>

            <h3 className="mt-8 text-lg font-bold text-slate-900">Como se cadastrar</h3>
            <div className="mt-4 space-y-3">
              {journey.registration.map((step, index) => (
                <div key={step} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{index + 1}</span>
                  <span className="text-sm leading-relaxed text-slate-700">{step}</span>
                </div>
              ))}
            </div>

            <Link to="/comecar" className="btn-primary mt-7 inline-flex items-center">Começar agora <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </article>

          <div className="space-y-8">
            <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3"><PlayCircle className="h-6 w-6 text-primary-700" /><h2 className="text-2xl font-bold text-slate-900">Formação essencial</h2></div>
              <div className="mt-6 grid gap-4">
                {journey.modules.map((module, index) => (
                  <div key={module.title} className="rounded-2xl border border-slate-200 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div><p className="text-xs font-bold uppercase tracking-wider text-primary-700">Módulo {index + 1}</p><h3 className="mt-1 font-bold text-slate-900">{module.title}</h3></div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{module.duration}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{module.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl bg-slate-900 p-7 text-white">
              <h2 className="text-2xl font-bold">Resultado esperado na primeira semana</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {journey.firstWeek.map((outcome) => (
                  <div key={outcome} className="flex gap-3 rounded-xl bg-white/5 p-4"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" /><span className="text-sm text-slate-200">{outcome}</span></div>
                ))}
              </div>
            </article>
          </div>
        </div>

        <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-7">
          <h2 className="text-xl font-bold text-amber-950">Princípios de implantação</h2>
          <p className="mt-3 leading-relaxed text-amber-900">O MindSteps não será apresentado apenas por e-mail. Cada implantação terá comunicação antes do acesso, formação prática, tours dentro do produto, plantão de dúvidas e revisão após 30 dias. Recomendações de IA permanecem revisáveis e decisões pedagógicas continuam sob supervisão humana.</p>
        </section>
      </section>
    </main>
  )
}
