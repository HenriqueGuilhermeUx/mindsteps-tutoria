import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWritingStore } from '@/stores/writing'

const starterThemes = [
  ['Tecnologia', 'Desafios para garantir o uso ético da inteligência artificial no Brasil'],
  ['Sociedade', 'Caminhos para enfrentar a solidão entre jovens na sociedade contemporânea'],
  ['Meio ambiente', 'Responsabilidade coletiva diante dos eventos climáticos extremos'],
] as const

export function EnemWritingStudioPage() {
  const navigate = useNavigate()
  const { projects, activeProjectId, createProject, saveVersion, setActiveProject } = useWritingStore()
  const active = projects.find((p) => p.id === activeProjectId) || null
  const [themeIndex, setThemeIndex] = useState(0)
  const [text, setText] = useState(active?.versions.at(-1)?.text || '')
  const wordCount = useMemo(() => text.trim() ? text.trim().split(/\s+/).length : 0, [text])

  const start = () => { const [area, theme] = starterThemes[themeIndex]; const id = createProject(theme, area); setActiveProject(id); setText('') }
  const save = () => { if (!active || !text.trim()) return; saveVersion(active.id, text) }

  if (!active) return <main className="ms-screen space-y-4 py-4"><section className="rounded-[30px] bg-slate-950 p-5 text-white"><p className="text-xs font-black uppercase tracking-[.18em] text-violet-300">Estúdio de escrita</p><h1 className="mt-2 text-2xl font-black">Escreva. Reescreva. Descubra como você melhora.</h1><p className="mt-3 text-sm leading-6 text-slate-400">Cada salvamento vira uma versão. O MindSteps acompanha sua evolução sem apagar sua voz.</p></section><section className="ms-card-soft p-5"><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">{starterThemes[themeIndex][0]}</span><h2 className="mt-4 text-lg font-black">{starterThemes[themeIndex][1]}</h2><div className="mt-4 flex gap-2"><button onClick={() => setThemeIndex((themeIndex+1)%starterThemes.length)} className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-black">Outro tema</button><button onClick={start} className="flex-1 rounded-2xl bg-violet-600 py-3 text-sm font-black text-white">Começar</button></div></section>{projects.length>0 && <section><p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Seus textos</p>{projects.slice(0,4).map(p=><button key={p.id} onClick={()=>{setActiveProject(p.id);setText(p.versions.at(-1)?.text||'')}} className="mb-2 w-full rounded-2xl bg-white p-4 text-left shadow-sm"><p className="text-sm font-black">{p.theme}</p><p className="mt-1 text-xs text-slate-500">{p.versions.length} versões · foco em {p.focus}</p></button>)}</section>}</main>

  return <main className="ms-screen space-y-4 py-4"><section><button onClick={()=>setActiveProject(null)} className="text-xs font-black text-violet-600">← Meus textos</button><p className="mt-3 text-xs font-black uppercase tracking-wider text-violet-600">{active.area} · versão {active.versions.length + 1}</p><h1 className="mt-1 text-xl font-black leading-7">{active.theme}</h1></section><section className="rounded-3xl bg-white p-4 shadow-sm"><textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Comece pelas suas ideias. Não precisa ficar perfeito na primeira versão..." className="min-h-[390px] w-full resize-none bg-transparent text-[15px] leading-7 outline-none placeholder:text-slate-300"/><div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-slate-400"><span>{wordCount} palavras</span><span>{active.versions.length} versões salvas</span></div></section><div className="grid grid-cols-2 gap-3"><button onClick={save} disabled={!text.trim()} className="rounded-2xl bg-slate-950 py-4 text-sm font-black text-white disabled:opacity-40">Salvar versão</button><button onClick={()=>navigate('/enem/redacao/dna')} className="rounded-2xl bg-violet-100 py-4 text-sm font-black text-violet-800">Ver meu DNA</button></div>{active.versions.length>0 && <section className="rounded-3xl bg-indigo-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-indigo-600">Histórico vivo</p><h2 className="mt-1 font-black">Você não perde versões anteriores.</h2><div className="mt-3 space-y-2">{active.versions.slice().reverse().slice(0,3).map((v,i)=><button key={v.id} onClick={()=>setText(v.text)} className="flex w-full items-center justify-between rounded-2xl bg-white p-3 text-left"><span className="text-sm font-black">Versão {active.versions.length-i}</span><span className="text-xs font-bold text-slate-400">{v.wordCount} palavras</span></button>)}</div></section>}</main>
}
