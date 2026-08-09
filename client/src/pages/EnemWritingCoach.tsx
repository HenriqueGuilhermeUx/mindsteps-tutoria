import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWritingStore, type WritingSkill } from '@/stores/writing'

const connectors = ['portanto','contudo','além disso','nesse sentido','dessa forma','assim','entretanto','por outro lado','consequentemente']
const interventionWords = ['governo','estado','escola','sociedade','mídia','instituição','ministério','prefeitura','projeto','política pública']
const repertoireWords = ['constituição','onu','ibge','unesco','filósofo','sociólogo','livro','obra','filme','história','dados','pesquisa']

function countAny(text: string, words: string[]) { const lower = text.toLowerCase(); return words.filter(w => lower.includes(w)).length }
function sentences(text: string) { return text.split(/[.!?]+/).map(s=>s.trim()).filter(Boolean) }
function paragraphs(text: string) { return text.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean) }

export function EnemWritingCoachPage() {
  const navigate = useNavigate()
  const { projects, activeProjectId, setFocus } = useWritingStore()
  const project = projects.find(p=>p.id===activeProjectId) || projects[0]
  const latest = project?.versions.at(-1)

  const analysis = useMemo(() => {
    const text = latest?.text || ''
    const words = text.trim().split(/\s+/).filter(Boolean)
    const unique = new Set(words.map(w=>w.toLowerCase().replace(/[^a-záàâãéèêíïóôõöúçñ]/gi,'')))
    const sent = sentences(text)
    const pars = paragraphs(text)
    const connectorCount = countAny(text, connectors)
    const repertoireCount = countAny(text, repertoireWords)
    const interventionCount = countAny(text, interventionWords)
    const avgSentence = sent.length ? Math.round(words.length / sent.length) : 0
    const diversity = words.length ? Math.round((unique.size / words.length) * 100) : 0

    const scores: Record<WritingSkill, number> = {
      tese: Math.min(100, 40 + (pars.length >= 3 ? 25 : 5) + (words.length >= 180 ? 20 : 5)),
      argumentacao: Math.min(100, 30 + pars.length * 10 + connectorCount * 7),
      repertorio: Math.min(100, 25 + repertoireCount * 22),
      coesao: Math.min(100, 30 + connectorCount * 9 + (pars.length >= 4 ? 18 : 5)),
      intervencao: Math.min(100, 25 + interventionCount * 18 + (text.toLowerCase().includes('para') ? 8 : 0)),
      clareza: Math.max(25, Math.min(100, 90 - Math.max(0, avgSentence - 24) * 2 + Math.min(15, Math.round(diversity / 6)))),
    }
    const ordered = (Object.entries(scores) as [WritingSkill, number][]).sort((a,b)=>a[1]-b[1])
    return { words: words.length, paragraphs: pars.length, connectorCount, repertoireCount, interventionCount, avgSentence, diversity, scores, focus: ordered[0][0], strongest: ordered.at(-1)![0] }
  }, [latest])

  if (!project || !latest) return <main className="ms-screen py-4"><section className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-wider text-violet-600">Coach de escrita</p><h1 className="mt-2 text-xl font-black">Primeiro precisamos de uma versão sua.</h1><p className="mt-2 text-sm leading-6 text-slate-500">Escreva e salve uma versão. A partir dela o MindSteps transforma sinais do seu texto em um treino recomendado.</p><button onClick={()=>navigate('/enem/redacao/escrever')} className="mt-4 w-full rounded-2xl bg-violet-600 py-4 text-sm font-black text-white">Ir para o estúdio</button></section></main>

  const labels: Record<WritingSkill,string> = { tese:'Tese', argumentacao:'Argumentação', repertorio:'Repertório', coesao:'Coesão', intervencao:'Intervenção', clareza:'Clareza' }
  const train: Record<WritingSkill,string> = {
    tese:'Resuma sua posição em uma frase que alguém consiga contestar. Depois retire palavras vagas.',
    argumentacao:'Escolha um argumento e force três passos: causa → consequência → evidência.',
    repertorio:'Use um repertório e complete: “Isso ajuda meu argumento porque…”. Se não conseguir, ele está solto.',
    coesao:'Revise a passagem entre parágrafos. Cada início deve mostrar como a nova ideia se conecta à anterior.',
    intervencao:'Construa uma intervenção com agente, ação, meio, finalidade e um detalhe concreto.',
    clareza:'Pegue a frase mais longa e tente dizer a mesma coisa com menos palavras, sem perder precisão.',
  }

  return <main className="ms-screen space-y-4 py-4">
    <section className="rounded-[30px] bg-gradient-to-br from-fuchsia-600 via-violet-700 to-indigo-800 p-5 text-white shadow-xl shadow-violet-100"><p className="text-xs font-black uppercase tracking-[.18em] text-violet-100">Coach adaptativo</p><h1 className="mt-2 text-2xl font-black">Seu texto virou um próximo passo.</h1><p className="mt-3 text-sm leading-6 text-white/75">Não é uma nota. É uma leitura pedagógica para decidir o que treinar agora.</p></section>

    <section className="ms-card-soft p-5"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Texto analisado</p><h2 className="mt-1 text-sm font-black leading-5">{project.theme}</h2><div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xl font-black">{analysis.words}</p><p className="text-[10px] font-bold text-slate-400">palavras</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xl font-black">{analysis.paragraphs}</p><p className="text-[10px] font-bold text-slate-400">parágrafos</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xl font-black">{analysis.diversity}%</p><p className="text-[10px] font-bold text-slate-400">diversidade</p></div></div></section>

    <section className="rounded-3xl bg-amber-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-amber-700">Treino recomendado agora</p><h2 className="mt-2 text-xl font-black text-amber-950">{labels[analysis.focus]}</h2><p className="mt-2 text-sm leading-6 text-amber-900/75">{train[analysis.focus]}</p><button onClick={()=>{setFocus(project.id, analysis.focus);navigate('/enem/redacao/escrever')}} className="mt-4 rounded-2xl bg-amber-950 px-4 py-3 text-sm font-black text-white">Treinar e reescrever →</button></section>

    <section className="ms-card-soft p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-emerald-600">Seu ponto mais forte agora</p><h2 className="mt-1 text-lg font-black">{labels[analysis.strongest]}</h2></div><span className="text-2xl">✨</span></div><p className="mt-2 text-sm text-slate-500">Reconhecer o que já funciona ajuda você a usar essa força nas próximas versões.</p></section>

    <section className="space-y-2">{Object.entries(analysis.scores).map(([skill,score])=><div key={skill} className="rounded-2xl bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-xs font-black"><span>{labels[skill as WritingSkill]}</span><span>{score}</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{width:`${score}%`}}/></div></div>)}</section>

    <section className="rounded-3xl bg-slate-950 p-5 text-white"><p className="text-xs font-black uppercase tracking-wider text-violet-300">Como interpretar</p><p className="mt-2 text-sm leading-6 text-slate-400">Estes sinais são heurísticos e educacionais. Eles não equivalem à correção oficial do ENEM. A próxima camada conectará avaliação semântica por IA e histórico longitudinal.</p></section>
  </main>
}
