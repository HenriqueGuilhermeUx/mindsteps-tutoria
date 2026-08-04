import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Compass, Home, MessageCircle, Sparkles, Target, UserRound } from 'lucide-react'
import { useAuthStore } from '@/stores'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Início', to: '/hoje', icon: Home },
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
    <div className="min-h-[100dvh] bg-[var(--ms-bg)] text-slate-950">
      <header className="fixed inset-x-0 top-0 z-40 pt-safe">
        <div className="mx-auto max-w-md px-4 pt-3">
          <div className="flex h-14 items-center justify-between rounded-[22px] border border-white/70 bg-white/80 px-3.5 shadow-sm backdrop-blur-xl">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-md shadow-primary-200/70">
                <Sparkles className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary-600">MindSteps</p>
                <h1 className="truncate text-[15px] font-extrabold tracking-tight text-slate-950">{title || `Oi, ${firstName}`}</h1>
              </div>
            </div>
            <Link to="/perfil" className="ms-pressable flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white" aria-label="Abrir perfil">
              {firstName.slice(0, 1).toUpperCase()}
            </Link>
          </div>
        </div>
      </header>

      <main className="min-h-[100dvh] pt-[calc(4.75rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))]">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 pb-safe">
        <div className="mx-auto max-w-md px-3 pb-2">
          <div className="grid h-[72px] grid-cols-5 rounded-[26px] border border-white/80 bg-white/90 px-1.5 shadow-[0_18px_55px_rgba(25,30,60,0.18)] backdrop-blur-xl">
            {tabs.map(({ label, to, icon: Icon }) => {
              const active = location.pathname === to || (to === '/journey' && location.pathname === '/dominio')
              return (
                <Link key={to} to={to} className={cn('ms-pressable flex flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-extrabold', active ? 'text-primary-700' : 'text-slate-400')}>
                  <span className={cn('flex h-9 w-9 items-center justify-center rounded-2xl transition-colors', active && 'bg-primary-50')}>
                    <Icon className={cn('h-[19px] w-[19px]', active && 'stroke-[2.6]')} />
                  </span>
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
