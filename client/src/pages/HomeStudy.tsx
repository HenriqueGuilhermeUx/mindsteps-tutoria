import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  GraduationCap,
  HeartHandshake,
  MessageCircleQuestion,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'

const FEATURES = [
  {
    icon: MessageCircleQuestion,
    title: 'Tutor que ensina de verdade',
    text: 'Explique sua dúvida, mostre sua tentativa e receba perguntas, exemplos e apoio ajustados ao seu momento.',
  },
  {
    icon: Route,
    title: 'Trilha pessoal de estudos',
    text: 'O MindSteps organiza o que aprender, praticar, revisar e aplicar sem exigir vínculo com uma escola.',
  },
  {
    icon: Brain,
    title: 'Memória da aprendizagem',
    text: 'O sistema acompanha conceitos fortes, lacunas, estratégias que funcionam e pontos que precisam de revisão.',
  },
  {
    icon: ClipboardCheck,
    title: 'Avaliações sem punição',
    text: 'Diagnósticos e desafios servem para decidir o próximo passo, não para rotular capacidade ou inteligência.',
  },
  {
    icon: CalendarDays,
    title: 'Plano semanal realista',
    text: 'Defina quanto tempo tem disponível e receba uma rotina curta, adaptável e com continuidade.',
  },
  {
    icon: Compass,
    title: 'Aprender por curiosidade',
    text: 'Além das matérias escolares, você pode investigar perguntas próprias, projetos e novos interesses.',
  },
]

const FIRST_WEEK = [
  'Criar sua conta com email e senha.',
  'Informar idade, ano escolar, interesses e objetivos.',
  'Escolher uma matéria ou pergunta para começar.',
  'Fazer uma primeira sessão diagnóstica curta.',
  'Receber seu plano semanal e a primeira trilha.',
  'Acompanhar progresso, domínio e revisões no painel.',
]

export function HomeStudyPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-950 to-secondary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5">
              <Sparkles className="w-4 h-4" /> MindSteps para estudar em casa
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
              Estude sozinho, mas não fique sem orientação.
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mt-6 max-w-3xl leading-relaxed">
              Qualquer estudante pode criar uma conta, escolher seus objetivos e aprender com um tutor adaptativo — mesmo sem escola, professor ou turma cadastrada.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/auth?mode=register&perfil=independente" className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-950 px-5 py-3 font-bold">
                Criar conta gratuita <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/tour" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-bold hover:bg-white/10">
                Conhecer funcionalidades
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/10 border border-white/10 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-400/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-200" />
              </div>
              <div>
                <p className="text-sm text-primary-200 font-bold">Seu primeiro ciclo</p>
                <h2 className="text-2xl font-bold">Da dúvida ao plano pessoal</h2>
              </div>
            </div>
            <div className="space-y-3 mt-6">
              {['Conte o que quer aprender', 'Mostre o que já tentou', 'Receba uma explicação adaptada', 'Pratique em outro contexto', 'Salve evidências e próximos passos'].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl bg-white/5 p-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5" />
                  <span className="text-slate-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.18em] text-primary-700 font-bold">Produto direto para estudantes</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Tudo o que precisa para estudar com autonomia.</h2>
          <p className="text-slate-600 mt-4 leading-relaxed">
            A experiência independente usa o mesmo cérebro pedagógico criado para escolas, mas com cadastro simples, plano pessoal e linguagem voltada ao estudante.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-9">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-5">{title}</h3>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid lg:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-7 h-7 text-primary-700" />
              <h2 className="text-3xl font-bold text-slate-900">Como começar em casa</h2>
            </div>
            <div className="space-y-4 mt-7">
              {FIRST_WEEK.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">{index + 1}</span>
                  <p className="text-slate-700 pt-1">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 text-white p-7 sm:p-9">
            <ShieldCheck className="w-9 h-9 text-emerald-300" />
            <h2 className="text-2xl font-bold mt-5">Autonomia com proteção</h2>
            <p className="text-slate-300 mt-4 leading-relaxed">
              O estudante pode usar sozinho. Para menores, o MindSteps recomenda vínculo opcional com responsável, privacidade por padrão e orientação clara para procurar ajuda humana quando necessário.
            </p>
            <div className="space-y-3 mt-6 text-sm">
              {[
                'Sem rankings de inteligência ou personalidade.',
                'Sem exposição pública de desempenho.',
                'Responsável acompanha progresso sem ler conversas privadas por padrão.',
                'A IA não substitui apoio humano em situações sensíveis.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <HeartHandshake className="w-5 h-5 text-primary-300 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="rounded-[2rem] bg-gradient-to-r from-primary-700 to-secondary-700 text-white p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
          <div>
            <div className="flex items-center gap-2 text-primary-100 font-bold text-sm">
              <BookOpenCheck className="w-5 h-5" /> Comece por uma dúvida real
            </div>
            <h2 className="text-3xl font-bold mt-3">Crie sua conta e faça a primeira sessão.</h2>
            <p className="text-primary-100 mt-3 max-w-2xl">Depois disso, o MindSteps organiza sua rotina, trilha, revisões e próximos desafios.</p>
          </div>
          <Link to="/auth?mode=register&perfil=independente" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-primary-800 px-6 py-3 font-bold whitespace-nowrap">
            Estudar agora <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
