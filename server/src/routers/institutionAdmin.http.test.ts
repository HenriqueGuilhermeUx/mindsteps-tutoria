import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import express from 'express'
import jwt from 'jsonwebtoken'
import type { Server } from 'node:http'

// Exercise the real Express middleware, JWT verification, and Zod route
// validation without contacting production or writing to a database.
test('school AI approvals HTTP route requires JWT and validates request before DB access', async () => {
  const { default: router } = await import('./institutionAdmin.js')
  const app = express()
  app.use(express.json())
  app.use('/api/institutions', router)
  const server: Server = await new Promise(resolve => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance))
  })
  try {
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Test server did not bind')
    const url = `http://127.0.0.1:${address.port}/api/institutions/manage/11111111-1111-4111-8111-111111111111/students/22222222-2222-4222-8222-222222222222/ai-approvals`
    const unauthenticated = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ systemKey: 'socratic_tutor', decision: 'approved', reason: 'Valid reason' }) })
    assert.equal(unauthenticated.status, 401)
    const invalidJwt = await fetch(url, { method: 'PUT', headers: { Authorization: 'Bearer invalid', 'Content-Type': 'application/json' }, body: '{}' })
    assert.equal(invalidJwt.status, 401)
    const token = jwt.sign({ userId: '33333333-3333-4333-8333-333333333333', email: 'manager@example.test' }, process.env.JWT_SECRET || 'dev-secret-change-in-production')
    for (const payload of [
      { systemKey: 'unknown_system', decision: 'approved', reason: 'Valid reason' },
      { systemKey: 'socratic_tutor', decision: 'approved', reason: '    ' },
      { systemKey: 'socratic_tutor', decision: 'pending', reason: 'Valid reason' },
    ]) {
      const response = await fetch(url, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      assert.equal(response.status, 400, JSON.stringify(payload))
      assert.equal(response.headers.get('cache-control'), 'no-store')
    }
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  }
})
