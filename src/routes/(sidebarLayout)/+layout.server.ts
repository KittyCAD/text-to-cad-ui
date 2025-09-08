import { DOMAIN, PLAYWRIGHT_MOCKING_HEADER } from '$lib/consts.js'
import { AUTH_COOKIE_NAME } from '$lib/cookies.js'
import { hooksUserMocks, isUserMock } from '$lib/mocks.js'
import { SIGN_OUT_PARAM } from '$lib/paths.js'
import { redirect } from '@sveltejs/kit'
import { env } from '$lib/env'
import { getBillingInfo, isErr } from '$lib/billing'
import { users } from '@kittycad/lib'
import { createZooClient } from '$lib/zooClient'

export const load = async ({ cookies, request, url, fetch }) => {
	if (url.searchParams.get(SIGN_OUT_PARAM)) {
		signOut()
	}

	const mockRequestHeader = request.headers.get(PLAYWRIGHT_MOCKING_HEADER)
	const token = env.PROD ? cookies.get(AUTH_COOKIE_NAME) : env.VITE_API_TOKEN

	if (!token) {
		signOut()
	}

	const currentUser = await users
		.get_user_self({ client: createZooClient({ token, fetch }) })
		.catch((e) => {
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

		const billing = await getBillingInfo(token)
		if (isErr(billing)) {
			console.error('Error fetching billing info:', billing)
			return {
				user: currentUser,
				token: token
			}
		}

		return {
			user: currentUser,
			token: token,
			tier: billing.tier,
			credits: billing.credits,
			allowance: billing.allowance
		}
	}

	/**
	 * Shared sign out function
	 */
	function signOut() {
		cookies.delete(AUTH_COOKIE_NAME, { domain: DOMAIN, path: '/' })
		throw redirect(303, '/')
	}
}
