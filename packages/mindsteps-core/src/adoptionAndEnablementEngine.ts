export type MindStepsAudience =
  | 'student'
  | 'family'
  | 'teacher'
  | 'coordinator'
  | 'director'
  | 'network_manager';

export type EnablementFormat = 'guided_tour' | 'video' | 'checklist' | 'workshop' | 'article' | 'practice';

export interface EnablementModule {
  id: string;
  title: string;
  objective: string;
  format: EnablementFormat;
  estimatedMinutes: number;
  required: boolean;
  successEvidence: string[];
}

export interface AudienceEnablementJourney {
  audience: MindStepsAudience;
  promise: string;
  registrationSteps: string[];
  firstSessionGoal: string;
  firstWeekOutcomes: string[];
  modules: EnablementModule[];
  supportMessages: string[];
  adoptionMetrics: string[];
}

export interface SchoolLaunchPlan {
  preparation: string[];
  launchWeek: string[];
  firstThirtyDays: string[];
  governance: string[];
  communicationCadence: string[];
  journeys: AudienceEnablementJourney[];
}

const sharedRegistration = [
  'Receber convite seguro da escola ou acessar a página oficial do MindSteps.',
  'Selecionar o perfil correto e confirmar e-mail ou vínculo institucional.',
  'Aceitar os termos aplicáveis e concluir somente os dados necessários.',
  'Realizar a configuração inicial guiada e conhecer o painel correspondente ao perfil.',
];

const journeys: Record<MindStepsAudience, AudienceEnablementJourney> = {
  student: {
    audience: 'student',
    promise: 'Aprender com apoio personalizado, compreender o próprio progresso e desenvolver autonomia.',
    registrationSteps: sharedRegistration,
    firstSessionGoal: 'Concluir uma atividade curta, receber apoio do tutor e visualizar a próxima etapa.',
    firstWeekOutcomes: ['Saber pedir ajuda ao tutor', 'Entender missões, domínio e trilha', 'Reconhecer que errar gera evidência para aprender'],
    modules: [
      { id: 'student-welcome', title: 'Bem-vindo ao MindSteps', objective: 'Entender o papel do tutor e como iniciar.', format: 'guided_tour', estimatedMinutes: 5, required: true, successEvidence: ['Iniciou a primeira missão'] },
      { id: 'student-tutor', title: 'Como conversar com o tutor', objective: 'Perguntar, explicar raciocínio e solicitar outra abordagem.', format: 'practice', estimatedMinutes: 10, required: true, successEvidence: ['Fez uma pergunta', 'Explicou uma tentativa'] },
      { id: 'student-progress', title: 'Meu progresso', objective: 'Interpretar domínio, evidências e próximos passos.', format: 'guided_tour', estimatedMinutes: 7, required: true, successEvidence: ['Abriu o painel de aprendizagem'] },
    ],
    supportMessages: ['Você não precisa acertar de primeira.', 'Peça outro exemplo quando algo não fizer sentido.', 'Seu progresso não é uma comparação com outros alunos.'],
    adoptionMetrics: ['primeira missão concluída', 'retorno em sete dias', 'uso do tutor', 'visualização do progresso'],
  },
  family: {
    audience: 'family',
    promise: 'Acompanhar a aprendizagem com clareza, sem transformar o painel em vigilância ou pressão.',
    registrationSteps: sharedRegistration,
    firstSessionGoal: 'Vincular-se ao estudante e compreender o resumo de evolução e prioridades.',
    firstWeekOutcomes: ['Interpretar evidências', 'Saber como apoiar em casa', 'Conhecer os limites de privacidade'],
    modules: [
      { id: 'family-dashboard', title: 'Entendendo o painel da família', objective: 'Ler progresso, forças e prioridades.', format: 'guided_tour', estimatedMinutes: 8, required: true, successEvidence: ['Visualizou o resumo do período'] },
      { id: 'family-support', title: 'Como apoiar sem dar a resposta', objective: 'Usar perguntas e rotinas simples de apoio.', format: 'video', estimatedMinutes: 8, required: true, successEvidence: ['Concluiu a orientação de apoio'] },
      { id: 'family-privacy', title: 'Privacidade e uso responsável', objective: 'Compreender quais dados aparecem e por quê.', format: 'article', estimatedMinutes: 6, required: true, successEvidence: ['Confirmou leitura das orientações'] },
    ],
    supportMessages: ['Converse sobre estratégias, não apenas notas.', 'Valorize revisão e persistência.', 'Procure a escola quando houver uma prioridade recorrente.'],
    adoptionMetrics: ['vínculo confirmado', 'painel visualizado', 'relatório lido', 'orientação de apoio concluída'],
  },
  teacher: {
    audience: 'teacher',
    promise: 'Transformar evidências em decisões pedagógicas sem retirar a autonomia docente.',
    registrationSteps: sharedRegistration,
    firstSessionGoal: 'Importar ou acessar uma turma, interpretar alertas e validar uma intervenção.',
    firstWeekOutcomes: ['Ler o mapa da turma', 'Validar recomendações', 'Criar uma atividade ou intervenção'],
    modules: [
      { id: 'teacher-class', title: 'Primeira leitura da turma', objective: 'Interpretar domínio, fragilidades e prontidão.', format: 'workshop', estimatedMinutes: 30, required: true, successEvidence: ['Abriu a turma', 'Identificou uma prioridade'] },
      { id: 'teacher-copilot', title: 'Teacher Copilot com supervisão humana', objective: 'Validar, editar ou rejeitar recomendações.', format: 'practice', estimatedMinutes: 20, required: true, successEvidence: ['Validou uma intervenção'] },
      { id: 'teacher-plan', title: 'Planos, avaliações e trilhas', objective: 'Criar experiências alinhadas ao currículo.', format: 'workshop', estimatedMinutes: 35, required: true, successEvidence: ['Publicou uma atividade'] },
    ],
    supportMessages: ['Toda recomendação é revisável.', 'Os agrupamentos são temporários.', 'A tecnologia apoia a decisão; não substitui o professor.'],
    adoptionMetrics: ['turmas ativas', 'intervenções validadas', 'atividades publicadas', 'alunos acompanhados'],
  },
  coordinator: {
    audience: 'coordinator',
    promise: 'Acompanhar prioridades pedagógicas, apoiar professores e organizar ciclos de intervenção.',
    registrationSteps: sharedRegistration,
    firstSessionGoal: 'Configurar escola, turmas e responsáveis pedagógicos.',
    firstWeekOutcomes: ['Ler cobertura curricular', 'Organizar prioridades', 'Acompanhar adoção docente'],
    modules: [
      { id: 'coord-setup', title: 'Configuração pedagógica', objective: 'Organizar escola, turmas, componentes e permissões.', format: 'checklist', estimatedMinutes: 25, required: true, successEvidence: ['Estrutura escolar configurada'] },
      { id: 'coord-analytics', title: 'Analytics para ação pedagógica', objective: 'Distinguir sinal, tendência e alerta.', format: 'workshop', estimatedMinutes: 40, required: true, successEvidence: ['Criou uma pauta de acompanhamento'] },
      { id: 'coord-coaching', title: 'Apoio ao professor', objective: 'Usar evidências em conversas formativas.', format: 'practice', estimatedMinutes: 30, required: true, successEvidence: ['Registrou um ciclo de apoio'] },
    ],
    supportMessages: ['Indicadores não substituem observação pedagógica.', 'Evite rankings de professores ou alunos.', 'Use tendências para organizar apoio, não punição.'],
    adoptionMetrics: ['professores ativados', 'turmas com evidência', 'ciclos de apoio realizados', 'prioridades revisadas'],
  },
  director: {
    audience: 'director',
    promise: 'Compreender impacto, adoção, equidade e riscos para tomar decisões responsáveis.',
    registrationSteps: sharedRegistration,
    firstSessionGoal: 'Visualizar o panorama da escola e confirmar governança, responsáveis e metas do piloto.',
    firstWeekOutcomes: ['Conhecer indicadores executivos', 'Entender limites dos dados', 'Definir rotina de governança'],
    modules: [
      { id: 'director-impact', title: 'Painel executivo', objective: 'Ler adoção, cobertura, progresso e equidade.', format: 'guided_tour', estimatedMinutes: 15, required: true, successEvidence: ['Abriu o panorama institucional'] },
      { id: 'director-governance', title: 'Governança e segurança', objective: 'Definir responsáveis, acessos e revisão de riscos.', format: 'workshop', estimatedMinutes: 45, required: true, successEvidence: ['Plano de governança aprovado'] },
      { id: 'director-pilot', title: 'Gestão do piloto', objective: 'Definir metas, critérios de sucesso e comunicação.', format: 'checklist', estimatedMinutes: 25, required: true, successEvidence: ['Metas do piloto registradas'] },
    ],
    supportMessages: ['Não use o produto para ranquear pessoas.', 'Avalie impacto com múltiplas evidências.', 'Proteja tempo de formação e acompanhamento.'],
    adoptionMetrics: ['adesão por perfil', 'uso semanal', 'qualidade das evidências', 'metas do piloto'],
  },
  network_manager: {
    audience: 'network_manager',
    promise: 'Acompanhar redes e territórios com equidade, transparência e autonomia local.',
    registrationSteps: sharedRegistration,
    firstSessionGoal: 'Configurar unidades, perfis de acesso e objetivos sistêmicos.',
    firstWeekOutcomes: ['Interpretar visão por território', 'Conhecer governança federada', 'Planejar suporte às escolas'],
    modules: [
      { id: 'network-setup', title: 'Estrutura da rede', objective: 'Configurar escolas, regiões e responsabilidades.', format: 'checklist', estimatedMinutes: 40, required: true, successEvidence: ['Rede configurada'] },
      { id: 'network-equity', title: 'Equidade e leitura territorial', objective: 'Comparar contextos sem criar rankings simplistas.', format: 'workshop', estimatedMinutes: 50, required: true, successEvidence: ['Plano territorial de apoio criado'] },
      { id: 'network-rollout', title: 'Expansão responsável', objective: 'Planejar formação, suporte e avaliação por ondas.', format: 'workshop', estimatedMinutes: 45, required: true, successEvidence: ['Plano de expansão aprovado'] },
    ],
    supportMessages: ['Contexto explica necessidades; não define potencial.', 'Compare condições e apoio, não apenas resultados.', 'Expanda somente com suporte e governança adequados.'],
    adoptionMetrics: ['escolas ativadas', 'formações concluídas', 'uso por território', 'intervenções sistêmicas'],
  },
};

export function getEnablementJourney(audience: MindStepsAudience): AudienceEnablementJourney {
  return journeys[audience];
}

export function createSchoolLaunchPlan(): SchoolLaunchPlan {
  return {
    preparation: ['Definir patrocinador executivo e liderança pedagógica', 'Configurar privacidade, acessos e integrações', 'Selecionar turmas do piloto', 'Comunicar objetivos e limites do produto'],
    launchWeek: ['Formar gestores e coordenação', 'Realizar oficina prática com professores', 'Apresentar o produto a estudantes', 'Enviar guia e encontro para famílias'],
    firstThirtyDays: ['Acompanhar ativação por perfil', 'Manter plantão de dúvidas', 'Revisar alertas e recomendações com professores', 'Publicar devolutiva transparente do piloto'],
    governance: ['Revisão mensal de segurança e equidade', 'Canal para contestar ou corrigir dados', 'Decisões pedagógicas sempre sob supervisão humana', 'Proibição de rankings simplistas e uso punitivo'],
    communicationCadence: ['Mensagem de boas-vindas antes do primeiro acesso', 'Dicas contextuais durante a primeira semana', 'Resumo semanal por perfil', 'Encontro de revisão após 30 dias'],
    journeys: Object.values(journeys),
  };
}
