import { Link } from 'react-router-dom'
import { BookOpen, MessageCircle, Sparkles, Zap, ChevronRight, Star } from 'lucide-react'

export function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 sm:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full opacity-20 blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Novo: Chat com IA Socrática</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Aqui, aprender é{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  pensar!
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Converse com seu Tutor IA que usa perguntas inteligentes para te ajudar a descobrir
                respostas. Sem decoreba, sem pressão — só você e sua curiosidade!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth?mode=register" className="btn-primary text-lg px-8 py-4 rounded-2xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all">
                  Começar a Aprender
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/auth" className="btn-secondary text-lg px-8 py-4 rounded-2xl">
                  Já tenho conta
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
              Como funciona?
            </h2>
            <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
              Três passos simples para começar sua jornada de aprendizado
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Escolha um tema</h3>
                <p className="text-slate-600">
                  Matemática, ciências, história... O que você tem curiosidade de explorar hoje?
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Converse com seu Tutor</h3>
                <p className="text-slate-600">
                  Nosso Tutor IA te faz perguntas inteligentes e te guia na descoberta.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Pense e descubra</h3>
                <p className="text-slate-600">
                  A melhor forma de aprender éraciocinar. Nós te ajudamos a chegar lá!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
              Por que o MindSteps?
            </h2>
            <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
              Uma experiência de aprendizado diferente de tudo que você já tentou
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<MessageCircle className="w-6 h-6" />}
                title="Diálogo Real"
                description="Conversa de verdade com um tutor que te ouve e responde suas dúvidas."
                color="primary"
              />
              <FeatureCard
                icon={<Sparkles className="w-6 h-6" />}
                title="Método Socrático"
                description="Aprenda pensando, não decorando. Faça perguntas certas e encontre respostas."
                color="secondary"
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Gamificação"
                description="Ganhe XP, desbloqueie badges e acompanhe seu progresso de forma divertida."
                color="accent"
              />
              <FeatureCard
                icon={<Star className="w-6 h-6" />}
                title="Tutores Personalizados"
                description="Escolha seu estilo de tutor: scientist, detetive, contador de histórias..."
                color="primary"
              />
              <FeatureCard
                icon={<BookOpen className="w-6 h-6" />}
                title="Todas as Matérias"
                description="Matemática, português, ciências, história, geografia e muito mais."
                color="secondary"
              />
              <FeatureCard
                icon={<Sparkles className="w-6 h-6" />}
                title="Gratuito para Começar"
                description="Comece a aprender hoje mesmo, sem cartão de crédito."
                color="accent"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Junte-se a milhares de estudantes que já estão aprendendo de forma mais inteligente.
            </p>
            <Link
              to="/auth?mode=register"
              className="inline-flex items-center justify-center bg-white text-primary-600 font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-slate-50 transition-colors"
            >
              Criar minha conta grátis
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: 'primary' | 'secondary' | 'accent'
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    accent: 'bg-accent-100 text-accent-600',
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  )
}