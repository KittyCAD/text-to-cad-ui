import { AUTH_COOKIE_NAME } from '$lib/cookies.js'
import { redirect } from '@sveltejs/kit'
import { env } from '$lib/env'

export const load = async ({ cookies, url }) => {
  const token = env.PROD ? cookies.get(AUTH_COOKIE_NAME) : env.VITE_TOKEN

  if (token) {
    throw redirect(302, '/dashboard' + (url.search || ''))
  }
}
