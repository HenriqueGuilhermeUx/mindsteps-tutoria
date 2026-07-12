import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, ClipboardList, MessageCircle, RefreshCcw, ShieldCheck, Sparkles, Target } from 'lucide-react'

type TestItem = {
  id: string
  title: string
  description: string
  route: string
  evidence: string
}

const TESTS: TestItem[] = [
  {
    id: 'account',
    title: 'Criar conta e concluir onboarding',
    description: 'Valide cadastro, entrada, escolha de tutor e clareza das primeiras instruções.',
    route: '/auth?mode=register',
    evidence: 'Conta criada e primeira tela compreendida sem ajuda.',
  },
  {
    id: 'socratic',
    title: 'Testar o Tutor Socrático',
    description: 'Faça uma pergunta real, responda errado de propósito e observe se o tutor guia sem entregar a resposta.',
    route: '/chat',
    evidence: 'O tutor fez uma pergunta útil, acolhedora e relacionada ao erro.',
  },
  {
    id: 'hint',
    title: 'Pedir uma dica',
    description: 'Use o botão de dica após uma troca com o tutor e avalie se a ajuda mantém o raciocínio ativo.',
    route: '/chat',
    evidence: 'A dica ajudou sem resolver o problema pelo aluno.',
  },
  {
    id: 'dashboard',
    title: 'Abrir o painel do aluno',
    description: 'Confira se ritmo, foco, DNA e próximo passo são fáceis de entender.',
    route: '/dashboard',
    evidence: 'Foi possível explicar em uma frase o que o painel mostra.',
  },
  {
    id: 'journey',
    title: 'Explorar jornada e domínio',
    description: 'Compare o mapa de conceitos com o Centro de Domínio e verifique se a progressão faz sentido.',
    route: '/journey',
    evidence: 'O próximo conceito recomendado parece coerente.',
  },
  {
    id: 'missions',
    title: 'Escolher uma missão',
    description: 'Avalie se a missão é simples, útil e possível de realizar fora da tela.',
    route: '/missoes',
    evidence: 'A missão tem objetivo claro e ligação com aprendizagem real.',
  },
  {
    id: 'intelligence',
    title: 'Ver a inteligência do Core',
    description: 'Abra o laboratório público e verifique se previsões e evidências são compreensíveis.',
    route: '/inteligencia',
    evidence: 'A justificativa da decisão pedagógica ficou clara.',
  },
  {
    id: 'feedback',
    title: 'Registrar avaliação final',
    description: 'Dê notas, descreva travas e registre o que deve ser priorizado na próxima rodada.',
    route: '/feedback',
    evidence: 'Feedback salvo e pronto para exportação.',
  },
]

const STORAGE_KEY = 'mindsteps-alpha-test-protocol-v1'

function loadProgress(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function TestProtocolPage() {
  const [completed, setCompleted] = useState<string[]>(loadProgress)
  const progress = useMemo(() => Math.round((completed.length / TESTS.length) * 100), [completed])

  const toggle = (id: string) => {
    const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id]
    setCompleted(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const reset = () => {
    setCompleted([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-900 to-secondary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5">
            <ClipboardList className="w-4 h-4" /> Protocolo de Testes Alpha
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold max-w-4xl leading-tight">
            Um roteiro simples para testar o produto inteiro sem se perder.
          </h1>
          <p className="text-lg text-slate-200 max-w-3xl mt-5">
            Siga os passos, marque o que concluiu e registre evidências. O progresso fica salvo neste navegador.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-6">
          <aside className="space-y-5">
            <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Progresso</p>
                  <p className="text-2xl font-bold text-slate-900">{progress}%</p>
                </div>
              </div>

              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-primary-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-slate-500 mt-3">{completed.length} de {TESTS.length} etapas concluídas.</p>

              <button onClick={reset} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
                <RefreshCcw className="w-4 h-4" /> Reiniciar protocolo
              </button>

              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 mt-6">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
                  <ShieldCheck className="w-4 h-4" /> Regra principal
                </div>
                <p className="text-sm text-emerald-800">
                  Não avalie apenas se a tela está bonita. Observe se a experiência ajuda alguém a pensar, compreender e agir melhor.
                </p>
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            {TESTS.map((test, index) => {
              const done = completed.includes(test.id)
              return (
                <article key={test.id} className={`rounded-3xl border p-5 sm:p-6 shadow-sm transition-colors ${done ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                  <div className="flex items-start gap-4">
                    <button onClick={() => toggle(test.id)} className="mt-1 flex-shrink-0" aria-label={done ? 'Marcar como pendente' : 'Marcar como concluído'}>
                      {done ? <CheckCircle2 className="w-7 h-7 text-emerald-600" /> : <Circle className="w-7 h-7 text-slate-300" />}
                    </button>
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary-600">Etapa {index + 1}</p>
                      <h2 className="text-xl font-bold text-slate-900 mt-1">{test.title}</h2>
                      <p className="text-slate-600 mt-2">{test.description}</p>
                      <div className="rounded-2xl bg-white/70 border border-slate-100 p-4 mt-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Evidência esperada</p>
                        <p className="text-sm text-slate-700">{test.evidence}</p>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <Link to={test.route} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 text-white px-4 py-2.5 font-semibold hover:bg-primary-700 transition-colors">
                          <Sparkles className="w-4 h-4" /> Abrir etapa
                        </Link>
                        <button onClick={() => toggle(test.id)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-2.5 font-semibold hover:bg-slate-50 transition-colors">
                          {done ? 'Reabrir etapa' : 'Marcar concluída'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}

            {progress === 100 && (
              <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-6 h-6 text-primary-300" />
                  <h2 className="text-2xl font-bold">Protocolo concluído</h2>
                </div>
                <p className="text-slate-300 mb-5">Agora transforme as observações em prioridades concretas no Feedback Lab.</p>
                <Link to="/feedback" className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-5 py-3 font-bold hover:bg-slate-100 transition-colors">
                  Registrar avaliação final
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
