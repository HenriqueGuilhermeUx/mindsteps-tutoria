import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { cn } from '@/lib/utils'
import { BookOpen, User, LogOut, LayoutDashboard, GraduationCap, Award } from 'lucide-react'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const { isAuthenticated, profile, logout } = useAuthStore()
  const location = useLocation()

  return (
    <header className={cn('bg-white border-b border-slate-100 sticky top-0 z-50', className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">
              Mind<span className="text-primary-600">Steps</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated && profile ? (
              <>
                <Link
                  to="/chat"
                  className={cn(
                    'px-3 sm:px-4 py-2 rounded-xl font-medium transition-colors',
                    location.pathname === '/chat' ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  Chat
                </Link>
                <Link
                  to="/dashboard"
                  className={cn(
                    'px-3 sm:px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2',
                    location.pathname === '/dashboard' ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Aluno</span>
                </Link>
                <Link
                  to="/passport"
                  className={cn(
                    'px-3 sm:px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2',
                    location.pathname === '/passport' ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <Award className="w-4 h-4" />
                  <span className="hidden sm:inline">Passport</span>
                </Link>
                <Link
                  to="/professor"
                  className={cn(
                    'px-3 sm:px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2',
                    location.pathname === '/professor' ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="hidden sm:inline">Professor</span>
                </Link>
                <Link
                  to="/perfil"
                  className={cn(
                    'p-2 rounded-xl transition-colors',
                    location.pathname === '/perfil' ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={logout} className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="btn-ghost">Entrar</Link>
                <Link to="/auth?mode=register" className="btn-primary">Cadastrar</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
