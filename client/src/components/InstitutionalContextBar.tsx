import { Link } from 'react-router-dom'
import { BrainCircuit, Building2, GraduationCap, ShieldCheck, Target, UserRoundCog } from 'lucide-react'

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center"><Building2 className="w-5 h-5" /></div><div><p className="text-xs uppercase tracking-[0.16em] font-bold text-slate-400">Contexto ativo</p><p className="font-bold text-slate-900">{profile.organization}</p></div></div>
            {profile.role && <div className="flex items-center gap-2 text-sm text-slate-600"><UserRoundCog className="w-4 h-4 text-primary-600" /><span>{profile.role}</span></div>}
            {profile.goal && <div className="flex items-center gap-2 text-sm text-slate-600"><Target className="w-4 h-4 text-secondary-600" /><span>{profile.goal}</span></div>}
          </div>
          <Link to="/onboarding" className="text-sm font-bold text-primary-700 hover:underline">Editar contexto</Link>
        </div>
        <nav className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          <Link to="/professor/ia" className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800"><GraduationCap className="h-4 w-4"/>Teacher Copilot</Link>
          <Link to="/escola/governanca-ia" className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-3 py-2 text-xs font-black text-cyan-800"><ShieldCheck className="h-4 w-4"/>Governança de IA</Link>
          <Link to="/transparencia-ia" className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-black text-violet-800"><BrainCircuit className="h-4 w-4"/>Explicabilidade</Link>
        </nav>
      </div>
    </section>
  )
}
