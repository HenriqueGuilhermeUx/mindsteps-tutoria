import { supabase } from '../db/index.js'

export type TransferCheckInput={userId:string;subject?:string|null;skill?:string|null;source?:string;assistedScore?:number|null;independentScore?:number|null;helpLevel?:number;attemptBeforeHelp?:boolean;completed?:boolean;metadata?:Record<string,unknown>}

export async function saveTransferCheck(input:TransferCheckInput){
 const {data,error}=await supabase.from('mindsteps_transfer_checks').insert({
  user_id:input.userId,subject:input.subject||null,skill:input.skill||null,source:input.source||'tutor',
  assisted_score:input.assistedScore??null,independent_score:input.independentScore??null,help_level:input.helpLevel??0,
  attempt_before_help:input.attemptBeforeHelp??false,completed:input.completed??true,metadata:input.metadata||{}
 }).select('*').single()
 if(error)throw new Error(error.message)
 return data
}

export async function listTransferChecks(userId:string,limit=50){const {data,error}=await supabase.from('mindsteps_transfer_checks').select('*').eq('user_id',userId).order('created_at',{ascending:false}).limit(limit);if(error)throw new Error(error.message);return data||[]}

export function summarizeIndependence(rows:any[]){
 const completed=rows.filter(r=>r.completed)
 const comparable=completed.filter(r=>r.assisted_score!=null&&r.independent_score!=null)
 const avg=(xs:number[])=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:0
 const assisted=avg(comparable.map(r=>Number(r.assisted_score)))
 const independent=avg(comparable.map(r=>Number(r.independent_score)))
 const gap=comparable.length?assisted-independent:0
 const attemptShare=completed.length?completed.filter(r=>r.attempt_before_help).length/completed.length:0
 const avgHelp=completed.length?avg(completed.map(r=>Number(r.help_level||0))):0
 const independenceScore=Math.max(0,Math.min(100,Math.round((independent||0)*0.7+attemptShare*20+Math.max(0,10-avgHelp*2))))
 const offloadingRisk=comparable.length<3?'unknown':gap>=20||attemptShare<.35?'high':gap>=10||attemptShare<.6?'medium':'low'
 return {checks:completed.length,comparableChecks:comparable.length,assistedScore:Math.round(assisted),independentScore:Math.round(independent),assistanceGap:Math.round(gap),attemptBeforeHelpShare:Math.round(attemptShare*100),averageHelpLevel:Number(avgHelp.toFixed(1)),independenceScore,offloadingRisk,notice:comparable.length<3?'Ainda há poucas evidências para estimar autonomia com confiança.':'O objetivo é reduzir o gap de assistência sem retirar ajuda necessária.'}
}
