import type { NextApiRequest, NextApiResponse } from 'next'
import { endSession } from '../_shared/db'
import { authMiddleware } from '../_shared/auth'

type Data =
  | { message: string }
  | { success: boolean }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userId = authMiddleware(req, res)
  if (!userId) return

  if (req.method === 'POST') {
    try {
      const { sessionId } = req.body
      await endSession(sessionId)
      res.json({ success: true })
    } catch (error) {
      console.error('End session error:', error)
      res.status(500).json({ message: 'Erro ao encerrar sessão' })
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}