import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Building2, GraduationCap, HeartHandshake, Landmark, School, Sparkles, Users } from 'lucide-react'

const PROFILES = [
  { id: 'aluno', label: 'Aluno', text: 'Aprender com o Tutor, acompanhar progresso, missões, domínio e conquistas.', icon: BookOpen, route: '/auth?mode=register&perfil=aluno' },
  { id: 'familia', label: 'Pais e responsáveis', text: 'Acompanhar evolução, confiança, persistência e receber sugestões para apoiar em casa.', icon: HeartHandshake, route: '/auth?mode=register&perfil=familia' },
  { id: 'professor', label: 'Professor', text: 'Visualizar sinais da turma, intervenções recomendadas e próximos passos pedagógicos.', icon: GraduationCap, route: '/auth?mode=register&perfil=professor' },
  { id: 'coordenacao', label: 'Coordenação pedagógica', text: 'Comparar turmas, apoiar professores e organizar prioridades de acompanhamento.', icon: Users, route: '/auth?mode=register&perfil=coordenacao' },
  { id: 'direcao', label: 'Direção escolar', text: 'Acompanhar a escola com visão consolidada, critérios e impacto pedagógico.', icon: School, route: '/auth?mode=register&perfil=direcao' },
  { id: 'rede', label: 'Prefeitura ou rede', text: 'Planejar pilotos, acompanhar escolas e priorizar intervenções em escala.', icon: Landmark, route: '/auth?mode=register&perfil=rede' },
]

export function StartPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-950 to-secondary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5"><Sparkles className="w-4 h-4" /> Começar no MindSteps</p>
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight">Escolha seu perfil e entre pela jornada certa.</h1>
            <p className="text-lg sm:text-xl text-slate-300 mt-6 max-w-3xl leading-relaxed">O cadastro continua simples, com email e senha. A diferença é que agora o produto já entende qual experiência deve apresentar primeiro.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROFILES.map((profile) => {
            const Icon = profile.icon
            return (
              <Link key={profile.id} to={profile.route} className="group rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-primary-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-5 group-hover:bg-primary-600 group-hover:text-white transition-colors"><Icon className="w-6 h-6" /></div>
                <h2 className="text-xl font-bold text-slate-900">{profile.label}</h2>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">{profile.text}</p>
                <span className="inline-flex items-center gap-2 mt-6 text-primary-700 font-bold">Criar acesso <ArrowRight className="w-4 h-4" /></span>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-sm text-primary-300 font-bold">Já possui conta?</p>
            <h2 className="text-2xl font-bold mt-2">Entre com email e senha e continue de onde parou.</h2>
            <p className="text-slate-300 mt-2">O perfil escolhido fica salvo neste dispositivo para personalizar a próxima entrada.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-950 px-5 py-3 font-bold">Entrar <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/tour" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-bold hover:bg-white/10">Ver tour</Link>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 flex items-start gap-3">
          <Building2 className="w-5 h-5 text-primary-700 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">Desenvolvido por Alternative Ventures Ltda.</p>
            <p className="text-sm text-slate-500 mt-1">CNPJ 61.920.356/0001-38</p>
          </div>
        </div>
      </section>
    </main>
  )
}
