import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { cn } from '@/lib/utils'
import {
  Award,
  Beaker,
  BookOpen,
  Brain,
  Building2,
  ChevronDown,
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  MessageCircle,
  Network,
  Rocket,
  User,
  X,
} from 'lucide-react'

interface HeaderProps {
  className?: string
}

const productLinks = [
  { label: 'Tutor IA', description: 'Aprenda por diálogo socrático.', to: '/chat', icon: MessageCircle },
  { label: 'Painel do Aluno', description: 'Acompanhe ritmo e próximos passos.', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Learning Passport', description: 'Sua identidade de aprendizagem.', to: '/passport', icon: Award },
  { label: 'Jornada', description: 'Mapa de conceitos e progresso.', to: '/journey', icon: Map },
  { label: 'Missões', description: 'Aprendizagem dentro e fora da tela.', to: '/missoes', icon: Rocket },
]

const ecosystemLinks = [
  { label: 'Professor', description: 'Copiloto e alertas pedagógicos.', to: '/professor', icon: GraduationCap },
  { label: 'Família', description: 'Evolução e sugestões para casa.', to: '/familia', icon: HeartHandshake },
  { label: 'Escola', description: 'Visão consolidada de turmas.', to: '/escola', icon: Building2 },
  { label: 'Rede de Ensino', description: 'Inteligência sistêmica para redes.', to: '/rede', icon: Network },
]

const researchLinks = [
  { label: 'Alpha Lab', description: 'Explore tudo que já está disponível.', to: '/testes', icon: FlaskConical },
  { label: 'Intelligence Lab', description: 'Veja como o Core decide.', to: '/inteligencia', icon: Brain },
  { label: 'Learning Research', description: 'Hipóteses e evidências agregadas.', to: '/pesquisa', icon: Beaker },
]

export function Header({ className }: HeaderProps) {
  const { isAuthenticated, profile, logout } = useAuthStore()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const closeMenus = () => {
    setMobileOpen(false)
    setOpenMenu(null)
  }

  return (
    <header className={cn('sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link to="/" onClick={closeMenus} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-xl font-bold text-slate-900">Mind<span className="text-primary-600">Steps</span></p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Learning OS</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <DesktopMenu label="Produto" items={productLinks} open={openMenu === 'produto'} onToggle={() => setOpenMenu(openMenu === 'produto' ? null : 'produto')} onNavigate={closeMenus} />
            <DesktopMenu label="Ecossistema" items={ecosystemLinks} open={openMenu === 'ecossistema'} onToggle={() => setOpenMenu(openMenu === 'ecossistema' ? null : 'ecossistema')} onNavigate={closeMenus} />
            <DesktopMenu label="Pesquisa" items={researchLinks} open={openMenu === 'pesquisa'} onToggle={() => setOpenMenu(openMenu === 'pesquisa' ? null : 'pesquisa')} onNavigate={closeMenus} />
            <Link to="/piloto" onClick={closeMenus} className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">Piloto</Link>
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && profile ? (
              <>
                <Link to="/dashboard" onClick={closeMenus} className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  <LayoutDashboard className="w-4 h-4" /> Meu painel
                </Link>
                <Link to="/perfil" onClick={closeMenus} className={cn('p-2 rounded-xl', location.pathname === '/perfil' ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100')}>
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={logout} className="p-2 rounded-xl text-slate-600 hover:bg-slate-100" title="Sair">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100">Entrar</Link>
                <Link to="/auth?mode=register" className="hidden sm:inline-flex btn-primary px-4 py-2">Começar grátis</Link>
              </>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100" aria-label="Abrir menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-4 py-5 space-y-6">
            <MobileSection title="Produto" items={productLinks} onNavigate={closeMenus} />
            <MobileSection title="Ecossistema" items={ecosystemLinks} onNavigate={closeMenus} />
            <MobileSection title="Pesquisa e testes" items={researchLinks} onNavigate={closeMenus} />
            <Link to="/piloto" onClick={closeMenus} className="block rounded-2xl border border-slate-200 p-4 font-semibold text-slate-800">Pilot Readiness Center</Link>
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link to="/auth" onClick={closeMenus} className="btn-secondary justify-center">Entrar</Link>
                <Link to="/auth?mode=register" onClick={closeMenus} className="btn-primary justify-center">Criar conta</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function DesktopMenu({ label, items, open, onToggle, onNavigate }: { label: string; items: typeof productLinks; open: boolean; onToggle: () => void; onNavigate: () => void }) {
  return (
    <div className="relative">
      <button onClick={onToggle} className={cn('flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-colors', open ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100')}>
        {label}<ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[430px] rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.to} to={item.to} onClick={onNavigate} className="rounded-2xl p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4" /></div>
                    <div><p className="font-semibold text-sm text-slate-900">{item.label}</p><p className="text-xs text-slate-500 mt-1">{item.description}</p></div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileSection({ title, items, onNavigate }: { title: string; items: typeof productLinks; onNavigate: () => void }) {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 mb-2">{title}</p>
      <div className="grid gap-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.to} to={item.to} onClick={onNavigate} className="flex items-center gap-3 rounded-2xl p-3 hover:bg-slate-50">
              <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center"><Icon className="w-4 h-4" /></div>
              <div><p className="font-semibold text-sm text-slate-900">{item.label}</p><p className="text-xs text-slate-500">{item.description}</p></div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
