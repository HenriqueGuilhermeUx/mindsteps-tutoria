import { Router } from 'express'
import { authMiddleware } from './auth.js'
import { joinInstitutionByCode, leaveInstitution, listStudentInstitutionLinks } from '../services/institutionLinks.js'

const router = Router()
router.use(authMiddleware)

router.get('/me/links', async (req, res) => {
  try {
    const links = await listStudentInstitutionLinks(req.userId)
    res.json({ links })
  } catch (error) {
    console.error('List institution links error:', error)
    res.status(500).json({ message: 'Não foi possível carregar seus vínculos' })
  }
})

router.post('/me/links/join', async (req, res) => {
  try {
    const code = String(req.body?.code || '')
    const link = await joinInstitutionByCode(req.userId, code)
    res.json({ link })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível usar este convite'
    const status = /não encontrado|inválido|expirou|ativo/.test(message.toLowerCase()) ? 400 : 500
    res.status(status).json({ message })
  }
})

router.delete('/me/links/:linkId', async (req, res) => {
  try {
    await leaveInstitution(req.userId, req.params.linkId)
    res.json({ success: true })
  } catch (error) {
    console.error('Leave institution error:', error)
    res.status(500).json({ message: 'Não foi possível remover o vínculo' })
  }
})

export default router
