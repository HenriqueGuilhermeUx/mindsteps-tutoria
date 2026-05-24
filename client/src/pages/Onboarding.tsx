import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores'
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const AGE_GROUPS = [
  { id: '6-10', label: '6-10 anos', description: 'Criança' },
  { id: '11-14', label: '11-14 anos', description: 'Pré-adolescente' },
  { id: '15-17', label: '15-17 anos', description: 'Adolescente' },
]

const GRADES = [
  { id: '1', label: '1º ano' },
  { id: '2', label: '2º ano' },
  { id: '3', label: '3º ano' },
  { id: '4', label: '4º ano' },
  { id: '5', label: '5º ano' },
  { id: '6', label: '6º ano' },
  { id: '7', label: '7º ano' },
  { id: '8', label: '8º ano' },
  { id: '9', label: '9º ano' },
  { id: 'EM1', label: '1º ano EM' },
  { id: 'EM2', label: '2º ano EM' },
  { id: 'EM3', label: '3º ano EM' },
]

const TUTORS = [
  {
    id: 'default',
    emoji: '🎓',
    name: 'Tutor Clássico',
    description: 'Guia investigativo padrão para todas as matérias',
  },
  {
    id: 'scientist',
    emoji: '🧪',
    name: 'Cientista Maluco',
    description: 'Experimentos e descobertas científicas!',
  },
  {
    id: 'time_traveler',
    emoji: '⏰',
    name: 'Viajante do Tempo',
    description: 'Explore a história como se estivesse lá!',
  },
  {
    id: 'detective',
    emoji: '🔍',
    name: 'Detetive Lógico',
    description: 'Resolva mistérios matemáticos!',
  },
  {
    id: 'storyteller',
    emoji: '📖',
    name: 'Contador de Histórias',
    description: 'Aprenda através de narrativas incríveis!',
  },
]

const STEPS = ['Nome', 'Idade', 'Ano Escolar', 'Tutor']

export function OnboardingPage() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const [data, setData] = useState({
    name: profile?.name || '',
    ageGroup: profile?.ageGroup || '',
    grade: profile?.grade || '',
    tutorId: profile?.tutorId || 'default',
  })

  const canProceed = () => {
    switch (step) {
      case 0:
        return data.name.length >= 2
      case 1:
        return data.ageGroup !== ''
      case 2:
        return data.grade !== ''
      case 3:
        return true
      default:
        return false
    }
  }

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      setIsLoading(true)
      try {
        setProfile({
          id: profile?.id || 0,
          name: data.name,
          ageGroup: data.ageGroup as any,
          grade: data.grade,
          xp: 0,
          level: 1,
          streak: 0,
          tutorId: data.tutorId,
          petXp: 0,
        })
        toast.success('Perfil criado! Vamos aprender!')
        navigate('/chat')
      } catch (error) {
        toast.error('Erro ao salvar perfil')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  i <= step
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-slate-600 mt-2">
            Passo {step + 1} de {STEPS.length}: {STEPS[step]}
          </p>
        </div>

        {/* Content */}
        <div className="card">
          {/* Step 0: Name */}
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 text-center">
                Qual é o seu nome?
              </h2>
              <p className="text-slate-600 text-center">
                assim posso te chamar pelo nome durante nossas conversas!
              </p>
              <input
                type="text"
                className="input text-center text-xl"
                placeholder="Digite seu nome..."
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                autoFocus
              />
            </div>
          )}

          {/* Step 1: Age */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 text-center">
                Quantos anos você tem?
              </h2>
              <p className="text-slate-600 text-center">
                assim posso te explicar as coisas no nível certo!
              </p>
              <div className="grid grid-cols-1 gap-3">
                {AGE_GROUPS.map((age) => (
                  <button
                    key={age.id}
                    onClick={() => setData({ ...data, ageGroup: age.id })}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      data.ageGroup === age.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <div className="font-semibold text-slate-900">{age.label}</div>
                    <div className="text-sm text-slate-600">{age.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Grade */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 text-center">
                Qual seu ano escolar?
              </h2>
              <p className="text-slate-600 text-center">
                assim sei que conteúdo é mais adequado para você!
              </p>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {GRADES.map((grade) => (
                  <button
                    key={grade.id}
                    onClick={() => setData({ ...data, grade: grade.id })}
                    className={cn(
                      'p-3 rounded-xl border-2 text-center transition-all',
                      data.grade === grade.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Tutor */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 text-center">
                Escolha seu Tutor!
              </h2>
              <p className="text-slate-600 text-center">
                cada um tem um jeito diferente de te ensinar!
              </p>
              <div className="space-y-3">
                {TUTORS.map((tutor) => (
                  <button
                    key={tutor.id}
                    onClick={() => setData({ ...data, tutorId: tutor.id })}
                    className={cn(
                      'w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4',
                      data.tutorId === tutor.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <span className="text-3xl">{tutor.emoji}</span>
                    <div>
                      <div className="font-semibold text-slate-900">{tutor.name}</div>
                      <div className="text-sm text-slate-600">{tutor.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleBack}
              className="btn-ghost"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Voltar
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : step === STEPS.length - 1 ? (
                <>
                  Começar!
                  <ChevronRight className="w-5 h-5 ml-1" />
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}