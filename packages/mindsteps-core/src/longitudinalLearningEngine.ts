import type { Subject } from './types';
import type { ConceptMastery } from './masteryEngine';

export type LearningTrend = 'accelerating' | 'improving' | 'stable' | 'declining' | 'insufficient_data';

export interface LongitudinalSnapshot {
  capturedAt: string;
  subject: Subject;
  conceptId: string;
  masteryScore: number;
  confidence: number;
  engagementScore?: number;
  autonomyScore?: number;
  transferScore?: number;
}

export interface LongitudinalConceptTrajectory {
  conceptId: string;
  subject: Subject;
  snapshots: LongitudinalSnapshot[];
  trend: LearningTrend;
  velocity: number;
  retentionRisk: 'low' | 'medium' | 'high' | 'unknown';
  lastEvidenceAt?: string;
  recommendedReviewAt?: string;
}

export interface LongitudinalLearningProfile {
  learnerId: string;
  trajectories: LongitudinalConceptTrajectory[];
  durableStrengths: string[];
  fragileKnowledge: string[];
  emergingCapabilities: string[];
  reviewQueue: Array<{ conceptId: string; priority: number; reason: string }>;
  generatedAt: string;
  safeguards: string[];
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function inferTrend(snapshots: LongitudinalSnapshot[]): LearningTrend {
  if (snapshots.length < 2) return 'insufficient_data';
  const recent = snapshots.slice(-4);
  const first = recent[0].masteryScore;
  const last = recent[recent.length - 1].masteryScore;
  const delta = last - first;
  if (delta >= 20) return 'accelerating';
  if (delta >= 6) return 'improving';
  if (delta <= -8) return 'declining';
  return 'stable';
}

function calculateVelocity(snapshots: LongitudinalSnapshot[]): number {
  if (snapshots.length < 2) return 0;
  const first = snapshots[0];
  const last = snapshots[snapshots.length - 1];
  const days = Math.max(1, (new Date(last.capturedAt).getTime() - new Date(first.capturedAt).getTime()) / 86_400_000);
  return Math.round(((last.masteryScore - first.masteryScore) / days) * 100) / 100;
}

function inferRetentionRisk(snapshots: LongitudinalSnapshot[]): LongitudinalConceptTrajectory['retentionRisk'] {
  if (!snapshots.length) return 'unknown';
  const last = snapshots[snapshots.length - 1];
  const ageDays = (Date.now() - new Date(last.capturedAt).getTime()) / 86_400_000;
  if (last.masteryScore < 45 || ageDays > 45) return 'high';
  if (last.masteryScore < 70 || ageDays > 21) return 'medium';
  return 'low';
}

function nextReviewDate(risk: LongitudinalConceptTrajectory['retentionRisk']): string | undefined {
  if (risk === 'unknown') return undefined;
  const days = risk === 'high' ? 2 : risk === 'medium' ? 7 : 21;
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

export function appendLongitudinalSnapshot(
  trajectory: LongitudinalConceptTrajectory | undefined,
  snapshot: LongitudinalSnapshot
): LongitudinalConceptTrajectory {
  const snapshots = [...(trajectory?.snapshots || []), snapshot]
    .sort((a, b) => a.capturedAt.localeCompare(b.capturedAt))
    .slice(-60);
  const retentionRisk = inferRetentionRisk(snapshots);
  return {
    conceptId: snapshot.conceptId,
    subject: snapshot.subject,
    snapshots,
    trend: inferTrend(snapshots),
    velocity: calculateVelocity(snapshots),
    retentionRisk,
    lastEvidenceAt: snapshots[snapshots.length - 1]?.capturedAt,
    recommendedReviewAt: nextReviewDate(retentionRisk),
  };
}

export function snapshotFromMastery(mastery: ConceptMastery, extras?: Partial<LongitudinalSnapshot>): LongitudinalSnapshot {
  return {
    capturedAt: extras?.capturedAt || new Date().toISOString(),
    subject: mastery.subject,
    conceptId: mastery.conceptId,
    masteryScore: clamp(mastery.score),
    confidence: clamp(mastery.confidence * 10),
    engagementScore: extras?.engagementScore,
    autonomyScore: extras?.autonomyScore,
    transferScore: extras?.transferScore,
  };
}

export function buildLongitudinalLearningProfile(params: {
  learnerId: string;
  trajectories: LongitudinalConceptTrajectory[];
}): LongitudinalLearningProfile {
  const durableStrengths = params.trajectories
    .filter((item) => item.retentionRisk === 'low' && item.snapshots.at(-1)!.masteryScore >= 80)
    .map((item) => item.conceptId);
  const fragileKnowledge = params.trajectories
    .filter((item) => item.retentionRisk === 'high' || item.trend === 'declining')
    .map((item) => item.conceptId);
  const emergingCapabilities = params.trajectories
    .filter((item) => ['accelerating', 'improving'].includes(item.trend) && item.snapshots.at(-1)!.masteryScore < 80)
    .map((item) => item.conceptId);
  const reviewQueue = params.trajectories
    .filter((item) => item.retentionRisk !== 'low')
    .map((item) => ({
      conceptId: item.conceptId,
      priority: item.retentionRisk === 'high' ? 100 : item.retentionRisk === 'medium' ? 60 : 30,
      reason: item.trend === 'declining' ? 'Queda recente de domínio.' : 'Revisão espaçada recomendada.',
    }))
    .sort((a, b) => b.priority - a.priority);

  return {
    learnerId: params.learnerId,
    trajectories: params.trajectories,
    durableStrengths,
    fragileKnowledge,
    emergingCapabilities,
    reviewQueue,
    generatedAt: new Date().toISOString(),
    safeguards: [
      'Tendências descrevem evidências ao longo do tempo, não capacidade fixa.',
      'Queda de desempenho deve gerar investigação e apoio, nunca punição.',
      'Decisões de alto impacto exigem revisão humana e múltiplas fontes de evidência.',
    ],
  };
}
