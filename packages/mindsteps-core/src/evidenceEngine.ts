import type { LearningEvent, Subject } from './types';
import type { LearningSignal } from './learningSignals';
import type { MisconceptionPattern } from './misconceptionEngine';
import type { InterventionPlan } from './interventionEngine';
import type { PredictionResult } from './predictionEngine';

export type EvidenceSource = 'event' | 'signal' | 'misconception' | 'prediction' | 'intervention';
export type EvidenceStrength = 'weak' | 'moderate' | 'strong';

export interface LearningEvidenceItem {
  id: string;
  source: EvidenceSource;
  subject?: Subject;
  claim: string;
  evidence: string;
  strength: EvidenceStrength;
  createdAt: string;
}

export interface EvidenceBundle {
  learnerId: string;
  items: LearningEvidenceItem[];
  summary: string;
  confidenceScore: number;
  createdAt: string;
}

function strengthFromScore(score: number): EvidenceStrength {
  if (score >= 8) return 'strong';
  if (score >= 5) return 'moderate';
  return 'weak';
}

function normalizeScore(value: number): number {
  return Math.max(0, Math.min(10, value));
}

export function buildEvidenceBundle(params: {
  learnerId: string;
  subject: Subject;
  events?: LearningEvent[];
  signals?: LearningSignal[];
  misconceptions?: MisconceptionPattern[];
  predictions?: PredictionResult[];
  interventions?: InterventionPlan[];
}): EvidenceBundle {
  const now = new Date().toISOString();
  const items: LearningEvidenceItem[] = [];

  for (const event of params.events || []) {
    if (!event.evidence) continue;
    items.push({
      id: `event:${event.id}`,
      source: 'event',
      subject: event.subject || params.subject,
      claim: `Evento pedagógico detectado: ${event.type}`,
      evidence: event.evidence,
      strength: 'moderate',
      createdAt: event.createdAt,
    });
  }

  for (const signal of params.signals || []) {
    items.push({
      id: `signal:${signal.type}:${signal.createdAt}`,
      source: 'signal',
      subject: signal.subject || params.subject,
      claim: signal.reason,
      evidence: signal.evidence || signal.reason,
      strength: strengthFromScore(signal.strength),
      createdAt: signal.createdAt,
    });
  }

  for (const misconception of params.misconceptions || []) {
    items.push({
      id: `misconception:${misconception.id}`,
      source: 'misconception',
      subject: misconception.subject,
      claim: misconception.label,
      evidence: misconception.evidence.join(' | '),
      strength: misconception.severity === 'high' ? 'strong' : misconception.severity === 'medium' ? 'moderate' : 'weak',
      createdAt: now,
    });
  }

  for (const prediction of params.predictions || []) {
    items.push({
      id: `prediction:${prediction.conceptId}`,
      source: 'prediction',
      subject: params.subject,
      claim: prediction.title,
      evidence: prediction.reasons.join(' | '),
      strength: strengthFromScore(prediction.riskScore / 10),
      createdAt: now,
    });
  }

  for (const intervention of params.interventions || []) {
    items.push({
      id: `intervention:${intervention.target}:${intervention.title}`,
      source: 'intervention',
      subject: intervention.subject || params.subject,
      claim: intervention.title,
      evidence: intervention.reason,
      strength: intervention.urgency === 'high' ? 'strong' : intervention.urgency === 'medium' ? 'moderate' : 'weak',
      createdAt: now,
    });
  }

  const strong = items.filter((item) => item.strength === 'strong').length;
  const moderate = items.filter((item) => item.strength === 'moderate').length;
  const confidenceScore = normalizeScore(strong * 2 + moderate + Math.min(2, items.length / 3));

  return {
    learnerId: params.learnerId,
    items,
    summary: items.length === 0
      ? 'Ainda não há evidências suficientes para justificar uma decisão pedagógica.'
      : `${items.length} evidências registradas: ${strong} fortes, ${moderate} moderadas e ${items.length - strong - moderate} fracas.`,
    confidenceScore,
    createdAt: now,
  };
}

export function explainEvidence(bundle: EvidenceBundle, limit = 5): string {
  if (bundle.items.length === 0) return bundle.summary;

  return bundle.items
    .sort((a, b) => {
      const order = { strong: 3, moderate: 2, weak: 1 };
      return order[b.strength] - order[a.strength];
    })
    .slice(0, limit)
    .map((item) => `${item.strength.toUpperCase()} - ${item.claim}: ${item.evidence}`)
    .join(' | ');
}
