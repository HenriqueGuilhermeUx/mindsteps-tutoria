import type { FlowInsight } from './flowEngine';
import type { LearningState } from './learningState';
import type { MisconceptionPattern } from './misconceptionEngine';
import type { LearningPrediction } from './predictionEngine';
import type { EvidenceBundle } from './evidenceEngine';

export type LearningDecisionType =
  | 'recover_confidence'
  | 'diagnose'
  | 'scaffold'
  | 'guided_practice'
  | 'challenge'
  | 'reflect';

export interface LearningDecision {
  type: LearningDecisionType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  objective: string;
  teachingMove: string;
  responseShape: string[];
  successCriteria: string[];
  avoid: string[];
  reason: string;
  confidenceScore: number;
}

function clamp(value: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function hasHighRisk(predictions: LearningPrediction[]): boolean {
  return predictions.some((prediction) => prediction.risk === 'high' || prediction.probability >= 75);
}

export function decideNextLearningMove(params: {
  learningState: LearningState;
  flow: FlowInsight;
  misconceptions: MisconceptionPattern[];
  predictions: LearningPrediction[];
  evidence: EvidenceBundle;
}): LearningDecision {
  const { learningState, flow, misconceptions, predictions, evidence } = params;
  const evidenceConfidence = clamp(evidence.confidenceScore);
  const fragileConcept = misconceptions[0]?.concept || misconceptions[0]?.label;
  const predictedRisk = predictions[0];

  if (learningState.label === 'frustrated' || flow.zone === 'too_hard') {
    return {
      type: 'recover_confidence',
      priority: 'critical',
      title: 'Recuperar segurança antes de avançar',
      objective: 'Reduzir carga cognitiva e criar uma pequena vitória verificável.',
      teachingMove: 'Acolha o esforço, divida o problema em uma única etapa e ofereça uma pista concreta.',
      responseShape: ['Validação breve', 'Uma pista concreta', 'Uma pergunta simples', 'Reforço do progresso'],
      successCriteria: ['O aluno tenta novamente', 'A carga percebida diminui', 'Uma etapa é explicada com as próprias palavras'],
      avoid: ['Novo conteúdo', 'Múltiplas perguntas', 'Resposta completa', 'Tom avaliativo'],
      reason: `${learningState.explanation} ${flow.explanation}`,
      confidenceScore: evidenceConfidence,
    };
  }

  if (evidenceConfidence <= 4 || flow.zone === 'unknown') {
    return {
      type: 'diagnose',
      priority: 'high',
      title: 'Coletar uma evidência curta antes de decidir',
      objective: 'Descobrir o raciocínio atual sem presumir domínio ou dificuldade.',
      teachingMove: 'Faça uma pergunta diagnóstica curta que revele como o aluno está pensando.',
      responseShape: ['Pergunta diagnóstica', 'Pedido de exemplo ou explicação', 'Sem correção antecipada'],
      successCriteria: ['O raciocínio fica observável', 'Surge evidência para confirmar ou revisar a hipótese'],
      avoid: ['Rotular o aluno', 'Inferir intenção', 'Aumentar dificuldade'],
      reason: `A confiança das evidências é ${evidenceConfidence}/10 e a zona de fluxo ainda não está suficientemente clara.`,
      confidenceScore: evidenceConfidence,
    };
  }

  if (misconceptions.length > 0 || hasHighRisk(predictions)) {
    return {
      type: 'scaffold',
      priority: 'high',
      title: fragileConcept ? `Reconstruir ${fragileConcept}` : 'Reconstruir o pré-requisito frágil',
      objective: 'Corrigir a estrutura conceitual sem entregar a solução pronta.',
      teachingMove: predictedRisk?.recommendedPrevention || misconceptions[0]?.recommendedIntervention || 'Use um exemplo concreto e reconstrua o pré-requisito passo a passo.',
      responseShape: ['Exemplo concreto', 'Contraste entre ideias', 'Pergunta de verificação', 'Aplicação curta'],
      successCriteria: ['O aluno distingue os conceitos', 'Explica o pré-requisito', 'Aplica em um caso simples'],
      avoid: ['Avançar na trilha', 'Repetir a mesma explicação', 'Memorização sem compreensão'],
      reason: predictedRisk?.reason || misconceptions[0]?.description || 'Há evidência de fragilidade conceitual.',
      confidenceScore: evidenceConfidence,
    };
  }

  if (learningState.label === 'ready_for_challenge' || flow.zone === 'too_easy') {
    return {
      type: 'challenge',
      priority: 'medium',
      title: 'Aumentar desafio com transferência',
      objective: 'Testar domínio em uma situação nova, não apenas repetição.',
      teachingMove: 'Peça aplicação em outro contexto, comparação de estratégias ou explicação para outra pessoa.',
      responseShape: ['Desafio novo', 'Justificativa do raciocínio', 'Reflexão sobre estratégia'],
      successCriteria: ['Transfere o conceito', 'Justifica escolhas', 'Reconhece limites da própria resposta'],
      avoid: ['Mais do mesmo', 'Aumentar dificuldade sem propósito', 'Confundir velocidade com domínio'],
      reason: `${learningState.explanation} ${flow.explanation}`,
      confidenceScore: evidenceConfidence,
    };
  }

  if (learningState.persistence >= 7 && learningState.confidence >= 5) {
    return {
      type: 'reflect',
      priority: 'medium',
      title: 'Consolidar por explicação e reflexão',
      objective: 'Transformar desempenho momentâneo em aprendizagem consciente.',
      teachingMove: 'Peça ao aluno para explicar o que mudou no próprio raciocínio e qual estratégia funcionou.',
      responseShape: ['Pergunta metacognitiva', 'Síntese do aluno', 'Próximo passo pequeno'],
      successCriteria: ['Nomeia a estratégia usada', 'Explica o conceito com clareza', 'Define o próximo passo'],
      avoid: ['Elogio genérico', 'Encerrar sem síntese', 'Introduzir conteúdo novo'],
      reason: 'Persistência e confiança estão suficientes para consolidar a aprendizagem por reflexão.',
      confidenceScore: evidenceConfidence,
    };
  }

  return {
    type: 'guided_practice',
    priority: 'medium',
    title: 'Manter prática guiada na zona produtiva',
    objective: 'Fortalecer compreensão com passos curtos e feedback imediato.',
    teachingMove: 'Faça uma pergunta socrática por vez e ajuste a ajuda conforme a resposta.',
    responseShape: ['Pergunta curta', 'Espera pelo raciocínio', 'Feedback específico', 'Nova tentativa'],
    successCriteria: ['Resolve uma etapa', 'Explica a escolha', 'Mantém-se na zona produtiva'],
    avoid: ['Sequência longa de instruções', 'Resposta direta', 'Mudar de estratégia sem evidência'],
    reason: `${learningState.explanation} ${flow.explanation}`,
    confidenceScore: evidenceConfidence,
  };
}

export function summarizeLearningDecision(decision: LearningDecision): string {
  return `${decision.type}/${decision.priority}: ${decision.title}. ${decision.teachingMove}`;
}
