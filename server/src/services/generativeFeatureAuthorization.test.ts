import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { authorizeGenerativeFeature } from './generativeFeatureAuthorization.js'
import type { supabase } from '../db/index.js'

const school = 'school-a'
const student = 'student-a'
const manager = 'manager-a'
const profile = { grade: '8', age_group: '11-14' as const }
const policy = { institution_id: school, status: 'active', allowed_systems: ['socratic_tutor'], prohibited_uses: [], age_rules: { allowGenerativeAIYears6to9: true }, human_review_rules: { mediatedGenerativeAI: true } }
const approval = { student_user_id: student, institution_id: school, system_key: 'socratic_tutor', status: 'approved', approved_by: manager, expires_at: '2099-01-01T00:00:00Z' }
const reviewer = { user_id: manager, institution_id: school, role: 'coordinator', status: 'active' }
type Table = 'mindsteps_student_links' | 'mindsteps_ai_school_policies' | 'mindsteps_ai_student_approvals' | 'mindsteps_institution_members'
function fakeDb(overrides: Partial<Record<Table, { data: any[] | null; error: unknown }>> = {}) {
  const rows: Record<Table, { data: any[] | null; error: unknown }> = {
    mindsteps_student_links: { data: [{ institution_id: school, user_id: student, role: 'student', status: 'active' }], error: null },
    mindsteps_ai_school_policies: { data: [policy], error: null },
    mindsteps_ai_student_approvals: { data: [approval], error: null },
    mindsteps_institution_members: { data: [reviewer], error: null },
    ...overrides,
  }
  const calls: { table: string; filters: [string, string, unknown][] }[] = []
  const db = {
    from(table: Table) {
      const call = { table, filters: [] as [string, string, unknown][] }
      calls.push(call)
      const query = {
        select(_fields: string) { return query },
        eq(field: string, value: unknown) { call.filters.push(['eq', field, value]); return query },
        in(field: string, value: unknown) { call.filters.push(['in', field, value]); return query },
        then(resolve: (result: { data: any[] | null; error: unknown }) => unknown) {
          const result = rows[table]
          if (result.error || !result.data) return Promise.resolve(result).then(resolve)
          const data = result.data.filter(row => call.filters.every(([kind, field, value]) =>
            kind === 'eq' ? row[field] === value : Array.isArray(value) && value.includes(row[field])
          ))
          return Promise.resolve({ data, error: null }).then(resolve)
        },
      }
      return query
    },
  }
  return { db: db as unknown as Pick<typeof supabase, 'from'>, calls }
}

test('active school policy, student link, approval and coordinator allow grade eight', async () => {
  const { db, calls } = fakeDb()
  assert.deepEqual(await authorizeGenerativeFeature(student, profile, 'socratic_tutor', db), { allowed: true, stage: 'anos_finais' })
  assert.deepEqual(calls.map(c => c.table), ['mindsteps_student_links','mindsteps_ai_school_policies','mindsteps_ai_student_approvals','mindsteps_institution_members'])
  assert.ok(calls[0].filters.some(f => f[1] === 'role' && f[2] === 'student'))
})
test('missing student link or database failure denies', async () => {
  for (const row of [{ data: [], error: null }, { data: null, error: { message: 'unavailable' } }]) {
    const { db } = fakeDb({ mindsteps_student_links: row })
    assert.equal((await authorizeGenerativeFeature(student, profile, 'socratic_tutor', db)).allowed, false)
  }
})
test('policy, approval, expiration and revocation deny', async () => {
  const cases: Partial<Record<Table, { data: any[] | null; error: unknown }>>[] = [
    { mindsteps_ai_school_policies: { data: [], error: null } },
    { mindsteps_ai_school_policies: { data: [{ ...policy, status: 'draft' }], error: null } },
    { mindsteps_ai_student_approvals: { data: [], error: null } },
    { mindsteps_ai_student_approvals: { data: [{ ...approval, status: 'revoked' }], error: null } },
    { mindsteps_ai_student_approvals: { data: [{ ...approval, expires_at: '2020-01-01T00:00:00Z' }], error: null } },
    { mindsteps_ai_student_approvals: { data: null, error: { message: 'missing table' } } },
  ]
  for (const change of cases) {
    const { db } = fakeDb(change)
    assert.equal((await authorizeGenerativeFeature(student, profile, 'socratic_tutor', db)).allowed, false)
  }
})
test('teacher, revoked manager and manager in another school cannot authorize', async () => {
  for (const change of [{ role: 'teacher' }, { status: 'revoked' }, { institution_id: 'school-b' }]) {
    const { db } = fakeDb({ mindsteps_institution_members: { data: [{ ...reviewer, ...change }], error: null } })
    assert.equal((await authorizeGenerativeFeature(student, profile, 'socratic_tutor', db)).allowed, false)
  }
})
test('grade five denies before any database lookup', async () => {
  const { db, calls } = fakeDb()
  assert.equal((await authorizeGenerativeFeature(student, { grade: '5', age_group: '6-10' }, 'socratic_tutor', db)).allowed, false)
  assert.equal(calls.length, 0)
})

test('reviewer lookup failures and missing active reviewer deny', async () => {
  for (const row of [
    { data: null, error: { message: 'reviewer table unavailable' } },
    { data: [], error: null },
    { data: [{ ...reviewer, user_id: 'another-manager' }], error: null },
  ]) {
    const { db } = fakeDb({ mindsteps_institution_members: row })
    const result = await authorizeGenerativeFeature(student, profile, 'socratic_tutor', db)
    assert.equal(result.allowed, false)
  }
})
test('a policy for one system never permits another system', async () => {
  const { db } = fakeDb()
  const result = await authorizeGenerativeFeature(student, profile, 'independent_assessment', db)
  assert.equal(result.allowed, false)
})


test('inactive, teacher-only, or another student school link denies', async () => {
  for (const change of [
    { status: 'inactive' },
    { role: 'teacher' },
    { user_id: 'another-student' },
  ]) {
    const { db } = fakeDb({ mindsteps_student_links: { data: [{ institution_id: school, user_id: student, role: 'student', status: 'active', ...change }], error: null } })
    assert.equal((await authorizeGenerativeFeature(student, profile, 'socratic_tutor', db)).allowed, false)
  }
})

test('cross-school, another student, and wrong-system approvals never authorize', async () => {
  for (const change of [
    { institution_id: 'school-b' },
    { student_user_id: 'another-student' },
    { system_key: 'independent_assessment' },
  ]) {
    const { db } = fakeDb({ mindsteps_ai_student_approvals: { data: [{ ...approval, ...change }], error: null } })
    assert.equal((await authorizeGenerativeFeature(student, profile, 'socratic_tutor', db)).allowed, false)
  }
})

test('a second school cannot lend its manager to an approval from the first', async () => {
  const { db } = fakeDb({
    mindsteps_student_links: { data: [
      { institution_id: school, user_id: student, role: 'student', status: 'active' },
      { institution_id: 'school-b', user_id: student, role: 'student', status: 'active' },
    ], error: null },
    mindsteps_ai_school_policies: { data: [policy, { ...policy, institution_id: 'school-b' }], error: null },
    mindsteps_institution_members: { data: [{ ...reviewer, institution_id: 'school-b' }], error: null },
  })
  assert.equal((await authorizeGenerativeFeature(student, profile, 'socratic_tutor', db)).allowed, false)
})
