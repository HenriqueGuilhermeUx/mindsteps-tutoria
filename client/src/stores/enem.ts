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

interface EnemState {
  attempts: EnemQuestionAttempt[]
  simulations: EnemSimulationResult[]
  dailyCompleted: string[]
  recordAttempt: (attempt: Omit<EnemQuestionAttempt, 'id' | 'createdAt'>) => void
  recordSimulation: (result: Omit<EnemSimulationResult, 'id' | 'completedAt'>) => void
  toggleDailyStep: (stepKey: string) => void
  resetPractice: () => void
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useEnemStore = create<EnemState>()(persist((set) => ({
  attempts: [],
  simulations: [],
  dailyCompleted: [],
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
