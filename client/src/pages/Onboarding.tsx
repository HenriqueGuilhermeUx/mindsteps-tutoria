import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores'
import { operationsApi, profileApi } from '@/lib/api'
import { ChevronRight, ChevronLeft, Loader2, Sparkles, Clock3, Target, Brain, Heart, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

const GOALS = [
  { id: 'duvida', emoji: '💡', label: 'Entender uma dúvida' },
  { id: 'prova', emoji: '🎯', label: 'Estudar para uma prova' },
  { id: 'notas', emoji: '📈', label: 'Melhorar minhas notas' },
  { id: 'recuperar', emoji: '🧩', label: 'Recuperar conteúdos' },
  { id: 'curiosidade', emoji: '🚀', label: 'Aprender por curiosidade' },
  { id: 'organizar', emoji: '🗓️', label: 'Organizar meus estudos' },
]

const SUBJECTS = [
  'Matemática', 'Português', 'Ciências', 'Biologia', 'Física', 'Química',
  'História', 'Geografia', 'Inglês', 'Redação', 'Programação', 'Educação financeira',
]

const FORMATS = [
  { id: 'passo-a-passo', emoji: '🪜', label: 'Passo a passo' },
  { id: 'visual', emoji: '🖼️', label: 'Imagens e esquemas' },
  { id: 'cotidiano', emoji: '🌎', label: 'Exemplos do dia a dia' },
  { id: 'conversa', emoji: '💬', label: 'Conversa e perguntas' },
  { id: 'exercicios', emoji: '✍️', label: 'Exercícios práticos' },
  { id: 'analogias', emoji: '✨', label: 'Histórias e analogias' },
]

const HELP = [
  { id: 'pista', label: 'Dê uma pista' },
  { id: 'outra-explicacao', label: 'Explique de outro jeito' },
  { id: 'exemplo', label: 'Mostre um exemplo parecido' },
  { id: 'perguntas', label: 'Faça perguntas para eu descobrir' },
  { id: 'partes-menores', label: 'Divida em partes menores' },
]

const CHALLENGES = [
  'Não sei por onde começar',
  'Perco a concentração',
  'Esqueço rápido',
  'Tenho dificuldade de entender',
  'Fico ansioso em provas',
  'Deixo para depois',
  'Não consigo manter rotina',
]

const INTERESTS = [
  'Games', 'Esportes', 'Música', 'Tecnologia', 'Espaço', 'Natureza',
  'Filmes e séries', 'Arte', 'Negócios', 'Carros', 'Saúde', 'Histórias',
]

const TUTORS = [
  { id: 'lumi', emoji: '✨', name: 'Lumi', description: 'Visual, clara e cheia de boas analogias.' },
  { id: 'nilo', emoji: '🔍', name: 'Nilo', description: 'Investigador que ajuda você a descobrir.' },
  { id: 'atlas', emoji: '🧭', name: 'Atlas', description: 'Organiza metas, planos e próximos passos.' },
  { id: 'nova', emoji: '🚀', name: 'Nova', description: 'Exploradora que conecta assuntos a curiosidades.' },
  { id: 'milo', emoji: '🌿', name: 'Milo', description: 'Calmo, paciente e sem pressão.' },
]

const STEPS = ['Objetivo', 'Assuntos', 'Seu jeito', 'Ajuda', 'Rotina', 'Interesses', 'Tutor']

export function OnboardingPage() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [missionTitle, setMissionTitle] = useState('')

  const [data, setData] = useState({
    primaryGoal: '',
    subjects: [] as string[],
    learningFormats: [] as string[],
    helpPreferences: [] as string[],
    challenges: [] as string[],
    interests: [] as string[],
    dailyMinutes: 15,
    preferredDays: [1, 2, 3, 4, 5] as number[],
    tutorPersona: 'lumi',
  })

  const toggle = (field: 'subjects' | 'learningFormats' | 'helpPreferences' | 'challenges' | 'interests', value: string, max = 6) => {
    setData(prev => {
      const current = prev[field]
      const next = current.includes(value)
        ? current.filter(item => item !== value)
        : current.length < max ? [...current, value] : current
      return { ...prev, [field]: next }
    })
  }

  const canProceed = () => {
    if (step === 0) return Boolean(data.primaryGoal)
    if (step === 1) return data.subjects.length > 0
    if (step === 2) return data.learningFormats.length > 0
    if (step === 3) return data.helpPreferences.length > 0
    if (step === 4) return data.dailyMinutes >= 5
    if (step === 5) return data.interests.length > 0
    return Boolean(data.tutorPersona)
  }

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      operationsApi.trackOnboarding('student_onboarding_step_completed', { step: STEPS[step] }).catch(() => undefined)
      setStep(value => value + 1)
      return
    }

    setIsLoading(true)
    try {
      const result = await operationsApi.saveLearningProfile({
        ...data,
        currentIntention: data.primaryGoal,
        onboardingCompleted: true,
      })

      await profileApi.update({
        name: profile?.name,
        tutorId: data.tutorPersona,
      })

      if (profile) {
        setProfile({ ...profile, tutorId: data.tutorPersona })
      }

      setMissionTitle(result.firstMission?.title || `Descubra seu próximo passo em ${data.subjects[0]}`)
      toast.success('Seu jeito de aprender foi configurado!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar seu perfil de aprendizagem')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(value => value - 1)
    else navigate(-1)
  }

  if (missionTitle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-5">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/95 p-8 shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
            <Sparkles className="h-8 w-8" />
          </div>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Seu mapa começou</p>
          <h1 className="mt-3 text-center text-3xl font-bold text-slate-950">O MindSteps já preparou seu primeiro passo.</h1>
          <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <p className="text-sm font-medium text-indigo-700">Sua primeira missão</p>
            <p className="mt-2 text-xl font-bold text-slate-950">{missionTitle}</p>
            <p className="mt-2 text-sm text-slate-600">Uma experiência curta para entender o que você já sabe e adaptar o caminho para você.</p>
          </div>
          <button onClick={() => navigate('/chat')} className="btn-primary mt-7 w-full justify-center py-4 text-base">
            Começar minha missão
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
          <p className="mt-4 text-center text-xs text-slate-500">Você poderá conectar esta conta a uma escola ou programa no futuro sem perder seu progresso.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-7 flex items-center justify-between text-white">
          <div>
            <p className="text-sm font-medium text-indigo-200">Conhecendo seu jeito de aprender</p>
            <h1 className="mt-1 text-2xl font-bold">Poucas escolhas. Um caminho só seu.</h1>
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-sm">{step + 1}/{STEPS.length}</div>
        </div>

        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white p-6 shadow-2xl md:p-8">
          {step === 0 && (
            <StepHeader icon={<Target />} title="O que você quer conquistar primeiro?" subtitle="Escolha o motivo que trouxe você até aqui hoje." />
          )}
          {step === 0 && <ChoiceGrid items={GOALS} selected={[data.primaryGoal]} onSelect={value => setData({ ...data, primaryGoal: value })} />}

          {step === 1 && (
            <>
              <StepHeader icon={<Compass />} title="O que você quer aprender agora?" subtitle="Escolha até três assuntos. Você poderá mudar depois." />
              <TagGrid items={SUBJECTS} selected={data.subjects} onSelect={value => toggle('subjects', value, 3)} />
            </>
          )}

          {step === 2 && (
            <>
              <StepHeader icon={<Brain />} title="Como uma explicação fica melhor para você?" subtitle="Escolha quantas formas quiser. Nós também aprenderemos com seu uso." />
              <ChoiceGrid items={FORMATS} selected={data.learningFormats} onSelect={value => toggle('learningFormats', value)} />
            </>
          )}

          {step === 3 && (
            <>
              <StepHeader icon={<Heart />} title="Quando você travar, como prefere ser ajudado?" subtitle="O tutor ajustará a forma de intervir sem simplesmente entregar a resposta." />
              <TagGrid items={HELP.map(item => item.label)} selected={data.helpPreferences.map(id => HELP.find(item => item.id === id)?.label || id)} onSelect={label => toggle('helpPreferences', HELP.find(item => item.label === label)?.id || label)} />
              <p className="mt-6 text-sm font-semibold text-slate-700">O que mais atrapalha seus estudos?</p>
              <TagGrid items={CHALLENGES} selected={data.challenges} onSelect={value => toggle('challenges', value)} />
            </>
          )}

          {step === 4 && (
            <>
              <StepHeader icon={<Clock3 />} title="Quanto tempo cabe na sua rotina?" subtitle="Missões pequenas e realistas funcionam melhor do que planos impossíveis." />
              <div className="grid grid-cols-3 gap-3">
                {[5, 10, 15, 20, 30, 45].map(minutes => (
                  <button key={minutes} onClick={() => setData({ ...data, dailyMinutes: minutes })} className={cn('rounded-2xl border-2 p-4 font-semibold transition-all', data.dailyMinutes === minutes ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700 hover:border-indigo-200')}>
                    {minutes} min
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <StepHeader icon={<Sparkles />} title="Do que você gosta?" subtitle="Usaremos seus interesses para criar exemplos que façam sentido para você." />
              <TagGrid items={INTERESTS} selected={data.interests} onSelect={value => toggle('interests', value, 8)} />
            </>
          )}

          {step === 6 && (
            <>
              <StepHeader icon={<Sparkles />} title="Escolha quem vai acompanhar você" subtitle="A base pedagógica é a mesma. O jeito de conversar e explicar muda." />
              <div className="space-y-3">
                {TUTORS.map(tutor => (
                  <button key={tutor.id} onClick={() => setData({ ...data, tutorPersona: tutor.id })} className={cn('flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all', data.tutorPersona === tutor.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200')}>
                    <span className="text-3xl">{tutor.emoji}</span>
                    <div>
                      <p className="font-bold text-slate-900">{tutor.name}</p>
                      <p className="text-sm text-slate-600">{tutor.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <button onClick={handleBack} className="btn-ghost"><ChevronLeft className="mr-1 h-5 w-5" />Voltar</button>
            <button onClick={handleNext} disabled={!canProceed() || isLoading} className="btn-primary">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : step === STEPS.length - 1 ? 'Criar meu caminho' : 'Continuar'}
              {!isLoading && <ChevronRight className="ml-1 h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">{icon}</div>
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-slate-600">{subtitle}</p>
    </div>
  )
}

function ChoiceGrid({ items, selected, onSelect }: { items: Array<{ id: string; emoji: string; label: string }>; selected: string[]; onSelect: (value: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(item => (
        <button key={item.id} onClick={() => onSelect(item.id)} className={cn('flex items-center gap-3 rounded-2xl border-2 p-4 text-left font-semibold transition-all', selected.includes(item.id) ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-slate-200 text-slate-800 hover:border-indigo-200')}>
          <span className="text-2xl">{item.emoji}</span>{item.label}
        </button>
      ))}
    </div>
  )
}

function TagGrid({ items, selected, onSelect }: { items: string[]; selected: string[]; onSelect: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map(item => (
        <button key={item} onClick={() => onSelect(item)} className={cn('rounded-full border px-4 py-2 text-sm font-medium transition-all', selected.includes(item) ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300')}>
          {item}
        </button>
      ))}
    </div>
  )
}
