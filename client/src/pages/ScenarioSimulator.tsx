import { useMemo, useState } from 'react'
import { Brain, CheckCircle2, Compass, FlaskConical, HeartHandshake, Lightbulb, ShieldCheck, Sparkles, Target, TrendingUp } from 'lucide-react'

const SCENARIOS = [
  {
    id: 'math-8',
    label: '8 anos • Matemática',
    title: 'Dificuldade em frações',
    description: 'A criança entende divisão simples, mas ainda confunde numerador e denominador.',
    learningState: 'Precisa de recuperação guiada',
    flow: 'Muito difícil',
    confidence: 4,
    curiosity: 7,
    risk: 82,
    riskConcept: 'Porcentagem',
    strategy: 'Analogia concreta + pergunta socrática curta',
    tutorMessage: 'Imagine uma pizza dividida em 4 partes. Se você comeu 1 parte, o número 4 conta o quê exatamente?',
    teacherAction: 'Voltar à ideia de parte e todo usando objetos concretos antes de avançar.',
    familyAction: 'Separar frutas ou brinquedos em grupos e conversar sobre quantas partes formam o todo.',
    evidence: ['Confusão repetida entre numerador e denominador', 'Carga cognitiva elevada', 'Pré-requisito “parte e todo” ainda frágil'],
  },
  {
    id: 'science-12',
    label: '12 anos • Ciências',
    title: 'Alta curiosidade científica',
    description: 'O estudante faz boas perguntas e aprende melhor quando investiga fenômenos reais.',
    learningState: 'Pronto para desafio',
    flow: 'Fluxo produtivo',
    confidence: 8,
    curiosity: 9,
    risk: 24,
    riskConcept: 'Baixo risco imediato',
    strategy: 'Investigação guiada + missão experimental',
    tutorMessage: 'Que hipótese você criaria para explicar por que uma planta cresce inclinada em direção à janela?',
    teacherAction: 'Propor mini experimento com registro de hipótese, observação e conclusão.',
    familyAction: 'Ajudar a observar uma planta por alguns dias e registrar mudanças com fotos.',
    evidence: ['Perguntas espontâneas frequentes', 'Boa persistência', 'Responde melhor a investigação do que a explicação direta'],
  },
  {
    id: 'portuguese-15',
    label: '15 anos • Português',
    title: 'Inferência sem evidência textual',
    description: 'A estudante compreende o tema, mas conclui sem apontar pistas concretas do texto.',
    learningState: 'Em consolidação',
    flow: 'Fluxo produtivo',
    confidence: 6,
    curiosity: 6,
    risk: 67,
    riskConcept: 'Interpretação inferencial',
    strategy: 'Evidência antes da conclusão',
    tutorMessage: 'Qual trecho do texto dá a pista mais forte para a sua conclusão? Vamos escolher uma frase específica.',
    teacherAction: 'Pedir marcação de evidências antes de aceitar qualquer inferência.',
    familyAction: 'Conversar sobre notícias e perguntar: “qual parte do texto fez você pensar isso?”',
    evidence: ['Ideia principal identificada corretamente', 'Inferências sem citação de pistas', 'Melhora quando recebe uma pergunta de verificação'],
  },
]

export function ScenarioSimulatorPage() {
  const [selectedId, setSelectedId] = useState(SCENARIOS[0].id)
  const scenario = useMemo(() => SCENARIOS.find((item) => item.id === selectedId) || SCENARIOS[0], [selectedId])

  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-900 to-secondary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5">
            <FlaskConical className="w-4 h-4" /> Simulador Público do Core
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold max-w-4xl leading-tight">Veja como o MindSteps muda a estratégia para cada perfil de aluno.</h1>
          <p className="text-lg text-slate-200 mt-5 max-w-3xl">
            Escolha um cenário e compare estado de aprendizagem, risco previsto, resposta do tutor, ação docente e apoio familiar.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6">
          <aside className="space-y-3">
            {SCENARIOS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left rounded-3xl border p-5 transition-all ${selectedId === item.id ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-800 hover:border-primary-200'}`}
              >
                <p className={`text-sm font-semibold ${selectedId === item.id ? 'text-primary-100' : 'text-primary-700'}`}>{item.label}</p>
                <p className="font-bold text-lg mt-1">{item.title}</p>
                <p className={`text-sm mt-2 ${selectedId === item.id ? 'text-primary-100' : 'text-slate-500'}`}>{item.description}</p>
              </button>
            ))}
          </aside>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center"><Brain className="w-5 h-5" /></div>
                <div>
                  <p className="text-sm text-slate-500">Leitura do Core</p>
                  <h2 className="font-bold text-xl text-slate-900">{scenario.title}</h2>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Metric label="Estado" value={scenario.learningState} icon={<Compass className="w-4 h-4" />} />
                <Metric label="Fluxo" value={scenario.flow} icon={<TrendingUp className="w-4 h-4" />} />
                <Metric label="Confiança" value={`${scenario.confidence}/10`} icon={<ShieldCheck className="w-4 h-4" />} />
                <Metric label="Curiosidade" value={`${scenario.curiosity}/10`} icon={<Sparkles className="w-4 h-4" />} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-red-600" />
                  <h3 className="font-bold text-lg text-slate-900">Previsão</h3>
                </div>
                <p className="text-4xl font-bold text-slate-900">{scenario.risk}%</p>
                <p className="font-semibold text-slate-800 mt-1">{scenario.riskConcept}</p>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden mt-4">
                  <div className="h-full rounded-full bg-red-500" style={{ width: `${scenario.risk}%` }} />
                </div>
                <p className="text-sm text-slate-500 mt-3">Probabilidade demonstrativa calculada a partir dos sinais do cenário.</p>
              </div>

              <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-amber-300" />
                  <h3 className="font-bold text-lg">Estratégia escolhida</h3>
                </div>
                <p className="text-lg font-semibold">{scenario.strategy}</p>
                <p className="text-sm text-slate-300 mt-4">Resposta sugerida do Tutor:</p>
                <blockquote className="mt-2 rounded-2xl bg-white/10 border border-white/10 p-4 text-slate-100">“{scenario.tutorMessage}”</blockquote>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ActionCard title="Ação para o professor" text={scenario.teacherAction} icon={<Brain className="w-5 h-5" />} />
              <ActionCard title="Apoio para a família" text={scenario.familyAction} icon={<HeartHandshake className="w-5 h-5" />} />
            </div>

            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Trilha de evidências</h3>
              <div className="space-y-3">
                {scenario.evidence.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">{icon}<span>{label}</span></div>
      <p className="font-bold text-slate-900">{value}</p>
    </div>
  )
}

function ActionCard({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
      <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">{icon}</div>
      <h3 className="font-bold text-lg text-slate-900">{title}</h3>
      <p className="text-slate-600 mt-2">{text}</p>
    </div>
  )
}
