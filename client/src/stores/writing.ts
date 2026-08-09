import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WritingSkill = 'tese' | 'argumentacao' | 'repertorio' | 'coesao' | 'intervencao' | 'clareza'

export interface WritingVersion { id: string; createdAt: string; text: string; wordCount: number }
export interface WritingDrillResult { id: string; projectId: string; skill: WritingSkill; createdAt: string; answer: string; completed: boolean; sourceVersionId?: string }
export interface WritingProject { id: string; theme: string; area: string; createdAt: string; updatedAt: string; versions: WritingVersion[]; focus: WritingSkill; status: 'draft' | 'review' | 'complete' }

interface WritingState {
  projects: WritingProject[]
  drillResults: WritingDrillResult[]
  activeProjectId: string | null
  createProject: (theme: string, area: string) => string
  saveVersion: (projectId: string, text: string) => void
  setFocus: (projectId: string, focus: WritingSkill) => void
  setStatus: (projectId: string, status: WritingProject['status']) => void
  setActiveProject: (id: string | null) => void
  completeDrill: (projectId: string, skill: WritingSkill, answer: string, sourceVersionId?: string) => void
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const words = (text: string) => text.trim() ? text.trim().split(/\s+/).length : 0

export const useWritingStore = create<WritingState>()(persist((set) => ({
  projects: [], drillResults: [], activeProjectId: null,
  createProject: (theme, area) => { const id = uid(); const now = new Date().toISOString(); set((state) => ({ projects: [{ id, theme, area, createdAt: now, updatedAt: now, versions: [], focus: 'argumentacao', status: 'draft' }, ...state.projects], activeProjectId: id })); return id },
  saveVersion: (projectId, text) => set((state) => ({ projects: state.projects.map((project) => project.id === projectId ? { ...project, updatedAt: new Date().toISOString(), versions: [...project.versions, { id: uid(), createdAt: new Date().toISOString(), text, wordCount: words(text) }] } : project) })),
  setFocus: (projectId, focus) => set((state) => ({ projects: state.projects.map((p) => p.id === projectId ? { ...p, focus, updatedAt: new Date().toISOString() } : p) })),
  setStatus: (projectId, status) => set((state) => ({ projects: state.projects.map((p) => p.id === projectId ? { ...p, status, updatedAt: new Date().toISOString() } : p) })),
  setActiveProject: (activeProjectId) => set({ activeProjectId }),
  completeDrill: (projectId, skill, answer, sourceVersionId) => set((state) => ({ drillResults: [{ id: uid(), projectId, skill, answer, sourceVersionId, completed: true, createdAt: new Date().toISOString() }, ...state.drillResults] })),
}), { name: 'mindsteps-writing-portfolio' }))
