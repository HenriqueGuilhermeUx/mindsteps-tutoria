import type { Subject } from './types';
import type { LearningSignal } from './learningSignals';
import type { LearningState } from './learningState';
import type { MisconceptionPattern } from './misconceptionEngine';
import type { TeachingStrategyMemory } from './teachingStrategyMemory';

export type TeacherInsightPriority = 'low' | 'medium' | 'high';
export type TeacherInsightCategory =
  | 'conceptual_gap'
  | 'confidence'
  | 'curiosity'
  | 'strategy'
  | 'intervention'
  | 'progress';

export interface TeacherInsight {
  category: TeacherInsightCategory;
  priority: TeacherInsightPriority;
  title: string;
  summary: string;
  recommendedAction: string;
  evidence: string[];
}

function priorityFromStrength(strength: number): TeacherInsightPriority {
  if (strength >= 8) return 'high';
  if (strength >= 5) return 'medium';
  return 'low';
}

export function generateTeacherInsights(params: {
  learnerName?: string;
  subject: Subject;
  learningState: LearningState;
  signals: LearningSignal[];
  misconceptions: MisconceptionPattern[];
  teachingStrategyMemory?: TeachingStrategyMemory;
}): TeacherInsight[] {
  const learner = params.learnerName || 'O aluno';
  const insights: TeacherInsight[] = [];

  for (const misconception of params.misconceptions) {
    insights.push({
      category: 'conceptual_gap',
      priority: misconception.severity === 'high' ? 'high' : misconception.severity === 'medium' ? 'medium' : 'low',
      title: misconception.label,
      summary: `${learner} pode estar com uma lacuna conceitual em ${misconception.concept || misconception.subject}.`,
      recommendedAction: misconception.recommendedIntervention,
      evidence: misconception.evidence,
    });
  }

  const recoverySignal = params.signals.find((signal) => signal.type === 'RecoveryNeeded');
  if (recoverySignal) {
    insights.push({
      category: 'confidence',
      priority: priorityFromStrength(recoverySignal.strength),
      title: 'Recuperar confiança antes de avançar',
      summary: `${learner} demonstra sinais de baixa confiança ou frustração nesta interação.`,
      recommendedAction: 'Comece por um exemplo simples, valide o esforço e só depois avance para desafio.',
      evidence: [recoverySignal.evidence || recoverySignal.reason],
    });
  }

  const curiositySignal = params.signals.find((signal) => signal.type === 'CuriosityDetected');
  if (curiositySignal) {
    insights.push({
      category: 'curiosity',
      priority: priorityFromStrength(curiositySignal.strength),
      title: 'Aproveitar curiosidade ativa',
      summary: `${learner} demonstrou curiosidade que pode ser transformada em investigação.`,
      recommendedAction: 'Proponha uma pergunta aberta ou uma mini investigação relacionada ao tema.',
      evidence: [curiositySignal.evidence || curiositySignal.reason],
    });
  }

  if (params.learningState.label === 'ready_for_challenge') {
    insights.push({
      category: 'progress',
      priority: 'medium',
      title: 'Pronto para desafio gradual',
      summary: `${learner} parece pronto para uma tarefa um pouco mais complexa em ${params.subject}.`,
      recommendedAction: 'Use transferência: peça para explicar com as próprias palavras ou aplicar em novo contexto.',
      evidence: [params.learningState.explanation],
    });
  }

  const bestStrategy = params.teachingStrategyMemory?.records
    .filter((record) => record.attempts > 0)
    .sort((a, b) => b.successes / b.attempts - a.successes / a.attempts)[0];

  if (bestStrategy) {
    const rate = Math.round((bestStrategy.successes / bestStrategy.attempts) * 100);
    insights.push({
      category: 'strategy',
      priority: rate >= 70 ? 'medium' : 'low',
      title: 'Estratégia com melhor evidência para este aluno',
      summary: `${bestStrategy.strategy} teve ${rate}% de sucesso nas tentativas registradas.`,
      recommendedAction: `Priorize ${bestStrategy.strategy} em ${bestStrategy.concept || bestStrategy.subject} antes de testar nova estratégia.`,
      evidence: bestStrategy.evidence.slice(-3),
    });
  }

  return insights.sort((a, b) => {
    const order = { high: 3, medium: 2, low: 1 };
    return order[b.priority] - order[a.priority];
  });
}

export function summarizeTeacherInsights(insights: TeacherInsight[]): string {
  if (insights.length === 0) return 'Nenhum insight docente relevante nesta interação.';

  return insights
    .slice(0, 4)
    .map((insight) => `${insight.priority.toUpperCase()} - ${insight.title}: ${insight.recommendedAction}`)
    .join(' | ');
}
