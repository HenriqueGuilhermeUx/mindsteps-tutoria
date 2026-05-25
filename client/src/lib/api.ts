import { useAuthStore } from '@/stores'

const API_BASE = import.meta.env.VITE_API_URL || 'https://mindsteps-backend.onrender.com'

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
    request<{ token: string; user: { id: string; email: string }; profile: unknown }>('/api/auth/register', {
      method: 'POST',
      body: data,
    }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: { id: string; email: string }; profile: unknown }>('/api/auth/login', {
      method: 'POST',
      body: data,
    }),
}

// Study
export const studyApi = {
  startSession: (tutorId: string) =>
    request<{ sessionId: string }>('/api/study/startSession', {
      method: 'POST',
      body: { tutorId },
    }),

  sendMessage: (sessionId: string, content: string, subject?: string) =>
    request<{ response: string; xpEarned: number; cognitiveLevel: number }>('/api/study/sendMessage', {
      method: 'POST',
      body: { sessionId, content, subject },
    }),

  getHistory: (sessionId: string) =>
    request<{ messages: Array<{ role: string; content: string; createdAt: string }> }>(`/api/study/history?sessionId=${sessionId}`),

  endSession: (sessionId: string) =>
    request<{ success: boolean }>('/api/study/endSession', {
      method: 'POST',
      body: { sessionId },
    }),
}

// Profile
export const profileApi = {
  get: () => request<unknown>('/api/profile'),

  update: (data: { name?: string; tutorId?: string; petType?: string; petName?: string }) =>
    request<unknown>('/api/profile/update', {
      method: 'POST',
      body: data,
    }),

  claimDaily: () =>
    request<{ streak: number; bonus: number }>('/api/profile/claimDaily', { method: 'POST' }),
}

// Usage
export const usageApi = {
  check: () => request<{ remaining: number; limit: number }>('/api/usage/check'),
}