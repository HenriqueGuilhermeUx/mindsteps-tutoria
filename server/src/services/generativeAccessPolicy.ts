import type { StudentProfile } from '../db/index.js'

export type GenerativeAccessDecision =
  | { allowed: true; stage: 'anos_finais' | 'ensino_medio' }
  | { allowed: false; code: 'EDUCATION_STAGE_UNVERIFIED' | 'GENERATIVE_AI_NOT_AVAILABLE_FOR_EARLY_YEARS'; message: string }

type Profile = Pick<StudentProfile, 'age_group' | 'grade'>

/**
 * Fail closed: ambiguous grades and age groups cannot silently become high school.
 * Grade 1-9 is only accepted when an explicit grade is available.
 * Grade 10-12 is accepted as high school only with an explicit grade.
 */
export function authorizeStudentGenerativeAI(profile: Profile): GenerativeAccessDecision {
  const rawGrade = typeof profile.grade === 'string' ? profile.grade.trim() : ''
  const match = /^(?:([1-9]|1[0-2])(?:\s*[º°ª.]?\s*(?:ano|série))?|(?:ano|série)\s*([1-9]|1[0-2]))$/i.exec(rawGrade)
  const grade = match ? Number(match[1] || match[2]) : null

  if (grade !== null) {
    if (grade <= 5) return { allowed: false, code: 'GENERATIVE_AI_NOT_AVAILABLE_FOR_EARLY_YEARS', message: 'Esta atividade com IA generativa não está disponível para estudantes dos anos iniciais.' }
    return { allowed: true, stage: grade <= 9 ? 'anos_finais' : 'ensino_medio' }
  }
  if (profile.age_group === '6-10') {
    return { allowed: false, code: 'GENERATIVE_AI_NOT_AVAILABLE_FOR_EARLY_YEARS', message: 'Esta atividade com IA generativa não está disponível para estudantes dos anos iniciais.' }
  }
  return { allowed: false, code: 'EDUCATION_STAGE_UNVERIFIED', message: 'Confirme a etapa escolar antes de acessar atividades com IA generativa.' }
}
