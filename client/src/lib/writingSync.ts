import { writingApi, type WritingSyncPayload } from '@/lib/api'
import type { WritingDrillResult, WritingProject } from '@/stores/writing'

export type WritingSyncState = 'idle' | 'syncing' | 'synced' | 'offline' | 'error'

export function toWritingSyncPayload(project: WritingProject, drills: WritingDrillResult[]): WritingSyncPayload {
  return {
    clientId: project.id,
    theme: project.theme,
    area: project.area,
    focus: project.focus,
    status: project.status,
    versions: project.versions.map((version) => ({
      clientId: version.id,
      createdAt: version.createdAt,
      text: version.text,
      wordCount: version.wordCount,
    })),
    drills: drills.filter((drill) => drill.projectId === project.id).map((drill) => ({
      clientId: drill.id,
      skill: drill.skill,
      answer: drill.answer,
      sourceVersionClientId: drill.sourceVersionId,
      createdAt: drill.createdAt,
    })),
  }
}

export async function syncWritingProject(project: WritingProject, drills: WritingDrillResult[]) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return { state: 'offline' as WritingSyncState }
  try {
    const result = await writingApi.syncProject(toWritingSyncPayload(project, drills))
    return { state: 'synced' as WritingSyncState, syncedAt: result.syncedAt }
  } catch (error) {
    // Local persistence remains the source of continuity until the backend writing routes are live.
    // We deliberately never discard or rollback a local version because a network sync failed.
    return { state: 'error' as WritingSyncState, error: error instanceof Error ? error.message : 'Falha ao sincronizar' }
  }
}
