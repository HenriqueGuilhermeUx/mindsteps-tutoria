import type { LearningEvent, Subject } from './types';

export type MisconceptionSeverity = 'low' | 'medium' | 'high';

export interface MisconceptionPattern {
  id: string;
  subject: Subject;
  concept?: string;
  label: string;
  description: string;
  evidence: string[];
  severity: MisconceptionSeverity;
  recommendedIntervention: string;
}

const SUBJECT_PATTERNS: Array<{
  subject: Subject;
  keywords: string[];
  label: string;
  description: string;
  recommendedIntervention: string;
}> = [
  {
    subject: 'matematica',
    keywords: ['fração', 'fracao', 'denominador', 'numerador'],
    label: 'Possível fragilidade em frações',
    description: 'O aluno pode estar confundindo parte, todo, numerador ou denominador.',
    recommendedIntervention: 'Use representação visual de parte/todo antes de procedimentos formais.',
  },
  {
    subject: 'matematica',
    keywords: ['porcentagem', '%', 'percentual'],
    label: 'Possível fragilidade em porcentagem',
    description: 'O aluno pode não estar conectando porcentagem com fração, razão ou parte de 100.',
    recommendedIntervention: 'Conecte porcentagem com exemplos concretos de 100 partes antes de calcular.',
  },
  {
    subject: 'portugues',
    keywords: ['interpretação', 'interpretacao', 'texto', 'não entendi o texto', 'nao entendi o texto'],
    label: 'Possível fragilidade em interpretação textual',
    description: 'O aluno pode estar lendo palavras isoladas sem reconstruir sentido global.',
    recommendedIntervention: 'Peça para o aluno localizar pistas no texto e explicar com suas próprias palavras.',
  },
  {
    subject: 'ciencias',
    keywords: ['experimento', 'hipótese', 'hipotese', 'por que acontece'],
    label: 'Possível confusão entre observação e explicação',
    description: 'O aluno pode misturar o que observou com a causa do fenômeno.',
    recommendedIntervention: 'Separe observação, hipótese e explicação em três passos curtos.',
  },
];

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function inferSeverity(evidenceCount: number): MisconceptionSeverity {
  if (evidenceCount >= 3) return 'high';
  if (evidenceCount === 2) return 'medium';
  return 'low';
}

export function detectMisconceptionPatterns(params: {
  subject: Subject;
  message: string;
  events?: LearningEvent[];
}): MisconceptionPattern[] {
  const normalizedMessage = normalize(params.message);
  const evidenceFromEvents = (params.events || [])
    .filter((event) => event.type === 'MisconceptionDetected' || event.type === 'FrustrationDetected')
    .map((event) => event.evidence)
    .filter(Boolean) as string[];

  return SUBJECT_PATTERNS
    .filter((pattern) => pattern.subject === params.subject || params.subject === 'geral')
    .map((pattern) => {
      const messageMatches = pattern.keywords.some((keyword) => normalizedMessage.includes(keyword));
      const eventMatches = evidenceFromEvents.filter((evidence) =>
        pattern.keywords.some((keyword) => normalize(evidence).includes(keyword))
      );
      const evidence = [messageMatches ? params.message : undefined, ...eventMatches].filter(Boolean) as string[];

      if (evidence.length === 0) return null;

      return {
        id: `${pattern.subject}:${pattern.label.toLowerCase().replace(/\s+/g, '-')}`,
        subject: pattern.subject,
        label: pattern.label,
        description: pattern.description,
        evidence,
        severity: inferSeverity(evidence.length),
        recommendedIntervention: pattern.recommendedIntervention,
      } satisfies MisconceptionPattern;
    })
    .filter(Boolean) as MisconceptionPattern[];
}

export function summarizeMisconceptions(patterns: MisconceptionPattern[]): string {
  if (patterns.length === 0) return 'No misconception pattern detected yet.';

  return patterns
    .map((pattern) => `${pattern.label} (${pattern.severity}): ${pattern.recommendedIntervention}`)
    .join(' | ');
}
