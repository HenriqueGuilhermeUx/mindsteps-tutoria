import type { Subject } from './types';

export type LearningGraphRelation = 'prerequisite' | 'supports' | 'extends' | 'applies_to';

export interface LearningConceptNode {
  id: string;
  subject: Subject;
  title: string;
  description: string;
}

export interface LearningConceptEdge {
  from: string;
  to: string;
  relation: LearningGraphRelation;
  reason: string;
}

export interface LearningGraph {
  nodes: LearningConceptNode[];
  edges: LearningConceptEdge[];
}

export const BASIC_LEARNING_GRAPH: LearningGraph = {
  nodes: [
    {
      id: 'math:whole-part',
      subject: 'matematica',
      title: 'Parte e todo',
      description: 'Compreender que uma quantidade pode ser dividida em partes de um todo.',
    },
    {
      id: 'math:fractions',
      subject: 'matematica',
      title: 'Frações',
      description: 'Representar partes de um todo usando numerador e denominador.',
    },
    {
      id: 'math:ratio',
      subject: 'matematica',
      title: 'Razão',
      description: 'Comparar duas quantidades por divisão ou proporção.',
    },
    {
      id: 'math:percentage',
      subject: 'matematica',
      title: 'Porcentagem',
      description: 'Representar uma razão em relação a 100.',
    },
    {
      id: 'math:probability',
      subject: 'matematica',
      title: 'Probabilidade',
      description: 'Estimar chances e relações entre casos favoráveis e possíveis.',
    },
    {
      id: 'portuguese:main-idea',
      subject: 'portugues',
      title: 'Ideia principal',
      description: 'Identificar a informação central de um texto.',
    },
    {
      id: 'portuguese:evidence',
      subject: 'portugues',
      title: 'Pistas do texto',
      description: 'Usar trechos do texto como evidência para interpretação.',
    },
    {
      id: 'portuguese:inference',
      subject: 'portugues',
      title: 'Inferência',
      description: 'Concluir algo que não está escrito diretamente, usando pistas do texto.',
    },
  ],
  edges: [
    {
      from: 'math:whole-part',
      to: 'math:fractions',
      relation: 'prerequisite',
      reason: 'Frações dependem da noção de parte e todo.',
    },
    {
      from: 'math:fractions',
      to: 'math:ratio',
      relation: 'supports',
      reason: 'Frações ajudam a compreender comparação entre quantidades.',
    },
    {
      from: 'math:ratio',
      to: 'math:percentage',
      relation: 'prerequisite',
      reason: 'Porcentagem é uma razão expressa em base 100.',
    },
    {
      from: 'math:fractions',
      to: 'math:probability',
      relation: 'supports',
      reason: 'Probabilidade usa a relação entre partes favoráveis e total de possibilidades.',
    },
    {
      from: 'portuguese:main-idea',
      to: 'portuguese:evidence',
      relation: 'supports',
      reason: 'Compreender a ideia principal ajuda a selecionar pistas relevantes.',
    },
    {
      from: 'portuguese:evidence',
      to: 'portuguese:inference',
      relation: 'prerequisite',
      reason: 'Inferências precisam ser sustentadas por pistas do texto.',
    },
  ],
};

export function findConceptByTitle(graph: LearningGraph, title: string): LearningConceptNode | null {
  const normalized = title.toLowerCase().trim();
  return graph.nodes.find((node) => node.title.toLowerCase() === normalized) || null;
}

export function getPrerequisites(graph: LearningGraph, conceptId: string): LearningConceptNode[] {
  const prerequisiteIds = graph.edges
    .filter((edge) => edge.to === conceptId && edge.relation === 'prerequisite')
    .map((edge) => edge.from);

  return graph.nodes.filter((node) => prerequisiteIds.includes(node.id));
}

export function getImpactedConcepts(graph: LearningGraph, conceptId: string): LearningConceptNode[] {
  const impactedIds = graph.edges
    .filter((edge) => edge.from === conceptId)
    .map((edge) => edge.to);

  return graph.nodes.filter((node) => impactedIds.includes(node.id));
}

export function explainConceptDependencies(graph: LearningGraph, conceptId: string): string {
  const concept = graph.nodes.find((node) => node.id === conceptId);
  if (!concept) return 'Concept not found in learning graph.';

  const prerequisites = getPrerequisites(graph, conceptId);
  const impacted = getImpactedConcepts(graph, conceptId);

  const prereqText = prerequisites.length
    ? `Prerequisites: ${prerequisites.map((node) => node.title).join(', ')}.`
    : 'No known prerequisites in this graph.';

  const impactedText = impacted.length
    ? `Impacted concepts: ${impacted.map((node) => node.title).join(', ')}.`
    : 'No known impacted concepts in this graph.';

  return `${concept.title}: ${concept.description} ${prereqText} ${impactedText}`;
}
