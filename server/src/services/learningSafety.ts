export type AuthorshipEventType='student_original'|'ai_feedback'|'ai_suggestion'|'student_revision'|'teacher_feedback'|'final_submission'
export interface AuthorshipEventInput{type:AuthorshipEventType;content?:string;metadata?:Record<string,unknown>;createdAt?:string}
export interface AuthorshipSummary{studentAuthoredShare:number;aiAssistanceShare:number;humanReviewShare:number;events:number;explanation:string[]}

export function summarizeAuthorship(events:AuthorshipEventInput[]):AuthorshipSummary{
 const weighted=events.map(e=>({type:e.type,weight:Math.max(1,(e.content||'').trim().length)}))
 const total=weighted.reduce((n,e)=>n+e.weight,0)||1
 const student=weighted.filter(e=>e.type==='student_original'||e.type==='student_revision'||e.type==='final_submission').reduce((n,e)=>n+e.weight,0)
 const ai=weighted.filter(e=>e.type==='ai_feedback'||e.type==='ai_suggestion').reduce((n,e)=>n+e.weight,0)
 const human=weighted.filter(e=>e.type==='teacher_feedback').reduce((n,e)=>n+e.weight,0)
 return{studentAuthoredShare:Math.round(student/total*100),aiAssistanceShare:Math.round(ai/total*100),humanReviewShare:Math.round(human/total*100),events:events.length,explanation:['Percentuais representam participação no processo registrado, não detecção forense de autoria.','Feedback e sugestões de IA são separados de revisões produzidas pelo estudante.','O objetivo é tornar o processo de aprendizagem visível, não policiar o aluno.']}
}

export type AccessibilityMode='plain_language'|'step_by_step'|'low_stimulation'|'audio_script'|'image_description'|'guided_reading'
export function buildAccessibilityInstruction(mode:AccessibilityMode,ageGroup:string){
 const base={plain_language:'Reescreva com linguagem simples, frases curtas e sem perder o conceito central.',step_by_step:'Divida a tarefa em passos pequenos e verificáveis, um por vez.',low_stimulation:'Reduza estímulos, listas longas e elementos acessórios. Mantenha apenas o essencial.',audio_script:'Transforme em roteiro oral claro, natural e com pausas curtas.',image_description:'Descreva elementos visuais essenciais, relações espaciais e informação pedagógica relevante.',guided_reading:'Crie leitura guiada com pequenos trechos, pergunta de compreensão e retomada.'}[mode]
 return `${base} Preserve equivalência pedagógica. Faixa etária: ${ageGroup}. Não simplifique a ponto de eliminar o objetivo de aprendizagem.`
}

export interface WellbeingDecision{screenBreak:boolean;offlineAlternative:boolean;maxInteractionMinutes:number;reason:string}
export function evaluateWellbeing(input:{ageGroup:string;sessionMinutes:number;messages:number;frustrated?:boolean}):WellbeingDecision{
 const young=input.ageGroup==='6-10';const threshold=young?20:input.ageGroup==='11-14'?30:45
 const overloaded=input.sessionMinutes>=threshold||input.messages>=18||Boolean(input.frustrated&&input.sessionMinutes>15)
 return{screenBreak:overloaded,offlineAlternative:young||overloaded,maxInteractionMinutes:threshold,reason:overloaded?'A sessão já atingiu um ponto em que uma pausa ou atividade fora da tela protege atenção e bem-estar.':young?'Para crianças, atividades fora da tela devem fazer parte do percurso, não ser exceção.':'A sessão ainda está dentro de uma intensidade adequada.'}
}

export interface InterventionEvidence{interventionId:string;skill:string;before?:number;after?:number;completed:boolean;minutes?:number;context?:string}
export function evaluateInterventionEvidence(rows:InterventionEvidence[]){
 const completed=rows.filter(r=>r.completed);const comparable=completed.filter(r=>typeof r.before==='number'&&typeof r.after==='number')
 const delta=comparable.length?comparable.reduce((n,r)=>n+((r.after as number)-(r.before as number)),0)/comparable.length:0
 const status=comparable.length<3?'insufficient_evidence':delta>=8?'promising':delta<=-3?'review_needed':'neutral'
 return{status,averageDelta:Math.round(delta*10)/10,evidenceCount:comparable.length,completionRate:rows.length?Math.round(completed.length/rows.length*100):0,explanation:status==='insufficient_evidence'?'Ainda não há evidências suficientes para concluir eficácia.':status==='promising'?'Há um sinal positivo, mas ele deve continuar sendo monitorado.':status==='review_needed'?'A intervenção não está produzindo o resultado esperado e merece revisão.':'O efeito observado é pequeno ou estável; continue coletando evidências.'}
}
