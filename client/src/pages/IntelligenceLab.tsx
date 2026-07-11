import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, Brain, CheckCircle2, Eye, FlaskConical, Lightbulb, ShieldCheck, Sparkles, Target, TrendingUp } from 'lucide-react'

const RISKS = [
  {
    concept: 'Porcentagem',
    probability: 82,
    reason: 'Razão ainda apresenta sinais de fragilidade.',
    prevention: 'Revisar comparação entre quantidades antes de avançar.',
    level: 'Alto',
  },
  {
    concept: 'Inferência textual',
    probability: 61,
    reason: 'O aluno identifica a ideia principal, mas ainda usa poucas pistas do texto.',
    prevention: 'Pedir que destaque duas evidências antes de concluir.',
    level: 'Médio',
  },
  {
    concept: 'Probabilidade',
    probability: 38,
    reason: 'Frações estão em consolidação e podem afetar o próximo conteúdo.',
    prevention: 'Aplicar uma missão curta com casos favoráveis e total de possibilidades.',
    level: 'Baixo',
  },
]

const EVIDENCE = [
  {
    strength: 'FORTE',
    title: 'Lacuna em Razão',
    detail: 'O padrão apareceu em três tentativas recentes e afetou respostas sobre porcentagem.',
  },
  {
    strength: 'MODERADA',
    title: 'Queda temporária de confiança',
    detail: 'O aluno pediu a resposta pronta após uma sequência de erros.',
  },
  {
    strength: 'FORTE',
    title: 'Analogia concreta funciona melhor',
    detail: 'Exemplos com objetos e situações do cotidiano produziram maior persistência.',
  },
]

export function IntelligenceLabPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-900 to-secondary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5">
                <FlaskConical className="w-4 h-4" /> Intelligence Lab Alpha
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
                Veja como o MindSteps pensa antes de responder.
              </h1>
              <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
                Esta área demonstra previsão de risco, trilha de evidências e decisão pedagógica. Os dados abaixo são demonstrativos, mas representam a estrutura real já construída no Core.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <Link to="/auth?mode=register" className="inline-flex items-center justify-center rounded-xl bg-white text-primary-800 px-6 py-3 font-bold hover:bg-primary-50 transition-colors">
                  Testar com uma conta
                </Link>
                <Link to="/testes" className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white px-6 py-3 font-bold hover:bg-white/15 transition-colors">
                  Voltar ao Alpha Lab
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/15 p-6 backdrop-blur">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white text-primary-700 flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-primary-100">Decisão atual</p>
                  <p className="font-bold text-xl">Revisar antes de avançar</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <SummaryRow label="Confiança da decisão" value="8/10" />
                <SummaryRow label="Risco principal" value="Porcentagem" />
                <SummaryRow label="Estratégia sugerida" value="Analogia concreta" />
                <SummaryRow label="Próximo movimento" value="Pergunta socrática curta" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <Metric icon={<TrendingUp className="w-5 h-5" />} label="Riscos previstos" value="3" />
          <Metric icon={<Eye className="w-5 h-5" />} label="Evidências usadas" value="7" />
          <Metric icon={<ShieldCheck className="w-5 h-5" />} label="Confiança" value="8/10" />
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Previsões de aprendizagem</h2>
                  <p className="text-sm text-slate-500">O sistema tenta prevenir dificuldades antes que elas apareçam.</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {RISKS.map((risk) => (
                <div key={risk.concept} className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{risk.concept}</h3>
                      <p className="text-sm text-slate-500">Risco {risk.level.toLowerCase()}</p>
                    </div>
                    <span className="rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-sm font-bold">
                      {risk.probability}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden mb-3">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${risk.probability}%` }} />
                  </div>
                  <p className="text-sm text-slate-700"><strong>Motivo:</strong> {risk.reason}</p>
                  <p className="text-sm text-emerald-700 mt-1"><strong>Prevenção:</strong> {risk.prevention}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Trilha de evidências</h2>
                  <p className="text-sm text-slate-500">Por que o Core tomou essa decisão.</p>
                </div>
              </div>

              <div className="space-y-3">
                {EVIDENCE.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <span className="rounded-full bg-primary-50 text-primary-700 px-2 py-1 text-[11px] font-bold">{item.strength}</span>
                    </div>
                    <p className="text-sm text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-amber-300" />
                <h2 className="font-bold text-lg">Ação pedagógica sugerida</h2>
              </div>
              <p className="text-slate-300 mb-4">
                Voltar um passo, usar uma situação concreta e verificar compreensão com uma única pergunta antes de seguir.
              </p>
              <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                <p className="text-sm text-slate-300 mb-1">Pergunta sugerida</p>
                <p className="font-semibold">“Se 25 de cada 100 alunos escolheram azul, que parte do grupo isso representa?”</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h2 className="font-bold text-slate-900">Próxima etapa do desenvolvimento</h2>
            </div>
            <p className="text-sm text-slate-600">Conectar estes painéis aos dados reais gerados em cada conversa do Tutor.</p>
          </div>
          <Link to="/auth?mode=register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 text-white px-5 py-3 font-bold hover:bg-primary-700 transition-colors">
            Entrar no Alpha <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white/10 px-4 py-3">
      <span className="text-slate-300">{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm">
      <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
