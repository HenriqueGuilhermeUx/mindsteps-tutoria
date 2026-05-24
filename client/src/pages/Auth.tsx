import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores'
import { authApi } from '@/lib/api'
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react'

export function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { setAuth, setProfile } = useAuthStore()

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
  })

  useEffect(() => {
    setIsRegister(searchParams.get('mode') === 'register')
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let result

      if (isRegister) {
        // For registration, we need name - we'll handle age/grade in onboarding
        result = await authApi.register({
          email: form.email,
          password: form.password,
          name: form.name,
          age: '',
          grade: '',
        })
      } else {
        result = await authApi.login({
          email: form.email,
          password: form.password,
        })
      }

      setAuth(result.user, result.token)

      // If there's a profile, set it and go to chat
      if (result.profile) {
        setProfile(result.profile as any)
        navigate('/chat')
      } else {
        // No profile yet, go to onboarding
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
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Mind<span className="text-primary-600">Steps</span>
          </h1>
          <p className="text-slate-600 mt-2">
            {isRegister ? 'Crie sua conta e comece a aprender' : 'Faça login para continuar'}
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seu nome
                </label>
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  className="input pl-12"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Senha
              </label>
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-lg"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isRegister ? (
                'Criar conta'
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              {isRegister ? 'Já tem conta?' : 'Não tem conta?'}{' '}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-primary-600 font-medium hover:underline"
              >
                {isRegister ? 'Entrar' : 'Cadastrar'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Ao continuar, você concorda com nossos{' '}
          <a href="/privacidade" className="text-primary-600 hover:underline">
            Termos de Privacidade
          </a>
        </p>
      </div>
    </div>
  )
}