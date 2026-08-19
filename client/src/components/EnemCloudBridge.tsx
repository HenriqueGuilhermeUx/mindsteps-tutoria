import { useEffect } from 'react'
import { enemCloudApi } from '@/lib/api'
import { useAuthStore } from '@/stores'
import { useEnemStore, type EnemCloudSnapshot } from '@/stores/enem'

function snapshot(): EnemCloudSnapshot {
  const state = useEnemStore.getState()
  return {
    profile: state.profile,
    diagnostic: state.diagnostic,
    attempts: state.attempts,
    simulations: state.simulations,
    dailyCompleted: state.dailyCompleted,
    updatedAt: state.updatedAt,
  }
}

function hasMeaningfulData(state: EnemCloudSnapshot) {
  return Boolean(state.profile || state.diagnostic || state.attempts.length || state.simulations.length || state.dailyCompleted.length)
}

export function EnemCloudBridge() {
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    if (!token) return
    let disposed = false
    let timer: number | undefined
    let unsubscribe: (() => void) | undefined

    const boot = async () => {
      try {
        const local = snapshot()
        const { state: remote } = await enemCloudApi.get()
        if (disposed) return
        if (remote && new Date(remote.updatedAt).getTime() > new Date(local.updatedAt).getTime()) {
          useEnemStore.getState().hydrateFromCloud(remote)
        } else if (hasMeaningfulData(local)) {
          await enemCloudApi.save(local)
        }
      } catch (error) {
        console.warn('ENEM cloud sync bootstrap failed:', error)
      }

      if (disposed) return
      unsubscribe = useEnemStore.subscribe((state, previous) => {
        if (state.updatedAt === previous.updatedAt) return
        if (timer) window.clearTimeout(timer)
        timer = window.setTimeout(() => {
          const current = snapshot()
          if (!hasMeaningfulData(current)) return
          enemCloudApi.save(current).catch((error) => console.warn('ENEM cloud sync failed:', error))
        }, 1200)
      })
    }

    boot()
    return () => {
      disposed = true
      if (timer) window.clearTimeout(timer)
      unsubscribe?.()
    }
  }, [token])

  return null
}
