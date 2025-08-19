import { DOMAIN, PLAYWRIGHT_MOCKING_HEADER } from '$lib/consts.js'
import { AUTH_COOKIE_NAME } from '$lib/cookies.js'
import { hooksUserMocks, isUserMock } from '$lib/mocks.js'
import { SIGN_OUT_PARAM } from '$lib/paths.js'
import { redirect } from '@sveltejs/kit'
import { env } from '$lib/env'
import type { Models } from '@kittycad/lib/types'

// Stolen from modeling-app, need to see what we do with those
enum Tier {
	Free = 'free',
	Pro = 'pro',
	Organization = 'organization',
	Unknown = 'unknown'
}

type OrgOrError = Models['Org_type'] | number | Error
type SubscriptionsOrError = Models['ZooProductSubscriptions_type'] | number | Error
type TierBasedOn = {
	orgOrError: OrgOrError
	subscriptionsOrError: SubscriptionsOrError
}

type ExcludeErr<T> = Exclude<T, Error>
function isErr<T>(value: ExcludeErr<T> | Error): value is Error {
	return value instanceof Error
}

const toTierFrom = (args: TierBasedOn): Tier => {
	if (typeof args.orgOrError !== 'number' && !('error_code' in args.orgOrError)) {
		return Tier.Organization
	} else if (typeof args.subscriptionsOrError !== 'number' && !isErr(args.subscriptionsOrError)) {
		const subscriptions: Models['ZooProductSubscriptions_type'] = args.subscriptionsOrError
		if (subscriptions.modeling_app.name === 'pro') {
			return Tier.Pro
		} else {
			return Tier.Free
		}
	}

	return Tier.Unknown
}

export const load = async ({ cookies, request, url, fetch }) => {
	if (url.searchParams.get(SIGN_OUT_PARAM)) {
		signOut()
	}

	const mockRequestHeader = request.headers.get(PLAYWRIGHT_MOCKING_HEADER)
	const token = env.PROD ? cookies.get(AUTH_COOKIE_NAME) : env.VITE_API_TOKEN

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

		const billingOrError: Models['CustomerBalance_type'] | number | Error = await fetch(
			`${env.VITE_API_BASE_URL}/user/payment/balance`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			}
		)
			.then((res) => res.json())
			.catch((e) => {
				console.error('Error fetching balance:', e)
			})

		if (typeof billingOrError === 'number' || isErr(billingOrError)) {
			return Promise.reject(billingOrError)
		}
		console.log('billing', billingOrError)
		const billing: Models['CustomerBalance_type'] = billingOrError

		const subscriptionsOrError: Models['ZooProductSubscriptions_type'] | number | Error =
			await fetch(`${env.VITE_API_BASE_URL}/user/payment/subscriptions`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			})
				.then((res) => res.json())
				.catch((e) => {
					console.error('Error fetching subscriptions:', e)
				})

		if (typeof subscriptionsOrError === 'number' || isErr(subscriptionsOrError)) {
			return Promise.reject(subscriptionsOrError)
		}

		const orgOrError: Models['Org_type'] | number | Error = await fetch(
			`${env.VITE_API_BASE_URL}/org`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			}
		)
			.then((res) => res.json())
			.catch((e) => {
				console.error('Error fetching org:', e)
			})

		console.log('orgOrError', orgOrError)

		const tier = toTierFrom({
			orgOrError,
			subscriptionsOrError
		})

		let credits =
			Number(billing.monthly_api_credits_remaining) + Number(billing.stable_api_credits_remaining)
		let allowance = undefined

		switch (tier) {
			case Tier.Organization:
			case Tier.Pro:
				credits = Infinity
				break
			case Tier.Free:
				// TS too dumb Tier.Free has the same logic
				if (typeof subscriptionsOrError !== 'number' && !isErr(subscriptionsOrError)) {
					allowance = Number(subscriptionsOrError.modeling_app.monthly_pay_as_you_go_api_credits)
				}
				break
			case Tier.Unknown:
				break
			default:
				const _exh: never = tier
		}

		console.log('billing data', {
			tier,
			credits,
			allowance
		})

		// Return the user and token
		return {
			user: currentUser,
			token: token,
			tier,
			credits,
			allowance
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
