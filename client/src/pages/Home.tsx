import { Link } from 'react-router-dom'
import {
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Eye,
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Map,
  MessageCircle,
  Rocket,
  School,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
} from 'lucide-react'

const CORE_ITEMS = [
  'Tutor Socrático',
  'Learning Memory',
  'Cognitive Twin',
  'Learning DNA',
  'Flow Engine',
  'Prediction Engine',
  'Mastery Engine',
  'Evidence Engine',
]

export function HomePage() {
  return (
    <div className="flex-1">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 sm:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Alpha aberto para testes</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Uma inteligência que entende{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                como cada pessoa aprende.
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              O MindSteps combina tutoria socrática, memória de aprendizagem, missões, domínio real e inteligência pedagógica para apoiar alunos, professores e famílias.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth?mode=register" className="btn-primary text-lg px-8 py-4 rounded-2xl shadow-lg shadow-primary-500/25 hover:shadow-xl transition-all inline-flex items-center justify-center">
                Começar a aprender
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/testes" className="btn-secondary text-lg px-8 py-4 rounded-2xl inline-flex items-center justify-center">
                <FlaskConical className="w-5 h-5 mr-2" />
                Explorar o Alpha
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sem cartão</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ambiente de testes</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Experiências públicas</span>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 text-white p-6 sm:p-8 shadow-2xl">
            <p className="text-primary-300 font-semibold mb-3">MindSteps Core</p>
            <h2 className="text-2xl font-bold mb-4">Mais do que um chatbot educacional.</h2>
            <p className="text-slate-300 mb-6">
              Cada interação pode gerar sinais sobre confiança, curiosidade, carga cognitiva, lacunas conceituais, fluxo e próximo passo recomendado.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {CORE_ITEMS.map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 border border-white/10 px-3 py-3 text-sm font-medium text-slate-100">
                  {item}
                </div>
              ))}
            </div>
            <Link to="/inteligencia" className="mt-6 inline-flex items-center gap-2 text-primary-200 font-bold hover:text-white">
              Ver inteligência em ação <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
            <div>
              <p className="text-primary-300 font-semibold mb-2">Produto em construção acelerada</p>
              <h2 className="text-3xl font-bold">Já há muito para abrir, navegar e testar.</h2>
            </div>
            <Link to="/testes" className="inline-flex items-center gap-2 text-white font-bold hover:text-primary-200">
              Abrir laboratório completo <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AlphaCard icon={<MessageCircle className="w-5 h-5" />} title="Tutor Socrático" text="Chat guiado pelo Core." />
            <AlphaCard icon={<Award className="w-5 h-5" />} title="Learning Passport" text="DNA, competências e timeline." />
            <AlphaCard icon={<Map className="w-5 h-5" />} title="Jornada" text="Mapa de conceitos e progresso." />
            <AlphaCard icon={<Rocket className="w-5 h-5" />} title="Missões" text="Aprendizagem dentro e fora da tela." />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-primary-700 font-semibold mb-2">Um ecossistema completo</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Uma experiência diferente para cada pessoa.</h2>
            <p className="text-slate-600">O mesmo Core alimenta interfaces específicas para aluno, professor, família e instituições.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <AudienceCard icon={<Brain className="w-6 h-6" />} title="Aluno" text="Tutor, missões, jornada, domínio, conquistas e identidade de aprendizagem." link="/auth?mode=register" cta="Criar conta" />
            <AudienceCard icon={<GraduationCap className="w-6 h-6" />} title="Professor" text="Alertas, padrões de dificuldade, intervenções e próximos passos recomendados." link="/testes" cta="Ver Alpha" />
            <AudienceCard icon={<HeartHandshake className="w-6 h-6" />} title="Família" text="Evolução explicada com linguagem positiva e sugestões práticas para casa." link="/testes" cta="Explorar" />
            <AudienceCard icon={<School className="w-6 h-6" />} title="Escolas e redes" text="Visão de turmas, aprendizagem, riscos, oportunidades e configuração white label." link="/inteligencia" cta="Conhecer Core" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-primary-700 font-semibold mb-2">Como funciona</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5">A conversa vira inteligência pedagógica.</h2>
            <div className="space-y-4">
              <Step number="1" title="O aluno conversa" text="Faz perguntas, explica o que entendeu, erra, tenta novamente e pede ajuda." />
              <Step number="2" title="O Core interpreta" text="Analisa sinais de confiança, curiosidade, fluxo, lacunas e estratégias pedagógicas." />
              <Step number="3" title="O sistema age" text="Ajusta a resposta, recomenda missões, atualiza a jornada e gera insights para professor e família." />
            </div>
          </div>

          <div className="rounded-[2rem] bg-white border border-slate-100 shadow-xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center"><Lightbulb className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-slate-500">Exemplo</p>
                <h3 className="font-bold text-slate-900 text-xl">O aluno erra uma fração.</h3>
              </div>
            </div>
            <div className="space-y-3">
              <ExampleRow label="Tutor" value="Faz uma pergunta curta em vez de entregar a resposta." />
              <ExampleRow label="Core" value="Detecta possível confusão entre parte e todo." />
              <ExampleRow label="Professor" value="Recebe sugestão de exemplo concreto." />
              <ExampleRow label="Família" value="Recebe atividade simples para praticar em casa." />
              <ExampleRow label="Jornada" value="Reforça o pré-requisito antes de avançar." />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-primary-700 font-semibold mb-2">Princípios do produto</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tecnologia potente, experiência humana.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <PrincipleCard icon={<ShieldCheck className="w-6 h-6" />} title="Espaço seguro" text="Feedback sem julgamento, linguagem acolhedora e respeito ao tempo de cada estudante." />
            <PrincipleCard icon={<Target className="w-6 h-6" />} title="Aprendizagem real" text="Domínio significa aplicar, explicar, transferir e ensinar — não apenas acertar uma vez." />
            <PrincipleCard icon={<Users className="w-6 h-6" />} title="Modelo híbrido" text="A IA personaliza e organiza sinais; professores e famílias continuam essenciais." />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">O MindSteps já pode ser explorado.</h2>
          <p className="text-xl text-white/80 mb-8">Entre no laboratório público, compare cenários e ajude a validar uma nova infraestrutura de aprendizagem.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/testes" className="inline-flex items-center justify-center bg-white text-primary-600 font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-slate-50 transition-colors">
              Explorar ambiente de testes
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/simulador" className="inline-flex items-center justify-center bg-white/10 border border-white/20 text-white font-semibold text-lg px-8 py-4 rounded-2xl hover:bg-white/20 transition-colors">
              Abrir simulador público
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function AlphaCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
      <div className="w-10 h-10 rounded-xl bg-white/10 text-primary-200 flex items-center justify-center mb-3">{icon}</div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-slate-300 mt-1">{text}</p>
    </div>
  )
}

function AudienceCard({ icon, title, text, link, cta }: { icon: React.ReactNode; title: string; text: string; link: string; cta: string }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
      <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600 mt-2 flex-1">{text}</p>
      <Link to={link} className="inline-flex items-center gap-2 text-primary-700 font-bold mt-5 hover:underline">{cta} <ChevronRight className="w-4 h-4" /></Link>
    </div>
  )
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 font-bold flex items-center justify-center flex-shrink-0">{number}</div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-slate-600 mt-1">{text}</p>
      </div>
    </div>
  )
}

function ExampleRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-primary-700 mb-1">{label}</p>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  )
}

function PrincipleCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 border border-slate-100 p-6">
      <div className="w-12 h-12 rounded-2xl bg-white text-primary-700 flex items-center justify-center shadow-sm mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600 mt-2">{text}</p>
    </div>
  )
}
