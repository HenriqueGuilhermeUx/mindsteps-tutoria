import { Link } from 'react-router-dom'
import { Accessibility, Beaker, BookOpen, Brain, Building2, Compass, Dna, GitBranch, GraduationCap, HeartHandshake, Network, Rocket, ShieldCheck, Sparkles } from 'lucide-react'

const PRODUCT_LINKS = [
  { label: 'Começar por perfil', route: '/comecar' },
  { label: 'Tour guiado', route: '/tour' },
  { label: 'Tutor Socrático', route: '/chat' },
  { label: 'Painel do Aluno', route: '/dashboard' },
  { label: 'Learning Genome', route: '/genoma' },
  { label: 'Knowledge Graph', route: '/grafo' },
  { label: 'Learning Passport', route: '/passport' },
  { label: 'Jornada', route: '/journey' },
  { label: 'Missões', route: '/missoes' },
]

const ECOSYSTEM_LINKS = [
  { label: 'Professor', route: '/professor' },
  { label: 'Família', route: '/familia' },
  { label: 'Escola', route: '/escola' },
  { label: 'Rede de Ensino', route: '/rede' },
]

const LAB_LINKS = [
  { label: 'Acessibilidade e inclusão', route: '/acessibilidade' },
  { label: 'Segurança e IA responsável', route: '/seguranca' },
  { label: 'Roadmap público', route: '/roadmap' },
  { label: 'Alpha Lab', route: '/testes' },
  { label: 'Intelligence Lab', route: '/inteligencia' },
  { label: 'Simulador', route: '/simulador' },
  { label: 'Learning Research', route: '/pesquisa' },
  { label: 'Protocolo de Testes', route: '/protocolo' },
]

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.9fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-950/40">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-white leading-none">Mind<span className="text-primary-400">Steps</span></p>
                <p className="text-xs text-slate-500 mt-1">Learning Operating System</p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Uma infraestrutura de inteligência pedagógica que transforma conversas em memória, evidências, domínio, previsões e próximos passos para alunos, professores, famílias e redes de ensino.
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              <FooterBadge icon={<Brain className="w-3.5 h-3.5" />} label="Learning Core" />
              <FooterBadge icon={<Dna className="w-3.5 h-3.5" />} label="Learning Genome" />
              <FooterBadge icon={<GitBranch className="w-3.5 h-3.5" />} label="Knowledge Graph" />
              <FooterBadge icon={<Sparkles className="w-3.5 h-3.5" />} label="IA Socrática" />
              <FooterBadge icon={<ShieldCheck className="w-3.5 h-3.5" />} label="Evidências" />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/comecar" className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-950 px-4 py-2.5 text-sm font-bold hover:bg-slate-100 transition-colors">
                <Compass className="w-4 h-4" /> Começar agora
              </Link>
              <Link to="/tour" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-900 transition-colors">
                <Rocket className="w-4 h-4" /> Fazer tour
              </Link>
            </div>
          </div>

          <FooterColumn title="Produto" links={PRODUCT_LINKS} icon={<BookOpen className="w-4 h-4" />} />
          <FooterColumn title="Ecossistema" links={ECOSYSTEM_LINKS} icon={<Building2 className="w-4 h-4" />} />
          <FooterColumn title="Laboratório" links={LAB_LINKS} icon={<Beaker className="w-4 h-4" />} />
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-10">
          <FooterSignal icon={<GraduationCap className="w-5 h-5" />} title="Para educadores" text="Insights acionáveis, não apenas relatórios." />
          <FooterSignal icon={<HeartHandshake className="w-5 h-5" />} title="Para famílias" text="Evolução compreensível e conversas positivas." />
          <FooterSignal icon={<Network className="w-5 h-5" />} title="Para redes" text="Visão sistêmica com prioridade pedagógica." />
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Desenvolvido por Alternative Ventures Ltda.</p>
            <p className="text-xs text-slate-500 mt-1">CNPJ 61.920.356/0001-38</p>
          </div>
          <Link to="/empresa" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-300 hover:text-white transition-colors">
            <Building2 className="w-4 h-4" /> Conhecer a empresa desenvolvedora
          </Link>
        </div>

        <div className="border-t border-slate-800 mt-7 pt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MindSteps. Inteligência pedagógica para aprendizagem real.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/empresa" className="hover:text-white transition-colors">Alternative Ventures</Link>
            <Link to="/comecar" className="hover:text-white transition-colors">Começar</Link>
            <Link to="/tour" className="hover:text-white transition-colors">Tour guiado</Link>
            <Link to="/grafo" className="hover:text-white transition-colors">Knowledge Graph</Link>
            <Link to="/genoma" className="hover:text-white transition-colors">Learning Genome</Link>
            <Link to="/seguranca" className="hover:text-white transition-colors">Segurança</Link>
            <Link to="/roadmap" className="hover:text-white transition-colors">Roadmap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links, icon }: { title: string; links: Array<{ label: string; route: string }>; icon: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-white mb-4">
        {icon}
        <h4 className="font-semibold">{title}</h4>
      </div>
      <ul className="space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.route}>
            <Link to={link.route} className="text-slate-400 hover:text-white transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FooterBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
      {icon}
      {label}
    </span>
  )
}

function FooterSignal({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex gap-3">
      <div className="w-9 h-9 rounded-xl bg-slate-800 text-primary-300 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-white text-sm">{title}</p>
        <p className="text-xs text-slate-500 mt-1">{text}</p>
      </div>
    </div>
  )
}
