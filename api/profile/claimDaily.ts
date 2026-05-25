import type { NextApiRequest, NextApiResponse } from 'next'
import { getProfileByUserId, addXP } from '../_shared/db'
import { authMiddleware } from '../_shared/auth'

type Data =
  | { message: string }
  | { streak: number; bonus: number }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userId = authMiddleware(req, res)
  if (!userId) return

  if (req.method === 'POST') {
    try {
      const profile = await getProfileByUserId(userId)
      if (!profile) {
        return res.status(404).json({ message: 'Perfil não encontrado' })
      }

      // Add streak bonus
      const bonus = profile.streak * 10
      await addXP(userId, bonus)

      res.json({
        streak: profile.streak,
        bonus,
      })
    } catch (error) {
      console.error('Claim daily error:', error)
      res.status(500).json({ message: 'Erro ao resgatar bônus' })
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}