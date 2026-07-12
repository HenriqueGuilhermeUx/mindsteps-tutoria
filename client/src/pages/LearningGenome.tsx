import { Link } from 'react-router-dom'
import { Activity, Brain, Compass, Dna, Gauge, Heart, Lightbulb, MessageCircle, Rocket, ShieldCheck, Sparkles, Target, Users } from 'lucide-react'

const DIMENSIONS = [
  { label: 'Curiosidade', value: 88, note: 'Explora perguntas novas com frequência.', icon: Sparkles },
  { label: 'Persistência', value: 79, note: 'Continua tentando depois de erros.', icon: Target },
  { label: 'Autonomia', value: 72, note: 'Já inicia parte das tarefas sem ajuda.', icon: Rocket },
  { label: 'Criatividade', value: 84, note: 'Cria analogias e caminhos próprios.', icon: Lightbulb },
  { label: 'Comunicação', value: 68, note: 'Explica melhor quando usa exemplos.', icon: MessageCircle },
  { label: 'Colaboração', value: 75, note: 'Aprende bem ao comparar ideias.', icon: Users },
]

const SIGNALS = [
  { title: 'Aprende melhor', value: 'Visual + analogias', icon: Brain },
  { title: 'Ritmo ideal', value: 'Blocos de 18–22 min', icon: Gauge },
  { title: 'Maior motivador', value: 'Desafios com propósito', icon: Compass },
  { title: 'Sinal de atenção', value: 'Confiança cai após repetição', icon: Heart },
]

const EVOLUTION = [
  { month: 'Abr', curiosity: 65, persistence: 58, autonomy: 48 },
  { month: 'Mai', curiosity: 72, persistence: 64, autonomy: 55 },
  { month: 'Jun', curiosity: 80, persistence: 71, autonomy: 64 },
  { month: 'Jul', curiosity: 88, persistence: 79, autonomy: 72 },
]

export function LearningGenomePage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-violet-950 to-primary-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm mb-6">
              <Dna className="w-4 h-4" /> Learning Genome Alpha
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight">O mapa vivo de como cada pessoa aprende.</h1>
            <p className="text-lg text-slate-300 mt-6 leading-relaxed max-w-2xl">
              O Learning Genome reúne sinais de ritmo, curiosidade, persistência, autonomia, comunicação e estratégias que funcionam melhor. Não é um rótulo: é uma hipótese dinâmica que evolui com novas evidências.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link to="/chat" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-950 px-6 py-3 font-bold hover:bg-slate-100 transition-colors">
                <MessageCircle className="w-5 h-5" /> Gerar novos sinais
              </Link>
              <Link to="/passport" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-bold hover:bg-white/15 transition-colors">
                Ver Learning Passport
              </Link>
            </div>
          </div>

          <div className="relative min-h-[430px] flex items-center justify-center">
            <div className="absolute w-80 h-80 rounded-full border border-violet-300/20" />
            <div className="absolute w-64 h-64 rounded-full border border-primary-300/25" />
            <div className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-violet-500/30 to-primary-500/30 blur-sm" />
            <div className="relative w-44 h-44 rounded-[3rem] bg-white text-violet-700 shadow-2xl flex flex-col items-center justify-center rotate-3">
              <Dna className="w-14 h-14" />
              <p className="font-bold text-xl mt-2">Genome</p>
              <p className="text-xs text-slate-500">atualização contínua</p>
            </div>
            <GenomeNode className="top-5 left-5" label="Curiosidade" value="88%" />
            <GenomeNode className="top-16 right-0" label="Persistência" value="79%" />
            <GenomeNode className="bottom-12 left-0" label="Criatividade" value="84%" />
            <GenomeNode className="bottom-4 right-6" label="Autonomia" value="72%" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {SIGNALS.map((signal) => {
            const Icon = signal.icon
            return (
              <div key={signal.title} className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5">
                <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></div>
                <p className="text-sm text-slate-500">{signal.title}</p>
                <p className="font-bold text-slate-900 mt-1">{signal.value}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 grid xl:grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-7">
            <div>
              <p className="text-sm font-bold text-violet-700">DIMENSÕES ATUAIS</p>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Perfil em evolução</h2>
            </div>
            <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold">Dados demonstrativos</span>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {DIMENSIONS.map((dimension) => {
              const Icon = dimension.icon
              return (
                <div key={dimension.label} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-violet-700 flex items-center justify-center"><Icon className="w-4 h-4" /></div>
                      <div>
                        <p className="font-semibold text-slate-900">{dimension.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{dimension.note}</p>
                      </div>
                    </div>
                    <span className="font-bold text-violet-700">{dimension.value}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden mt-4">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-primary-500" style={{ width: `${dimension.value}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-[2rem] bg-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-violet-300" />
            <div>
              <p className="text-sm text-violet-300 font-bold">EVOLUÇÃO TEMPORAL</p>
              <h2 className="text-2xl font-bold">Últimos quatro ciclos</h2>
            </div>
          </div>
          <div className="space-y-5">
            {EVOLUTION.map((point) => (
              <div key={point.month} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold">{point.month}</span>
                  <span className="text-xs text-slate-400">média {Math.round((point.curiosity + point.persistence + point.autonomy) / 3)}%</span>
                </div>
                <MiniBar label="Curiosidade" value={point.curiosity} />
                <MiniBar label="Persistência" value={point.persistence} />
                <MiniBar label="Autonomia" value={point.autonomy} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-[2rem] border border-violet-100 bg-violet-50 p-6 sm:p-8 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-violet-700 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Genome não é diagnóstico nem perfil fixo.</h2>
              <p className="text-slate-600 mt-2 max-w-3xl">Toda leitura deve permanecer revisável, contextual e explicável. O sistema deve mostrar evidências, nível de confiança e permitir supervisão humana antes de orientar decisões importantes.</p>
            </div>
          </div>
          <Link to="/seguranca" className="inline-flex items-center justify-center rounded-xl bg-violet-700 text-white px-5 py-3 font-bold hover:bg-violet-800 transition-colors">Ver princípios de segurança</Link>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">Desenvolvido por Alternative Ventures Ltda. · CNPJ 61.920.356/0001-38</p>
      </section>
    </main>
  )
}

function GenomeNode({ className, label, value }: { className: string; label: string; value: string }) {
  return (
    <div className={`absolute ${className} rounded-2xl border border-white/10 bg-white/10 backdrop-blur px-4 py-3 shadow-lg`}>
      <p className="text-xs text-slate-300">{label}</p>
      <p className="font-bold text-white">{value}</p>
    </div>
  )
}

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[88px_1fr_34px] items-center gap-2 mt-2 text-xs">
      <span className="text-slate-400">{label}</span>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-violet-400" style={{ width: `${value}%` }} /></div>
      <span className="text-slate-300 text-right">{value}</span>
    </div>
  )
}
