import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { compareWritingVersions } from '@/lib/writingAnalysis'
import { useWritingStore } from '@/stores/writing'

export function WritingVersionComparePage() {
  const navigate = useNavigate()
  const { projects, activeProjectId } = useWritingStore()
  const project = projects.find((p) => p.id === activeProjectId)
  const versions = project?.versions || []
  const current = versions.at(-1)
  const previous = versions.at(-2)
  const insights = useMemo(() => previous && current ? compareWritingVersions(previous, current) : [], [previous, current])

  if (!project || !current || !previous) {
    return <main className="ms-screen space-y-4 py-4"><section className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-wider text-violet-600">Version Intelligence</p><h1 className="mt-2 text-xl font-black">Precisamos de duas versões.</h1><p className="mt-2 text-sm leading-6 text-slate-500">Salve uma primeira versão, melhore seu texto e salve novamente. A partir daí o MindSteps compara sua evolução.</p><button onClick={()=>navigate('/enem/redacao/escrever')} className="mt-4 w-full rounded-2xl bg-slate-950 py-4 text-sm font-black text-white">Voltar ao estúdio</button></section></main>
  }

  const delta = current.wordCount - previous.wordCount
  return <main className="ms-screen space-y-4 py-4">
    <section className="rounded-[30px] bg-gradient-to-br from-slate-950 to-indigo-950 p-5 text-white"><p className="text-xs font-black uppercase tracking-[.18em] text-violet-300">Version Intelligence</p><h1 className="mt-2 text-2xl font-black">O que mudou na sua escrita?</h1><p className="mt-3 text-sm leading-6 text-slate-300">Não procuramos só “erros”. Procuramos sinais de como seu pensamento e sua escrita evoluíram de uma versão para outra.</p></section>

    <section className="grid grid-cols-2 gap-3"><div className="rounded-3xl bg-white p-4 shadow-sm"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Versão anterior</p><p className="mt-2 text-3xl font-black">{previous.wordCount}</p><p className="text-xs font-bold text-slate-500">palavras</p></div><div className="rounded-3xl bg-violet-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-violet-500">Versão atual</p><p className="mt-2 text-3xl font-black text-violet-950">{current.wordCount}</p><p className="text-xs font-bold text-violet-700">palavras · {delta >= 0 ? '+' : ''}{delta}</p></div></section>

    <section><p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">Sinais encontrados</p><div className="space-y-3">{insights.map((insight, i)=><article key={`${insight.title}-${i}`} className={`rounded-3xl p-4 ${insight.type==='improved'?'bg-emerald-50':insight.type==='attention'?'bg-amber-50':'bg-white shadow-sm'}`}><div className="flex items-start gap-3"><span className="mt-0.5 text-xl">{insight.type==='improved'?'↗️':insight.type==='attention'?'🔎':'✨'}</span><div><h2 className="text-sm font-black text-slate-950">{insight.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{insight.detail}</p></div></div></article>)}</div></section>

    <section className="rounded-3xl bg-indigo-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-indigo-600">Pergunta de autor</p><h2 className="mt-2 text-lg font-black text-indigo-950">Qual mudança deixou seu argumento mais convincente?</h2><p className="mt-2 text-sm leading-6 text-indigo-900/70">Antes de receber mais ajuda, tente identificar você mesmo. Essa metacognição também faz parte do treino.</p></section>

    <div className="grid grid-cols-2 gap-3"><button onClick={()=>navigate('/enem/redacao/escrever')} className="rounded-2xl bg-slate-950 py-4 text-sm font-black text-white">Reescrever</button><button onClick={()=>navigate('/enem/redacao/dna')} className="rounded-2xl bg-violet-100 py-4 text-sm font-black text-violet-800">Meu DNA</button></div>
    <p className="px-2 text-center text-[11px] leading-5 text-slate-400">Esta comparação inicial usa sinais linguísticos e estruturais locais. A avaliação pedagógica por IA será adicionada ao motor sem substituir a autoria do estudante.</p>
  </main>
}
