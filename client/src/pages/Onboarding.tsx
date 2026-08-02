import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Check, Clock3, Loader2, Sparkles } from 'lucide-react'
import { operationsApi, profileApi } from '@/lib/api'
import { useAuthStore } from '@/stores'
import { cn } from '@/lib/utils'

const steps = [
  { title: 'O que você quer fazer primeiro?', options: ['Entender uma dúvida', 'Estudar pra prova', 'Melhorar minhas notas', 'Aprender por curiosidade'] },
  { title: 'O que você quer aprender agora?', options: ['Matemática', 'Português', 'Ciências', 'História', 'Inglês', 'Programação'] },
  { title: 'Como fica mais fácil aprender?', options: ['Passo a passo', 'Com imagens', 'Com exemplos reais', 'Fazendo exercícios'] },
  { title: 'Quanto tempo cabe no seu dia?', options: ['5 min', '10 min', '15 min', '20 min', '30 min', '45 min'] },
  { title: 'Escolha seu jeito de tutor', options: ['Lumi · visual e criativa', 'Nilo · curioso e investigativo', 'Atlas · focado e organizado', 'Milo · calmo e paciente'] },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAuthStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [mission, setMission] = useState('')
  const [answers, setAnswers] = useState({ goal: '', subjects: [] as string[], format: '', minutes: 15, tutor: 'lumi' })

  const selected = step === 0 ? [answers.goal] : step === 1 ? answers.subjects : step === 2 ? [answers.format] : step === 3 ? [`${answers.minutes} min`] : [tutorLabel(answers.tutor)]

  const choose = (value: string) => {
    if (step === 0) setAnswers({ ...answers, goal: value })
    if (step === 1) setAnswers({ ...answers, subjects: answers.subjects.includes(value) ? answers.subjects.filter(v => v !== value) : answers.subjects.length < 3 ? [...answers.subjects, value] : answers.subjects })
    if (step === 2) setAnswers({ ...answers, format: value })
    if (step === 3) setAnswers({ ...answers, minutes: Number(value.replace(' min', '')) })
    if (step === 4) setAnswers({ ...answers, tutor: tutorId(value) })
  }

  const canContinue = selected.length > 0 && selected.every(Boolean)

  const next = async () => {
    if (step < steps.length - 1) { setStep(step + 1); return }
    setLoading(true)
    try {
      const result = await operationsApi.saveLearningProfile({
        primaryGoal: answers.goal,
        currentIntention: answers.goal,
        subjects: answers.subjects,
        learningFormats: [answers.format],
        helpPreferences: ['outra-explicacao', 'exemplo'],
        challenges: [], interests: [], dailyMinutes: answers.minutes,
        preferredDays: [1,2,3,4,5], tutorPersona: answers.tutor, onboardingCompleted: true,
      })
      await profileApi.update({ name: profile?.name, tutorId: answers.tutor })
      if (profile) setProfile({ ...profile, tutorId: answers.tutor })
      setMission(result.firstMission?.title || `Seu primeiro desafio em ${answers.subjects[0]}`)
      setDone(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível montar seu caminho')
    } finally { setLoading(false) }
  }

  if (done) return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-indigo-600 to-violet-700 px-5 pb-8 pt-[calc(3rem+env(safe-area-inset-top))] text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-sm flex-col justify-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/15 backdrop-blur"><Sparkles className="h-10 w-10" /></div>
        <p className="mt-6 text-center text-sm font-bold uppercase tracking-[0.18em] text-indigo-100">Seu mapa começou</p>
        <h1 className="mt-3 text-center text-3xl font-black leading-tight">Seu primeiro desafio está pronto.</h1>
        <div className="mt-7 rounded-[28px] bg-white p-5 text-slate-950 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-600">Primeira missão</p>
          <p className="mt-2 text-xl font-black">{mission}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">Leva poucos minutos e já começa a personalizar seu caminho.</p>
          <button onClick={() => navigate('/hoje')} className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 font-black text-white">Abrir meu app <ArrowRight className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-[100dvh] bg-[#f7f7ff] px-5 pb-8 pt-[calc(1.5rem+env(safe-area-inset-top))]">
      <div className="mx-auto w-full max-w-sm">
        <div className="flex items-center justify-between">
          <button onClick={() => step ? setStep(step - 1) : navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm"><ArrowLeft className="h-5 w-5" /></button>
          <p className="text-sm font-black text-slate-400">{step + 1} de {steps.length}</p>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-indigo-100"><div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
        <div className="mt-8">
          <p className="text-sm font-bold text-primary-600">Só mais um passo</p>
          <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-slate-950">{steps[step].title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Escolha o que combina com você. Tudo pode mudar depois.</p>
        </div>
        <div className="mt-6 space-y-3">
          {steps[step].options.map(option => {
            const active = selected.includes(option)
            return <button key={option} onClick={() => choose(option)} className={cn('flex min-h-16 w-full items-center justify-between rounded-[22px] border-2 px-5 py-4 text-left text-base font-black transition active:scale-[0.99]', active ? 'border-primary-500 bg-primary-50 text-primary-800' : 'border-white bg-white text-slate-800 shadow-sm')}>
              <span>{option}</span>{active && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white"><Check className="h-4 w-4" /></span>}
            </button>
          })}
        </div>
        {step === 3 && <div className="mt-5 flex items-center gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800"><Clock3 className="h-5 w-5 shrink-0" /> Missões curtas também contam. O importante é continuar.</div>}
        <button onClick={next} disabled={!canContinue || loading} className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 font-black text-white shadow-lg disabled:opacity-40">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{step === steps.length - 1 ? 'Criar meu caminho' : 'Continuar'}<ArrowRight className="h-5 w-5" /></>}
        </button>
      </div>
    </div>
  )
}

function tutorId(label: string) { if (label.startsWith('Nilo')) return 'nilo'; if (label.startsWith('Atlas')) return 'atlas'; if (label.startsWith('Milo')) return 'milo'; return 'lumi' }
function tutorLabel(id: string) { return id === 'nilo' ? steps[4].options[1] : id === 'atlas' ? steps[4].options[2] : id === 'milo' ? steps[4].options[3] : steps[4].options[0] }
