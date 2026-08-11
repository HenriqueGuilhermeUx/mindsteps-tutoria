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

export interface EnemSimulationResult {
  id: string
  elapsedSeconds: number
  markedQuestions: number
  completedAt: string
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

interface EnemState {
  profile: EnemStudyProfile | null
  diagnostic: EnemDiagnosticResult | null
  attempts: EnemQuestionAttempt[]
  simulations: EnemSimulationResult[]
  dailyCompleted: string[]
  saveProfile: (profile: Omit<EnemStudyProfile, 'completedAt'>) => void
  saveDiagnostic: (diagnostic: Omit<EnemDiagnosticResult, 'completedAt'>) => void
  recordAttempt: (attempt: Omit<EnemQuestionAttempt, 'id' | 'createdAt'>) => void
  recordSimulation: (result: Omit<EnemSimulationResult, 'id' | 'completedAt'>) => void
  toggleDailyStep: (stepKey: string) => void
  resetPractice: () => void
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useEnemStore = create<EnemState>()(persist((set) => ({
  profile: null,
  diagnostic: null,
  attempts: [],
  simulations: [],
  dailyCompleted: [],
  saveProfile: (profile) => set({ profile: { ...profile, completedAt: new Date().toISOString() } }),
  saveDiagnostic: (diagnostic) => set({ diagnostic: { ...diagnostic, completedAt: new Date().toISOString() } }),
  recordAttempt: (attempt) => set((state) => ({
    attempts: [...state.attempts, { ...attempt, id: uid(), createdAt: new Date().toISOString() }].slice(-500),
  })),
  recordSimulation: (result) => set((state) => ({
    simulations: [{ ...result, id: uid(), completedAt: new Date().toISOString() }, ...state.simulations].slice(0, 50),
  })),
  toggleDailyStep: (stepKey) => set((state) => ({
    dailyCompleted: state.dailyCompleted.includes(stepKey)
      ? state.dailyCompleted.filter((key) => key !== stepKey)
      : [...state.dailyCompleted, stepKey],
  })),
  resetPractice: () => set({ attempts: [] }),
}), { name: 'mindsteps-enem-learning-state' }))
