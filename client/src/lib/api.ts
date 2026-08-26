import { useAuthStore } from '@/stores'
import type { EnemCloudSnapshot } from '@/stores/enem'

const API_BASE = import.meta.env.VITE_API_URL || 'https://mindsteps-backend.onrender.com'
const REQUEST_TIMEOUT_MS = 20000

interface RequestOptions { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown }

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
    const response = await fetch(`${API_BASE}${endpoint}`, { method: options.method || 'GET', headers, body: options.body ? JSON.stringify(options.body) : undefined, signal: controller.signal })
    if (!response.ok) {
      const payload = await response.json().catch(() => ({} as { message?: string }))
      if (response.status === 401) throw new Error(endpoint === '/api/auth/login' ? 'E-mail ou senha incorretos.' : 'Sessão expirada. Entre novamente para continuar.')
      if (response.status === 403) throw new Error(payload.message || 'Acesso recusado. Verifique sua permissão e tente novamente.')
      if (response.status >= 500) throw new Error('O serviço está temporariamente indisponível. Tente novamente em instantes.')
      throw new Error(payload.message || `Não foi possível concluir a solicitação (HTTP ${response.status}).`)
    }
    return response.json()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw new Error('O servidor demorou para responder. Verifique sua conexão e tente novamente.')
    if (error instanceof TypeError) throw new Error('Não foi possível conectar ao MindSteps. Verifique sua internet e tente novamente.')
    throw error
  } finally { window.clearTimeout(timeout) }
}

export const authApi = {
  register: (data: { email: string; password: string; name: string; age: string; grade: string }) => request<{ token: string; user: { id: string; email: string }; profile: unknown }>('/api/auth/register', { method: 'POST', body: data }),
  login: (data: { email: string; password: string }) => request<{ token: string; user: { id: string; email: string }; profile: unknown }>('/api/auth/login', { method: 'POST', body: data }),
}
export const studyApi = {
  startSession: (tutorId: string) => request<{ sessionId: string }>('/api/study/startSession', { method: 'POST', body: { tutorId } }),
  sendMessage: (sessionId: string, content: string, subject?: string) => request<{ response: string; xpEarned: number; cognitiveLevel: number; learningCore?: LearningCoreMetadata; responsibleAI?: ResponsibleAIMetadata; learningOS?: LearningOSMetadata }>('/api/study/sendMessage', { method: 'POST', body: { sessionId, content, subject } }),
  getHint: (sessionId: string) => request<{ hint: string }>('/api/study/hint', { method: 'POST', body: { sessionId } }),
  getHistory: (sessionId: string) => request<{ messages: Array<{ role: string; content: string; createdAt: string }> }>(`/api/study/history?sessionId=${sessionId}`),
  endSession: (sessionId: string) => request<{ success: boolean }>('/api/study/endSession', { method: 'POST', body: { sessionId } }),
}
export const profileApi = { get: () => request<unknown>('/api/profile'), update: (data: { name?: string; tutorId?: string; petType?: string; petName?: string }) => request<unknown>('/api/profile/update', { method: 'POST', body: data }), claimDaily: () => request<{ streak: number; bonus: number }>('/api/profile/claimDaily', { method: 'POST' }) }
export const operationsApi = { today: () => request<TodayOverview>('/api/operations/me/today'), getLearningProfile: () => request<{ profile: unknown | null }>('/api/operations/me/learning-profile'), saveLearningProfile: (data: StudentLearningProfileInput) => request<{ learningProfile: unknown; firstMission: { id: string; title?: string } | null }>('/api/operations/me/learning-profile', { method: 'PUT', body: data }), saveRole: (role: string, onboardingCompleted = false) => request<unknown>('/api/operations/me/role', { method: 'PUT', body: { role, onboardingCompleted } }), trackOnboarding: (eventName: string, metadata: Record<string, unknown> = {}) => request<unknown>('/api/operations/onboarding/events', { method: 'POST', body: { audience: 'independente', eventName, metadata } }) }
export const usageApi = { check: () => request<{ remaining: number; limit: number }>('/api/usage/check') }

export interface InstitutionLink { id:string; role:string; status:string; joinedAt:string; institution:{ id:string; name:string; type:string; city?:string|null; state?:string|null } }
export const institutionApi = {
  list: () => request<{ links: InstitutionLink[] }>('/api/institutions/me/links'),
  join: (code: string) => request<{ link: InstitutionLink }>('/api/institutions/me/links/join', { method: 'POST', body: { code } }),
  leave: (linkId: string) => request<{ success: boolean }>(`/api/institutions/me/links/${encodeURIComponent(linkId)}`, { method: 'DELETE' }),
}

export interface ManagedInstitution { id:string; name:string; type:string; city?:string|null; state?:string|null; parent_institution_id?:string|null; role:string }
export interface InstitutionStudent { id:string; userId:string; name?:string; grade?:string; xp?:number; level?:number; streak?:number; last_study_date?:string|null; joinedAt:string }
export interface InstitutionInvite { code:string; label?:string|null; active:boolean; expires_at?:string|null; max_uses?:number|null; uses_count:number; created_at:string }
export interface InstitutionOverview { institution:ManagedInstitution; metrics:{ students:number; activeToday:number; avgXp:number; avgStreak:number; activeInvites:number }; students:InstitutionStudent[]; gradeCounts:Record<string,number>; invites:InstitutionInvite[] }
export const institutionAdminApi = {
  list: () => request<{ institutions: ManagedInstitution[] }>('/api/institutions/manage'),
  create: (data:{ name:string; type?:string; city?:string; state?:string; parentInstitutionId?:string|null }) => request<{ institution:ManagedInstitution }>('/api/institutions/manage', { method:'POST', body:data }),
  overview: (institutionId:string) => request<InstitutionOverview>(`/api/institutions/manage/${encodeURIComponent(institutionId)}/overview`),
  students: (institutionId:string) => request<{ students:InstitutionStudent[] }>(`/api/institutions/manage/${encodeURIComponent(institutionId)}/students`),
  invites: (institutionId:string) => request<{ invites:InstitutionInvite[] }>(`/api/institutions/manage/${encodeURIComponent(institutionId)}/invites`),
  createInvite: (institutionId:string, data:{ label?:string; expiresAt?:string|null; maxUses?:number|null }) => request<{ invite:InstitutionInvite }>(`/api/institutions/manage/${encodeURIComponent(institutionId)}/invites`, { method:'POST', body:data }),
}

export const enemCloudApi = {
  get: () => request<{ state: EnemCloudSnapshot | null }>('/api/enem/state'),
  save: (state: EnemCloudSnapshot) => request<{ updatedAt: string }>('/api/enem/state', { method: 'PUT', body: state }),
}

export interface WritingSyncPayload { clientId: string; theme: string; area: string; focus: string; status: string; versions: Array<{ clientId: string; createdAt: string; text: string; wordCount: number }>; drills: Array<{ clientId: string; skill: string; answer: string; sourceVersionClientId?: string; createdAt: string }> }
export interface WritingRemoteProject { id: string; clientId: string; updatedAt: string }
export const writingApi = {
  list: () => request<{ projects: WritingRemoteProject[] }>('/api/writing/projects'),
  syncProject: (payload: WritingSyncPayload) => request<{ project: WritingRemoteProject; syncedAt: string }>('/api/writing/projects/sync', { method: 'POST', body: payload }),
  removeProject: (clientId: string) => request<{ success: boolean }>(`/api/writing/projects/${encodeURIComponent(clientId)}`, { method: 'DELETE' }),
  effects: () => request<{ effects: Array<{ skill: string; beforeScore: number; afterScore: number; delta: number; createdAt: string }> }>('/api/writing/effects'),
}

export interface ResponsibleAIMetadata { enabled:boolean; stage:string; assistanceMode:string; confidence:string; explanation:string; humanReviewAvailable:boolean }
export interface LearningOSMetadata { intervention:string; confidence:number; confidenceBand:string; explanation:string; safeguards:Record<string,unknown>; nextAction:{type:string;label:string;payload?:Record<string,unknown>} }
export interface AILiteracyLearning { id:number; title:string; domain:string; description?:string }
export interface AILiteracyMission { id:string; title:string; goal?:string; steps?:string[]; reflection?:string; learningIds?:number[]; minutes?:number }
export const responsibleAIApi = {
  policy: (message='') => request<{ policy:unknown; intent:string; confidence:string; explanation:string }>(`/api/responsible-ai/policy?message=${encodeURIComponent(message)}`),
  registry: () => request<{ systems:Array<{key:string;name:string;purpose:string;riskLevel:string;humanOversight:boolean;data:string[];safeguards:string[]}> }>('/api/responsible-ai/registry'),
  literacy: () => request<{ learnings:AILiteracyLearning[]; stage?:string; progress:Array<{learning_id:number;status:string;updated_at?:string}> }>('/api/responsible-ai/literacy'),
  mission: (learningId?:number) => request<{ mission:AILiteracyMission }>(`/api/responsible-ai/literacy/mission${learningId?`?learningId=${learningId}`:''}`),
  saveProgress: (data:{learningId:number;missionId:string;status:'started'|'completed';evidence?:string;reflection?:string}) => request<unknown>('/api/responsible-ai/literacy/progress',{method:'POST',body:data}),
  override: (data:{systemKey:string;recommendationId?:string;decision:'accepted'|'adjusted'|'rejected';reason?:string}) => request<unknown>('/api/responsible-ai/overrides',{method:'POST',body:data}),
}

export interface LearningDecision { id:string; system_key:string; decision_type:string; subject?:string|null; skill?:string|null; confidence:number; explanation:string; human_review_required:boolean; created_at:string; evidence?:Record<string,unknown> }
export const learningGovernanceApi = {
  decisions: (limit=30) => request<{decisions:LearningDecision[]}>(`/api/learning-governance/decisions?limit=${limit}`),
  childRights: () => request<{preferences:Record<string,unknown>}>('/api/learning-governance/child-rights'),
  competencies: () => request<{domains:Array<{key?:string;title?:string;name?:string;description?:string}>}>('/api/learning-governance/teacher/competencies'),
  teacherSignals: (institutionId?:string) => request<{events:Array<Record<string,unknown>>}>(`/api/learning-governance/teacher/signals${institutionId?`?institutionId=${encodeURIComponent(institutionId)}`:''}`),
}

export const learningOSApi = {
  plan: (data:Record<string,unknown>) => request<{plan:LearningOSMetadata}>('/api/learning-os/plan',{method:'POST',body:data}),
  runs: (limit=30) => request<{runs:Array<Record<string,unknown>>}>(`/api/learning-os/runs?limit=${limit}`),
  outcomeSummary: () => request<Record<string,unknown>>('/api/learning-os/outcomes/summary'),
  institutionPolicy: (institutionId:string) => request<{policy:Record<string,unknown>|null}>(`/api/learning-os/institutions/${encodeURIComponent(institutionId)}/policy`),
  saveInstitutionPolicy: (institutionId:string,data:Record<string,unknown>) => request<{policy:Record<string,unknown>}>(`/api/learning-os/institutions/${encodeURIComponent(institutionId)}/policy`,{method:'PUT',body:data}),
}
