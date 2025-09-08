import type { CustomerBalance, UserOrgInfo, ZooProductSubscriptions } from '@kittycad/lib'
import { payments, orgs } from '@kittycad/lib'
import { createZooClient } from '$lib/zooClient'

// Stolen from modeling-app, need to see what we do with those
enum Tier {
	Free = 'free',
	Pro = 'pro',
	Organization = 'organization',
	Unknown = 'unknown'
}

type OrgOrError = UserOrgInfo | Error
type SubscriptionsOrError = ZooProductSubscriptions | number | Error
type TierBasedOn = {
	orgOrError: OrgOrError
	subscriptionsOrError: SubscriptionsOrError
}

type ExcludeErr<T> = Exclude<T, Error>
export function isErr<T>(value: ExcludeErr<T> | Error): value is Error {
	return value instanceof Error
}

const toTierFrom = (args: TierBasedOn): Tier => {
	if (typeof args.orgOrError !== 'number' && !isErr(args.orgOrError)) {
		return Tier.Organization
	} else if (typeof args.subscriptionsOrError !== 'number' && !isErr(args.subscriptionsOrError)) {
		const subscriptions: ZooProductSubscriptions = args.subscriptionsOrError
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
	const client = createZooClient({ token })
	const billingOrError: CustomerBalance | Error = await payments
		.get_payment_balance_for_user({ client, include_total_due: false })
		.catch((e) => {
			console.error('Error fetching balance:', e)
			return e as Error
		})

	if (typeof billingOrError === 'number') {
		return new Error('Received error code: ' + billingOrError)
	}

	if (isErr(billingOrError)) {
		return billingOrError
	}

	const billing: CustomerBalance = billingOrError

	const subscriptionsOrError: ZooProductSubscriptions | Error = await payments
		.get_user_subscription({ client })
		.catch((e) => {
			console.error('Error fetching subscriptions:', e)
			return e as Error
		})

	if (typeof subscriptionsOrError === 'number') {
		return new Error('Received error code: ' + subscriptionsOrError)
	}

	if (isErr(subscriptionsOrError)) {
		return subscriptionsOrError
	}

	const orgOrError: UserOrgInfo | Error = await orgs.get_user_org({ client }).catch((e) => {
		console.error('Error fetching org:', e)
		return e as Error
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
			if (!isErr(subscriptionsOrError)) {
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
