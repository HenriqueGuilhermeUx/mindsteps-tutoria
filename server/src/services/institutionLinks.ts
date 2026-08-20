import { supabase } from '../db/index.js'

export interface StudentInstitutionLink {
  id: string
  role: string
  status: string
  joinedAt: string
  institution: {
    id: string
    name: string
    type: string
    city?: string | null
    state?: string | null
  }
}

export async function listStudentInstitutionLinks(userId: string): Promise<StudentInstitutionLink[]> {
  const { data, error } = await supabase
    .from('mindsteps_student_links')
    .select('id, role, status, joined_at, mindsteps_institutions(id,name,type,city,state)')
    .eq('user_id', userId)
    .neq('status', 'inactive')
    .order('joined_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data || []).map((row: any) => ({
    id: row.id,
    role: row.role,
    status: row.status,
    joinedAt: row.joined_at,
    institution: row.mindsteps_institutions,
  }))
}

export async function joinInstitutionByCode(userId: string, rawCode: string) {
  const code = rawCode.trim().toUpperCase().replace(/\s+/g, '')
  if (code.length < 4 || code.length > 32) throw new Error('Código de convite inválido')

  const { data: invite, error: inviteError } = await supabase
    .from('mindsteps_institution_invites')
    .select('code,institution_id,active,expires_at,max_uses,uses_count,mindsteps_institutions(id,name,type,city,state)')
    .eq('code', code)
    .single()

  if (inviteError || !invite) throw new Error('Código de convite não encontrado')
  if (!invite.active) throw new Error('Este convite não está mais ativo')
  if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) throw new Error('Este convite expirou')
  if (invite.max_uses && Number(invite.uses_count || 0) >= Number(invite.max_uses)) throw new Error('Este convite atingiu o limite de usos')

  const { data: existing } = await supabase
    .from('mindsteps_student_links')
    .select('id,status,joined_at')
    .eq('user_id', userId)
    .eq('institution_id', invite.institution_id)
    .maybeSingle()

  const wasAlreadyActive = existing?.status === 'active'
  const { data: link, error } = await supabase
    .from('mindsteps_student_links')
    .upsert({ user_id: userId, institution_id: invite.institution_id, role: 'student', status: 'active', left_at: null }, { onConflict: 'user_id,institution_id' })
    .select('id,role,status,joined_at')
    .single()

  if (error) throw new Error(error.message)

  if (!wasAlreadyActive) {
    const nextUses = Number(invite.uses_count || 0) + 1
    const shouldDisable = invite.max_uses ? nextUses >= Number(invite.max_uses) : false
    await supabase
      .from('mindsteps_institution_invites')
      .update({ uses_count: nextUses, active: shouldDisable ? false : invite.active })
      .eq('code', code)
  }

  return {
    id: link.id,
    role: link.role,
    status: link.status,
    joinedAt: link.joined_at,
    institution: invite.mindsteps_institutions,
  }
}

export async function leaveInstitution(userId: string, linkId: string) {
  const { error } = await supabase
    .from('mindsteps_student_links')
    .update({ status: 'inactive', left_at: new Date().toISOString() })
    .eq('id', linkId)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}
