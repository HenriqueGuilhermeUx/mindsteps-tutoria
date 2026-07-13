import { Link } from 'react-router-dom'
import { Building2, Target, UserRoundCog } from 'lucide-react'

type InstitutionalProfile = {
  audience?: string
  organization?: string
  role?: string
  goal?: string
}

function readProfile(): InstitutionalProfile | null {
  try {
    const raw = localStorage.getItem('mindsteps_institutional_profile')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function InstitutionalContextBar() {
  const profile = readProfile()

  if (!profile?.organization) return null

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] font-bold text-slate-400">Contexto ativo</p>
              <p className="font-bold text-slate-900">{profile.organization}</p>
            </div>
          </div>

          {profile.role && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <UserRoundCog className="w-4 h-4 text-primary-600" />
              <span>{profile.role}</span>
            </div>
          )}

          {profile.goal && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Target className="w-4 h-4 text-secondary-600" />
              <span>{profile.goal}</span>
            </div>
          )}
        </div>

        <Link to="/onboarding" className="text-sm font-bold text-primary-700 hover:underline">
          Editar contexto
        </Link>
      </div>
    </section>
  )
}
