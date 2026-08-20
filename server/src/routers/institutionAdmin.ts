import { Router } from 'express'
import { authMiddleware } from './auth.js'
import { createManagedInstitution, createStudentInvite, getInstitutionOverview, listInstitutionInvites, listInstitutionStudents, listManagedInstitutions } from '../services/institutionAdmin.js'

const router = Router()
router.use(authMiddleware)

router.get('/manage', async (req, res) => {
  try { res.json({ institutions: await listManagedInstitutions(req.userId) }) }
  catch (error) { res.status(500).json({ message: error instanceof Error ? error.message : 'Não foi possível carregar instituições' }) }
})

router.post('/manage', async (req, res) => {
  try {
    const institution = await createManagedInstitution(req.userId, {
      name: String(req.body?.name || ''),
      type: req.body?.type ? String(req.body.type) : undefined,
      city: req.body?.city ? String(req.body.city) : undefined,
      state: req.body?.state ? String(req.body.state) : undefined,
      parentInstitutionId: req.body?.parentInstitutionId ? String(req.body.parentInstitutionId) : null,
    })
    res.json({ institution })
  } catch (error) { res.status(400).json({ message: error instanceof Error ? error.message : 'Não foi possível criar a instituição' }) }
})

router.get('/manage/:institutionId/overview', async (req, res) => {
  try { res.json(await getInstitutionOverview(req.userId, req.params.institutionId)) }
  catch (error) { res.status(403).json({ message: error instanceof Error ? error.message : 'Acesso negado' }) }
})

router.get('/manage/:institutionId/students', async (req, res) => {
  try { res.json({ students: await listInstitutionStudents(req.userId, req.params.institutionId) }) }
  catch (error) { res.status(403).json({ message: error instanceof Error ? error.message : 'Acesso negado' }) }
})

router.get('/manage/:institutionId/invites', async (req, res) => {
  try { res.json({ invites: await listInstitutionInvites(req.userId, req.params.institutionId) }) }
  catch (error) { res.status(403).json({ message: error instanceof Error ? error.message : 'Acesso negado' }) }
})

router.post('/manage/:institutionId/invites', async (req, res) => {
  try {
    const invite = await createStudentInvite(req.userId, req.params.institutionId, {
      label: req.body?.label ? String(req.body.label) : undefined,
      expiresAt: req.body?.expiresAt ? String(req.body.expiresAt) : null,
      maxUses: Number.isFinite(Number(req.body?.maxUses)) && Number(req.body.maxUses) > 0 ? Number(req.body.maxUses) : null,
    })
    res.json({ invite })
  } catch (error) { res.status(400).json({ message: error instanceof Error ? error.message : 'Não foi possível criar o convite' }) }
})

export default router
