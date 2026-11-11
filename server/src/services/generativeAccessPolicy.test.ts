import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { authorizeStudentGenerativeAI, isExplicitlyMediatedPolicy } from './generativeAccessPolicy.js'

test('early grades are blocked', () => {
  for (const grade of ['1', '5', '5º ano']) {
    assert.equal(authorizeStudentGenerativeAI({ grade, age_group: '6-10' }).allowed, false)
  }
})
test('missing or malformed grade fails closed', () => {
  for (const grade of ['', 'não informado', '5 a 9']) {
    const result = authorizeStudentGenerativeAI({ grade, age_group: '11-14' })
    assert.equal(result.allowed, false)
  }
})
test('young age and higher grade conflict fails closed', () => {
  const result = authorizeStudentGenerativeAI({ grade: '8', age_group: '6-10' })
  assert.equal(result.allowed, false)
})
test('explicit upper grades are eligible for subsequent policy checks', () => {
  const result = authorizeStudentGenerativeAI({ grade: '8º ano', age_group: '11-14' })
  assert.deepEqual(result, { allowed: true, stage: 'anos_finais' })
})

test('institution mediation requires active explicit policy and matching system', () => {
  const policy = {
    institution_id: 'school-1',
    status: 'active',
    allowed_systems: ['socratic_tutor'],
    age_rules: { allowGenerativeAIYears6to9: true },
    human_review_rules: { mediatedGenerativeAI: true },
  }
  assert.equal(isExplicitlyMediatedPolicy(policy, ['school-1'], 'socratic_tutor'), true)
  assert.equal(isExplicitlyMediatedPolicy(policy, ['school-2'], 'socratic_tutor'), false)
  assert.equal(isExplicitlyMediatedPolicy(policy, ['school-1'], 'independent_assessment'), false)
  assert.equal(isExplicitlyMediatedPolicy({ ...policy, status: 'draft' }, ['school-1'], 'socratic_tutor'), false)
  assert.equal(isExplicitlyMediatedPolicy({ ...policy, human_review_rules: {} }, ['school-1'], 'socratic_tutor'), false)
  assert.equal(isExplicitlyMediatedPolicy({ ...policy, age_rules: {} }, ['school-1'], 'socratic_tutor'), false)
})
