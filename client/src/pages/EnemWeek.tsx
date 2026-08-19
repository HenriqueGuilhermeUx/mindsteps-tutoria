import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, ChevronRight, Flame, Sparkles, Target, Trophy } from 'lucide-react'
import { useEnemStore } from '@/stores/enem'
import { useWritingStore } from '@/stores/writing'

function dayKey(date:Date){return date.toISOString().slice(0,10)}
function startOfWeek(date=new Date()){const d=new Date(date);const weekday=(d.getDay()+6)%7;d.setHours(0,0,0,0);d.setDate(d.getDate()-weekday);return d}

export function EnemWeekPage(){
 const navigate=useNavigate();const {profile,attempts,simulations,dailyCompleted}=useEnemStore();const {projects}=useWritingStore()
 const data=useMemo(()=>{
  const weekStart=startOfWeek();const days=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return d})
  const activeDates=new Set<string>()
  attempts.forEach(a=>activeDates.add(a.createdAt.slice(0,10)))
  simulations.forEach(s=>activeDates.add(s.completedAt.slice(0,10)))
  projects.forEach(p=>p.versions.forEach(v=>activeDates.add(v.createdAt.slice(0,10))))
  dailyCompleted.forEach(k=>activeDates.add(k.slice(0,10)))
  const weekDays=days.map(d=>({key:dayKey(d),label:new Intl.DateTimeFormat('pt-BR',{weekday:'short'}).format(d).replace('.',''),day:d.getDate(),active:activeDates.has(dayKey(d)),today:dayKey(d)===dayKey(new Date())}))
  let streak=0;const cursor=new Date();cursor.setHours(0,0,0,0);for(let i=0;i<365;i++){const key=dayKey(cursor);if(activeDates.has(key)){streak++;cursor.setDate(cursor.getDate()-1);continue}if(i===0){cursor.setDate(cursor.getDate()-1);continue}break}
  const activeThisWeek=weekDays.filter(d=>d.active).length;const goal=profile?.studyDaysPerWeek||5
  return {weekDays,streak,activeThisWeek,goal,progress:Math.min(100,Math.round(activeThisWeek/goal*100))}
 },[attempts,simulations,dailyCompleted,projects,profile])
 return <main className="ms-screen space-y-4 py-4">
  <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-orange-500 via-rose-500 to-violet-700 p-5 text-white"><div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl"/><div className="relative"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-orange-100">Minha semana ENEM</p><h1 className="mt-2 text-2xl font-black">Ritmo antes de pressão.</h1></div><CalendarDays className="h-8 w-8"/></div><p className="mt-3 text-sm leading-6 text-white/80">A meta é criar constância sem transformar estudo em culpa. Cada dia ativo conta como evidência de continuidade.</p></div></section>
  <section className="grid grid-cols-2 gap-3"><div className="rounded-3xl bg-orange-50 p-5"><div className="flex items-center gap-2 text-orange-700"><Flame className="h-5 w-5"/><span className="text-xs font-black uppercase tracking-wider">Sequência</span></div><p className="mt-2 text-3xl font-black text-orange-950">{data.streak} dias</p><p className="mt-1 text-xs leading-5 text-orange-900/65">Não buscamos perfeição. Buscamos voltar.</p></div><div className="rounded-3xl bg-violet-50 p-5"><div className="flex items-center gap-2 text-violet-700"><Target className="h-5 w-5"/><span className="text-xs font-black uppercase tracking-wider">Meta semanal</span></div><p className="mt-2 text-3xl font-black text-violet-950">{data.activeThisWeek}/{data.goal}</p><p className="mt-1 text-xs leading-5 text-violet-900/65">dias de estudo nesta semana</p></div></section>
  <section className="rounded-3xl bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-slate-400">Esta semana</p><h2 className="mt-1 text-lg font-black">Seu ritmo visual</h2></div><span className="text-sm font-black text-violet-700">{data.progress}%</span></div><div className="mt-4 grid grid-cols-7 gap-2">{data.weekDays.map(d=><div key={d.key} className="text-center"><p className={`text-[10px] font-black uppercase ${d.today?'text-violet-700':'text-slate-400'}`}>{d.label}</p><div className={`mx-auto mt-2 flex h-9 w-9 items-center justify-center rounded-2xl text-xs font-black ${d.active?'bg-emerald-500 text-white':d.today?'bg-violet-100 text-violet-700':'bg-slate-100 text-slate-400'}`}>{d.active?'✓':d.day}</div></div>)}</div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-600" style={{width:`${data.progress}%`}}/></div></section>
  <section className="rounded-3xl bg-slate-950 p-5 text-white"><div className="flex items-center gap-2 text-amber-300"><Trophy className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-wider">Regra de consistência</span></div><h2 className="mt-2 text-lg font-black">Fez pouco? Ainda conta.</h2><p className="mt-2 text-sm leading-6 text-slate-400">Uma sessão curta, uma redação, um simulado ou algumas questões podem manter o vínculo com a aprendizagem. Depois ajustamos intensidade.</p><button onClick={()=>navigate('/enem/hoje')} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-black text-slate-950">Abrir meu próximo passo <ChevronRight className="h-4 w-4"/></button></section>
  <section className="rounded-3xl bg-emerald-50 p-5"><div className="flex items-center gap-2 text-emerald-700"><Sparkles className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-wider">Próxima evolução</span></div><p className="mt-2 text-sm leading-6 text-emerald-950/70">Quando tivermos histórico suficiente, o MindSteps poderá recomendar não só o que estudar, mas também quais dias e intensidades funcionam melhor para o seu próprio ritmo.</p></section>
 </main>
}
