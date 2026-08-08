import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const themes = [
  { area: 'Tecnologia', title: 'Desafios para garantir o uso ético da inteligência artificial no Brasil', emoji: '🤖' },
  { area: 'Educação', title: 'Caminhos para reduzir a desigualdade de acesso à educação de qualidade', emoji: '📚' },
  { area: 'Sociedade', title: 'Desafios para combater a solidão entre jovens na sociedade contemporânea', emoji: '🫂' },
  { area: 'Meio ambiente', title: 'Responsabilidade coletiva diante dos eventos climáticos extremos', emoji: '🌱' },
  { area: 'Cidadania', title: 'Caminhos para ampliar a participação dos jovens nas decisões da comunidade', emoji: '🗳️' },
  { area: 'Cultura', title: 'A importância da preservação da memória cultural brasileira na era digital', emoji: '🎭' },
]

const drills = [
  { emoji: '🎯', title: 'Tese em 3 minutos', text: 'Transforme um tema amplo em uma posição clara.' },
  { emoji: '🧱', title: 'Construa um argumento', text: 'Passe de opinião para causa, consequência e evidência.' },
  { emoji: '🔗', title: 'Repertório que conversa', text: 'Aprenda a conectar repertório ao argumento sem decorar frases.' },
  { emoji: '✂️', title: 'Cirurgia de parágrafo', text: 'Encontre excessos, lacunas e ideias que precisam respirar.' },
  { emoji: '🔄', title: 'Troque de perspectiva', text: 'Defenda o outro lado para fortalecer seu pensamento crítico.' },
  { emoji: '🛠️', title: 'Intervenção completa', text: 'Treine agente, ação, meio, finalidade e detalhamento.' },
]

export function EnemWritingLabPage() {
  const [themeIndex, setThemeIndex] = useState(0)
  const [mode, setMode] = useState<'learn' | 'write' | 'review'>('learn')
  const theme = themes[themeIndex]
  const prompt = useMemo(() => themes[(themeIndex + 1) % themes.length], [themeIndex])

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-28 pt-2 text-slate-900">
      <section className="overflow-hidden rounded-[30px] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-5 text-white shadow-xl shadow-indigo-100">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-100">MindSteps ENEM</p><h1 className="mt-1 text-2xl font-black">Laboratório de Redação</h1></div>
          <div className="rounded-2xl bg-white/15 px-3 py-2 text-2xl">✍️</div>
        </div>
        <p className="mt-3 max-w-sm text-sm leading-6 text-indigo-50">Aqui a IA não escreve por você. Ela ajuda você a encontrar ideias, construir argumentos, escrever, revisar e aprender com cada versão.</p>
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-white/10 p-1.5">
          {[['learn','Treinar'],['write','Escrever'],['review','Revisar']].map(([key,label]) => <button key={key} onClick={() => setMode(key as typeof mode)} className={`rounded-xl px-2 py-2.5 text-xs font-extrabold transition ${mode===key?'bg-white text-indigo-700 shadow':'text-white'}`}>{label}</button>)}
        </div>
      </section>

      {mode === 'learn' && <>
        <section className="mt-5"><div className="mb-3 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Microtreinos</p><h2 className="text-xl font-black">Aprenda escrevendo</h2></div><span className="text-xs font-semibold text-slate-400">5–10 min</span></div>
          <div className="grid grid-cols-2 gap-3">{drills.map((d) => <button key={d.title} className="min-h-36 rounded-3xl border border-slate-100 bg-white p-4 text-left shadow-sm transition active:scale-[.98]"><span className="text-2xl">{d.emoji}</span><h3 className="mt-3 text-sm font-black">{d.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{d.text}</p></button>)}</div>
        </section>
        <section className="mt-5 rounded-3xl border border-amber-100 bg-amber-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-amber-700">Desafio relâmpago</p><h2 className="mt-2 font-black">{prompt.title}</h2><p className="mt-2 text-sm text-amber-900/70">Você tem 3 minutos: escreva apenas uma tese. A Lumi vai fazer perguntas para ajudar a deixá-la mais precisa — sem escrever por você.</p><button className="mt-4 rounded-2xl bg-amber-900 px-4 py-3 text-sm font-black text-white">Aceitar desafio</button></section>
      </>}

      {mode === 'write' && <>
        <section className="mt-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{theme.emoji} {theme.area}</span><button onClick={() => setThemeIndex((themeIndex+1)%themes.length)} className="text-xs font-bold text-indigo-600">Outro tema ↻</button></div><h2 className="mt-4 text-xl font-black leading-7">{theme.title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Tema de treino. Antes de escrever, vamos construir seu ponto de vista.</p></section>
        <section className="mt-4 space-y-3">{['O que exatamente esse tema está perguntando?','Qual problema você enxerga aqui?','Por que esse problema acontece?','Quem é afetado e de que forma?','Qual posição você pretende defender?'].map((q,i)=><button key={q} className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-black text-indigo-700">{i+1}</span><span className="text-sm font-bold">{q}</span></button>)}</section>
        <button className="mt-4 w-full rounded-2xl bg-slate-950 py-4 text-sm font-black text-white">Construir meu rascunho →</button>
      </>}

      {mode === 'review' && <>
        <section className="mt-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-wider text-emerald-600">Revisão que ensina</p><h2 className="mt-2 text-xl font-black">Traga uma redação sua</h2><p className="mt-2 text-sm leading-6 text-slate-500">Cole o texto ou envie uma foto. O MindSteps identifica padrões, destaca trechos e transforma cada dificuldade em um treino curto.</p><div className="mt-4 grid grid-cols-2 gap-3"><button className="rounded-2xl bg-slate-950 py-4 text-sm font-black text-white">📋 Colar texto</button><button className="rounded-2xl border border-slate-200 bg-white py-4 text-sm font-black">📷 Enviar foto</button></div></section>
        <section className="mt-4 rounded-3xl bg-emerald-50 p-5"><h3 className="font-black text-emerald-950">O resultado não é só uma nota.</h3><p className="mt-2 text-sm leading-6 text-emerald-900/70">Você recebe um mapa de tese, argumentação, repertório, coesão, proposta de intervenção e clareza — com o próximo treino recomendado.</p></section>
      </>}

      <section className="mt-6 rounded-3xl bg-slate-950 p-5 text-white"><p className="text-xs font-black uppercase tracking-wider text-violet-300">Princípio MindSteps</p><p className="mt-2 text-lg font-black leading-7">Sua voz é sua. A tecnologia ajuda você a desenvolvê-la.</p><p className="mt-2 text-xs leading-5 text-slate-400">Avaliações e pontuações geradas pelo app são estimativas educacionais e não representam nota oficial do ENEM.</p></section>
      <Link to="/hoje" className="mt-5 block text-center text-sm font-bold text-indigo-600">← Voltar ao início</Link>
    </main>
  )
}
