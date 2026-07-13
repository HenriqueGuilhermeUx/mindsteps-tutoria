import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, BookOpenCheck, BrainCircuit, Building2, CheckCircle2, Circle, GitBranch, LockKeyhole, Route, Sparkles, Target } from 'lucide-react'

type NodeStatus = 'mastered' | 'learning' | 'risk' | 'locked' | 'next'

type ConceptNode = {
  id: string
  label: string
  status: NodeStatus
  mastery: number
  description: string
  prerequisites: string[]
  unlocks: string[]
  evidence: string
}

const CONCEPTS: ConceptNode[] = [
  {
    id: 'numeros',
    label: 'Números',
    status: 'mastered',
    mastery: 94,
    description: 'Base para reconhecer quantidades, comparar valores e operar com segurança.',
    prerequisites: [],
    unlocks: ['operacoes'],
    evidence: 'Aplicou o conceito em diferentes contextos e explicou com palavras próprias.',
  },
  {
    id: 'operacoes',
    label: 'Operações',
    status: 'mastered',
    mastery: 88,
    description: 'Uso de adição, subtração, multiplicação e divisão para resolver problemas.',
    prerequisites: ['numeros'],
    unlocks: ['fracoes'],
    evidence: 'Resolveu problemas mistos com baixa necessidade de ajuda.',
  },
  {
    id: 'fracoes',
    label: 'Frações',
    status: 'learning',
    mastery: 72,
    description: 'Compreensão de partes, todo, equivalência e representação de quantidades.',
    prerequisites: ['operacoes'],
    unlocks: ['razao', 'porcentagem'],
    evidence: 'Reconhece representações, mas ainda oscila em equivalência e comparação.',
  },
  {
    id: 'razao',
    label: 'Razão',
    status: 'risk',
    mastery: 46,
    description: 'Comparação entre duas grandezas e relação proporcional entre quantidades.',
    prerequisites: ['fracoes'],
    unlocks: ['proporcao'],
    evidence: 'Ainda confunde parte-todo com comparação entre grandezas.',
  },
  {
    id: 'porcentagem',
    label: 'Porcentagem',
    status: 'next',
    mastery: 18,
    description: 'Representação de uma razão com base em cem e aplicação em situações reais.',
    prerequisites: ['fracoes', 'razao'],
    unlocks: ['juros'],
    evidence: 'Próximo conceito recomendado após fortalecer razão.',
  },
  {
    id: 'proporcao',
    label: 'Proporção',
    status: 'locked',
    mastery: 0,
    description: 'Relação de igualdade entre razões e base para escalas e regra de três.',
    prerequisites: ['razao'],
    unlocks: ['regra-de-tres'],
    evidence: 'Bloqueado até razão alcançar evidência suficiente.',
  },
  {
    id: 'regra-de-tres',
    label: 'Regra de três',
    status: 'locked',
    mastery: 0,
    description: 'Estratégia para encontrar valores desconhecidos em relações proporcionais.',
    prerequisites: ['proporcao'],
    unlocks: ['funcoes'],
    evidence: 'Ainda não iniciado.',
  },
  {
    id: 'juros',
    label: 'Juros',
    status: 'locked',
    mastery: 0,
    description: 'Aplicação de porcentagem em crescimento, descontos e educação financeira.',
    prerequisites: ['porcentagem'],
    unlocks: [],
    evidence: 'Ainda não iniciado.',
  },
  {
    id: 'funcoes',
    label: 'Funções',
    status: 'locked',
    mastery: 0,
    description: 'Relações entre variáveis, padrões e representação matemática de mudanças.',
    prerequisites: ['regra-de-tres'],
    unlocks: [],
    evidence: 'Ainda não iniciado.',
  },
]

const STATUS_COPY: Record<NodeStatus, { label: string; className: string }> = {
  mastered: { label: 'Dominado', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  learning: { label: 'Aprendendo', className: 'bg-primary-100 text-primary-700 border-primary-200' },
  risk: { label: 'Atenção', className: 'bg-rose-100 text-rose-700 border-rose-200' },
  locked: { label: 'Bloqueado', className: 'bg-slate-100 text-slate-500 border-slate-200' },
  next: { label: 'Próximo', className: 'bg-amber-100 text-amber-700 border-amber-200' },
}

export function KnowledgeGraphPage() {
  const [selectedId, setSelectedId] = useState('fracoes')
  const selected = useMemo(() => CONCEPTS.find((concept) => concept.id === selectedId) ?? CONCEPTS[0], [selectedId])
  const conceptById = (id: string) => CONCEPTS.find((concept) => concept.id === id)?.label ?? id

  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-primary-950 to-secondary-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-[1fr_0.85fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm mb-5">
              <GitBranch className="w-4 h-4" /> Knowledge Graph Alpha
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight">O mapa vivo do que já foi aprendido e do que vem depois.</h1>
            <p className="text-lg text-slate-200 leading-relaxed mt-5 max-w-3xl">
              O MindSteps conecta conceitos, pré-requisitos, evidências e riscos para recomendar o próximo passo com mais contexto do que uma sequência fixa de aulas.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link to="/journey" className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-950 px-5 py-3 font-bold hover:bg-slate-100 transition-colors">
                <Route className="w-5 h-5" /> Abrir jornada
              </Link>
              <Link to="/inteligencia" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-bold hover:bg-white/15 transition-colors">
                <BrainCircuit className="w-5 h-5" /> Ver inteligência
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-slate-300">Recomendação atual</p>
            <div className="flex items-start gap-4 mt-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-300 text-amber-950 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Fortalecer Razão</h2>
                <p className="text-slate-300 mt-2">Isso reduz o risco futuro em Porcentagem e prepara o caminho para Proporção.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6">
              <HeroStat value="9" label="conceitos" />
              <HeroStat value="2" label="dominados" />
              <HeroStat value="1" label="em atenção" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid xl:grid-cols-[1.35fr_0.65fr] gap-6">
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 sm:p-7 overflow-x-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Mapa de Matemática</h2>
              <p className="text-sm text-slate-500 mt-1">Selecione um conceito para abrir evidências e dependências.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STATUS_COPY) as NodeStatus[]).map((status) => (
                <span key={status} className={`rounded-full border px-3 py-1 text-xs font-bold ${STATUS_COPY[status].className}`}>{STATUS_COPY[status].label}</span>
              ))}
            </div>
          </div>

          <div className="min-w-[760px] rounded-3xl bg-slate-950 p-7 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className="relative space-y-8">
              <GraphRow concepts={['numeros']} selectedId={selectedId} onSelect={setSelectedId} />
              <Connector />
              <GraphRow concepts={['operacoes']} selectedId={selectedId} onSelect={setSelectedId} />
              <Connector />
              <GraphRow concepts={['fracoes']} selectedId={selectedId} onSelect={setSelectedId} />
              <div className="flex justify-center gap-36 text-slate-600"><ArrowRight className="w-5 h-5 rotate-45" /><ArrowRight className="w-5 h-5 rotate-[135deg]" /></div>
              <GraphRow concepts={['razao', 'porcentagem']} selectedId={selectedId} onSelect={setSelectedId} />
              <div className="grid grid-cols-2 gap-16 text-slate-600"><Connector /><Connector /></div>
              <GraphRow concepts={['proporcao', 'juros']} selectedId={selectedId} onSelect={setSelectedId} />
              <Connector align="left" />
              <GraphRow concepts={['regra-de-tres']} selectedId={selectedId} onSelect={setSelectedId} />
              <Connector />
              <GraphRow concepts={['funcoes']} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Conceito selecionado</p>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">{selected.label}</h2>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${STATUS_COPY[selected.status].className}`}>{STATUS_COPY[selected.status].label}</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mt-4">{selected.description}</p>

            <div className="mt-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Domínio estimado</span>
                <span className="font-bold text-slate-900">{selected.mastery}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${selected.mastery}%` }} />
              </div>
            </div>

            <DetailBlock title="Evidência atual" icon={<Sparkles className="w-4 h-4" />}>
              {selected.evidence}
            </DetailBlock>

            <DetailBlock title="Pré-requisitos" icon={<BookOpenCheck className="w-4 h-4" />}>
              {selected.prerequisites.length ? selected.prerequisites.map(conceptById).join(' • ') : 'Conceito-base'}
            </DetailBlock>

            <DetailBlock title="Desbloqueia" icon={<GitBranch className="w-4 h-4" />}>
              {selected.unlocks.length ? selected.unlocks.map(conceptById).join(' • ') : 'Nenhum conceito mapeado nesta versão'}
            </DetailBlock>
          </div>

          <div className="rounded-3xl bg-amber-50 border border-amber-100 p-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-950">Como interpretar</h3>
                <p className="text-sm text-amber-900/80 mt-2 leading-relaxed">Os estados deste Alpha são demonstrativos. Em produção, cada mudança deverá ser sustentada por múltiplas evidências e poderá ser revisada por educadores.</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <p className="text-sm text-primary-300 font-semibold">Infraestrutura pedagógica</p>
            <h2 className="text-2xl font-bold mt-2">Do conceito isolado para uma rede de aprendizagem explicável.</h2>
            <p className="text-slate-300 mt-2 max-w-3xl">O grafo alimentará Journey, Prediction Engine, Mastery Engine, Teacher Copilot e recomendações de missão.</p>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/10 px-5 py-4 text-sm">
            <p className="font-semibold">Desenvolvido por Alternative Ventures Ltda.</p>
            <p className="text-slate-400 mt-1">CNPJ 61.920.356/0001-38</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function GraphRow({ concepts, selectedId, onSelect }: { concepts: string[]; selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex justify-center gap-20">
      {concepts.map((id) => {
        const concept = CONCEPTS.find((item) => item.id === id)!
        const selected = selectedId === id
        return (
          <button key={id} onClick={() => onSelect(id)} className={`w-48 rounded-2xl border p-4 text-left transition-all ${selected ? 'ring-4 ring-white/20 scale-105' : 'hover:-translate-y-1'} ${nodeClass(concept.status)}`}>
            <div className="flex items-center justify-between gap-2">
              <NodeIcon status={concept.status} />
              <span className="text-xs font-bold opacity-80">{concept.mastery}%</span>
            </div>
            <p className="font-bold mt-3">{concept.label}</p>
            <p className="text-xs opacity-75 mt-1">{STATUS_COPY[concept.status].label}</p>
          </button>
        )
      })}
    </div>
  )
}

function Connector({ align = 'center' }: { align?: 'center' | 'left' }) {
  return <div className={`flex ${align === 'left' ? 'justify-start pl-[170px]' : 'justify-center'}`}><div className="w-px h-8 bg-slate-600" /></div>
}

function NodeIcon({ status }: { status: NodeStatus }) {
  if (status === 'mastered') return <CheckCircle2 className="w-5 h-5" />
  if (status === 'risk') return <AlertTriangle className="w-5 h-5" />
  if (status === 'locked') return <LockKeyhole className="w-5 h-5" />
  if (status === 'next') return <Target className="w-5 h-5" />
  return <Circle className="w-5 h-5" />
}

function nodeClass(status: NodeStatus) {
  if (status === 'mastered') return 'bg-emerald-400 text-emerald-950 border-emerald-300'
  if (status === 'learning') return 'bg-primary-400 text-primary-950 border-primary-300'
  if (status === 'risk') return 'bg-rose-400 text-rose-950 border-rose-300'
  if (status === 'next') return 'bg-amber-300 text-amber-950 border-amber-200'
  return 'bg-slate-800 text-slate-400 border-slate-700'
}

function DetailBlock({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 mt-3">
      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide">{icon}{title}</div>
      <p className="text-sm text-slate-700 mt-2 leading-relaxed">{children}</p>
    </div>
  )
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-300 mt-1">{label}</p>
    </div>
  )
}
