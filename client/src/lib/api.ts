import { useAuthStore } from '@/stores'

const API_BASE = import.meta.env.VITE_API_URL || 'https://mindsteps-backend.onrender.com'
const REQUEST_TIMEOUT_MS = 20000

interface RequestOptions { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown }

export interface LearningCoreMetadata { enabled?: boolean; contextPreview?: string[]; learningState?: string; flowZone?: string; learningDNA?: string; teacherInsights?: string[]; familyMessages?: string[]; interventions?: string[] }
export interface StudentLearningProfileInput { primaryGoal: string; subjects: string[]; learningFormats: string[]; helpPreferences: string[]; challenges: string[]; interests: string[]; dailyMinutes: number; preferredDays: number[]; tutorPersona: string; currentIntention?: string; onboardingCompleted?: boolean }
export interface TodayOverview { learningProfile: { primary_goal?: string; subjects?: string[]; daily_minutes?: number; tutor_persona?: string } | null; mission: { id: string; title: string; description?: string; subject?: string; estimated_minutes?: number; mission_type?: string; status?: string } | null; stats: { missionsCompleted: number; activePlans: number; pendingMissions: number }; organizations: Array<{ role: string; status: string; organizations: { id: string; name: string; type: string } | null }> }

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token } = useAuthStore.getState()
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({} as { message?: string }))
      if (response.status === 401) throw new Error('E-mail ou senha incorretos.')
      if (response.status === 403) throw new Error('Acesso recusado. Verifique a conta e tente novamente.')
      if (response.status >= 500) throw new Error('O serviço está temporariamente indisponível. Tente novamente em instantes.')
      throw new Error(payload.message || `Não foi possível concluir a solicitação (HTTP ${response.status}).`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('O servidor demorou para responder. Verifique sua conexão e tente novamente.')
    }
    if (error instanceof TypeError) {
      throw new Error('Não foi possível conectar ao MindSteps. Verifique sua internet e tente novamente.')
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

export const authApi = {
  register: (data: { email: string; password: string; name: string; age: string; grade: string }) => request<{ token: string; user: { id: string; email: string }; profile: unknown }>('/api/auth/register', { method: 'POST', body: data }),
  login: (data: { email: string; password: string }) => request<{ token: string; user: { id: string; email: string }; profile: unknown }>('/api/auth/login', { method: 'POST', body: data }),
}
export const studyApi = {
  startSession: (tutorId: string) => request<{ sessionId: string }>('/api/study/startSession', { method: 'POST', body: { tutorId } }),
  sendMessage: (sessionId: string, content: string, subject?: string) => request<{ response: string; xpEarned: number; cognitiveLevel: number; learningCore?: LearningCoreMetadata }>('/api/study/sendMessage', { method: 'POST', body: { sessionId, content, subject } }),
  getHint: (sessionId: string) => request<{ hint: string }>('/api/study/hint', { method: 'POST', body: { sessionId } }),
  getHistory: (sessionId: string) => request<{ messages: Array<{ role: string; content: string; createdAt: string }> }>(`/api/study/history?sessionId=${sessionId}`),
  endSession: (sessionId: string) => request<{ success: boolean }>('/api/study/endSession', { method: 'POST', body: { sessionId } }),
}
export const profileApi = { get: () => request<unknown>('/api/profile'), update: (data: { name?: string; tutorId?: string; petType?: string; petName?: string }) => request<unknown>('/api/profile/update', { method: 'POST', body: data }), claimDaily: () => request<{ streak: number; bonus: number }>('/api/profile/claimDaily', { method: 'POST' }) }
export const operationsApi = { today: () => request<TodayOverview>('/api/operations/me/today'), getLearningProfile: () => request<{ profile: unknown | null }>('/api/operations/me/learning-profile'), saveLearningProfile: (data: StudentLearningProfileInput) => request<{ learningProfile: unknown; firstMission: { id: string; title?: string } | null }>('/api/operations/me/learning-profile', { method: 'PUT', body: data }), saveRole: (role: string, onboardingCompleted = false) => request<unknown>('/api/operations/me/role', { method: 'PUT', body: { role, onboardingCompleted } }), trackOnboarding: (eventName: string, metadata: Record<string, unknown> = {}) => request<unknown>('/api/operations/onboarding/events', { method: 'POST', body: { audience: 'independente', eventName, metadata } }) }
export const usageApi = { check: () => request<{ remaining: number; limit: number }>('/api/usage/check') }

export interface WritingSyncPayload {
  clientId: string
  theme: string
  area: string
  focus: string
  status: string
  versions: Array<{ clientId: string; createdAt: string; text: string; wordCount: number }>
  drills: Array<{ clientId: string; skill: string; answer: string; sourceVersionClientId?: string; createdAt: string }>
}

export interface WritingRemoteProject { id: string; clientId: string; updatedAt: string }

export const writingApi = {
  list: () => request<{ projects: WritingRemoteProject[] }>('/api/writing/projects'),
  syncProject: (payload: WritingSyncPayload) => request<{ project: WritingRemoteProject; syncedAt: string }>('/api/writing/projects/sync', { method: 'POST', body: payload }),
  removeProject: (clientId: string) => request<{ success: boolean }>(`/api/writing/projects/${encodeURIComponent(clientId)}`, { method: 'DELETE' }),
  effects: () => request<{ effects: Array<{ skill: string; beforeScore: number; afterScore: number; delta: number; createdAt: string }> }>('/api/writing/effects'),
}
