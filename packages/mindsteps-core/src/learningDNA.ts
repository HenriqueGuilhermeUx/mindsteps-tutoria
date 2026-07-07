import type { CognitiveTwin, LearningMemory } from './types';
import type { LearningState } from './learningState';
import type { FlowInsight } from './flowEngine';
import type { TeachingStrategyMemory } from './teachingStrategyMemory';

export interface LearningDNAProfile {
  learnerId: string;
  visualThinking: number;
  verbalReasoning: number;
  experimentation: number;
  analogyAffinity: number;
  projectAffinity: number;
  gameAffinity: number;
  reflectionStrength: number;
  persistenceStrength: number;
  confidenceStability: number;
  curiosityDrive: number;
  summary: string;
  updatedAt: string;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function hasInterest(twin: CognitiveTwin, terms: string[]): boolean {
  const text = twin.interests.join(' ').toLowerCase();
  return terms.some((term) => text.includes(term));
}

function strategySuccessRate(memory?: TeachingStrategyMemory, keyword?: string): number {
  if (!memory || memory.records.length === 0) return 50;

  const records = keyword
    ? memory.records.filter((record) => record.strategy.toLowerCase().includes(keyword.toLowerCase()))
    : memory.records;

  if (records.length === 0) return 50;

  const attempts = records.reduce((sum, record) => sum + record.attempts, 0);
  const successes = records.reduce((sum, record) => sum + record.successes, 0);

  return attempts > 0 ? (successes / attempts) * 100 : 50;
}

export function generateLearningDNA(params: {
  learnerId: string;
  twin: CognitiveTwin;
  memory: LearningMemory;
  learningState: LearningState;
  flow?: FlowInsight;
  teachingStrategyMemory?: TeachingStrategyMemory;
}): LearningDNAProfile {
  const { twin, memory, learningState, flow, teachingStrategyMemory } = params;
  const analogyRate = strategySuccessRate(teachingStrategyMemory, 'analogy');
  const socraticRate = strategySuccessRate(teachingStrategyMemory, 'socratic');
  const interestCount = Math.min(10, twin.interests.length + memory.interestMemory.length);

  const visualThinking = clamp(
    45 +
      (hasInterest(twin, ['desenho', 'minecraft', 'lego', 'roblox', 'mapa', 'arte']) ? 20 : 0) +
      (analogyRate - 50) * 0.25
  );

  const verbalReasoning = clamp(
    45 +
      (hasInterest(twin, ['livro', 'história', 'historia', 'escrita', 'leitura']) ? 20 : 0) +
      (socraticRate - 50) * 0.25
  );

  const experimentation = clamp(
    45 +
      (hasInterest(twin, ['experimento', 'ciência', 'ciencia', 'robótica', 'robotica', 'cozinhar']) ? 25 : 0) +
      learningState.curiosity * 2
  );

  const analogyAffinity = clamp(analogyRate + (visualThinking - 50) * 0.2);
  const projectAffinity = clamp(
    45 +
      (hasInterest(twin, ['construir', 'projeto', 'criar', 'programar', 'robótica', 'robotica']) ? 25 : 0) +
      interestCount * 2
  );
  const gameAffinity = clamp(
    45 +
      (hasInterest(twin, ['jogo', 'games', 'minecraft', 'roblox', 'futebol']) ? 25 : 0) +
      (flow?.zone === 'productive_flow' ? 10 : 0)
  );

  const reflectionStrength = clamp(learningState.persistence * 6 + (memory.strategyMemory.length > 0 ? 15 : 0));
  const persistenceStrength = clamp(learningState.persistence * 10);
  const confidenceStability = clamp(100 - Math.abs(6 - learningState.confidence) * 12 - learningState.cognitiveLoad * 2);
  const curiosityDrive = clamp(learningState.curiosity * 10 + interestCount * 2);

  const strongest = [
    ['experimentação', experimentation],
    ['analogias', analogyAffinity],
    ['projetos', projectAffinity],
    ['jogos', gameAffinity],
    ['reflexão', reflectionStrength],
    ['curiosidade', curiosityDrive],
  ].sort((a, b) => Number(b[1]) - Number(a[1]))[0];

  return {
    learnerId: params.learnerId,
    visualThinking,
    verbalReasoning,
    experimentation,
    analogyAffinity,
    projectAffinity,
    gameAffinity,
    reflectionStrength,
    persistenceStrength,
    confidenceStability,
    curiosityDrive,
    summary: `Perfil inicial sugere maior força em ${strongest[0]} (${strongest[1]}%). Use isso como hipótese, não como rótulo fixo.`,
    updatedAt: new Date().toISOString(),
  };
}

export function summarizeLearningDNA(profile: LearningDNAProfile): string {
  return [
    `Visual ${profile.visualThinking}%`,
    `Verbal ${profile.verbalReasoning}%`,
    `Experimentação ${profile.experimentation}%`,
    `Analogias ${profile.analogyAffinity}%`,
    `Projetos ${profile.projectAffinity}%`,
    `Jogos ${profile.gameAffinity}%`,
    `Curiosidade ${profile.curiosityDrive}%`,
  ].join(' | ');
}
