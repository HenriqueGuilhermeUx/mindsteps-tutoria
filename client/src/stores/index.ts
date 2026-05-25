import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
}

interface Profile {
  id: string
  name: string
  ageGroup: '6-10' | '11-14' | '15-17'
  grade: string
  xp: number
  level: number
  streak: number
  tutorId: string
  petType?: string
  petName?: string
  petXp: number
}

interface AuthState {
  user: User | null
  token: string | null
  profile: Profile | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  setProfile: (profile: Profile) => void
  addXP: (amount: number) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      profile: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true })
      },

      setProfile: (profile) => {
        set({ profile })
      },

      addXP: (amount) => {
        const { profile } = get()
        if (!profile) return

        const newXP = profile.xp + amount
        // Calculate new level (same formula as in utils)
        let newLevel = 1
        if (newXP >= 100) {
          newLevel = Math.floor((newXP - 100) / 200) + 2
        }

        set({
          profile: {
            ...profile,
            xp: newXP,
            level: newLevel,
          },
        })
      },

      logout: () => {
        set({ user: null, token: null, profile: null, isAuthenticated: false })
      },
    }),
    {
      name: 'mindsteps-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  sessionId: string | null
  subject: string
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  setLoading: (loading: boolean) => void
  setSessionId: (id: string | null) => void
  setSubject: (subject: string) => void
  clearChat: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  sessionId: null,
  subject: 'geral',

  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (loading) => set({ isLoading: loading }),
  setSessionId: (id) => set({ sessionId: id }),
  setSubject: (subject) => set({ subject }),
  clearChat: () => set({ messages: [], sessionId: null }),
}))

interface UsageState {
  messagesRemaining: number
  limit: number
  setUsage: (remaining: number, limit: number) => void
  decrementUsage: () => void
}

export const useUsageStore = create<UsageState>((set) => ({
  messagesRemaining: 5,
  limit: 5,

  setUsage: (remaining, limit) => set({ messagesRemaining: remaining, limit }),
  decrementUsage: () => set((state) => ({ messagesRemaining: Math.max(0, state.messagesRemaining - 1) })),
}))