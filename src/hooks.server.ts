import { redirect } from '@sveltejs/kit'
import { AUTH_COOKIE_NAME } from '$lib/cookies'
import { users, Client } from '@kittycad/lib'
import { SIGN_OUT_PARAM } from '$lib/paths'
const unProtectedRoutes = ['/']

export const handle = async ({ event, resolve }) => {
	const token = event.cookies.get(AUTH_COOKIE_NAME)
	if (!token && !unProtectedRoutes.includes(event.url.pathname)) {
		throw redirect(303, '/')
	} else if (!token) {
		return resolve(event)
	}

	// We need to tell the client to use the right base URL
	if (import.meta.env.MODE !== 'production') {
		// Set the env variable BASE_URL to import.meta.env.VITE_API_BASE_URL.
		// This will be used by the client to make requests to the API.
		process.env.BASE_URL = import.meta.env.VITE_API_BASE_URL + '/'
	}
	const client = new Client(token)
	const currentUser = await users.get_user_self({ client })

	if (currentUser) {
		event.locals.user = currentUser
	} else {
		if (!unProtectedRoutes.includes(event.url.pathname)) {
			throw redirect(303, '/')
		}

		event.locals.user = undefined
	}
	const query = event.url.searchParams.get(SIGN_OUT_PARAM)

	if (Boolean(query) == true) {
		event.cookies.delete(AUTH_COOKIE_NAME, { path: '/' })
		event.url.searchParams.delete(SIGN_OUT_PARAM)
		throw redirect(303, '/')
	}
	return resolve(event)
}
