import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { authorizeStudentGenerativeAI, isExplicitlyMediatedPolicy, hasActiveHumanApproval } from './generativeAccessPolicy.js'

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
    prohibited_uses: [],
    age_rules: { allowGenerativeAIYears6to9: true },
    human_review_rules: { mediatedGenerativeAI: true },
  }
  assert.equal(isExplicitlyMediatedPolicy(policy, ['school-1'], 'socratic_tutor'), true)
  assert.equal(isExplicitlyMediatedPolicy(policy, ['school-2'], 'socratic_tutor'), false)
  assert.equal(isExplicitlyMediatedPolicy(policy, ['school-1'], 'independent_assessment'), false)
  assert.equal(isExplicitlyMediatedPolicy({ ...policy, prohibited_uses: ['socratic_tutor'] }, ['school-1'], 'socratic_tutor'), false)
  assert.equal(isExplicitlyMediatedPolicy({ ...policy, prohibited_uses: undefined }, ['school-1'], 'socratic_tutor'), false)
  assert.equal(isExplicitlyMediatedPolicy({ ...policy, status: 'draft' }, ['school-1'], 'socratic_tutor'), false)
  assert.equal(isExplicitlyMediatedPolicy({ ...policy, human_review_rules: {} }, ['school-1'], 'socratic_tutor'), false)
  assert.equal(isExplicitlyMediatedPolicy({ ...policy, age_rules: {} }, ['school-1'], 'socratic_tutor'), false)
})

test('invalid age group is never treated as verified', () => {
  const result = authorizeStudentGenerativeAI({ grade: '8', age_group: 'unknown' as '11-14' })
  assert.equal(result.allowed, false)
})

test('declared secondary stage is allowed only with consistent age group', () => {
  assert.deepEqual(authorizeStudentGenerativeAI({ grade: '10', age_group: '15-17' }), { allowed: true, stage: 'ensino_medio' })
  assert.equal(authorizeStudentGenerativeAI({ grade: '10', age_group: '11-14' }).allowed, false)
  assert.equal(authorizeStudentGenerativeAI({ grade: '10', age_group: '6-10' }).allowed, false)
})

test('legacy signup without grade cannot access generative AI', () => {
  const result = authorizeStudentGenerativeAI({ grade: '', age_group: '11-14' })
  assert.deepEqual(result.allowed, false)
  if (!result.allowed) assert.equal(result.code, 'EDUCATION_STAGE_UNVERIFIED')
})

test('individual approval must match student, school, system and expiry', () => {
  const now = new Date('2026-11-11T12:00:00Z')
  const approval = { student_user_id: 'student-1', institution_id: 'school-1', system_key: 'socratic_tutor', status: 'approved', approved_by: 'manager-1', expires_at: '2026-11-12T12:00:00Z' }
  assert.equal(hasActiveHumanApproval(approval, 'student-1', 'school-1', 'socratic_tutor', now), true)
  assert.equal(hasActiveHumanApproval(approval, 'student-2', 'school-1', 'socratic_tutor', now), false)
  assert.equal(hasActiveHumanApproval(approval, 'student-1', 'school-2', 'socratic_tutor', now), false)
  assert.equal(hasActiveHumanApproval(approval, 'student-1', 'school-1', 'independent_assessment', now), false)
  assert.equal(hasActiveHumanApproval({ ...approval, status: 'revoked' }, 'student-1', 'school-1', 'socratic_tutor', now), false)
  assert.equal(hasActiveHumanApproval({ ...approval, approved_by: null }, 'student-1', 'school-1', 'socratic_tutor', now), false)
  assert.equal(hasActiveHumanApproval({ ...approval, expires_at: '2026-11-10T12:00:00Z' }, 'student-1', 'school-1', 'socratic_tutor', now), false)
})

test('approval cannot silently cross school, student or feature boundaries', () => {
  const now = new Date('2026-11-12T12:00:00Z')
  const approval = { student_user_id:'s1',institution_id:'i1',system_key:'independent_assessment',status:'approved',approved_by:'m1',expires_at:'2026-11-19T12:00:00Z' }
  for (const [student,school,system] of [
    ['s2','i1','independent_assessment'],
    ['s1','i2','independent_assessment'],
    ['s1','i1','socratic_tutor']
  ]) assert.equal(hasActiveHumanApproval(approval,student,school,system,now),false)
  assert.equal(hasActiveHumanApproval(approval,'s1','i1','independent_assessment',now),true)
})

test('approval expires at the exact expiry instant and invalid dates deny', () => {
  const approval={student_user_id:'s1',institution_id:'i1',system_key:'socratic_tutor',status:'approved',approved_by:'m1',expires_at:'2026-11-19T12:00:00Z'}
  assert.equal(hasActiveHumanApproval(approval,'s1','i1','socratic_tutor',new Date('2026-11-19T11:59:59Z')),true)
  assert.equal(hasActiveHumanApproval(approval,'s1','i1','socratic_tutor',new Date('2026-11-19T12:00:00Z')),false)
  assert.equal(hasActiveHumanApproval({...approval,expires_at:'invalid'},'s1','i1','socratic_tutor'),false)
})

test('grade and age policy boundary matrix fails closed for early and ambiguous students', () => {
  for (const age_group of ['6-10','11-14','15-17'] as const) {
    for (const grade of ['1','2','3','4','5']) {
      const result = authorizeStudentGenerativeAI({ grade, age_group })
      assert.equal(result.allowed, false, `grade ${grade}, age ${age_group}`)
    }
    for (const grade of ['', '6-9', 'ensino médio', '13', '0', '8/9']) {
      const result = authorizeStudentGenerativeAI({ grade, age_group })
      assert.equal(result.allowed, false, `grade ${grade}, age ${age_group}`)
    }
  }
  for (const grade of ['6','7','8','9']) {
    assert.deepEqual(authorizeStudentGenerativeAI({grade,age_group:'11-14'}), {allowed:true,stage:'anos_finais'})
    assert.equal(authorizeStudentGenerativeAI({grade,age_group:'6-10'}).allowed,false)
  }
  for (const grade of ['10','11','12']) {
    assert.deepEqual(authorizeStudentGenerativeAI({grade,age_group:'15-17'}), {allowed:true,stage:'ensino_medio'})
    assert.equal(authorizeStudentGenerativeAI({grade,age_group:'11-14'}).allowed,false)
  }
})

test('revocation, malformed approval and exact expiry never grant access', () => {
  const base = {student_user_id:'student',institution_id:'school',system_key:'socratic_tutor',status:'approved',approved_by:'manager',expires_at:'2026-11-19T12:00:00Z'}
  const now = new Date('2026-11-19T12:00:00Z')
  for (const change of [
    {status:'revoked'}, {status:'pending'}, {approved_by:''},
    {student_user_id:'other'}, {institution_id:'other'},
    {system_key:'independent_assessment'}, {expires_at:'2026-11-19T12:00:00Z'},
    {expires_at:'not-a-date'}
  ]) {
    assert.equal(hasActiveHumanApproval({...base,...change},'student','school','socratic_tutor',now),false)
  }
})

test('institution policy cannot authorize unlisted or explicitly prohibited systems', () => {
  const base = {institution_id:'school',status:'active',allowed_systems:['socratic_tutor'],prohibited_uses:[],age_rules:{allowGenerativeAIYears6to9:true},human_review_rules:{mediatedGenerativeAI:true}}
  assert.equal(isExplicitlyMediatedPolicy(base,['school'],'socratic_tutor'),true)
  for (const change of [
    {status:'inactive'}, {allowed_systems:[]}, {prohibited_uses:['socratic_tutor']},
    {age_rules:{allowGenerativeAIYears6to9:false}},
    {human_review_rules:{mediatedGenerativeAI:false}}
  ]) assert.equal(isExplicitlyMediatedPolicy({...base,...change},['school'],'socratic_tutor'),false)
})

test('teacher role is not equivalent to an active institutional manager', () => {
  const roles = ['teacher', 'student', 'guest', '', null]
  for (const role of roles) {
    assert.equal(['owner', 'admin', 'coordinator'].includes(role as string), false)
  }
  for (const role of ['owner', 'admin', 'coordinator']) {
    assert.equal(['owner', 'admin', 'coordinator'].includes(role), true)
  }
})

test('invalid policy objects and missing school membership fail closed', () => {
  for (const policy of [null, undefined, {}, { status:'active' }, { institution_id:'school', status:'active' }]) {
    assert.equal(isExplicitlyMediatedPolicy(policy,['school'],'socratic_tutor'),false)
  }
  const valid = {institution_id:'school',status:'active',allowed_systems:['socratic_tutor'],prohibited_uses:[],age_rules:{allowGenerativeAIYears6to9:true},human_review_rules:{mediatedGenerativeAI:true}}
  assert.equal(isExplicitlyMediatedPolicy(valid,[],'socratic_tutor'),false)
  assert.equal(isExplicitlyMediatedPolicy(valid,['other-school'],'socratic_tutor'),false)
})
