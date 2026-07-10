import { Link } from 'react-router-dom'
import { useAuthStore, useChatStore } from '@/stores'
import { Brain, CalendarDays, CheckCircle2, HeartHandshake, MessageCircleHeart, Moon, Sparkles, Sun, TrendingUp } from 'lucide-react'

const FAMILY_MESSAGES = [
  {
    title: 'Curiosidade em alta',
    message: 'Hoje houve bons sinais de curiosidade. Uma conversa curta pode reforçar esse interesse.',
    action: 'Pergunte: “o que você descobriu hoje?”',
    tone: 'celebratory',
  },
  {
    title: 'Valorize o esforço',
    message: 'O processo de aprendizagem ficou desafiador em alguns momentos.',
    action: 'Evite cobrar resposta certa. Pergunte qual parte pareceu mais difícil.',
    tone: 'supportive',
  },
  {
    title: 'Convite para explicar',
    message: 'Explicar com as próprias palavras ajuda a consolidar o que foi aprendido.',
    action: 'Peça um exemplo simples usando algo de casa.',
    tone: 'encouraging',
  },
]

const WEEK = [
  { day: 'Seg', curiosity: 62, confidence: 55 },
  { day: 'Ter', curiosity: 68, confidence: 58 },
  { day: 'Qua', curiosity: 71, confidence: 61 },
  { day: 'Qui', curiosity: 78, confidence: 66 },
  { day: 'Sex', curiosity: 84, confidence: 72 },
]

export function FamilyDashboardPage() {
  const { profile } = useAuthStore()
  const { messages } = useChatStore()
  const interactions = messages.filter((message) => message.role === 'user').length

  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-rose-500 via-fuchsia-600 to-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm mb-4">
                <HeartHandshake className="w-4 h-4" /> Family Companion Alpha
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">Acompanhar sem pressionar.</h1>
              <p className="text-rose-50 max-w-2xl">
                O painel da família traduz sinais pedagógicos em conversas simples, positivas e úteis para apoiar {profile?.name || 'o estudante'} em casa.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/passport" className="rounded-xl bg-white text-fuchsia-700 px-5 py-3 font-semibold hover:bg-rose-50 transition-colors">
                  Ver Passport
                </Link>
                <Link to="/chat" className="rounded-xl bg-white/10 px-5 py-3 font-semibold hover:bg-white/20 transition-colors">
                  Abrir Tutor
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/15 p-5 backdrop-blur">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white text-fuchsia-700 flex items-center justify-center">
                  <MessageCircleHeart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-rose-100">Resumo de hoje</p>
                  <p className="font-bold text-xl">{interactions > 0 ? 'Aprendizagem em movimento' : 'Pronto para começar'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FamilyStat label="Interações" value={interactions} />
                <FamilyStat label="Streak" value={profile?.streak ?? 0} />
                <FamilyStat label="Nível" value={profile?.level ?? 1} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Sugestões para a família</h2>
              <p className="text-sm text-slate-500">Mensagens acionáveis, sem transformar a família em fiscal de nota.</p>
            </div>
          </div>

          <div className="space-y-4">
            {FAMILY_MESSAGES.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-fuchsia-600 flex items-center justify-center flex-shrink-0">
                    {item.tone === 'celebratory' ? <Sparkles className="w-5 h-5" /> : item.tone === 'supportive' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{item.message}</p>
                    <p className="text-sm font-medium text-fuchsia-700 mt-2">Ação sugerida: {item.action}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Evolução da semana</h2>
                <p className="text-sm text-slate-500">Visual Alpha para validar entendimento.</p>
              </div>
            </div>

            <div className="space-y-4">
              {WEEK.map((day) => (
                <div key={day.day}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{day.day}</span>
                    <span className="text-slate-500">Curiosidade {day.curiosity}% • Confiança {day.confidence}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-fuchsia-500" style={{ width: `${day.curiosity}%` }} /></div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-primary-500" style={{ width: `${day.confidence}%` }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <CalendarDays className="w-6 h-6 text-rose-300" />
              <h2 className="font-bold text-lg">Conversa de hoje</h2>
            </div>
            <p className="text-slate-300 mb-4">Uma pergunta simples pode abrir espaço para a criança refletir sem sentir cobrança.</p>
            <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
              <p className="font-semibold">“Qual foi a coisa mais interessante que você percebeu hoje?”</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-100 text-accent-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Princípio do Family Companion</h2>
              <p className="text-sm text-slate-600">Apoiar curiosidade, confiança e persistência — sem reduzir aprendizagem a nota.</p>
            </div>
          </div>
          <Link to="/dashboard" className="text-primary-700 font-semibold hover:underline">Ver painel do aluno →</Link>
        </div>
      </section>
    </main>
  )
}

function FamilyStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
      <p className="text-xs text-rose-100">{label}</p>
      <p className="font-bold text-xl">{value}</p>
    </div>
  )
}
