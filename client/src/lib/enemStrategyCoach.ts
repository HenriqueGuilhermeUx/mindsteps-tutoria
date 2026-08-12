import type { EnemSimulationResult } from '@/stores/enem'

export type StrategyInsight={id:string;title:string;detail:string;action:string;tone:'amber'|'rose'|'emerald'|'indigo'}

export function buildStrategyInsights(simulations:EnemSimulationResult[]):StrategyInsight[]{
 const recent=simulations.slice(0,5); if(!recent.length)return[]
 const insights:StrategyInsight[]=[]
 const avg=(values:number[])=>values.length?values.reduce((a,b)=>a+b,0)/values.length:0
 const scores=recent.map(s=>s.strategyScore??0).filter(Boolean)
 if(scores.length>=2){const delta=scores[0]-scores[scores.length-1];insights.push(delta>=5?{id:'trend-up',title:'Sua estratégia está evoluindo',detail:`Seu Strategy Score subiu ${delta} pontos nas sessões recentes.`,action:'Repita a rotina de decisão que funcionou e observe se o ganho se mantém.',tone:'emerald'}:delta<=-5?{id:'trend-down',title:'Sua estratégia perdeu eficiência',detail:`Seu Strategy Score caiu ${Math.abs(delta)} pontos nas sessões recentes.`,action:'Faça o próximo simulado curto priorizando ritmo e evitando insistência excessiva.',tone:'rose'}:{id:'trend-stable',title:'Estratégia estável',detail:'Seu Strategy Score mudou pouco nas últimas sessões.',action:'Escolha uma variável por vez para melhorar: tempo, marcações ou revisão.',tone:'indigo'})}
 const allAreas=recent.flatMap(s=>s.areaResults??[])
 const areaNames=[...new Set(allAreas.map(a=>a.area))]
 const areaStats=areaNames.map(area=>{const rows=allAreas.filter(a=>a.area===area);const seconds=rows.reduce((n,r)=>n+r.secondsSpent,0);const answered=rows.reduce((n,r)=>n+r.answered,0);const correct=rows.reduce((n,r)=>n+r.correct,0);return{area,secPer:answered?seconds/answered:0,accuracy:answered?correct/answered:0}}).filter(a=>a.secPer>0)
 if(areaStats.length){const slow=[...areaStats].sort((a,b)=>b.secPer-a.secPer)[0];const median=avg(areaStats.map(a=>a.secPer));if(slow.secPer>median*1.25)insights.push({id:'slow-area',title:`${slow.area} está consumindo mais tempo`,detail:`Você gasta cerca de ${Math.round(slow.secPer)}s por resposta nessa área, acima do seu padrão geral.`,action:slow.accuracy<.65?'Treine decisão de saída: se não houver caminho claro, marque e avance.':'O tempo está trazendo acerto, mas teste se consegue manter precisão com decisões mais rápidas.',tone:'amber'})}
 const marked=recent.reduce((n,s)=>n+s.markedQuestions,0), answered=recent.reduce((n,s)=>n+(s.answeredQuestions??0),0)
 if(answered&&marked/answered>.4)insights.push({id:'many-marks',title:'Você está marcando muitas questões',detail:`Cerca de ${Math.round(marked/answered*100)}% das respostas recentes foram marcadas para revisão.`,action:'Use a marcação apenas quando houver uma dúvida concreta entre alternativas ou cálculo para conferir.',tone:'amber'})
 const changes=recent.reduce((n,s)=>n+(s.reviewChanges??0),0)
 if(changes>=3)insights.push({id:'review-changes',title:'Sua revisão muda bastante a prova',detail:`Você alterou ${changes} respostas nas últimas sessões.`,action:'No próximo simulado, só troque uma resposta quando encontrar uma evidência nova — não apenas por insegurança.',tone:'indigo'})
 const skipped=recent.reduce((n,s)=>n+(s.skippedQuestions??0),0)
 if(answered+skipped>0&&skipped/(answered+skipped)>.2)insights.push({id:'skips',title:'Muitas questões ficam sem decisão final',detail:`${Math.round(skipped/(answered+skipped)*100)}% ficaram em branco nas sessões recentes.`,action:'Reserve uma janela final para transformar questões puladas em decisões conscientes.',tone:'rose'})
 return insights.slice(0,4)
}
