import { useAuthStore } from '@/stores'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token } = useAuthStore.getState()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// Auth
export const authApi = {
  register: (data: { email: string; password: string; name: string; age: string; grade: string }) =>
    request<{ token: string; user: { id: number; email: string }; profile: unknown }>('/auth/register', {
      method: 'POST',
      body: data,
    }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: { id: number; email: string }; profile: unknown }>('/auth/login', {
      method: 'POST',
      body: data,
    }),
}

// Study
export const studyApi = {
  startSession: (tutorId: string) =>
    request<{ sessionId: number }>('/study/startSession', {
      method: 'POST',
      body: { tutorId },
    }),

  sendMessage: (sessionId: number, content: string) =>
    request<{ response: string; xpEarned: number; cognitiveLevel: number }>('/study/sendMessage', {
      method: 'POST',
      body: { sessionId, content },
    }),

  getHistory: (sessionId: number) =>
    request<{ messages: Array<{ role: string; content: string; createdAt: string }> }>(`/study/history/${sessionId}`),

  endSession: (sessionId: number) =>
    request<{ stats: unknown }>('/study/endSession', {
      method: 'POST',
      body: { sessionId },
    }),
}

// Profile
export const profileApi = {
  get: () => request<unknown>('/profile/get'),

  update: (data: { name?: string; tutorId?: string }) =>
    request<unknown>('/profile/update', {
      method: 'POST',
      body: data,
    }),

  claimDaily: () =>
    request<{ streak: number; bonus: number }>('/profile/claimDaily', { method: 'POST' }),
}

// Usage
export const usageApi = {
  check: () => request<{ remaining: number; limit: number }>('/usage/check'),
}

// Quiz
export const quizApi = {
  generate: (topic: string) =>
    request<{ questions: Array<{ id: string; question: string; options: string[]; correctIndex: number }> }>('/quiz/generate', {
      method: 'POST',
      body: { topic },
    }),

  submit: (answers: Array<{ questionId: string; answer: number }>) =>
    request<{ score: number; xpEarned: number }>('/quiz/submit', {
      method: 'POST',
      body: { answers },
    }),
}

// Pets
export const petApi = {
  create: (petType: string, petName: string) =>
    request<unknown>('/pet/create', {
      method: 'POST',
      body: { petType, petName },
    }),

  get: () => request<unknown>('/pet/get'),
}