import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Sparkles, User } from 'lucide-react'
import { useAuthStore } from '@/stores'
import { authApi } from '@/lib/api'

type AudienceId = 'independente' | 'aluno' | 'familia' | 'professor' | 'coordenacao' | 'direcao' | 'rede'

const DESTINATIONS: Record<AudienceId, string> = {
  independente: '/hoje', aluno: '/hoje', familia: '/familia', professor: '/professor',
  coordenacao: '/escola', direcao: '/escola', rede: '/rede',
}

function isAudience(value: string | null): value is AudienceId {
  return Boolean(value && value in DESTINATIONS)
}

export function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const { setAuth, setProfile } = useAuthStore()

  const audience = useMemo<AudienceId>(() => {
    const query = searchParams.get('perfil')
    if (isAudience(query)) return query
    const saved = localStorage.getItem('mindsteps_audience')
    return isAudience(saved) ? saved : 'independente'
  }, [searchParams])

  useEffect(() => setIsRegister(searchParams.get('mode') === 'register'), [searchParams])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      const result = isRegister
        ? await authApi.register({ email: form.email, password: form.password, name: form.name, age: '', grade: '' })
        : await authApi.login({ email: form.email, password: form.password })
      setAuth(result.user, result.token)
      localStorage.setItem('mindsteps_audience', audience)
      if (result.profile) {
        setProfile(result.profile as any)
        navigate(DESTINATIONS[audience])
      } else navigate('/onboarding')
      toast.success(isRegister ? 'Seu espaço está pronto!' : 'Que bom ver você de novo!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível entrar')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[100dvh] bg-[#f7f7ff] px-5 pb-8 pt-[calc(2rem+env(safe-area-inset-top))]">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-sm flex-col">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-200">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div><p className="text-xl font-black text-slate-950">Mind<span className="text-primary-600">Steps</span></p><p className="text-xs font-medium text-slate-500">Seu jeito de aprender</p></div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-primary-600">{isRegister ? 'Comece por aqui' : 'Bem-vindo de volta'}</p>
          <h1 className="mt-1 text-3xl font-black leading-tight tracking-tight text-slate-950">
            {isRegister ? 'Crie seu espaço de aprendizagem.' : 'Continue de onde parou.'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Leva menos de um minuto. Depois, o app prepara seu primeiro desafio.</p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {isRegister && <Field icon={User} type="text" placeholder="Como quer ser chamado?" value={form.name} onChange={name => setForm({ ...form, name })} autoComplete="name" />}
          <Field icon={Mail} type="email" placeholder="Seu e-mail" value={form.email} onChange={email => setForm({ ...form, email })} autoComplete="email" />
          <div className="relative">
            <Field icon={Lock} type={showPassword ? 'text' : 'password'} placeholder="Sua senha" value={form.password} onChange={password => setForm({ ...form, password })} autoComplete={isRegister ? 'new-password' : 'current-password'} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Mostrar senha">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <button disabled={loading} className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 text-base font-black text-white shadow-lg active:scale-[0.98] disabled:opacity-60">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{isRegister ? 'Criar meu espaço' : 'Entrar'}<ArrowRight className="h-5 w-5" /></>}
          </button>
        </form>

        <button onClick={() => setIsRegister(!isRegister)} className="mt-5 text-center text-sm font-semibold text-slate-600">
          {isRegister ? 'Já tenho uma conta' : 'Quero criar uma conta grátis'}
        </button>

        <div className="mt-auto pt-8 text-center">
          <p className="text-[11px] leading-5 text-slate-400">Ao continuar, você concorda com a política de privacidade do MindSteps.</p>
          <p className="mt-2 text-[10px] text-slate-300">Alternative Ventures Ltda · CNPJ 61.920.356/0001-38</p>
        </div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, onChange, ...props }: { icon: typeof Mail; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  return <div className="relative"><Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input {...props} onChange={e => onChange(e.target.value)} required className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-base font-medium text-slate-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100" /></div>
}
