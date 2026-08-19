import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type EnemArea = 'Linguagens' | 'Humanas' | 'Natureza' | 'Matemática' | 'Redação'

export interface EnemQuestionAttempt {
  id: string
  questionId: string
  area: EnemArea
  skill: string
  correct: boolean
  difficulty: number
  createdAt: string
}

export interface EnemSimulationAreaResult {
  area: Exclude<EnemArea, 'Redação'>
  answered: number
  correct: number
  skipped: number
  marked: number
  secondsSpent: number
}

export interface EnemSimulationResult {
  id: string
  elapsedSeconds: number
  markedQuestions: number
  completedAt: string
  answeredQuestions?: number
  correctQuestions?: number
  skippedQuestions?: number
  reviewChanges?: number
  areaResults?: EnemSimulationAreaResult[]
  strategyScore?: number
}

export interface EnemStudyProfile {
  goal: string
  targetCourse: string
  targetScore: number
  dailyMinutes: number
  studyDaysPerWeek: number
  preferredMode: 'curto' | 'equilibrado' | 'intensivo'
  confidence: Record<EnemArea, number>
  completedAt: string
}

export interface EnemDiagnosticResult {
  completedAt: string
  questionCount: number
  accuracy: number
  areaScores: Record<EnemArea, number>
  writingSample: string
  writingSignal: number
}

export interface EnemCloudSnapshot {
  profile: EnemStudyProfile | null
  diagnostic: EnemDiagnosticResult | null
  attempts: EnemQuestionAttempt[]
  simulations: EnemSimulationResult[]
  dailyCompleted: string[]
  updatedAt: string
}

interface EnemState extends EnemCloudSnapshot {
  saveProfile: (profile: Omit<EnemStudyProfile, 'completedAt'>) => void
  saveDiagnostic: (diagnostic: Omit<EnemDiagnosticResult, 'completedAt'>) => void
  recordAttempt: (attempt: Omit<EnemQuestionAttempt, 'id' | 'createdAt'>) => void
  recordSimulation: (result: Omit<EnemSimulationResult, 'id' | 'completedAt'>) => void
  toggleDailyStep: (stepKey: string) => void
  resetPractice: () => void
  hydrateFromCloud: (snapshot: EnemCloudSnapshot) => void
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()

export const useEnemStore = create<EnemState>()(persist((set) => ({
  profile: null,
  diagnostic: null,
  attempts: [],
  simulations: [],
  dailyCompleted: [],
  updatedAt: new Date(0).toISOString(),
  saveProfile: (profile) => set({ profile: { ...profile, completedAt: now() }, updatedAt: now() }),
  saveDiagnostic: (diagnostic) => set({ diagnostic: { ...diagnostic, completedAt: now() }, updatedAt: now() }),
  recordAttempt: (attempt) => set((state) => ({ attempts: [...state.attempts, { ...attempt, id: uid(), createdAt: now() }].slice(-500), updatedAt: now() })),
  recordSimulation: (result) => set((state) => ({ simulations: [{ ...result, id: uid(), completedAt: now() }, ...state.simulations].slice(0, 50), updatedAt: now() })),
  toggleDailyStep: (stepKey) => set((state) => ({ dailyCompleted: state.dailyCompleted.includes(stepKey) ? state.dailyCompleted.filter((key) => key !== stepKey) : [...state.dailyCompleted, stepKey], updatedAt: now() })),
  resetPractice: () => set({ attempts: [], updatedAt: now() }),
  hydrateFromCloud: (snapshot) => set({ profile: snapshot.profile, diagnostic: snapshot.diagnostic, attempts: snapshot.attempts || [], simulations: snapshot.simulations || [], dailyCompleted: snapshot.dailyCompleted || [], updatedAt: snapshot.updatedAt || now() }),
}), { name: 'mindsteps-enem-learning-state' }))
