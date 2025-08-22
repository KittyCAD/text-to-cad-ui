import { DOMAIN, PLAYWRIGHT_MOCKING_HEADER } from '$lib/consts.js'
import { getCookieName } from '$lib/cookies.js'
import { hooksUserMocks, isUserMock } from '$lib/mocks.js'
import { SIGN_OUT_PARAM } from '$lib/paths.js'
import { redirect } from '@sveltejs/kit'
import { env } from '$lib/env'

export const load = async ({ cookies, request, url, fetch }) => {
	if (url.searchParams.get(SIGN_OUT_PARAM)) {
		signOut()
	}

	const mockRequestHeader = request.headers.get(PLAYWRIGHT_MOCKING_HEADER)
	const token = env.PROD ? cookies.get(getCookieName()) : env.VITE_API_TOKEN

	if (!token) {
		signOut()
	}

	const currentUser = await fetch(env.VITE_API_BASE_URL + '/user', {
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
		signOut()
	} else {
		if ('error_code' in currentUser) {
			console.error('Error fetching user:', currentUser.error_code)
			signOut()
		} else if (mockRequestHeader !== null) {
			const userMock = isUserMock(mockRequestHeader)
			return {
				user: userMock ? hooksUserMocks[userMock](currentUser) : currentUser,
				token
			}
		}

		// Return the user and token
		return {
			user: currentUser,
			token: token
		}
	}

	/**
	 * Shared sign out function
	 */
	function signOut() {
		cookies.delete(getCookieName(), { domain: DOMAIN, path: '/' })
		throw redirect(303, '/')
	}
}
