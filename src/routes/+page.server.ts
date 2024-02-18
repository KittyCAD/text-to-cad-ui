import { AUTH_COOKIE_NAME } from '$lib/cookies.js'
import { redirect } from '@sveltejs/kit'

export const load = async ({ cookies, url }) => {
	const token =
		import.meta.env.MODE === 'production'
			? cookies.get(AUTH_COOKIE_NAME)
			: import.meta.env.VITE_TOKEN

	if (token) {
		throw redirect(302, '/dashboard' + (url.search || ''))
	}
}
