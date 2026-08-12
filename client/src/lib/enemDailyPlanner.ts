import type { EnemSimulationResult } from '@/stores/enem'
import type { EnemSkillSignal } from '@/lib/enemSkillMap'
import { buildStrategyInsights } from '@/lib/enemStrategyCoach'

export type DailyPlanMode='learning'|'strategy'|'hybrid'
export type DailyPlanDecision={mode:DailyPlanMode;reason:string;strategyNeed:number;learningNeed:number;strategyInsight?:ReturnType<typeof buildStrategyInsights>[number]}

export function decideDailyPlan(priority:EnemSkillSignal,simulations:EnemSimulationResult[]):DailyPlanDecision{
 const learningNeed=Math.max(0,100-priority.score)
 const latest=simulations[0]
 const insights=buildStrategyInsights(simulations)
 const strategyScore=latest?.strategyScore ?? 100
 const strategyNeed=latest?Math.max(0,100-strategyScore):0
 const topInsight=insights[0]
 if(simulations.length>=2&&strategyNeed>=45&&strategyNeed>learningNeed+8)return{mode:'strategy',reason:'Seu comportamento de prova está limitando mais que o conteúdo neste momento.',strategyNeed,learningNeed,strategyInsight:topInsight}
 if(simulations.length>=1&&strategyNeed>=32&&learningNeed>=32)return{mode:'hybrid',reason:'Há espaço de evolução tanto no conteúdo quanto na forma de fazer a prova.',strategyNeed,learningNeed,strategyInsight:topInsight}
 return{mode:'learning',reason:'O maior ganho provável agora está em fortalecer uma habilidade específica.',strategyNeed,learningNeed,strategyInsight:topInsight}
}
