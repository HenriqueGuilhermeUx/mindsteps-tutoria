import type { Subject } from './types';
import type { LearningSignal } from './learningSignals';
import type { LearningState } from './learningState';
import type { TeacherInsight } from './teacherCopilot';
import type { FamilyCompanionMessage } from './familyCompanion';
import { shouldShowTeacherAlert, type WhiteLabelConfig, DEFAULT_WHITE_LABEL_CONFIG } from './whiteLabel';

export type InterventionTarget = 'learner' | 'teacher' | 'family' | 'institution';
export type InterventionUrgency = 'low' | 'medium' | 'high';

export interface InterventionPlan {
  target: InterventionTarget;
  urgency: InterventionUrgency;
  title: string;
  reason: string;
  recommendedAction: string;
  subject?: Subject;
}

function urgencyFromStrength(strength: number): InterventionUrgency {
  if (strength >= 8) return 'high';
  if (strength >= 5) return 'medium';
  return 'low';
}

export function planInterventions(params: {
  learnerName?: string;
  subject: Subject;
  learningState: LearningState;
  signals: LearningSignal[];
  teacherInsights?: TeacherInsight[];
  familyMessages?: FamilyCompanionMessage[];
  config?: WhiteLabelConfig;
}): InterventionPlan[] {
  const config = params.config || DEFAULT_WHITE_LABEL_CONFIG;
  const learner = params.learnerName || 'O estudante';
  const plans: InterventionPlan[] = [];

  const recoverySignal = params.signals.find((signal) => signal.type === 'RecoveryNeeded');
  if (recoverySignal) {
    plans.push({
      target: 'learner',
      urgency: urgencyFromStrength(recoverySignal.strength),
      title: 'Recuperar segurança do estudante',
      reason: recoverySignal.reason,
      recommendedAction: 'Reduzir dificuldade, acolher o erro e fazer uma pergunta pequena de próximo passo.',
      subject: params.subject,
    });
  }

  const teacherSignal = params.signals.find((signal) => signal.type === 'TeacherAttentionSuggested');
  if (teacherSignal && config.modules.teacherCopilot && shouldShowTeacherAlert(config, teacherSignal.strength)) {
    const strongestInsight = params.teacherInsights?.[0];
    plans.push({
      target: 'teacher',
      urgency: urgencyFromStrength(teacherSignal.strength),
      title: strongestInsight?.title || 'Atenção docente recomendada',
      reason: strongestInsight?.summary || teacherSignal.reason,
      recommendedAction: strongestInsight?.recommendedAction || 'Observar o padrão de dificuldade e intervir com exemplo concreto.',
      subject: params.subject,
    });
  }

  const familySignal = params.signals.find((signal) => signal.type === 'FamilySupportSuggested');
  if (familySignal && config.modules.familyCompanion) {
    const familyMessage = params.familyMessages?.[0];
    plans.push({
      target: 'family',
      urgency: urgencyFromStrength(familySignal.strength),
      title: familyMessage?.title || 'Apoio em casa sugerido',
      reason: familySignal.reason,
      recommendedAction: familyMessage?.suggestedAction || 'Conversar sobre o que foi aprendido hoje.',
      subject: params.subject,
    });
  }

  if (params.learningState.label === 'ready_for_challenge') {
    plans.push({
      target: 'learner',
      urgency: 'medium',
      title: 'Oferecer desafio gradual',
      reason: `${learner} demonstra confiança suficiente para transferir conhecimento.`,
      recommendedAction: 'Propor aplicação em novo contexto ou pedir explicação com as próprias palavras.',
      subject: params.subject,
    });
  }

  if (plans.length === 0) {
    plans.push({
      target: 'learner',
      urgency: 'low',
      title: 'Continuar trilha guiada',
      reason: 'Nenhum sinal crítico foi detectado nesta interação.',
      recommendedAction: 'Manter pergunta socrática curta e observar novos sinais.',
      subject: params.subject,
    });
  }

  return plans.sort((a, b) => {
    const order = { high: 3, medium: 2, low: 1 };
    return order[b.urgency] - order[a.urgency];
  });
}

export function summarizeInterventionPlans(plans: InterventionPlan[]): string {
  return plans
    .slice(0, 4)
    .map((plan) => `${plan.target}/${plan.urgency}: ${plan.title} - ${plan.recommendedAction}`)
    .join(' | ');
}
