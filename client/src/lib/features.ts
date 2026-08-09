const truthy = new Set(['1', 'true', 'yes', 'on'])

function envFlag(name: string, fallback = false) {
  const value = (import.meta.env as Record<string, string | undefined>)[name]
  if (value == null || value === '') return fallback
  return truthy.has(value.toLowerCase())
}

/**
 * ENEM/V2 launch gate.
 *
 * IMPORTANT: keep disabled in production until the first Google Play release
 * has been approved and is publicly available. Once approved:
 * - Web/Netlify: set VITE_ENEM_V2_ENABLED=true and redeploy.
 * - Android: build the next release with VITE_ENEM_V2_ENABLED=true.
 *
 * Default is intentionally false so accidental deploys/builds do not expose
 * unreleased features.
 */
export const features = {
  enemV2: envFlag('VITE_ENEM_V2_ENABLED', false),
} as const
