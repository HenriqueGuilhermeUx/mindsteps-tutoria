import type { NextApiRequest, NextApiResponse } from 'next'
import {
  getProfileByUserId,
  createSession,
} from '../_shared/db'
import { authMiddleware } from '../_shared/auth'

type Data =
  | { message: string }
  | { sessionId: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userId = authMiddleware(req, res)
  if (!userId) return

  if (req.method === 'POST') {
    try {
      const { tutorId } = req.body
      const profile = await getProfileByUserId(userId)

      if (!profile) {
        return res.status(404).json({ message: 'Perfil não encontrado' })
      }

      const session = await createSession(profile.id, tutorId || 'default')
      res.json({ sessionId: session.id })
    } catch (error) {
      console.error('Start session error:', error)
      res.status(500).json({ message: 'Erro ao iniciar sessão' })
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}