import { AUTH_COOKIE_NAME } from '$lib/cookies.js'

/** @type {import('./$types').LayoutData} */
export const load = async ({ locals, cookies }) => {
	const token =
		import.meta.env.MODE === 'production'
			? cookies.get(AUTH_COOKIE_NAME)
			: import.meta.env.VITE_ZOO_DEV_TOKEN

	return {
		user: !locals.user || 'error_code' in locals.user ? undefined : locals.user,
		token
	}
}
