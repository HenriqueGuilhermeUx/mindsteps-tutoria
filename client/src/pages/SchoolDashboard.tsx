import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { BarChart3, Building2, CheckCircle2, Copy, GraduationCap, KeyRound, Loader2, Plus, RefreshCw, Users } from 'lucide-react'
import { institutionAdminApi, type InstitutionOverview, type ManagedInstitution } from '@/lib/api'
import { useAuthStore } from '@/stores'

export function SchoolDashboardPage() {
  const { isAuthenticated } = useAuthStore()
  const [institutions, setInstitutions] = useState<ManagedInstitution[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [overview, setOverview] = useState<InstitutionOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  const loadInstitutions = async () => {
    if (!isAuthenticated) { setLoading(false); return }
    setLoading(true)
    try {
      const data = await institutionAdminApi.list()
      setInstitutions(data.institutions)
      const next = selectedId || data.institutions[0]?.id || ''
      setSelectedId(next)
      if (next) setOverview(await institutionAdminApi.overview(next))
      else setOverview(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível carregar a escola')
    } finally { setLoading(false) }
  }

  useEffect(() => { void loadInstitutions() }, [isAuthenticated])

  const selectInstitution = async (id: string) => {
    setSelectedId(id); setBusy(true)
    try { setOverview(await institutionAdminApi.overview(id)) }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Não foi possível abrir a instituição') }
    finally { setBusy(false) }
  }

  const createInstitution = async () => {
    if (name.trim().length < 2) { toast.error('Informe o nome da instituição'); return }
    setBusy(true)
    try {
      const { institution } = await institutionAdminApi.create({ name, city, state, type: 'school' })
      setName(''); setCity(''); setState('')
      const next = [institution, ...institutions]
      setInstitutions(next); setSelectedId(institution.id)
      setOverview(await institutionAdminApi.overview(institution.id))
      toast.success('Instituição criada')
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Não foi possível criar a instituição') }
    finally { setBusy(false) }
  }

  const createInvite = async () => {
    if (!selectedId) return
    setBusy(true)
    try {
      const { invite } = await institutionAdminApi.createInvite(selectedId, { label: 'Entrada de estudantes' })
      await navigator.clipboard?.writeText(invite.code).catch(() => undefined)
      setOverview(await institutionAdminApi.overview(selectedId))
      toast.success(`Código ${invite.code} criado e copiado`)
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Não foi possível criar o convite') }
    finally { setBusy(false) }
  }

  if (!isAuthenticated) return <main className="flex-1 bg-slate-50"><section className="mx-auto max-w-3xl px-4 py-20 text-center"><Building2 className="mx-auto h-12 w-12 text-primary-600"/><h1 className="mt-5 text-3xl font-black text-slate-950">Gestão escolar MindSteps</h1><p className="mt-3 text-slate-600">Entre com uma conta autorizada para criar ou administrar uma escola, turma ou programa.</p><Link to="/auth" className="mt-6 inline-flex rounded-xl bg-primary-600 px-6 py-3 font-bold text-white">Entrar</Link></section></main>
  if (loading) return <main className="flex min-h-[55vh] flex-1 items-center justify-center bg-slate-50"><Loader2 className="h-8 w-8 animate-spin text-primary-600"/></main>

  if (!institutions.length) return <main className="flex-1 bg-slate-50"><section className="mx-auto max-w-3xl px-4 py-12"><div className="rounded-3xl bg-gradient-to-br from-slate-950 to-primary-900 p-8 text-white"><p className="text-xs font-black uppercase tracking-[.18em] text-primary-200">Primeira configuração</p><h1 className="mt-3 text-3xl font-black">Crie sua instituição.</h1><p className="mt-3 text-slate-300">Sua conta vira proprietária da instituição e depois poderá gerar códigos para conectar estudantes existentes.</p></div><div className="mt-6 rounded-3xl bg-white p-6 shadow-sm"><div className="grid gap-3 sm:grid-cols-2"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome da escola" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-200 sm:col-span-2"/><input value={city} onChange={e=>setCity(e.target.value)} placeholder="Cidade" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-200"/><input value={state} onChange={e=>setState(e.target.value)} placeholder="UF" maxLength={2} className="rounded-xl border border-slate-200 px-4 py-3 uppercase outline-none focus:ring-2 focus:ring-primary-200"/></div><button disabled={busy} onClick={createInstitution} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 font-black text-white disabled:opacity-50">{busy?<Loader2 className="h-4 w-4 animate-spin"/>:<Plus className="h-4 w-4"/>} Criar instituição</button></div></section></main>

  const metrics = overview?.metrics
  return <main className="flex-1 bg-slate-50">
    <section className="bg-gradient-to-br from-slate-950 via-primary-900 to-secondary-900 text-white"><div className="mx-auto max-w-6xl px-4 py-10 sm:px-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm"><Building2 className="h-4 w-4"/> School Intelligence</p><h1 className="mt-4 text-4xl font-black">{overview?.institution.name || 'Sua instituição'}</h1><p className="mt-2 text-slate-300">Dados reais de vínculo, atividade e evolução. Sem reduzir aprendizagem a uma nota única.</p></div><div className="flex flex-wrap gap-2">{institutions.map(item=><button key={item.id} onClick={()=>void selectInstitution(item.id)} className={`rounded-xl px-4 py-2 text-sm font-bold ${item.id===selectedId?'bg-white text-primary-800':'bg-white/10 text-white'}`}>{item.name}</button>)}</div></div></div></section>

    <section className="mx-auto grid max-w-6xl gap-4 px-4 py-7 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
      <Metric label="Alunos conectados" value={metrics?.students ?? 0} icon={<Users className="h-5 w-5"/>}/>
      <Metric label="Ativos hoje" value={metrics?.activeToday ?? 0} icon={<CheckCircle2 className="h-5 w-5"/>}/>
      <Metric label="XP médio" value={metrics?.avgXp ?? 0} icon={<BarChart3 className="h-5 w-5"/>}/>
      <Metric label="Sequência média" value={`${metrics?.avgStreak ?? 0}d`} icon={<RefreshCw className="h-5 w-5"/>}/>
      <Metric label="Convites ativos" value={metrics?.activeInvites ?? 0} icon={<KeyRound className="h-5 w-5"/>}/>
    </section>

    <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[1.2fr_.8fr]">
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><p className="text-xs font-black uppercase tracking-wider text-primary-600">Estudantes</p><h2 className="text-xl font-black text-slate-950">Quem já está conectado</h2></div>{busy&&<Loader2 className="h-5 w-5 animate-spin text-primary-600"/>}</div>{overview?.students.length?<div className="divide-y divide-slate-100">{overview.students.map(student=><div key={student.id} className="flex items-center justify-between gap-4 p-5"><div><p className="font-black text-slate-900">{student.name || 'Estudante'}</p><p className="mt-1 text-xs text-slate-500">{student.grade ? `${student.grade}º ano · ` : ''}entrou {new Date(student.joinedAt).toLocaleDateString('pt-BR')}</p></div><div className="flex gap-2 text-center"><span className="rounded-xl bg-primary-50 px-3 py-2 text-xs font-black text-primary-700">{student.xp || 0} XP</span><span className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-black text-orange-700">🔥 {student.streak || 0}</span></div></div>)}</div>:<div className="p-8 text-center text-slate-500">Ainda não há estudantes conectados. Gere o primeiro código de convite.</div>}</div>

      <aside className="space-y-5"><div className="rounded-3xl bg-slate-950 p-6 text-white"><div className="flex items-center gap-2 text-primary-300"><GraduationCap className="h-5 w-5"/><span className="text-xs font-black uppercase tracking-wider">Entrada de estudantes</span></div><h2 className="mt-3 text-xl font-black">Um código. A mesma identidade.</h2><p className="mt-2 text-sm leading-6 text-slate-400">O aluno usa o código em “Meus vínculos”. A conta, o histórico e o mapa continuam sendo dele.</p><button disabled={busy} onClick={createInvite} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-black text-slate-950 disabled:opacity-50"><Plus className="h-4 w-4"/> Gerar código</button></div><div className="rounded-3xl bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Códigos recentes</p><div className="mt-3 space-y-2">{overview?.invites.slice(0,4).map(invite=><button key={invite.code} onClick={()=>{void navigator.clipboard?.writeText(invite.code);toast.success('Código copiado')}} className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-3 text-left"><div><p className="font-black text-slate-900">{invite.code}</p><p className="text-xs text-slate-500">{invite.label || 'Convite'} · {invite.uses_count || 0} usos</p></div><Copy className="h-4 w-4 text-slate-400"/></button>)}{!overview?.invites.length&&<p className="text-sm text-slate-500">Nenhum código ainda.</p>}</div></div></aside>
    </section>
  </main>
}

function Metric({label,value,icon}:{label:string;value:string|number;icon:React.ReactNode}){return <div className="rounded-3xl bg-white p-5 shadow-sm"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">{icon}</div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-black text-slate-950">{value}</p></div>}
