import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Dice5, Layers3, Shuffle, Sparkles } from 'lucide-react'

const axes = {
  Tecnologia: ['inteligência artificial','desinformação digital','acesso à conectividade','automação do trabalho','privacidade de dados'],
  Sociedade: ['solidão entre jovens','violência simbólica','participação comunitária','envelhecimento populacional','desigualdade de oportunidades'],
  Educação: ['evasão escolar','alfabetização científica','formação de professores','desigualdade educacional','educação midiática'],
  Ambiente: ['eventos climáticos extremos','justiça climática','consumo sustentável','segurança hídrica','urbanização e natureza'],
  Cultura: ['memória cultural','acesso à cultura','diversidade linguística','indústria criativa','patrimônio imaterial'],
  Cidadania: ['participação política jovem','acesso a direitos','inclusão de pessoas com deficiência','mobilidade urbana','combate à intolerância'],
}

const frames = [
  'Desafios para enfrentar {topic} no Brasil contemporâneo',
  'Caminhos para ampliar a resposta brasileira a {topic}',
  'Impactos sociais de {topic} e possibilidades de transformação',
  'O papel da sociedade na construção de soluções para {topic}',
  'Limites e possibilidades das políticas públicas diante de {topic}',
]

const lenses = ['causas estruturais','impactos sobre jovens','desigualdades regionais','efeitos sobre populações vulneráveis','papel da educação','responsabilidade do Estado e da sociedade']

function pick<T>(items:T[], seed:number){ return items[Math.abs(seed)%items.length] }

export function EnemThemeEnginePage(){
  const navigate = useNavigate()
  const [seed,setSeed] = useState(17)
  const categories = Object.keys(axes) as Array<keyof typeof axes>
  const generated = useMemo(()=>{
    const category = pick(categories, seed)
    const topic = pick(axes[category], seed*7+3)
    const title = pick(frames, seed*11+5).replace('{topic}',topic)
    const lens = pick(lenses, seed*13+1)
    return {category,topic,title,lens}
  },[seed])

  return <main className="mx-auto w-full max-w-md px-4 pb-28 pt-2 text-slate-900">
    <section className="flex items-center gap-3"><button onClick={()=>navigate('/enem/redacao')} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"><ArrowLeft className="h-5 w-5"/></button><div><p className="text-xs font-black uppercase tracking-[.18em] text-violet-600">Redação ENEM</p><h1 className="text-2xl font-black">Motor de Temas</h1></div></section>

    <section className="mt-5 overflow-hidden rounded-[30px] bg-gradient-to-br from-fuchsia-600 via-violet-600 to-indigo-700 p-5 text-white shadow-xl shadow-violet-100"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-violet-100">Diversidade de treino</p><h2 className="mt-2 text-2xl font-black">Tema novo. Raciocínio novo.</h2></div><Shuffle className="h-8 w-8 text-cyan-200"/></div><p className="mt-3 text-sm leading-6 text-white/80">O objetivo não é decorar redações prontas. É aprender a pensar diante de assuntos diferentes, inclusive combinações inesperadas.</p></section>

    <section className="mt-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">{generated.category}</span><span className="text-xs font-semibold text-slate-400">foco: {generated.lens}</span></div><h2 className="mt-4 text-xl font-black leading-7">{generated.title}</h2><p className="mt-3 text-sm leading-6 text-slate-500">Antes de escrever, responda: qual tensão existe aqui? Quem é afetado? Quais causas você consegue sustentar? Que posição vale defender?</p><button onClick={()=>setSeed(v=>v+37)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-sm font-black text-white"><Dice5 className="h-4 w-4"/> Gerar outro tema</button></section>

    <section className="mt-6"><div className="flex items-center gap-2"><Layers3 className="h-5 w-5 text-indigo-600"/><h2 className="text-lg font-black">Treine por contraste</h2></div><div className="mt-3 grid grid-cols-2 gap-3">{categories.map((category,i)=><button key={category} onClick={()=>setSeed(i*101+29)} className="rounded-3xl border border-slate-100 bg-white p-4 text-left shadow-sm active:scale-[.98]"><span className="text-xs font-black uppercase tracking-wider text-indigo-600">{category}</span><p className="mt-2 text-sm font-black leading-5">Gerar tema desta área</p></button>)}</div></section>

    <section className="mt-6 rounded-3xl bg-amber-50 p-5"><div className="flex items-center gap-2 text-amber-700"><Sparkles className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-wider">Modo anti-decoreba</span></div><h2 className="mt-2 text-lg font-black">O mesmo tema por outra lente</h2><p className="mt-2 text-sm leading-6 text-amber-900/70">Depois de construir uma tese, o MindSteps pode mudar a lente: desigualdade regional, juventude, políticas públicas ou populações vulneráveis. Você aprende a reorganizar o raciocínio sem copiar uma fórmula.</p></section>
  </main>
}
