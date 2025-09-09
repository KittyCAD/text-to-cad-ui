import { getCookieName } from '$lib/cookies.js'
import { redirect } from '@sveltejs/kit'
import { env } from '$lib/env'

export const load = async ({ cookies, url }) => {
	const token = env.PROD ? cookies.get(getCookieName()) : env.VITE_API_TOKEN

	if (token) {
		throw redirect(302, '/dashboard' + (url.search || ''))
	}
}
