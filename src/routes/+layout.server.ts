import { getCookieName } from '$lib/cookies.js'
import { env } from '$lib/env'

/** @type {import('./$types').LayoutData} */
export const load = async ({ locals, cookies }) => {
	const token = env.MODE === 'production' ? cookies.get(getCookieName()) : env.VITE_API_TOKEN

	return {
		user: !locals.user || 'error_code' in locals.user ? undefined : locals.user,
		token
	}
}
