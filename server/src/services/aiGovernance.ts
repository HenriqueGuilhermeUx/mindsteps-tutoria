export const RESPONSIBLE_AI_PRINCIPLES = [
  {key:'intentionality',label:'Intencionalidade e centralidade humana',question:'Existe objetivo educacional claro e mediação humana definida?'},
  {key:'learning_safeguards',label:'Salvaguardas de aprendizagem',question:'A solução protege pensamento crítico, autoria e esforço cognitivo?'},
  {key:'pedagogical_reliability',label:'Confiabilidade pedagógica',question:'Há evidências, métricas e monitoramento contínuo da aprendizagem?'},
  {key:'ai_literacy',label:'Letramento em IA',question:'Usuários compreendem riscos, limites e finalidade do sistema?'},
  {key:'agency',label:'Agência e participação',question:'Estudantes, docentes e famílias podem participar, revisar ou contestar?'},
  {key:'data_protection',label:'Proteção de dados e não-vigilância',question:'Os dados são mínimos, finalísticos e protegidos sem vigilância massiva?'},
  {key:'equity',label:'Equidade',question:'Há medidas de acessibilidade e mitigação de vieses/desigualdades?'},
  {key:'wellbeing',label:'Bem-estar',question:'O desenho respeita faixa etária, atenção, equilíbrio digital e não usa publicidade direcionada?'},
  {key:'sustainability',label:'Sustentabilidade e não-dependência',question:'Existe continuidade, portabilidade, reversibilidade e atenção a dependência de fornecedor?'},
  {key:'transparency',label:'Transparência e explicabilidade',question:'Recomendações, incertezas, evidências e responsáveis podem ser compreendidos?'},
] as const

export type PrincipleKey = typeof RESPONSIBLE_AI_PRINCIPLES[number]['key']

export interface GovernanceAssessmentInput {
  systemKey:string
  purpose:string
  educationalObjective:string
  targetStage:string
  dataCategories:string[]
  automatedDecisionImpact:'low'|'medium'|'high'
  humanOversight:boolean
  contestable:boolean
  explainable:boolean
  evidenceLevel:'none'|'pilot'|'observational'|'validated'
  childData:boolean
  sensitiveData:boolean
  profiling:boolean
  persuasiveDesign:boolean
  adsOrCommercialTargeting:boolean
  offlineAlternative:boolean
  portability:boolean
  accessibility:boolean
  biasMitigation:boolean
}

export function evaluateGovernance(input:GovernanceAssessmentInput){
  const checks:Record<PrincipleKey,{pass:boolean;reason:string}>={
    intentionality:{pass:input.educationalObjective.trim().length>=10&&input.humanOversight,reason:'Objetivo pedagógico explícito e supervisão humana.'},
    learning_safeguards:{pass:input.automatedDecisionImpact!=='high'||input.contestable,reason:'Decisões de maior impacto precisam ser contestáveis e supervisionadas.'},
    pedagogical_reliability:{pass:input.evidenceLevel!=='none',reason:'Adoção sem evidência deve permanecer em piloto com métricas e reversibilidade.'},
    ai_literacy:{pass:true,reason:'O Responsible AI Core expõe finalidade, limites e explicações como requisito transversal.'},
    agency:{pass:input.humanOversight&&input.contestable,reason:'Participação exige revisão e contestação humanas.'},
    data_protection:{pass:!input.adsOrCommercialTargeting&&!input.persuasiveDesign&&(!input.sensitiveData||input.humanOversight),reason:'Minimização, finalidade pedagógica e não-vigilância são requisitos centrais.'},
    equity:{pass:input.accessibility&&input.biasMitigation,reason:'Acessibilidade e mitigação de vieses precisam ser tratadas no desenho.'},
    wellbeing:{pass:!input.persuasiveDesign&&!input.adsOrCommercialTargeting,reason:'Evitar exploração de atenção e publicidade/comercialização direcionada.'},
    sustainability:{pass:input.portability||input.offlineAlternative,reason:'Portabilidade, reversibilidade ou alternativa offline reduzem dependência.'},
    transparency:{pass:input.explainable&&input.humanOversight,reason:'Resultados relevantes devem ser explicáveis e sujeitos à supervisão humana.'},
  }
  const entries=RESPONSIBLE_AI_PRINCIPLES.map(p=>({ ...p,...checks[p.key] }))
  const passed=entries.filter(e=>e.pass).length
  const score=Math.round(passed/entries.length*100)
  const blockers:string[]=[]
  if(input.automatedDecisionImpact==='high'&&!input.humanOversight)blockers.push('Decisão educacional de alto impacto sem supervisão humana.')
  if(input.childData&&input.adsOrCommercialTargeting)blockers.push('Dados de crianças/adolescentes não podem alimentar publicidade ou segmentação comercial no desenho MindSteps.')
  if(input.persuasiveDesign)blockers.push('Design persuasivo/exploração de atenção é incompatível com o padrão de bem-estar adotado.')
  if(input.evidenceLevel==='none')blockers.push('Sem evidência pedagógica: uso deve permanecer experimental/piloto, com métricas e reversibilidade.')
  const risk=blockers.length?'high':input.automatedDecisionImpact==='high'||input.sensitiveData||input.profiling?'medium':'low'
  return {score,risk,passed,total:entries.length,principles:entries,blockers,recommendation:blockers.length?'pilot_or_block':'eligible_with_monitoring'}
}

export function impactAssessmentTemplate(systemKey:string){
  return {
    systemKey,
    sections:[
      'finalidade_pedagogica','publicos_afetados','dados_e_minimizacao','modelo_e_fornecedor','riscos_a_aprendizagem','vieses_e_equidade','privacidade_e_seguranca','bem_estar_e_faixa_etaria','explicabilidade','supervisao_humana','contestacao_e_reversibilidade','acessibilidade','evidencias_pedagogicas','metricas_de_monitoramento','incidentes','plano_de_descontinuacao'
    ],
    requiredEvidence:['objetivo educacional','responsável humano','dados utilizados','base/finalidade de tratamento','salvaguardas','métrica de benefício','métrica de risco','mecanismo de contestação','critério de suspensão'],
  }
}
