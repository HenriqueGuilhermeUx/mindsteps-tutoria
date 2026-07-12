import { Link } from 'react-router-dom'
import { BarChart3, CheckCircle2, ClipboardList, Flag, GraduationCap, HeartHandshake, School, ShieldCheck, Sparkles, Users } from 'lucide-react'

const READINESS = [
  { label: 'Tutor Socrático', value: 88 },
  { label: 'Experiência do aluno', value: 76 },
  { label: 'Teacher Copilot', value: 64 },
  { label: 'Family Companion', value: 58 },
  { label: 'Dados reais do Core', value: 42 },
]

const PHASES = [
  { title: 'Fase 1 · Teste interno', text: '3 perfis fictícios, 20 conversas e revisão de linguagem.', status: 'Em andamento' },
  { title: 'Fase 2 · Grupo controlado', text: '5 a 10 alunos, 1 professor e responsáveis convidados.', status: 'Próxima' },
  { title: 'Fase 3 · Turma piloto', text: 'Uso por 4 semanas com métricas pedagógicas e de produto.', status: 'Planejada' },
  { title: 'Fase 4 · Escola parceira', text: 'Expansão responsável com formação e acompanhamento.', status: 'Futura' },
]

const METRICS = [
  'Qualidade das perguntas socráticas',
  'Persistência após erro',
  'Recuperação de confiança',
  'Clareza para professor e família',
  'Tempo até uma descoberta real',
  'Taxa de retorno e conclusão de missão',
]

export function PilotCenterPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-900 to-secondary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5">
              <Flag className="w-4 h-4" /> Pilot Readiness Center
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">Do Alpha ao primeiro piloto real.</h1>
            <p className="text-lg text-slate-200 leading-relaxed">
              Esta área organiza o caminho para colocar o MindSteps nas mãos de alunos, professores e famílias com segurança, métricas claras e ciclos curtos de aprendizagem.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <Link to="/testes" className="inline-flex items-center justify-center rounded-xl bg-white text-primary-800 px-6 py-3 font-bold hover:bg-primary-50 transition-colors">
                Abrir Alpha Lab
              </Link>
              <Link to="/feedback" className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white px-6 py-3 font-bold hover:bg-white/15 transition-colors">
                Registrar teste
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center"><BarChart3 className="w-5 h-5" /></div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Prontidão atual</h2>
              <p className="text-sm text-slate-500">Estimativa Alpha para orientar prioridades.</p>
            </div>
          </div>
          <div className="space-y-4">
            {READINESS.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-700">{item.label}</span><span className="font-bold text-primary-700">{item.value}%</span></div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-primary-500" style={{ width: `${item.value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><ClipboardList className="w-5 h-5" /></div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Plano de validação</h2>
              <p className="text-sm text-slate-500">Avançar somente quando cada etapa gerar evidência suficiente.</p>
            </div>
          </div>
          <div className="space-y-3">
            {PHASES.map((phase) => (
              <div key={phase.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="font-bold text-slate-900">{phase.title}</p>
                  <span className="text-xs font-bold rounded-full bg-white border border-slate-200 px-3 py-1 text-slate-600">{phase.status}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">{phase.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 grid md:grid-cols-3 gap-5">
        <RoleCard icon={<GraduationCap className="w-5 h-5" />} title="Professor" text="Valida utilidade dos alertas, clareza das recomendações e aderência à prática pedagógica." />
        <RoleCard icon={<Users className="w-5 h-5" />} title="Aluno" text="Valida acolhimento, interesse, compreensão e vontade de continuar aprendendo." />
        <RoleCard icon={<HeartHandshake className="w-5 h-5" />} title="Família" text="Valida linguagem, confiança e valor das mensagens para apoiar sem pressionar." />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 grid lg:grid-cols-[1fr_0.8fr] gap-6">
        <div className="rounded-3xl bg-slate-900 text-white p-6">
          <div className="flex items-center gap-3 mb-5"><Sparkles className="w-6 h-6 text-primary-300" /><h2 className="font-bold text-xl">Métricas do piloto</h2></div>
          <div className="grid sm:grid-cols-2 gap-3">
            {METRICS.map((metric) => <div key={metric} className="rounded-2xl bg-white/10 border border-white/10 p-4 text-sm text-slate-100 flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 flex-shrink-0" />{metric}</div>)}
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4"><ShieldCheck className="w-5 h-5" /></div>
          <h2 className="font-bold text-slate-900 text-xl mb-3">Critérios para avançar</h2>
          <div className="space-y-3 text-sm text-slate-600">
            <p>• Nenhuma decisão de alto impacto baseada apenas em IA.</p>
            <p>• Professor e família recebem explicações compreensíveis.</p>
            <p>• Dados pessoais e pedagógicos coletados apenas com consentimento.</p>
            <p>• Resultados revisados antes de ampliar o número de participantes.</p>
          </div>
          <Link to="/pesquisa" className="inline-flex items-center gap-2 mt-5 text-primary-700 font-bold hover:underline"><School className="w-4 h-4" /> Ver princípios de pesquisa</Link>
        </div>
      </section>
    </main>
  )
}

function RoleCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm"><div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">{icon}</div><h3 className="font-bold text-slate-900">{title}</h3><p className="text-sm text-slate-600 mt-2">{text}</p></div>
}
