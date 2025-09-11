import { DOMAIN, PLAYWRIGHT_MOCKING_HEADER } from '$lib/consts.js'
import { getCookieName } from '$lib/cookies.js'
import { hooksUserMocks, isUserMock } from '$lib/mocks.js'
import { SIGN_OUT_PARAM } from '$lib/paths.js'
import { redirect, type ServerLoadEvent } from '@sveltejs/kit'
import { env } from '$lib/env'
import { users, extra } from '@kittycad/lib'
import { createZooClient } from '$lib/zooClient'

export const load = async (args: ServerLoadEvent) => {
	const { cookies, request, url, fetch } = args

	if (url.searchParams.get(SIGN_OUT_PARAM)) {
		signOut()
	}

	const mockRequestHeader = request.headers.get(PLAYWRIGHT_MOCKING_HEADER)
	const token = env.PROD ? cookies.get(getCookieName()) : env.VITE_API_TOKEN

	if (!token) {
		signOut()
	}

	const client = createZooClient({ token, fetch })
	const currentUser = await users.get_user_self({ client }).catch((e) => {
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

		const billing = await extra.getBillingInfo(client)
		if (extra.BillingError.from(billing)) {
			console.error('Error fetching billing info:', billing.error)
			return {
				user: currentUser,
				token: token
			}
		}

		return {
			user: currentUser,
			token: token,
			credits: billing.credits,
			allowance: billing.allowance
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
