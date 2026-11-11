import { supabase } from '../db/index.js'
import type { StudentProfile } from '../db/index.js'
import { authorizeStudentGenerativeAI, isExplicitlyMediatedPolicy, hasActiveHumanApproval } from './generativeAccessPolicy.js'

type Profile = Pick<StudentProfile, 'age_group' | 'grade'>
type Denied = { allowed: false; code: string; message: string }
type Granted = { allowed: true; stage: 'anos_finais' | 'ensino_medio' }

export async function authorizeGenerativeFeature(userId: string, profile: Profile, systemKey: 'socratic_tutor' | 'independent_assessment'): Promise<Denied | Granted> {
  const stageDecision = authorizeStudentGenerativeAI(profile)
  if (!stageDecision.allowed) return stageDecision
  if (stageDecision.stage === 'ensino_medio') return stageDecision

  // A link alone is not authorization. Fail closed on missing data, errors, or
  // policies that have not been explicitly approved by school administrators.
  const { data: links, error: linkError } = await supabase
    .from('mindsteps_student_links')
    .select('institution_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .eq('role', 'student')
  if (linkError || !links?.length) {
    return { allowed: false, code: 'INSTITUTION_MEDIATION_REQUIRED', message: 'Para esta etapa escolar, a IA generativa exige vínculo e autorização institucional.' }
  }
  const institutionIds = [...new Set(links.map((link: { institution_id: string }) => link.institution_id))]
  const { data: policies, error: policyError } = await supabase
    .from('mindsteps_ai_school_policies')
    .select('institution_id,status,allowed_systems,prohibited_uses,age_rules,human_review_rules')
    .in('institution_id', institutionIds)
    .eq('status', 'active')
  if (policyError || !policies?.length) {
    return { allowed: false, code: 'INSTITUTION_POLICY_REQUIRED', message: 'A escola precisa ativar uma política de IA com mediação humana.' }
  }
  const eligibleInstitutionIds = policies.filter((policy: any) =>
    isExplicitlyMediatedPolicy(policy, institutionIds, systemKey)
  ).map((policy: any) => policy.institution_id as string)
  if (!eligibleInstitutionIds.length) {
    return { allowed: false, code: 'INSTITUTION_POLICY_REQUIRED', message: 'Esta atividade requer autorização explícita e mediação humana pela escola.' }
  }

  // No individual approval, expired approval or missing approval table = deny.
  // This gate remains closed until the isolated approval migration and reviewer
  // workflow have been deployed and independently validated.
  const { data: approvals, error: approvalError } = await supabase
    .from('mindsteps_ai_student_approvals')
    .select('student_user_id,institution_id,system_key,status,approved_by,expires_at')
    .eq('student_user_id', userId)
    .eq('system_key', systemKey)
    .eq('status', 'approved')
    .in('institution_id', eligibleInstitutionIds)
  if (approvalError || !approvals?.length) {
    return { allowed: false, code: 'HUMAN_APPROVAL_REQUIRED', message: 'Esta atividade precisa de aprovação individual vigente de um educador autorizado.' }
  }
  const authorized = approvals.some((approval: any) =>
    eligibleInstitutionIds.includes(approval.institution_id) &&
    hasActiveHumanApproval(approval, userId, approval.institution_id, systemKey)
  )
  return authorized ? stageDecision
    : { allowed: false, code: 'HUMAN_APPROVAL_REQUIRED', message: 'Esta atividade precisa de aprovação individual vigente de um educador autorizado.' }
}
