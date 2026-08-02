import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Compass, MessageCircle, Sparkles, Target, UserRound } from 'lucide-react'
import { useAuthStore } from '@/stores'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Hoje', to: '/hoje', icon: Sparkles },
  { label: 'Tutor', to: '/chat', icon: MessageCircle },
  { label: 'Mapa', to: '/journey', icon: Compass },
  { label: 'Missões', to: '/missoes', icon: Target },
  { label: 'Eu', to: '/perfil', icon: UserRound },
]

export function MobileAppShell({ children, title }: { children: ReactNode; title?: string }) {
  const location = useLocation()
  const { profile } = useAuthStore()
  const firstName = profile?.name?.split(' ')[0] || 'Estudante'

  return (
    <div className="min-h-[100dvh] bg-[#F6F7FB] text-slate-950">
      <header className="fixed inset-x-0 top-0 z-40 bg-[#F6F7FB]/95 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-200/70">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary-600">MindSteps</p>
              <h1 className="truncate text-[17px] font-extrabold tracking-tight text-slate-950">{title || `Oi, ${firstName}!`}</h1>
            </div>
          </div>
          <Link
            to="/perfil"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-primary-700 shadow-sm ring-1 ring-slate-200"
            aria-label="Abrir perfil"
          >
            {firstName.slice(0, 1).toUpperCase()}
          </Link>
        </div>
      </header>

      <main className="min-h-[100dvh] pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5.75rem+env(safe-area-inset-bottom))]">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(15,23,42,0.06)]">
        <div className="mx-auto grid h-[76px] max-w-md grid-cols-5 px-2">
          {tabs.map(({ label, to, icon: Icon }) => {
            const active = location.pathname === to || (to === '/journey' && location.pathname === '/dominio')
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-bold transition-all active:scale-95',
                  active ? 'text-primary-700' : 'text-slate-400'
                )}
              >
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-2xl transition-all', active && 'bg-primary-50 shadow-inner')}>
                  <Icon className={cn('h-5 w-5', active && 'stroke-[2.5]')} />
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
