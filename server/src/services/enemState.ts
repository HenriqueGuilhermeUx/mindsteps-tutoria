import { supabase } from '../db/index.js'

export interface EnemCloudState {
  profile: unknown | null
  diagnostic: unknown | null
  attempts: unknown[]
  simulations: unknown[]
  dailyCompleted: string[]
  updatedAt: string
}

export async function getEnemState(userId: string): Promise<EnemCloudState | null> {
  const { data, error } = await supabase
    .from('mindsteps_enem_state')
    .select('profile,diagnostic,attempts,simulations,daily_completed,updated_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null
  return {
    profile: data.profile,
    diagnostic: data.diagnostic,
    attempts: Array.isArray(data.attempts) ? data.attempts : [],
    simulations: Array.isArray(data.simulations) ? data.simulations : [],
    dailyCompleted: Array.isArray(data.daily_completed) ? data.daily_completed : [],
    updatedAt: data.updated_at,
  }
}

export async function saveEnemState(userId: string, state: Omit<EnemCloudState, 'updatedAt'> & { updatedAt?: string }) {
  const updatedAt = state.updatedAt || new Date().toISOString()
  const { error } = await supabase
    .from('mindsteps_enem_state')
    .upsert({
      user_id: userId,
      profile: state.profile,
      diagnostic: state.diagnostic,
      attempts: state.attempts || [],
      simulations: state.simulations || [],
      daily_completed: state.dailyCompleted || [],
      updated_at: updatedAt,
    }, { onConflict: 'user_id' })

  if (error) throw new Error(error.message)
  return { updatedAt }
}
