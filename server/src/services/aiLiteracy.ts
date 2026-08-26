import { getEducationStage, type EducationStage } from './responsibleAI.js'
import type { StudentProfile } from '../db/index.js'

export interface AILiteracyLearning {
  id: number
  title: string
  cluster: 'computacional' | 'digital_midiatico' | 'etico_social'
  description: string
}

export interface AILiteracyMission {
  id: string
  learningId: number
  stage: EducationStage
  title: string
  objective: string
  mode: 'offline' | 'guided_digital' | 'project'
  activity: string
  evidence: string
}

export const AI_LITERACY_LEARNINGS: AILiteracyLearning[] = [
  { id:1,title:'Linguagem computacional e IA',cluster:'computacional',description:'Compreender dados, algoritmos, modelos e diferenças entre sistemas de IA.' },
  { id:2,title:'Lógica e pensamento computacional',cluster:'computacional',description:'Reconhecer padrões, classificar, decompor problemas e estruturar passos.' },
  { id:3,title:'Projetos humano–IA para problemas reais',cluster:'computacional',description:'Relacionar soluções técnicas a problemas humanos, sociais e éticos.' },
  { id:4,title:'Ciclo de vida da IA',cluster:'etico_social',description:'Compreender trabalho, infraestrutura, energia, água, materiais e impactos ambientais.' },
  { id:5,title:'Dados, privacidade e desinformação',cluster:'digital_midiatico',description:'Entender coleta e uso de dados, treinamento, bolhas informacionais e desinformação.' },
  { id:6,title:'Vieses humanos e algorítmicos',cluster:'digital_midiatico',description:'Reconhecer como vieses podem aparecer em dados, linguagem, decisões e resultados.' },
  { id:7,title:'Aprendizagem autorregulada',cluster:'digital_midiatico',description:'Planejar, monitorar, identificar erros e ajustar estratégias com ou sem IA.' },
  { id:8,title:'Criatividade e descarga cognitiva',cluster:'digital_midiatico',description:'Criar com e sem IA preservando memória, autoria, esforço e pensamento crítico.' },
  { id:9,title:'Poder e desigualdades no ecossistema da IA',cluster:'etico_social',description:'Analisar desigualdades, interesses, concentração tecnológica e impactos sociais.' },
  { id:10,title:'Direitos e deveres digitais',cluster:'etico_social',description:'Compreender cidadania digital, direitos de crianças e adolescentes e responsabilidades.' },
  { id:11,title:'Responsabilidade, segurança e ética',cluster:'etico_social',description:'Usar IA de modo seguro, responsável, crítico e orientado ao bem-estar coletivo.' },
  { id:12,title:'Autonomia e bem-estar frente à IA',cluster:'etico_social',description:'Construir hábitos saudáveis, equilíbrio digital e convivência com diversidade.' },
]

const MISSIONS: AILiteracyMission[] = [
  {id:'ai1-iniciais',learningId:1,stage:'anos_iniciais',title:'A máquina de instruções',objective:'Perceber que sistemas seguem regras e sequências.',mode:'offline',activity:'Escolha uma tarefa simples da casa e dê instruções exatas para outra pessoa executá-la como se fosse um robô. Depois descubra onde suas instruções ficaram ambíguas.',evidence:'Conte quais instruções precisaram ser melhoradas.'},
  {id:'ai2-iniciais',learningId:2,stage:'anos_iniciais',title:'Caçador de padrões',objective:'Reconhecer padrões e classificação.',mode:'offline',activity:'Separe objetos por uma regra secreta e peça para alguém descobrir a regra. Depois troquem os papéis.',evidence:'Explique qual padrão você usou.'},
  {id:'ai5-iniciais',learningId:5,stage:'anos_iniciais',title:'O que eu contaria para um aplicativo?',objective:'Iniciar reflexão sobre dados pessoais.',mode:'guided_digital',activity:'Classifique exemplos em “posso compartilhar”, “só com adulto responsável” e “melhor não compartilhar”.',evidence:'Explique uma escolha.'},
  {id:'ai7-iniciais',learningId:7,stage:'anos_iniciais',title:'Meu plano de 3 passos',objective:'Praticar autorregulação simples.',mode:'offline',activity:'Escolha algo para aprender hoje, escreva três passos e marque qual foi mais difícil.',evidence:'Diga o que mudaria amanhã.'},
  {id:'ai8-iniciais',learningId:8,stage:'anos_iniciais',title:'Criei eu ou a ferramenta?',objective:'Valorizar autoria e criatividade.',mode:'project',activity:'Crie primeiro uma história curta sem ajuda digital. Depois peça ideias à IA com mediação e compare as duas versões.',evidence:'Aponte o que continuou sendo sua ideia.'},
  {id:'ai1-finais',learningId:1,stage:'anos_finais',title:'Por dentro de uma resposta de IA',objective:'Distinguir dado, algoritmo, modelo e resposta.',mode:'guided_digital',activity:'Analise um fluxo simples: dados → padrões → modelo → resposta. Identifique o que a IA não “sabe” como uma pessoa sabe.',evidence:'Explique a diferença entre prever palavras e compreender.'},
  {id:'ai5-finais',learningId:5,stage:'anos_finais',title:'Rastro de dados',objective:'Entender coleta, recomendação e bolhas.',mode:'project',activity:'Escolha um aplicativo conhecido e mapeie quais dados ele poderia usar para recomendar conteúdo.',evidence:'Liste um benefício, um risco e uma forma de reduzir o risco.'},
  {id:'ai6-finais',learningId:6,stage:'anos_finais',title:'Faça o algoritmo tropeçar',objective:'Perceber vieses e limitações.',mode:'guided_digital',activity:'Compare respostas dadas a perguntas equivalentes com mudanças de contexto. Procure generalizações ou estereótipos.',evidence:'Registre um possível viés e como você verificaria.'},
  {id:'ai8-finais',learningId:8,stage:'anos_finais',title:'Sem IA / com IA',objective:'Comparar criatividade e esforço cognitivo.',mode:'project',activity:'Resolva ou crie algo primeiro sem IA e depois com apoio de IA. Compare tempo, qualidade, aprendizado e autoria.',evidence:'Diga em qual etapa a IA ajudou e em qual atrapalhou.'},
  {id:'ai11-finais',learningId:11,stage:'anos_finais',title:'Pode confiar?',objective:'Praticar verificação de respostas.',mode:'guided_digital',activity:'Pegue três afirmações geradas por IA e verifique em fontes independentes.',evidence:'Classifique cada afirmação como confirmada, duvidosa ou falsa e explique.'},
  {id:'ai1-medio',learningId:1,stage:'ensino_medio',title:'LLM não é oráculo',objective:'Compreender inferência probabilística e limites de modelos.',mode:'guided_digital',activity:'Compare respostas do mesmo modelo a prompts equivalentes e analise variabilidade, contexto e certeza aparente.',evidence:'Escreva uma explicação curta sobre por que fluência não garante verdade.'},
  {id:'ai4-medio',learningId:4,stage:'ensino_medio',title:'O custo invisível da IA',objective:'Analisar ciclo de vida material da IA.',mode:'project',activity:'Mapeie recursos físicos envolvidos em treinamento e uso de IA: energia, água, chips, datacenters e trabalho humano.',evidence:'Proponha dois critérios de sustentabilidade para uma escola escolher ferramentas.'},
  {id:'ai6-medio',learningId:6,stage:'ensino_medio',title:'Auditoria de viés',objective:'Investigar vieses em sistemas de IA.',mode:'project',activity:'Desenhe um pequeno protocolo para testar um sistema em diferentes grupos/contextos sem usar dados pessoais sensíveis.',evidence:'Apresente hipótese, teste, resultado e limite da sua conclusão.'},
  {id:'ai9-medio',learningId:9,stage:'ensino_medio',title:'Quem governa a IA?',objective:'Analisar poder, mercado, Estado e sociedade.',mode:'project',activity:'Compare interesses de estudantes, empresas, governo e professores em uma decisão sobre uso de IA na escola.',evidence:'Construa uma matriz de conflitos e salvaguardas.'},
  {id:'ai10-medio',learningId:10,stage:'ensino_medio',title:'Direitos digitais na prática',objective:'Relacionar IA, privacidade, direitos e democracia.',mode:'guided_digital',activity:'Analise um caso fictício de plataforma escolar que coleta dados demais e proponha uma política alternativa.',evidence:'Defina finalidade, dados mínimos, responsável e direito de contestação.'},
  {id:'ai12-medio',learningId:12,stage:'ensino_medio',title:'Meu contrato pessoal com a IA',objective:'Promover autonomia e bem-estar.',mode:'offline',activity:'Crie regras pessoais para quando usar IA, quando não usar e como verificar se você continua aprendendo.',evidence:'Defina três sinais de dependência e três ações de prevenção.'},
]

export function getAILiteracyCurriculum(profile: Pick<StudentProfile,'age_group'|'grade'>) {
  const stage = getEducationStage(profile)
  return {
    stage,
    learnings: AI_LITERACY_LEARNINGS,
    missions: MISSIONS.filter(m => m.stage === stage),
    principles: ['aprender_com_e_sobre_ia','pensamento_critico','autoria','privacidade','equidade','bem_estar','cidadania_digital'],
  }
}

export function getAILiteracyMission(profile: Pick<StudentProfile,'age_group'|'grade'>, learningId?: number) {
  const curriculum = getAILiteracyCurriculum(profile)
  return curriculum.missions.find(m => !learningId || m.learningId === learningId) || curriculum.missions[0] || null
}
