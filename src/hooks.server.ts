import { redirect } from '@sveltejs/kit'
import { AUTH_COOKIE_NAME } from '$lib/cookies'
import { SIGN_OUT_PARAM } from '$lib/paths'
import { DOMAIN, PLAYWRIGHT_MOCKING_HEADER } from '$lib/consts'
import { hooksUserMocks, isUserMock } from '$lib/mocks'

export const handle = async ({ event, resolve }) => {
	const mock = event.request.headers.get(PLAYWRIGHT_MOCKING_HEADER)
	const token = import.meta.env.PROD
		? event.request.headers.get(AUTH_COOKIE_NAME)
		: import.meta.env.VITE_TOKEN

	if (!token) {
		return resolve(event)
	} else {
		event.locals.token = token
	}

	const currentUser = await event
		.fetch(import.meta.env.VITE_API_BASE_URL + '/user', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		})
		.then((res) => res.json())
		.catch((e) => {
			// If the user had a token but there was an error fetching the user,
			//delete the token, because it was likely revoked or expired
			console.error('Error fetching user:', e)
			signOut()
		})

	if (!currentUser) {
		event.locals.user = undefined
	} else {
		if ('error_code' in currentUser) {
			console.error('Error fetching user:', currentUser.error_code)
			signOut()
		}

		event.locals.user = currentUser
		if (mock !== null) {
			const userMock = isUserMock(mock)
			event.locals.user = userMock ? hooksUserMocks[userMock](currentUser) : currentUser
		}
	}

	const query = event.url.searchParams.get(SIGN_OUT_PARAM)

	if (Boolean(query) == true) {
		signOut()
	}
	return resolve(event)

	/**
	 * Shared sign out function
	 */
	function signOut() {
		event.cookies.delete(AUTH_COOKIE_NAME, { domain: DOMAIN, path: '/' })
		event.url.searchParams.delete(SIGN_OUT_PARAM)
		throw redirect(303, '/')
	}
}
