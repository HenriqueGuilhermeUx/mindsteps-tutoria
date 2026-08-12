const truthy = new Set(['1', 'true', 'yes', 'on'])

function envFlag(name: string, fallback = false) {
  const value = (import.meta.env as Record<string, string | undefined>)[name]
  if (value == null || value === '') return fallback
  return truthy.has(value.toLowerCase())
}

/**
 * ENEM/V2 release gate.
 *
 * Public release is now enabled by default. The environment variable remains
 * available as an emergency kill switch: set VITE_ENEM_V2_ENABLED=false and
 * redeploy/build to hide the module without reverting code.
 */
export const features = {
  enemV2: envFlag('VITE_ENEM_V2_ENABLED', true),
} as const
