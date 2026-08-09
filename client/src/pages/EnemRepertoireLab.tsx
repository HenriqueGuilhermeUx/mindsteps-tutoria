import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const repertoire = [
  { area: 'Tecnologia', emoji: '🤖', items: ['Algoritmos e escolhas humanas', 'Desigualdade de acesso digital', 'Privacidade e autonomia'] },
  { area: 'Sociedade', emoji: '🧭', items: ['Bauman e relações contemporâneas', 'Desigualdade estrutural', 'Participação social'] },
  { area: 'Educação', emoji: '📚', items: ['Paulo Freire e autonomia', 'Educação como direito', 'Desigualdades de aprendizagem'] },
  { area: 'Cultura', emoji: '🎭', items: ['Memória e identidade', 'Indústria cultural', 'Diversidade brasileira'] },
  { area: 'Meio ambiente', emoji: '🌱', items: ['Justiça climática', 'Consumo e responsabilidade', 'Urbanização e risco'] },
  { area: 'Cidadania', emoji: '⚖️', items: ['Constituição de 1988', 'Direitos sociais', 'Responsabilidade coletiva'] },
]

export function EnemRepertoireLabPage() {
  const navigate = useNavigate()
  const [areaIndex, setAreaIndex] = useState(0)
  const [itemIndex, setItemIndex] = useState(0)
  const [connection, setConnection] = useState('')
  const [challenge, setChallenge] = useState('')
  const current = repertoire[areaIndex]
  const item = current.items[itemIndex % current.items.length]
  const ready = useMemo(() => connection.trim().length > 20 && challenge.trim().length > 20, [connection, challenge])

  const next = () => { setItemIndex((itemIndex + 1) % current.items.length); setConnection(''); setChallenge('') }

  return <main className="ms-screen space-y-4 py-4">
    <section className="rounded-[30px] bg-gradient-to-br from-rose-600 via-fuchsia-600 to-violet-700 p-5 text-white"><p className="text-xs font-black uppercase tracking-[.18em] text-rose-100">Repertório Vivo</p><h1 className="mt-2 text-2xl font-black">Não decore citações. Aprenda a conectar ideias.</h1><p className="mt-3 text-sm leading-6 text-white/80">Um repertório só vale quando ajuda seu argumento a pensar melhor.</p></section>

    <section className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">{repertoire.map((r,i)=><button key={r.area} onClick={()=>{setAreaIndex(i);setItemIndex(0);setConnection('');setChallenge('')}} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${i===areaIndex?'bg-slate-950 text-white':'bg-white text-slate-600 shadow-sm'}`}>{r.emoji} {r.area}</button>)}</section>

    <section className="ms-card-soft p-5"><p className="text-xs font-black uppercase tracking-wider text-fuchsia-600">Ideia para explorar</p><h2 className="mt-2 text-xl font-black text-slate-950">{item}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Explique com suas palavras o que essa ideia significa e por que ela poderia ser útil numa argumentação.</p><textarea value={connection} onChange={e=>setConnection(e.target.value)} rows={4} className="mt-4 w-full resize-none rounded-2xl bg-slate-50 p-4 text-sm leading-6 outline-none ring-fuchsia-200 focus:ring-2" placeholder="Eu entendo essa ideia como..."/></section>

    <section className="rounded-3xl bg-amber-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-amber-700">Faça a ponte</p><h3 className="mt-2 font-black text-amber-950">Como você usaria isso em um tema atual?</h3><p className="mt-2 text-sm leading-6 text-amber-900/70">Não basta citar. Mostre a relação entre a referência e o problema discutido.</p><textarea value={challenge} onChange={e=>setChallenge(e.target.value)} rows={4} className="mt-4 w-full resize-none rounded-2xl bg-white p-4 text-sm leading-6 outline-none ring-amber-200 focus:ring-2" placeholder="Isso se conecta ao tema porque..."/></section>

    <section className="grid grid-cols-2 gap-3"><button onClick={next} className="rounded-2xl border border-slate-200 bg-white py-4 text-sm font-black">Outra ideia ↻</button><button disabled={!ready} onClick={()=>navigate('/enem/redacao/escrever')} className="rounded-2xl bg-slate-950 py-4 text-sm font-black text-white disabled:opacity-40">Usar na redação</button></section>

    <section className="rounded-3xl bg-emerald-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-emerald-700">Regra de ouro</p><p className="mt-2 text-base font-black text-emerald-950">Repertório produtivo = referência compreendida + conexão explícita + função no argumento.</p></section>
  </main>
}
