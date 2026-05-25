import type { NextApiRequest, NextApiResponse } from 'next'
import { getSessionMessages } from '../_shared/db'
import { authMiddleware } from '../_shared/auth'

type Data =
  | { message: string }
  | { messages: any[] }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userId = authMiddleware(req, res)
  if (!userId) return

  if (req.method === 'GET') {
    try {
      const sessionId = req.query.sessionId as string
      const messages = await getSessionMessages(sessionId)

      res.json({
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
          createdAt: m.created_at,
        })),
      })
    } catch (error) {
      console.error('Get history error:', error)
      res.status(500).json({ message: 'Erro ao buscar histórico' })
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}