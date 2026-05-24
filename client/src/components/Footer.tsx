import { Link } from 'react-router-dom'
import { BookOpen, Sparkles, Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Mind<span className="text-primary-400">Steps</span>
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Aqui, aprender é pensar! TutorIA com método socrático para crianças e adolescentes.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-white transition-colors">
                  Sobre o Método
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="hover:text-white transition-colors">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary-400" />
                <span>IA Socrática</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent-400" />
                <span>Aprendizado Gamificado</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-400" />
                <span>Todas as Matérias</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          <p>© 2024 MindSteps. Feito com 💜 para a educação.</p>
        </div>
      </div>
    </footer>
  )
}