import type { Models } from '@kittycad/lib/types'
import { env } from '$lib/env'

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
export function isErr<T>(value: ExcludeErr<T> | Error): value is Error {
	return value instanceof Error
}

const toTierFrom = (args: TierBasedOn): Tier => {
	if (typeof args.orgOrError !== 'number' && !('error_code' in args.orgOrError)) {
		return Tier.Organization
	} else if (typeof args.subscriptionsOrError !== 'number' && !isErr(args.subscriptionsOrError)) {
		const subscriptions: Models['ZooProductSubscriptions_type'] = args.subscriptionsOrError
		if (subscriptions?.modeling_app?.name === 'pro') {
			return Tier.Pro
		} else {
			return Tier.Free
		}
	}

	return Tier.Unknown
}

/**
 * Copied logic from https://github.com/KittyCAD/modeling-app/blob/49d40f28b703505743f90948a38ede929d4f28e0/src/machines/billingMachine.ts#L91
 */
export async function getBillingInfo(token: string) {
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

	if (typeof billingOrError === 'number') {
		return new Error('Received error code: ' + billingOrError)
	}

	if (isErr(billingOrError)) {
		return billingOrError
	}

	const billing: Models['CustomerBalance_type'] = billingOrError

	const subscriptionsOrError: Models['ZooProductSubscriptions_type'] | number | Error = await fetch(
		`${env.VITE_API_BASE_URL}/user/payment/subscriptions`,
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
			console.error('Error fetching subscriptions:', e)
		})

	if (typeof subscriptionsOrError === 'number') {
		return new Error('Received error code: ' + subscriptionsOrError)
	}

	if (isErr(subscriptionsOrError)) {
		return subscriptionsOrError
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
				allowance = Number(subscriptionsOrError?.modeling_app?.monthly_pay_as_you_go_api_credits)
			}
			break
		case Tier.Unknown:
			break
	}

	return {
		tier,
		credits,
		allowance
	}
}
