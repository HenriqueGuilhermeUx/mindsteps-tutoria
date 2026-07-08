import { Link } from 'react-router-dom'
import { AlertTriangle, Brain, CheckCircle2, ClipboardList, GraduationCap, Lightbulb, MessageSquareText, Users } from 'lucide-react'

const STUDENTS = [
  {
    name: 'Ana Clara',
    age: 8,
    subject: 'Matemática',
    state: 'Precisa apoio',
    insight: 'Pode estar confundindo parte e todo antes de frações.',
    action: 'Usar objetos concretos antes de cálculo formal.',
    priority: 'Alta',
  },
  {
    name: 'João Pedro',
    age: 12,
    subject: 'Ciências',
    state: 'Curioso',
    insight: 'Responde melhor quando a aula vira investigação.',
    action: 'Propor pergunta aberta e mini experimento.',
    priority: 'Média',
  },
  {
    name: 'Marina',
    age: 15,
    subject: 'Português',
    state: 'Em progresso',
    insight: 'Precisa sustentar inferências com pistas do texto.',
    action: 'Pedir que destaque evidências antes de responder.',
    priority: 'Média',
  },
]

const CLASS_INSIGHTS = [
  'A turma responde melhor a exemplos concretos antes da teoria.',
  'Frações e interpretação textual aparecem como pontos de recuperação.',
  'Curiosidade está alta quando as tarefas começam por perguntas investigativas.',
]

export function TeacherDashboardPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-sm mb-3">
                <GraduationCap className="w-4 h-4" /> Teacher Copilot Alpha
              </p>
              <h1 className="text-3xl font-bold text-slate-900">Painel do Professor</h1>
              <p className="text-slate-600 mt-2 max-w-2xl">
                Primeira visão operacional do MindSteps para transformar sinais do Core em ações pedagógicas simples.
              </p>
            </div>
            <Link to="/chat" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 text-white px-5 py-3 font-semibold hover:bg-primary-700 transition-colors">
              <MessageSquareText className="w-5 h-5" /> Testar Tutor
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-4 gap-4">
        <MetricCard icon={<Users className="w-5 h-5" />} label="Alunos" value="3" />
        <MetricCard icon={<AlertTriangle className="w-5 h-5" />} label="Alertas" value="1" />
        <MetricCard icon={<Lightbulb className="w-5 h-5" />} label="Insights" value="6" />
        <MetricCard icon={<CheckCircle2 className="w-5 h-5" />} label="Prontos p/ desafio" value="1" />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Alunos acompanhados</h2>
              <p className="text-sm text-slate-500">Dados simulados para teste de UX e fluxo pedagógico.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {STUDENTS.map((student) => (
              <div key={student.name} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{student.name}</h3>
                      <span className="text-xs rounded-full bg-slate-100 text-slate-600 px-2 py-1">{student.age} anos</span>
                      <span className="text-xs rounded-full bg-primary-50 text-primary-700 px-2 py-1">{student.subject}</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">Estado: {student.state}</p>
                    <p className="text-slate-800 font-medium">{student.insight}</p>
                    <p className="text-sm text-slate-600 mt-1">Ação sugerida: {student.action}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={student.priority === 'Alta' ? 'rounded-full bg-red-50 text-red-700 px-3 py-1 text-sm font-semibold' : 'rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-sm font-semibold'}>
                      {student.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl bg-slate-900 text-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className="w-6 h-6 text-primary-300" />
              <h2 className="font-bold text-lg">Resumo da turma</h2>
            </div>
            <div className="space-y-3">
              {CLASS_INSIGHTS.map((insight) => (
                <div key={insight} className="rounded-2xl bg-white/10 border border-white/10 p-3 text-sm text-slate-100">
                  {insight}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-2">Próximo passo</h2>
            <p className="text-sm text-slate-600 mb-4">
              Quando o backend persistir os sinais reais, este painel trocará os dados simulados por insights do Orchestrator.
            </p>
            <Link to="/dashboard" className="text-primary-700 font-semibold text-sm hover:underline">
              Ver painel do aluno →
            </Link>
          </div>
        </aside>
      </section>
    </main>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
