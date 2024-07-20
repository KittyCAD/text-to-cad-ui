import { DOMAIN } from '$lib/consts.js'
import { AUTH_COOKIE_NAME } from '$lib/cookies.js'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, cookies }) => {
	// redirect user if not logged in
	if (!locals.user) {
		cookies.delete(AUTH_COOKIE_NAME, { domain: DOMAIN, path: '/' })
		throw redirect(302, '/')
	}
}
