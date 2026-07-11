import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ClipboardCheck, Download, FlaskConical, MessageSquareText, RotateCcw, Save } from 'lucide-react'

const AREAS = [
  'Tutor Socrático',
  'Painel do Aluno',
  'Jornada',
  'Missões',
  'Domínio',
  'Learning Passport',
  'Teacher Copilot',
  'Family Companion',
  'Intelligence Lab',
]

interface FeedbackDraft {
  area: string
  role: string
  clarity: number
  usefulness: number
  visual: number
  trust: number
  bestPart: string
  confusion: string
  missing: string
  wouldUse: string
  createdAt: string
}

const STORAGE_KEY = 'mindsteps-alpha-feedback'

export function FeedbackLabPage() {
  const [area, setArea] = useState(AREAS[0])
  const [role, setRole] = useState('Aluno')
  const [clarity, setClarity] = useState(4)
  const [usefulness, setUsefulness] = useState(4)
  const [visual, setVisual] = useState(4)
  const [trust, setTrust] = useState(4)
  const [bestPart, setBestPart] = useState('')
  const [confusion, setConfusion] = useState('')
  const [missing, setMissing] = useState('')
  const [wouldUse, setWouldUse] = useState('Talvez')
  const [saved, setSaved] = useState(false)

  const average = useMemo(() => ((clarity + usefulness + visual + trust) / 4).toFixed(1), [clarity, usefulness, visual, trust])

  const buildFeedback = (): FeedbackDraft => ({
    area,
    role,
    clarity,
    usefulness,
    visual,
    trust,
    bestPart,
    confusion,
    missing,
    wouldUse,
    createdAt: new Date().toISOString(),
  })

  const saveFeedback = () => {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as FeedbackDraft[]
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, buildFeedback()]))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  const exportFeedback = () => {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as FeedbackDraft[]
    const payload = current.length ? current : [buildFeedback()]
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `mindsteps-feedback-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setClarity(4)
    setUsefulness(4)
    setVisual(4)
    setTrust(4)
    setBestPart('')
    setConfusion('')
    setMissing('')
    setWouldUse('Talvez')
  }

  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-900 to-secondary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm mb-5">
            <FlaskConical className="w-4 h-4" /> Alpha Feedback Lab
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Teste, avalie e registre o que precisa melhorar.</h1>
          <p className="text-slate-200 text-lg max-w-3xl">
            Este formulário salva avaliações no próprio navegador e permite exportar tudo em JSON. Assim conseguimos transformar impressão em evidência de produto.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_0.7fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Área testada">
              <select value={area} onChange={(event) => setArea(event.target.value)} className="input">
                {AREAS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Perfil do avaliador">
              <select value={role} onChange={(event) => setRole(event.target.value)} className="input">
                {['Aluno', 'Responsável', 'Professor', 'Gestor', 'Equipe interna'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Score label="Clareza" value={clarity} onChange={setClarity} />
            <Score label="Utilidade" value={usefulness} onChange={setUsefulness} />
            <Score label="Visual" value={visual} onChange={setVisual} />
            <Score label="Confiança" value={trust} onChange={setTrust} />
          </div>

          <Field label="O que funcionou melhor?">
            <textarea value={bestPart} onChange={(event) => setBestPart(event.target.value)} className="input min-h-24" placeholder="Ex.: linguagem simples, organização, recomendação útil..." />
          </Field>
          <Field label="O que confundiu ou travou?">
            <textarea value={confusion} onChange={(event) => setConfusion(event.target.value)} className="input min-h-24" placeholder="Ex.: não entendi o próximo passo, botão escondido..." />
          </Field>
          <Field label="O que está faltando?">
            <textarea value={missing} onChange={(event) => setMissing(event.target.value)} className="input min-h-24" placeholder="Ex.: dados reais, explicação, filtro, comparação..." />
          </Field>
          <Field label="Você usaria esta experiência novamente?">
            <select value={wouldUse} onChange={(event) => setWouldUse(event.target.value)} className="input">
              {['Sim', 'Talvez', 'Não'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={saveFeedback} className="btn-primary inline-flex items-center justify-center gap-2">
              {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? 'Avaliação salva' : 'Salvar avaliação'}
            </button>
            <button onClick={exportFeedback} className="btn-secondary inline-flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> Exportar avaliações
            </button>
            <button onClick={reset} className="btn-ghost inline-flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" /> Limpar
            </button>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl bg-slate-900 text-white p-6">
            <div className="flex items-center gap-3 mb-5">
              <ClipboardCheck className="w-6 h-6 text-primary-300" />
              <h2 className="font-bold text-xl">Resumo desta avaliação</h2>
            </div>
            <p className="text-slate-300 text-sm">Área</p>
            <p className="font-bold text-lg mb-4">{area}</p>
            <div className="rounded-2xl bg-white/10 border border-white/10 p-5 text-center">
              <p className="text-sm text-slate-300">Nota média</p>
              <p className="text-5xl font-bold mt-1">{average}</p>
              <p className="text-xs text-slate-400 mt-2">de 5</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
            <MessageSquareText className="w-6 h-6 text-primary-600 mb-3" />
            <h2 className="font-bold text-slate-900 mb-2">Roteiro rápido de teste</h2>
            <ol className="space-y-3 text-sm text-slate-600 list-decimal list-inside">
              <li>Abra uma experiência no Alpha Lab.</li>
              <li>Tente concluir uma tarefa real.</li>
              <li>Anote onde houve dúvida ou entusiasmo.</li>
              <li>Volte aqui e registre a avaliação.</li>
            </ol>
            <Link to="/testes" className="inline-flex mt-5 text-primary-700 font-bold hover:underline">Voltar ao Alpha Lab →</Link>
          </div>
        </aside>
      </section>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-sm font-semibold text-slate-700 mb-2">{label}</span>{children}</label>
}

function Score({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <div className="flex justify-between mb-3"><span className="font-semibold text-slate-800">{label}</span><span className="font-bold text-primary-700">{value}/5</span></div>
      <input type="range" min="1" max="5" value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full" />
    </div>
  )
}
