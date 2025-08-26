import type { Models } from '@kittycad/lib/types'
import { env } from '$lib/env'

/**
 * Stolen from https://github.com/KittyCAD/modeling-app/blob/49d40f28b703505743f90948a38ede929d4f28e0/src/lib/trap.ts
 */
type ExcludeErr<T> = Exclude<T, Error>
export function isErr<T>(value: ExcludeErr<T> | Error): value is Error {
	return value instanceof Error
}

/**
 * Adapted from https://github.com/KittyCAD/modeling-app/blob/49d40f28b703505743f90948a38ede929d4f28e0/src/lib/crossPlatformFetch.ts
 */

const headers = (token?: string): HeadersInit => ({
	'Content-Type': 'application/json',
	...(token ? { Authorization: `Bearer ${token}` } : {})
})

async function fetchOrError<T>(
	url: string,
	options?: RequestInit,
	token?: string
): Promise<T | Error> {
	let response = null
	const opts = options || {}
	opts.headers = headers(token)
	opts.credentials = 'include'
	response = await fetch(url, opts)

	if (!response) {
		return new Error('Failed to request endpoint: ' + url)
	}

	const data = (await response.json().catch((e) => e)) as T | Error

	if (!response.ok) {
		console.error(`Failed to request endpoint: ${url}`, JSON.stringify(response), data)
		const fallbackErrorMessage = `Failed to request endpoint: ${url} with status: ${response.status} ${response.statusText}`
		const resolvedMessage =
			data instanceof Object && 'message' in data ? data.message : fallbackErrorMessage
		return new Error(resolvedMessage)
	}

	if (typeof data === 'number') {
		return new Error('Unexpected number response: ' + data)
	}

	return data
}

/**
 * Adapted from https://github.com/KittyCAD/modeling-app/blob/49d40f28b703505743f90948a38ede929d4f28e0/src/machines/billingMachine.ts#L91
 */
export async function getBillingInfo(
	token: string
): Promise<Error | { credits: number; allowance?: number }> {
	const billing = await fetchOrError<Models['CustomerBalance_type']>(
		`${env.VITE_API_BASE_URL}/user/payment/balance`,
		{ method: 'GET' },
		token
	)

	if (isErr(billing)) {
		return billing
	}

	const subscriptions = await fetchOrError<Models['ZooProductSubscriptions_type']>(
		`${env.VITE_API_BASE_URL}/user/payment/subscriptions`,
		{ method: 'GET' },
		token
	)

	if (isErr(subscriptions)) {
		return subscriptions
	}

	const org = await fetchOrError<Models['Org_type']>(
		`${env.VITE_API_BASE_URL}/org`,
		{ method: 'GET' },
		token
	)

	const isOrgOrPro = (!isErr(org) && org.id) || subscriptions.modeling_app.name === 'pro'
	if (isOrgOrPro) {
		return { credits: Infinity }
	}

	const allowance = Number(subscriptions.modeling_app.monthly_pay_as_you_go_api_credits)
	const credits =
		Number(billing.monthly_api_credits_remaining) + Number(billing.stable_api_credits_remaining)
	return {
		credits,
		allowance
	}
}
