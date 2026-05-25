import type { NextApiRequest, NextApiResponse } from 'next'
import {
  getProfileByUserId,
  updateProfile,
} from '../_shared/db'
import { authMiddleware } from '../_shared/auth'

type Data =
  | { message: string }
  | any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userId = authMiddleware(req, res)
  if (!userId) return

  if (req.method === 'GET') {
    try {
      const profile = await getProfileByUserId(userId)
      if (!profile) {
        return res.status(404).json({ message: 'Perfil não encontrado' })
      }
      res.json(profile)
    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json({ message: 'Erro ao buscar perfil' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, tutorId, petType, petName } = req.body
      const updates: any = {}
      if (name) updates.name = name
      if (tutorId) updates.tutor_id = tutorId
      if (petType) updates.pet_type = petType
      if (petName) updates.pet_name = petName

      const profile = await updateProfile(userId, updates)
      res.json(profile)
    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({ message: 'Erro ao atualizar perfil' })
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}