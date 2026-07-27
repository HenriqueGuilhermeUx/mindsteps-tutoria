import type { Subject } from './types';
import type { ConceptMastery } from './masteryEngine';

export type KnowledgeNodeStatus = 'locked' | 'ready' | 'learning' | 'fragile' | 'mastered';

export interface KnowledgeMapNode {
  id: string;
  title: string;
  subject: Subject;
  prerequisiteIds: string[];
  masteryScore: number;
  confidence: number;
  status: KnowledgeNodeStatus;
  evidenceCount: number;
  lastUpdatedAt?: string;
}

export interface KnowledgeMapEdge {
  from: string;
  to: string;
  relation: 'prerequisite' | 'supports' | 'transfers_to';
  strength: number;
}

export interface KnowledgeMapEvolution {
  learnerId: string;
  nodes: KnowledgeMapNode[];
  edges: KnowledgeMapEdge[];
  unlockedConcepts: string[];
  bottlenecks: string[];
  nextBestConcepts: string[];
  coverage: number;
  generatedAt: string;
}

function inferStatus(node: Omit<KnowledgeMapNode, 'status'>, masteredPrerequisites: boolean): KnowledgeNodeStatus {
  if (!masteredPrerequisites) return 'locked';
  if (node.masteryScore >= 85 && node.confidence >= 60) return 'mastered';
  if (node.masteryScore > 0 && node.masteryScore < 50) return 'fragile';
  if (node.masteryScore >= 50) return 'learning';
  return 'ready';
}

export function buildKnowledgeMap(params: {
  learnerId: string;
  concepts: Array<{ id: string; title: string; subject: Subject; prerequisiteIds?: string[] }>;
  mastery: ConceptMastery[];
  transferEdges?: KnowledgeMapEdge[];
}): KnowledgeMapEvolution {
  const masteryById = new Map(params.mastery.map((item) => [item.conceptId, item]));
  const nodesWithoutStatus = params.concepts.map((concept) => {
    const mastery = masteryById.get(concept.id);
    return {
      id: concept.id,
      title: concept.title,
      subject: concept.subject,
      prerequisiteIds: concept.prerequisiteIds || [],
      masteryScore: mastery?.score || 0,
      confidence: Math.round((mastery?.confidence || 0) * 10),
      evidenceCount: mastery?.evidence.length || 0,
      lastUpdatedAt: mastery?.updatedAt,
    };
  });

  const provisionalMastered = new Set(nodesWithoutStatus.filter((node) => node.masteryScore >= 85).map((node) => node.id));
  const nodes: KnowledgeMapNode[] = nodesWithoutStatus.map((node) => ({
    ...node,
    status: inferStatus(node, node.prerequisiteIds.every((id) => provisionalMastered.has(id))),
  }));

  const edges: KnowledgeMapEdge[] = [
    ...params.concepts.flatMap((concept) =>
      (concept.prerequisiteIds || []).map((prerequisiteId) => ({
        from: prerequisiteId,
        to: concept.id,
        relation: 'prerequisite' as const,
        strength: 100,
      }))
    ),
    ...(params.transferEdges || []),
  ];

  const unlockedConcepts = nodes.filter((node) => node.status === 'ready').map((node) => node.id);
  const bottlenecks = nodes
    .filter((node) => node.status === 'fragile' && edges.some((edge) => edge.from === node.id && edge.relation === 'prerequisite'))
    .map((node) => node.id);
  const nextBestConcepts = nodes
    .filter((node) => ['ready', 'fragile', 'learning'].includes(node.status))
    .sort((a, b) => {
      const aBottleneck = bottlenecks.includes(a.id) ? 1 : 0;
      const bBottleneck = bottlenecks.includes(b.id) ? 1 : 0;
      return bBottleneck - aBottleneck || b.masteryScore - a.masteryScore;
    })
    .slice(0, 5)
    .map((node) => node.id);
  const coverage = nodes.length ? Math.round((nodes.filter((node) => node.status === 'mastered').length / nodes.length) * 100) : 0;

  return {
    learnerId: params.learnerId,
    nodes,
    edges,
    unlockedConcepts,
    bottlenecks,
    nextBestConcepts,
    coverage,
    generatedAt: new Date().toISOString(),
  };
}

export function summarizeKnowledgeMap(map: KnowledgeMapEvolution): string {
  return `Cobertura ${map.coverage}%. ${map.bottlenecks.length} gargalo(s). Próximos conceitos: ${map.nextBestConcepts.join(', ') || 'nenhum definido'}.`;
}
