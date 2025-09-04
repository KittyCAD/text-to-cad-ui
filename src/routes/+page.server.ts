import { AUTH_COOKIE_NAME } from '$lib/cookies.js'
import { redirect, type ServerLoadEvent } from '@sveltejs/kit'
import { env } from '$lib/env'

export const load = async ({ cookies, url }: ServerLoadEvent) => {
	const token = env.PROD ? cookies.get(AUTH_COOKIE_NAME) : env.VITE_API_TOKEN

	if (token) {
		throw redirect(302, '/dashboard' + (url.search || ''))
	}
}
