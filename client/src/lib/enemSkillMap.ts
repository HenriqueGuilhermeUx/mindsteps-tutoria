import type { EnemArea, EnemQuestionAttempt } from '@/stores/enem'
import type { WritingProject } from '@/stores/writing'
import { analyzeWriting } from '@/lib/writingAnalysis'

export type EnemSkillSignal = {
  area: EnemArea
  skill: string
  score: number
  evidenceCount: number
  source: 'practice' | 'writing' | 'baseline'
}

export type EnemAreaSignal = {
  area: EnemArea
  score: number
  evidenceCount: number
  skills: EnemSkillSignal[]
}

const defaults: Record<Exclude<EnemArea, 'Redação'>, string[]> = {
  Linguagens: ['Inferência', 'Efeito de sentido', 'Leitura crítica'],
  Humanas: ['Fonte histórica', 'Cidadania', 'Relações sociais'],
  Natureza: ['Ecologia', 'Energia', 'Evidência científica'],
  Matemática: ['Porcentagem', 'Proporção', 'Modelagem'],
}

const writingLabels = {
  tese: 'Tese',
  argumentacao: 'Argumentação',
  repertorio: 'Repertório',
  coesao: 'Coesão',
  intervencao: 'Intervenção',
  clareza: 'Clareza',
} as const

function practiceScore(items: EnemQuestionAttempt[]) {
  if (!items.length) return 50
  const recent = items.slice(-12)
  const weighted = recent.reduce((sum, item, index) => {
    const recency = 0.7 + ((index + 1) / recent.length) * 0.3
    const difficultyWeight = 0.85 + item.difficulty * 0.1
    const outcome = item.correct ? 78 : 28
    return sum + outcome * recency * difficultyWeight
  }, 0)
  const weightTotal = recent.reduce((sum, item, index) => {
    const recency = 0.7 + ((index + 1) / recent.length) * 0.3
    return sum + recency * (0.85 + item.difficulty * 0.1)
  }, 0)
  return Math.max(20, Math.min(95, Math.round(weighted / weightTotal)))
}

export function buildEnemSkillMap(attempts: EnemQuestionAttempt[], projects: WritingProject[]): EnemAreaSignal[] {
  const areas: EnemAreaSignal[] = []
  ;(Object.keys(defaults) as Array<Exclude<EnemArea, 'Redação'>>).forEach((area) => {
    const areaAttempts = attempts.filter((item) => item.area === area)
    const observedSkills = Array.from(new Set(areaAttempts.map((item) => item.skill)))
    const skillNames = Array.from(new Set([...defaults[area], ...observedSkills]))
    const skills = skillNames.map<EnemSkillSignal>((skill) => {
      const evidence = areaAttempts.filter((item) => item.skill === skill)
      return { area, skill, score: practiceScore(evidence), evidenceCount: evidence.length, source: evidence.length ? 'practice' : 'baseline' }
    })
    const evidenced = skills.filter((item) => item.evidenceCount > 0)
    const score = evidenced.length ? Math.round(evidenced.reduce((sum, item) => sum + item.score, 0) / evidenced.length) : 50
    areas.push({ area, score, evidenceCount: areaAttempts.length, skills })
  })

  const writingProjects = projects.filter((project) => project.versions.length).slice(0, 6)
  const writingSkills = (Object.keys(writingLabels) as Array<keyof typeof writingLabels>).map<EnemSkillSignal>((key) => {
    if (!writingProjects.length) return { area: 'Redação', skill: writingLabels[key], score: 50, evidenceCount: 0, source: 'baseline' }
    const scores = writingProjects.map((project) => analyzeWriting(project.versions[project.versions.length - 1]!.text).scores[key])
    return { area: 'Redação', skill: writingLabels[key], score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), evidenceCount: scores.length, source: 'writing' }
  })
  const writingEvidenced = writingSkills.filter((item) => item.evidenceCount > 0)
  areas.push({ area: 'Redação', score: writingEvidenced.length ? Math.round(writingEvidenced.reduce((sum, item) => sum + item.score, 0) / writingEvidenced.length) : 50, evidenceCount: writingProjects.length, skills: writingSkills })
  return areas
}

export function findPrioritySkill(areas: EnemAreaSignal[]) {
  const all = areas.flatMap((area) => area.skills)
  const evidenced = all.filter((skill) => skill.evidenceCount > 0)
  return [...(evidenced.length ? evidenced : all)].sort((a, b) => a.score - b.score || b.evidenceCount - a.evidenceCount)[0]
}
