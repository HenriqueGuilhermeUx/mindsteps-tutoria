import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const drills = {
  tese: { emoji: '🎯', title: 'Tese em 3 minutos', goal: 'Transforme um tema amplo em uma posição clara e defensável.', prompt: 'Desafios para combater a desinformação no Brasil', steps: ['Qual problema central você identifica?', 'Qual causa merece entrar na sua tese?', 'Que posição você vai defender?'], placeholder: 'Escreva sua tese em uma frase...' },
  argumento: { emoji: '🧱', title: 'Construa um argumento', goal: 'Saia da opinião e construa causa → consequência → evidência.', prompt: 'A exclusão digital amplia desigualdades sociais.', steps: ['Por que isso acontece?', 'Qual consequência concreta surge?', 'Que exemplo, dado ou repertório poderia sustentar?'], placeholder: 'Construa seu argumento...' },
  repertorio: { emoji: '🔗', title: 'Repertório que conversa', goal: 'Use repertório como parte do raciocínio, não como decoração.', prompt: 'Tema: impactos da tecnologia nas relações humanas.', steps: ['Escolha uma referência que você realmente entende.', 'Explique a ideia central dessa referência.', 'Conecte-a diretamente ao seu argumento.'], placeholder: 'Mostre a conexão entre repertório e argumento...' },
  paragrafo: { emoji: '✂️', title: 'Cirurgia de parágrafo', goal: 'Deixe cada parágrafo com uma função clara.', prompt: 'Revise um parágrafo seu ou escreva um novo.', steps: ['Qual é a ideia principal?', 'Cada frase ajuda essa ideia?', 'Há algo repetido ou solto?'], placeholder: 'Cole ou escreva um parágrafo...' },
  perspectiva: { emoji: '🔄', title: 'Troque de perspectiva', goal: 'Fortaleça sua argumentação tentando derrubar a própria ideia.', prompt: 'Escolha uma opinião que você defenderia no tema atual.', steps: ['Qual seria o melhor argumento contrário?', 'Que parte da sua posição ele enfraquece?', 'Como você responderia sem distorcer o outro lado?'], placeholder: 'Escreva o melhor contra-argumento possível...' },
  intervencao: { emoji: '🛠️', title: 'Intervenção completa', goal: 'Construa proposta concreta, coerente e detalhada.', prompt: 'Crie uma intervenção para o problema trabalhado.', steps: ['Quem deve agir?', 'O que deve ser feito e por qual meio?', 'Qual finalidade e qual detalhamento tornam a proposta concreta?'], placeholder: 'Agente + ação + meio + finalidade + detalhamento...' },
} as const

type DrillKey = keyof typeof drills

export function EnemWritingDrillPage() {
  const navigate = useNavigate()
  const { kind } = useParams()
  const key = (kind && kind in drills ? kind : 'tese') as DrillKey
  const drill = drills[key]
  const [answers, setAnswers] = useState(['', '', ''])
  const [draft, setDraft] = useState('')
  const [finished, setFinished] = useState(false)
  const completion = useMemo(() => Math.round(((answers.filter(Boolean).length + (draft.trim() ? 1 : 0)) / 4) * 100), [answers, draft])

  return <main className="ms-screen space-y-4 py-4">
    <section className="rounded-[30px] bg-slate-950 p-5 text-white"><div className="text-3xl">{drill.emoji}</div><p className="mt-3 text-xs font-black uppercase tracking-[.18em] text-violet-300">Microtreino de escrita</p><h1 className="mt-1 text-2xl font-black">{drill.title}</h1><p className="mt-2 text-sm leading-6 text-slate-400">{drill.goal}</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-400 transition-all" style={{width:`${completion}%`}}/></div></section>

    <section className="ms-card-soft p-5"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Desafio</p><h2 className="mt-2 text-base font-black leading-6 text-slate-950">{drill.prompt}</h2></section>

    <section className="space-y-3">{drill.steps.map((step,i)=><div key={step} className="rounded-3xl bg-white p-4 shadow-sm"><div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-black text-violet-700">{i+1}</span><div className="min-w-0 flex-1"><p className="text-sm font-black text-slate-900">{step}</p><textarea value={answers[i]} onChange={(e)=>setAnswers(a=>a.map((v,idx)=>idx===i?e.target.value:v))} rows={2} className="mt-3 w-full resize-none rounded-2xl bg-slate-50 p-3 text-sm leading-6 outline-none ring-violet-200 focus:ring-2" placeholder="Pense e escreva com suas palavras..."/></div></div></div>)}</section>

    <section className="rounded-3xl border border-violet-100 bg-violet-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-violet-600">Agora junte as peças</p><textarea value={draft} onChange={(e)=>setDraft(e.target.value)} rows={5} className="mt-3 w-full resize-none rounded-2xl bg-white p-4 text-sm leading-6 outline-none ring-violet-200 focus:ring-2" placeholder={drill.placeholder}/><button disabled={!draft.trim()} onClick={()=>setFinished(true)} className="mt-3 w-full rounded-2xl bg-violet-600 py-4 text-sm font-black text-white disabled:opacity-40">Concluir treino</button></section>

    {finished && <section className="rounded-3xl bg-emerald-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-emerald-700">Treino concluído ✓</p><h2 className="mt-2 text-lg font-black text-emerald-950">Agora leve isso para uma redação real.</h2><p className="mt-2 text-sm leading-6 text-emerald-900/70">O objetivo não é decorar uma fórmula. É reconhecer a técnica quando você precisar dela.</p><div className="mt-4 grid grid-cols-2 gap-3"><button onClick={()=>navigate('/enem/redacao/escrever')} className="rounded-2xl bg-emerald-900 py-3 text-sm font-black text-white">Ir escrever</button><button onClick={()=>navigate('/enem/redacao/coach')} className="rounded-2xl bg-white py-3 text-sm font-black text-emerald-900">Meu Coach</button></div></section>}
  </main>
}
