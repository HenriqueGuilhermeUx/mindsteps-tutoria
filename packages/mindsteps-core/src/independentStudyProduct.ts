import type { Subject } from './types';

export type IndependentStudyGoal =
  | 'school_support'
  | 'exam_preparation'
  | 'homework_help'
  | 'learn_from_scratch'
  | 'curiosity_project'
  | 'review_and_retain';

export type StudySessionMode =
  | 'diagnostic'
  | 'guided_learning'
  | 'practice'
  | 'review'
  | 'assessment'
  | 'project';

export interface IndependentLearnerProfile {
  learnerId: string;
  name: string;
  ageGroup: string;
  grade?: string;
  subjects: Subject[];
  goals: IndependentStudyGoal[];
  weeklyMinutes: number;
  preferredDays: string[];
  guardianLinked: boolean;
  createdAt: string;
}

export interface HomeStudyPlanItem {
  id: string;
  title: string;
  subject: Subject;
  mode: StudySessionMode;
  objective: string;
  estimatedMinutes: number;
  completionEvidence: string[];
  required: boolean;
}

export interface HomeStudyPlan {
  learnerId: string;
  generatedAt: string;
  weeklyGoalMinutes: number;
  items: HomeStudyPlanItem[];
  safetyMessage: string;
  learnerMessage: string;
}

const GOAL_LABELS: Record<IndependentStudyGoal, string> = {
  school_support: 'Acompanhar melhor as matérias da escola',
  exam_preparation: 'Preparar-se para provas',
  homework_help: 'Entender tarefas e deveres',
  learn_from_scratch: 'Aprender um assunto desde o início',
  curiosity_project: 'Explorar um projeto por curiosidade',
  review_and_retain: 'Revisar e lembrar por mais tempo',
};

export function createIndependentStudyPlan(profile: IndependentLearnerProfile): HomeStudyPlan {
  const subjects = profile.subjects.length > 0 ? profile.subjects : (['mathematics'] as Subject[]);
  const perSubjectMinutes = Math.max(15, Math.floor(profile.weeklyMinutes / Math.max(1, subjects.length * 2)));
  const items: HomeStudyPlanItem[] = [];

  subjects.forEach((subject, index) => {
    items.push({
      id: `${profile.learnerId}-${subject}-learn-${index}`,
      title: `Aprender e explicar — ${subject}`,
      subject,
      mode: index === 0 ? 'diagnostic' : 'guided_learning',
      objective: index === 0
        ? 'Descobrir o que já está claro e onde começar com segurança.'
        : 'Compreender um conceito com apoio adaptativo e exemplos diferentes.',
      estimatedMinutes: perSubjectMinutes,
      completionEvidence: [
        'Registrar uma tentativa própria',
        'Explicar a ideia com palavras próprias',
        'Identificar o próximo passo',
      ],
      required: true,
    });

    items.push({
      id: `${profile.learnerId}-${subject}-apply-${index}`,
      title: `Praticar e transferir — ${subject}`,
      subject,
      mode: profile.goals.includes('exam_preparation') ? 'assessment' : 'practice',
      objective: 'Aplicar o que foi aprendido em uma situação diferente e justificar o raciocínio.',
      estimatedMinutes: perSubjectMinutes,
      completionEvidence: [
        'Resolver pelo menos uma situação nova',
        'Explicar o que permaneceu igual',
        'Revisar um erro ou estratégia',
      ],
      required: true,
    });
  });

  if (profile.goals.includes('curiosity_project')) {
    items.push({
      id: `${profile.learnerId}-curiosity-project`,
      title: 'Projeto de curiosidade',
      subject: subjects[0],
      mode: 'project',
      objective: 'Transformar uma pergunta pessoal em investigação, criação ou explicação.',
      estimatedMinutes: Math.max(30, perSubjectMinutes * 2),
      completionEvidence: [
        'Formular uma pergunta',
        'Buscar ou comparar evidências',
        'Criar uma conclusão ou produto próprio',
      ],
      required: false,
    });
  }

  return {
    learnerId: profile.learnerId,
    generatedAt: new Date().toISOString(),
    weeklyGoalMinutes: profile.weeklyMinutes,
    items,
    safetyMessage: profile.guardianLinked
      ? 'Responsável vinculado. O acompanhamento deve apoiar autonomia, sem vigilância ou pressão.'
      : 'O estudante pode usar o MindSteps sozinho. Para menores, recomendamos vínculo opcional com responsável e canais claros de ajuda humana.',
    learnerMessage: `Seu plano foi criado a partir destes objetivos: ${profile.goals.map((goal) => GOAL_LABELS[goal]).join(', ')}. Você pode avançar no seu ritmo, pedir outra explicação e retomar de onde parou.`,
  };
}

export function summarizeIndependentStudyPlan(plan: HomeStudyPlan): string {
  const required = plan.items.filter((item) => item.required).length;
  return `${plan.items.length} atividades planejadas, ${required} essenciais, meta semanal de ${plan.weeklyGoalMinutes} minutos.`;
}
