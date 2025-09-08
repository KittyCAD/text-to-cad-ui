import { ApiError } from '@kittycad/lib'

export function getApiErrorMessage(err: unknown, fallback = 'Request failed'): string {
  if (err instanceof ApiError) {
    const bodyMsg = typeof err.body?.message === 'string' ? err.body?.message : undefined
    return bodyMsg || err.message || fallback
  }
  if (err instanceof Error) return err.message || fallback
  return fallback
}

