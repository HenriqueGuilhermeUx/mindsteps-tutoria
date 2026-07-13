import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores'
import { authApi } from '@/lib/api'
import { ArrowLeft, Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react'

type AudienceId = 'aluno' | 'familia' | 'professor' | 'coordenacao' | 'direcao' | 'rede'

const AUDIENCE_LABELS: Record<AudienceId, string> = {
  aluno: 'Aluno',
  familia: 'Pais e responsáveis',
  professor: 'Professor',
  coordenacao: 'Coordenação pedagógica',
  direcao: 'Direção escolar',
  rede: 'Prefeitura ou rede de ensino',
}

const AUDIENCE_DESTINATIONS: Record<AudienceId, string> = {
  aluno: '/chat',
  familia: '/familia',
  professor: '/professor',
  coordenacao: '/escola',
  direcao: '/escola',
  rede: '/rede',
}

function isAudience(value: string | null): value is AudienceId {
  return Boolean(value && value in AUDIENCE_LABELS)
}

export function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const selectedAudience = useMemo<AudienceId>(() => {
    const fromQuery = searchParams.get('perfil')
    if (isAudience(fromQuery)) return fromQuery

    const saved = localStorage.getItem('mindsteps_audience')
    return isAudience(saved) ? saved : 'aluno'
  }, [searchParams])

  const { setAuth, setProfile } = useAuthStore()

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
  })

  useEffect(() => {
    setIsRegister(searchParams.get('mode') === 'register')
  }, [searchParams])

  useEffect(() => {
    localStorage.setItem('mindsteps_audience', selectedAudience)
  }, [selectedAudience])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = isRegister
        ? await authApi.register({
            email: form.email,
            password: form.password,
            name: form.name,
            age: '',
            grade: '',
          })
        : await authApi.login({
            email: form.email,
            password: form.password,
          })

      setAuth(result.user, result.token)
      localStorage.setItem('mindsteps_audience', selectedAudience)

      if (result.profile) {
        setProfile(result.profile as any)
        navigate(AUDIENCE_DESTINATIONS[selectedAudience])
      } else {
        navigate('/onboarding')
      }

      toast.success(isRegister ? 'Conta criada com sucesso!' : 'Bem-vindo de volta!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/comecar" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Trocar perfil
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Mind<span className="text-primary-600">Steps</span>
          </h1>
          <p className="text-slate-600 mt-2">
            {isRegister ? 'Crie sua conta e comece sua jornada' : 'Entre para continuar sua jornada'}
          </p>
          <span className="inline-flex rounded-full bg-primary-100 text-primary-700 px-3 py-1 text-xs font-bold mt-3">
            Perfil: {AUDIENCE_LABELS[selectedAudience]}
          </span>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Seu nome</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    className="input pl-12"
                    placeholder="Como você quer ser chamado?"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required={isRegister}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  className="input pl-12"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pl-12 pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-lg">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isRegister ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              {isRegister ? 'Já tem conta?' : 'Não tem conta?'}{' '}
              <button onClick={() => setIsRegister(!isRegister)} className="text-primary-600 font-medium hover:underline">
                {isRegister ? 'Entrar' : 'Cadastrar'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Ao continuar, você concorda com os princípios de privacidade e segurança do MindSteps.
        </p>
        <p className="text-center text-xs text-slate-400 mt-3">
          Desenvolvido por Alternative Ventures Ltda. • CNPJ 61.920.356/0001-38
        </p>
      </div>
    </div>
  )
}
