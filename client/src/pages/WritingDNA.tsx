import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Brain, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'
import { useWritingStore, type WritingSkill } from '@/stores/writing'
import { analyzeWriting, writingSkillLabels } from '@/lib/writingAnalysis'

const notes: Record<WritingSkill, string> = {
  tese: 'Capacidade de assumir uma posição clara e defensável.',
  argumentacao: 'Profundidade de causa, consequência, explicação e sustentação.',
  repertorio: 'Uso de referências que realmente ajudam o argumento.',
  coesao: 'Continuidade e relação explícita entre ideias e parágrafos.',
  intervencao: 'Concretude de agente, ação, meio, finalidade e detalhamento.',
  clareza: 'Precisão, legibilidade e controle do tamanho das frases.',
}

export function WritingDNAPage() {
  const navigate = useNavigate()
  const { projects, interventionEffects, setActiveProject } = useWritingStore()

  const latestProjects = useMemo(() => projects.filter(p => p.versions.length).slice(0, 8), [projects])
  const scores = useMemo(() => {
    const base: Record<WritingSkill, number[]> = { tese:[], argumentacao:[], repertorio:[], coesao:[], intervencao:[], clareza:[] }
    latestProjects.forEach(project => { const version = project.versions.at(-1); if (!version) return; const result = analyzeWriting(version.text); (Object.keys(base) as WritingSkill[]).forEach(skill => base[skill].push(result.scores[skill])) })
    return (Object.keys(base) as WritingSkill[]).map(skill => ({ skill, value: base[skill].length ? Math.round(base[skill].reduce((a,b)=>a+b,0)/base[skill].length) : 0 }))
  }, [latestProjects])

  const effects = useMemo(() => interventionEffects.map(effect => ({ ...effect, project: projects.find(p=>p.id===effect.projectId) })).filter(e=>e.project), [interventionEffects, projects])
  const strongest = [...scores].sort((a,b)=>b.value-a.value)[0] || { skill:'clareza' as WritingSkill, value:0 }
  const next = [...scores].filter(s=>s.value>0).sort((a,b)=>a.value-b.value)[0] || { skill:'argumentacao' as WritingSkill, value:0 }
  const bestEffect = [...effects].sort((a,b)=>b.delta-a.delta)[0]
  const positiveRate = effects.length ? Math.round((effects.filter(e=>e.delta>0).length/effects.length)*100) : 0
  const bySkill = (Object.keys(notes) as WritingSkill[]).map(skill => { const list=effects.filter(e=>e.skill===skill); return {skill,count:list.length,avg:list.length?Math.round(list.reduce((s,e)=>s+e.delta,0)/list.length):0} }).filter(x=>x.count).sort((a,b)=>b.avg-a.avg)

  return <main className="mx-auto w-full max-w-md px-4 pb-28 pt-2 text-slate-900">
    <section className="flex items-center gap-3"><button onClick={() => navigate('/enem/redacao')} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"><ArrowLeft className="h-5 w-5"/></button><div><p className="text-xs font-black uppercase tracking-[.18em] text-violet-600">Redação ENEM</p><h1 className="text-2xl font-black">Seu DNA da Escrita</h1></div></section>

    <section className="mt-5 overflow-hidden rounded-[30px] bg-[#17152f] p-5 text-white shadow-xl shadow-violet-100"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-violet-300">Mapa longitudinal</p><h2 className="mt-2 text-2xl font-black">Sua escrita muda com você.</h2></div><Brain className="h-8 w-8 text-cyan-300"/></div><p className="mt-3 text-sm leading-6 text-white/70">O DNA usa suas versões reais e registra o efeito de cada treino na versão seguinte. Não é nota oficial: é um mapa pedagógico vivo.</p></section>

    {!latestProjects.length ? <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm"><h2 className="font-black">Seu DNA ainda está em branco.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Salve sua primeira redação para começar a construir seu mapa.</p><button onClick={()=>navigate('/enem/redacao/escrever')} className="mt-4 w-full rounded-2xl bg-violet-600 py-3.5 text-sm font-black text-white">Escrever primeira versão</button></section> : <>
      <section className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-3xl bg-emerald-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-emerald-700">Seu ponto forte</p><p className="mt-2 text-xl font-black">{writingSkillLabels[strongest.skill]}</p><p className="mt-1 text-xs leading-5 text-emerald-900/70">{notes[strongest.skill]}</p></div><div className="rounded-3xl bg-amber-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-amber-700">Próximo salto</p><p className="mt-2 text-xl font-black">{writingSkillLabels[next.skill]}</p><p className="mt-1 text-xs leading-5 text-amber-900/70">{notes[next.skill]}</p></div></section>

      <section className="mt-6"><div className="flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-indigo-600">Mapa vivo</p><h2 className="text-xl font-black">Como sua escrita está hoje</h2></div><span className="text-xs font-semibold text-slate-400">{latestProjects.length} textos</span></div><div className="mt-3 space-y-3">{scores.map(({skill,value}) => <div key={skill} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-black">{writingSkillLabels[skill]}</span><span className="text-sm font-black text-indigo-600">{value}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{width:`${value}%`}}/></div><p className="mt-2 text-xs leading-5 text-slate-500">{notes[skill]}</p></div>)}</div></section>

      <section className="mt-6 rounded-3xl bg-indigo-50 p-5"><div className="flex items-center gap-2 text-indigo-700"><Sparkles className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-wider">Próxima intervenção</span></div><h2 className="mt-2 text-lg font-black">Treinar {writingSkillLabels[next.skill]}</h2><p className="mt-2 text-sm leading-6 text-indigo-900/70">O próximo treino ataca sua habilidade menos consolidada e depois mede o efeito na nova versão.</p><button onClick={() => navigate(`/enem/redacao/treino/${next.skill==='argumentacao'?'argumento':next.skill==='clareza'||next.skill==='coesao'?'paragrafo':next.skill}`)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-700 py-3.5 text-sm font-black text-white">Começar treino <ChevronRight className="h-4 w-4"/></button></section>

      <section className="mt-6"><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald-600"/><h2 className="text-lg font-black">O que funciona para você</h2></div>{effects.length ? <><div className="mt-3 grid grid-cols-2 gap-3"><div className="rounded-3xl bg-white p-4 shadow-sm"><p className="text-2xl font-black text-emerald-600">{positiveRate}%</p><p className="mt-1 text-xs font-bold text-slate-500">dos treinos medidos tiveram sinal positivo</p></div><div className="rounded-3xl bg-white p-4 shadow-sm"><p className="text-2xl font-black text-indigo-600">{effects.length}</p><p className="mt-1 text-xs font-bold text-slate-500">intervenções medidas</p></div></div>{bestEffect && <div className="mt-3 rounded-3xl bg-emerald-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-emerald-700">Maior resposta observada</p><p className="mt-2 text-lg font-black text-emerald-950">{writingSkillLabels[bestEffect.skill]} {bestEffect.delta>=0?'+':''}{bestEffect.delta}</p><p className="mt-1 text-sm leading-6 text-emerald-900/70">Depois do treino, o sinal passou de {bestEffect.beforeScore} para {bestEffect.afterScore} na redação “{bestEffect.project?.theme}”.</p></div>}{bySkill.length>0 && <div className="mt-3 rounded-3xl bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Resposta média por habilidade</p><div className="mt-3 space-y-2">{bySkill.map(x=><div key={x.skill} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><span className="text-sm font-black">{writingSkillLabels[x.skill]}</span><span className={`text-sm font-black ${x.avg>0?'text-emerald-600':x.avg<0?'text-amber-600':'text-slate-500'}`}>{x.avg>0?'+':''}{x.avg} · {x.count}x</span></div>)}</div></div>}</> : <div className="mt-3 rounded-3xl bg-white p-5 shadow-sm"><p className="text-sm font-black">Ainda precisamos de um ciclo completo.</p><p className="mt-2 text-sm leading-6 text-slate-500">Faça um treino recomendado, reescreva e salve uma nova versão. O efeito será registrado automaticamente.</p></div>}</section>

      <section className="mt-6"><h2 className="text-lg font-black">Textos recentes</h2><div className="mt-3 space-y-2">{latestProjects.slice(0,4).map(project=><button key={project.id} onClick={()=>{setActiveProject(project.id);navigate('/enem/redacao/escrever')}} className="flex w-full items-center justify-between rounded-2xl bg-white p-4 text-left shadow-sm"><div className="min-w-0"><p className="truncate text-sm font-black">{project.theme}</p><p className="mt-1 text-xs text-slate-500">{project.versions.length} versões · foco atual: {writingSkillLabels[project.focus]}</p></div><ChevronRight className="h-4 w-4 shrink-0 text-slate-300"/></button>)}</div></section>
    </>}
  </main>
}
