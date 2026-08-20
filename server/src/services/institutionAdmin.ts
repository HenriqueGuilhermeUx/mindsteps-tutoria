import crypto from 'node:crypto'
import { supabase } from '../db/index.js'

export type InstitutionRole = 'owner' | 'admin' | 'coordinator' | 'teacher'

async function getMembership(userId: string, institutionId: string) {
  const { data, error } = await supabase
    .from('mindsteps_institution_members')
    .select('id,role,status')
    .eq('user_id', userId)
    .eq('institution_id', institutionId)
    .eq('status', 'active')
    .single()
  if (error || !data) throw new Error('Você não tem acesso a esta instituição')
  return data as { id: string; role: InstitutionRole; status: string }
}

async function requireRole(userId: string, institutionId: string, allowed: InstitutionRole[]) {
  const membership = await getMembership(userId, institutionId)
  if (!allowed.includes(membership.role)) throw new Error('Seu perfil não tem permissão para esta ação')
  return membership
}

export async function listManagedInstitutions(userId: string) {
  const { data, error } = await supabase
    .from('mindsteps_institution_members')
    .select('role,status,created_at,mindsteps_institutions(id,name,type,city,state,parent_institution_id,created_at)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data || []).map((row: any) => ({ ...row.mindsteps_institutions, role: row.role }))
}

export async function createManagedInstitution(userId: string, input: { name: string; type?: string; city?: string; state?: string; parentInstitutionId?: string | null }) {
  const name = input.name.trim()
  if (name.length < 2) throw new Error('Informe o nome da instituição')
  if (input.parentInstitutionId) await requireRole(userId, input.parentInstitutionId, ['owner','admin','coordinator'])
  const type = input.type || 'school'
  const { data: institution, error } = await supabase
    .from('mindsteps_institutions')
    .insert({ name, type, city: input.city?.trim() || null, state: input.state?.trim().toUpperCase() || null, parent_institution_id: input.parentInstitutionId || null })
    .select('*')
    .single()
  if (error || !institution) throw new Error(error?.message || 'Não foi possível criar a instituição')
  const { error: memberError } = await supabase
    .from('mindsteps_institution_members')
    .insert({ user_id: userId, institution_id: institution.id, role: 'owner', status: 'active' })
  if (memberError) throw new Error(memberError.message)
  return { ...institution, role: 'owner' as const }
}

export async function createStudentInvite(userId: string, institutionId: string, input: { label?: string; expiresAt?: string | null; maxUses?: number | null }) {
  await requireRole(userId, institutionId, ['owner','admin','coordinator','teacher'])
  const code = `MS${crypto.randomBytes(4).toString('hex').toUpperCase()}`
  const { data, error } = await supabase
    .from('mindsteps_institution_invites')
    .insert({ code, institution_id: institutionId, label: input.label?.trim() || 'Convite de estudantes', active: true, expires_at: input.expiresAt || null, max_uses: input.maxUses || null, created_by: userId })
    .select('code,label,active,expires_at,max_uses,uses_count,created_at')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function listInstitutionInvites(userId: string, institutionId: string) {
  await getMembership(userId, institutionId)
  const { data, error } = await supabase
    .from('mindsteps_institution_invites')
    .select('code,label,active,expires_at,max_uses,uses_count,created_at')
    .eq('institution_id', institutionId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function listInstitutionStudents(userId: string, institutionId: string) {
  await getMembership(userId, institutionId)
  const { data: links, error } = await supabase
    .from('mindsteps_student_links')
    .select('id,user_id,status,joined_at')
    .eq('institution_id', institutionId)
    .eq('status', 'active')
    .order('joined_at', { ascending: false })
  if (error) throw new Error(error.message)
  const userIds = (links || []).map((row: any) => row.user_id)
  if (!userIds.length) return []
  const { data: profiles, error: profileError } = await supabase
    .from('student_profiles')
    .select('user_id,name,grade,xp,level,streak,last_study_date')
    .in('user_id', userIds)
  if (profileError) throw new Error(profileError.message)
  const byUser = new Map((profiles || []).map((profile: any) => [profile.user_id, profile]))
  return (links || []).map((link: any) => ({ id: link.id, userId: link.user_id, joinedAt: link.joined_at, ...(byUser.get(link.user_id) || {}) }))
}

export async function getInstitutionOverview(userId: string, institutionId: string) {
  const membership = await getMembership(userId, institutionId)
  const { data: institution, error } = await supabase
    .from('mindsteps_institutions')
    .select('id,name,type,city,state,parent_institution_id,created_at')
    .eq('id', institutionId)
    .single()
  if (error || !institution) throw new Error('Instituição não encontrada')
  const [students, invites] = await Promise.all([listInstitutionStudents(userId, institutionId), listInstitutionInvites(userId, institutionId)])
  const activeToday = students.filter((s: any) => s.last_study_date === new Date().toISOString().slice(0, 10)).length
  const avgXp = students.length ? Math.round(students.reduce((sum: number, s: any) => sum + Number(s.xp || 0), 0) / students.length) : 0
  const avgStreak = students.length ? Math.round(students.reduce((sum: number, s: any) => sum + Number(s.streak || 0), 0) / students.length) : 0
  const gradeCounts = students.reduce<Record<string, number>>((acc, s: any) => { const key = s.grade || 'Não informado'; acc[key] = (acc[key] || 0) + 1; return acc }, {})
  return { institution: { ...institution, role: membership.role }, metrics: { students: students.length, activeToday, avgXp, avgStreak, activeInvites: invites.filter((i: any) => i.active).length }, students: students.slice(0, 50), gradeCounts, invites }
}
