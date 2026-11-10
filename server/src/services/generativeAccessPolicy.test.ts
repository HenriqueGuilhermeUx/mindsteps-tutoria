import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { authorizeStudentGenerativeAI } from './generativeAccessPolicy.js'

test('early grades are blocked', () => {
  for (const grade of ['1', '5', '5º ano']) {
    assert.equal(authorizeStudentGenerativeAI({ grade, age_group: '6-10' }).allowed, false)
  }
})
test('missing or malformed grade fails closed', () => {
  for (const grade of [null, '', 'não informado', '5 a 9']) {
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
