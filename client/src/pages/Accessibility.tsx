import { Link } from 'react-router-dom'
import { Accessibility, BatteryLow, CheckCircle2, Eye, Gauge, Keyboard, Languages, Network, ShieldCheck, Smartphone, Volume2, WifiOff } from 'lucide-react'

const PRINCIPLES = [
  {
    title: 'Funcionar em celular simples',
    text: 'A experiência principal deve continuar útil em telas pequenas, aparelhos modestos e navegadores comuns.',
    icon: Smartphone,
  },
  {
    title: 'Consumir menos dados',
    text: 'Priorizar texto, componentes leves, carregamento progressivo e evitar mídia pesada como requisito para aprender.',
    icon: BatteryLow,
  },
  {
    title: 'Ser compreensível',
    text: 'Linguagem clara, orientação passo a passo, poucas decisões por tela e feedback imediato para reduzir ansiedade.',
    icon: Eye,
  },
  {
    title: 'Oferecer caminhos alternativos',
    text: 'Leitura, áudio, teclado, toque e atividades offline devem coexistir sempre que fizer sentido pedagógico.',
    icon: Accessibility,
  },
]

const DELIVERY = [
  'Layouts responsivos com prioridade mobile-first.',
  'Textos e ações essenciais disponíveis sem animações obrigatórias.',
  'Estados de carregamento e erro em linguagem simples.',
  'Contraste, foco de teclado e áreas de toque amplas como padrão.',
  'Missões offline para transformar aprendizagem em ação no mundo real.',
  'Redução progressiva de dependências pesadas no fluxo principal.',
]

const NEXT = [
  { title: 'Modo conexão limitada', text: 'Detectar instabilidade e reduzir automaticamente elementos não essenciais.', icon: WifiOff },
  { title: 'Modo leitura e áudio', text: 'Permitir que instruções importantes também sejam ouvidas e repetidas.', icon: Volume2 },
  { title: 'Navegação por teclado', text: 'Revisar todas as áreas para garantir foco visível e sequência lógica.', icon: Keyboard },
  { title: 'Idioma e leitura simples', text: 'Preparar textos adaptáveis por idade, contexto e nível de compreensão.', icon: Languages },
  { title: 'Métricas de desempenho', text: 'Acompanhar peso das páginas, tempo de resposta e falhas em aparelhos modestos.', icon: Gauge },
  { title: 'Experiência offline parcial', text: 'Salvar missões, últimas orientações e progresso essencial para consulta sem internet.', icon: Network },
]

export function AccessibilityPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-950 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm mb-6">
              <Accessibility className="w-4 h-4" /> Acessibilidade e inclusão digital
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
              O melhor recurso possível, acessível também a quem tem menos tecnologia.
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mt-6 max-w-3xl">
              O MindSteps não será simplificado em potencial. A missão é entregar uma experiência completa, poderosa e transformadora, desenhada para continuar funcionando em celular simples, internet limitada e diferentes formas de aprender.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link to="/testes" className="inline-flex items-center justify-center rounded-xl bg-white text-slate-950 px-6 py-3 font-bold hover:bg-slate-100 transition-colors">
                Testar o Alpha
              </Link>
              <Link to="/feedback" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-bold hover:bg-white/15 transition-colors">
                Relatar barreira de acesso
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRINCIPLES.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-slate-900 text-lg">{item.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="rounded-3xl bg-slate-900 text-white p-7">
          <div className="flex items-center gap-3 mb-5">
            <ShieldCheck className="w-6 h-6 text-primary-300" />
            <h2 className="font-bold text-xl">Compromissos do produto</h2>
          </div>
          <div className="space-y-3">
            {DELIVERY.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 p-7 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-sm font-semibold text-primary-700">Próximas entregas</p>
              <h2 className="font-bold text-slate-900 text-2xl mt-1">Inclusão como requisito técnico</h2>
            </div>
            <Smartphone className="w-7 h-7 text-primary-600" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {NEXT.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <Icon className="w-5 h-5 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="rounded-3xl border border-primary-100 bg-primary-50 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Potência não pode depender do preço do aparelho.</h2>
            <p className="text-slate-600 mt-2 max-w-3xl">
              O objetivo é preservar toda a inteligência pedagógica do Core e adaptar a entrega ao contexto de cada pessoa. A conexão pode ser limitada; a ambição educacional, não.
            </p>
          </div>
          <Link to="/roadmap" className="inline-flex items-center justify-center rounded-xl bg-primary-700 text-white px-5 py-3 font-bold hover:bg-primary-800 transition-colors flex-shrink-0">
            Acompanhar roadmap
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Desenvolvido por Alternative Ventures Ltda.</p>
          <p className="mt-1">CNPJ 61.920.356/0001-38</p>
        </div>
      </section>
    </main>
  )
}
