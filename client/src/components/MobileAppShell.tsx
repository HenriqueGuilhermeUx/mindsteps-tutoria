import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Brain, Compass, MessageCircle, Sparkles, Target } from 'lucide-react'
import { useAuthStore } from '@/stores'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Hoje', to: '/hoje', icon: Sparkles },
  { label: 'Tutor', to: '/chat', icon: MessageCircle },
  { label: 'Mapa', to: '/journey', icon: Compass },
  { label: 'Missões', to: '/missoes', icon: Target },
  { label: 'Eu', to: '/perfil', icon: Brain },
]

export function MobileAppShell({ children, title }: { children: ReactNode; title?: string }) {
  const location = useLocation()
  const { profile } = useAuthStore()
  const firstName = profile?.name?.split(' ')[0] || 'Estudante'

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-950">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md shadow-primary-200/60">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-600">MindSteps</p>
              <h1 className="truncate text-base font-bold text-slate-950">{title || `Olá, ${firstName}`}</h1>
            </div>
          </div>
          <Link to="/perfil" className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm" aria-label="Abrir perfil">
            {firstName.slice(0, 1).toUpperCase()}
          </Link>
        </div>
      </header>

      <main className="min-h-[100dvh] pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="grid h-20 grid-cols-5 px-1">
          {tabs.map(({ label, to, icon: Icon }) => {
            const active = location.pathname === to || (to === '/journey' && location.pathname === '/dominio')
            return (
              <Link key={to} to={to} className={cn('relative flex flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition-colors', active ? 'text-primary-700' : 'text-slate-400')}>
                {active && <span className="absolute top-1 h-1 w-8 rounded-full bg-primary-500" />}
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-2xl transition-colors', active && 'bg-primary-50')}>
                  <Icon className="h-5 w-5" />
                </span>
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
