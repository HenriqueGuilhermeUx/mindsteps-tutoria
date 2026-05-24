import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatXP(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k`
  }
  return xp.toString()
}

export function calculateLevel(xp: number): number {
  // Level formula: each level requires progressively more XP
  // Level 1: 0-99, Level 2: 100-299, Level 3: 300-599, etc.
  if (xp < 100) return 1
  return Math.floor((xp - 100) / 200) + 2
}

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: 'Curioso',
    2: 'Investigador',
    3: 'Explorador',
    4: 'Descobridor',
    5: 'Pensador',
    6: 'Analista',
    7: 'Mestre',
    8: 'Sábio',
    9: 'Gênio',
    10: 'Lendário',
  }
  return titles[level] || `Nível ${level}`
}

export function getXPForNextLevel(level: number): number {
  if (level === 1) return 100
  return 100 + (level - 1) * 200
}

export function getXPProgress(xp: number, level: number): number {
  const currentLevelXP = level === 1 ? 0 : getXPForNextLevel(level - 1)
  const nextLevelXP = getXPForNextLevel(level)
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
  return Math.min(100, Math.max(0, progress))
}

export function getPetEmoji(type: string): string {
  const pets: Record<string, string> = {
    dragon: '🐉',
    cat: '🐱',
    robot: '🤖',
    unicorn: '🦄',
    phoenix: '🔥',
  }
  return pets[type] || '🐣'
}

export function getPetStage(xp: number): { name: string; emoji: string } {
  if (xp < 100) return { name: 'Ovo', emoji: '🥚' }
  if (xp < 500) return { name: 'Filhote', emoji: '🐣' }
  if (xp < 1500) return { name: 'Adolescente', emoji: '🌟' }
  if (xp < 5000) return { name: 'Adulto', emoji: '👑' }
  return { name: 'Lendário', emoji: '💫' }
}

export function formatStreak(days: number): string {
  if (days === 0) return 'Sem streak'
  if (days === 1) return '1 dia 🔥'
  return `${days} dias 🔥`
}