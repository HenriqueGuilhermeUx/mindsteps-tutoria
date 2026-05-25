import type { NextApiRequest, NextApiResponse } from 'next'
import { getTodayUsage, addXP, getProfileByUserId } from '../_shared/db'
import { authMiddleware } from '../_shared/auth'

type Data =
  | { message: string }
  | { remaining: number; limit: number }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userId = authMiddleware(req, res)
  if (!userId) return

  if (req.method === 'GET') {
    try {
      const todayUsage = await getTodayUsage(userId)
      const messageCount = todayUsage?.message_count || 0
      const limit = 5

      res.json({
        remaining: Math.max(0, limit - messageCount),
        limit,
      })
    } catch (error) {
      console.error('Check usage error:', error)
      res.json({ remaining: 5, limit: 5 })
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}