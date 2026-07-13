import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Landmark,
  Loader2,
  School,
  Users,
} from 'lucide-react'

type AudienceId = 'familia' | 'professor' | 'coordenacao' | 'direcao' | 'rede'

type SetupConfig = {
  label: string
  icon: typeof Building2
  destination: string
  headline: string
  description: string
  organizationLabel: string
  roleLabel: string
  goalOptions: string[]
}

const CONFIG: Record<AudienceId, SetupConfig> = {
  familia: {
    label: 'Pais e responsáveis',
    icon: Users,
    destination: '/familia',
    headline: 'Vamos preparar uma visão clara da aprendizagem.',
    description: 'Conte apenas o necessário para personalizar o Family Companion neste Alpha.',
    organizationLabel: 'Nome do aluno ou família',
    roleLabel: 'Sua relação com o aluno',
    goalOptions: ['Acompanhar evolução', 'Apoiar estudos em casa', 'Entender confiança e persistência'],
  },
  professor: {
    label: 'Professor',
    icon: GraduationCap,
    destination: '/professor',
    headline: 'Configure seu espaço de apoio pedagógico.',
    description: 'Vamos organizar o Teacher Copilot para o contexto da sua turma.',
    organizationLabel: 'Escola ou instituição',
    roleLabel: 'Disciplina ou função',
    goalOptions: ['Identificar alunos em atenção', 'Planejar intervenções', 'Acompanhar domínio conceitual'],
  },
  coordenacao: {
    label: 'Coordenação pedagógica',
    icon: Building2,
    destination: '/escola',
    headline: 'Prepare a visão pedagógica da escola.',
    description: 'Defina o contexto inicial para acompanhar turmas, professores e prioridades.',
    organizationLabel: 'Nome da escola ou grupo escolar',
    roleLabel: 'Cargo ou área de atuação',
    goalOptions: ['Acompanhar turmas', 'Apoiar professores', 'Organizar prioridades pedagógicas'],
  },
  direcao: {
    label: 'Direção escolar',
    icon: School,
    destination: '/escola',
    headline: 'Configure a visão executiva da escola.',
    description: 'Vamos preparar indicadores e prioridades para gestão pedagógica.',
    organizationLabel: 'Nome da escola',
    roleLabel: 'Cargo na instituição',
    goalOptions: ['Visão consolidada', 'Avaliar impacto', 'Preparar um piloto'],
  },
  rede: {
    label: 'Prefeitura ou rede de ensino',
    icon: Landmark,
    destination: '/rede',
    headline: 'Prepare a visão inicial da rede de ensino.',
    description: 'Organize o contexto para acompanhar escolas, regiões e prioridades sistêmicas.',
    organizationLabel: 'Município, secretaria ou mantenedora',
    roleLabel: 'Cargo ou área responsável',
    goalOptions: ['Mapear prioridades da rede', 'Planejar piloto', 'Acompanhar impacto por território'],
  },
}

function getAudience(): AudienceId {
  const value = localStorage.getItem('mindsteps_audience')
  return value && value in CONFIG ? (value as AudienceId) : 'professor'
}

export function InstitutionalOnboardingPage() {
  const navigate = useNavigate()
  const audience = useMemo(getAudience, [])
  const config = CONFIG[audience]
  const Icon = config.icon
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ organization: '', role: '', goal: config.goalOptions[0] })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      localStorage.setItem(
        'mindsteps_institutional_profile',
        JSON.stringify({ audience, ...form, createdAt: new Date().toISOString() })
      )
      toast.success('Espaço configurado com sucesso!')
      navigate(config.destination)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-primary-950 to-secondary-950 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-[0.9fr_1.1fr] overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <section className="bg-slate-900 text-white p-7 sm:p-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-7">
            <Icon className="w-7 h-7 text-primary-300" />
          </div>
          <p className="text-sm uppercase tracking-[0.18em] text-primary-300 font-bold">{config.label}</p>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mt-3">{config.headline}</h1>
          <p className="text-slate-300 leading-relaxed mt-5">{config.description}</p>

          <div className="space-y-3 mt-8 text-sm">
            {['Configuração simples', 'Dados iniciais salvos no navegador', 'Experiência personalizada por perfil'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
            Alpha institucional. A persistência completa no backend será ativada na próxima fase do produto.
          </div>
        </section>

        <section className="p-7 sm:p-10">
          <div className="mb-7">
            <p className="text-sm font-semibold text-primary-700">Configuração inicial</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Conte um pouco sobre seu contexto</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{config.organizationLabel}</label>
              <input
                className="input"
                value={form.organization}
                onChange={(event) => setForm({ ...form, organization: event.target.value })}
                placeholder="Digite aqui"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{config.roleLabel}</label>
              <input
                className="input"
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
                placeholder="Ex.: Matemática, coordenação, responsável"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Principal objetivo neste momento</label>
              <div className="grid gap-3">
                {config.goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setForm({ ...form, goal })}
                    className={`rounded-xl border p-4 text-left transition-colors ${form.goal === goal ? 'border-primary-500 bg-primary-50 text-primary-900' : 'border-slate-200 hover:border-slate-300 text-slate-700'}`}
                  >
                    <span className="font-semibold">{goal}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-base">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Entrar no produto</span><ArrowRight className="w-5 h-5 ml-2" /></>}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-7">
            Desenvolvido por Alternative Ventures Ltda. • CNPJ 61.920.356/0001-38
          </p>
        </section>
      </div>
    </main>
  )
}
