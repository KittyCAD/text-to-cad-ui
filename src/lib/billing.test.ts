import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { Models } from '@kittycad/lib/types'
import { getBillingInfo, isErr } from './billing'

// Setup basic request mocking
const server = setupServer()
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
const token = 'does not matter'

// Data ripped from docs.zoo.dev
const createUserPaymentBalanceResponse = (opts: {
	monthlyApiCreditsRemaining: number
	stableApiCreditsRemaining: number
}): Models['CustomerBalance_type'] => ({
	created_at: '2025-05-05T16:05:47.317Z',
	id: 'de607b7e-90ba-4977-8561-16e8a9ea0e50',
	map_id: 'd7f7de34-9bc3-4b8b-9951-cdee03fc792d',
	modeling_app_enterprise_price: {
		type: 'enterprise'
	},
	monthly_api_credits_remaining: opts.monthlyApiCreditsRemaining,
	monthly_api_credits_remaining_monetary_value: 22.47,
	stable_api_credits_remaining: opts.stableApiCreditsRemaining,
	stable_api_credits_remaining_monetary_value: 18.91,
	subscription_details: undefined,
	subscription_id: 'Hnd3jalJkHA3lb1YexOTStZtPYHTM',
	total_due: 100.08,
	updated_at: '2025-05-05T16:05:47.317Z'
})

const createOrgResponse = (): Models['Org_type'] => ({
	allow_users_in_domain_to_auto_join: true,
	billing_email: 'm@dN9MCH.com',
	billing_email_verified: '2025-05-05T18:52:02.021Z',
	block: 'payment_method_failed',
	can_train_on_data: true,
	created_at: '2025-05-05T18:52:02.021Z',
	domain: 'Ctxde1hpG8xTvvlef5SEPm7',
	id: '78432284-8660-46bf-ac65-d00bf9b18c3e',
	image: 'NOT_A_REAL_IMAGE',
	name: 'AevRR4w42KdkA487dh',
	phone: '+1-696-641-2790',
	stripe_id: 'sCfjVscpLyOBYUWO7Vlx',
	updated_at: '2025-05-05T18:52:02.021Z'
})

const createUserPaymentSubscriptionsResponse = (opts: {
	monthlyPayAsYouGoApiCreditsTotal: number
	name: Models['ModelingAppSubscriptionTierName_type']
}): Models['ZooProductSubscriptions_type'] => ({
	modeling_app: {
		annual_discount: 10,
		description: '1ztERftrU3L3yOnv5epTLcM',
		endpoints_included: ['modeling'],
		features: [
			{
				info: 'zZcZKHejXabT5HMZDkSkDGD2bfzkAt'
			}
		],
		monthly_pay_as_you_go_api_credits: opts.monthlyPayAsYouGoApiCreditsTotal,
		monthly_pay_as_you_go_api_credits_monetary_value: 55.85,
		name: opts.name,
		pay_as_you_go_api_credit_price: 18.49,
		price: {
			interval: 'year',
			price: 50.04,
			type: 'per_user'
		},
		share_links: ['password_protected'],
		support_tier: 'community',
		training_data_behavior: 'default_on',
		type: {
			saml_sso: true,
			type: 'organization'
		},
		zoo_tools_included: ['text_to_cad']
	}
})

test('Handles error fetching billing on balance', async () => {
	server.use(
		http.get('*/user/payment/balance', () => {
			return new HttpResponse(403)
		})
	)

	const billing = await getBillingInfo('does not matter')
	console.log('billing', billing)
	expect(billing).toBeInstanceOf(Error)
})

test('Handles error fetching billing on subscriptions', async () => {
	const data = {
		balance: {
			monthlyApiCreditsRemaining: 1,
			stableApiCreditsRemaining: 2
		}
	}

	server.use(
		http.get('*/user/payment/balance', () => {
			return HttpResponse.json(createUserPaymentBalanceResponse(data.balance))
		}),
		http.get('*/user/payment/subscriptions', () => {
			return new HttpResponse(403)
		})
	)

	const billing = await getBillingInfo('does not matter')
	console.log('billing', billing)
	expect(billing).toBeInstanceOf(Error)
})

test('Finds the credits of Free subscription', async () => {
	const data = {
		balance: {
			monthlyApiCreditsRemaining: 10,
			stableApiCreditsRemaining: 0
		},
		subscriptions: {
			monthlyPayAsYouGoApiCreditsTotal: 20,
			name: 'free' as Models['ModelingAppSubscriptionTierName_type']
		}
	}

	server.use(
		http.get('*/user/payment/balance', () => {
			return HttpResponse.json(createUserPaymentBalanceResponse(data.balance))
		}),
		http.get('*/user/payment/subscriptions', () => {
			return HttpResponse.json(createUserPaymentSubscriptionsResponse(data.subscriptions))
		}),
		http.get('*/org', () => {
			return new HttpResponse(403)
		})
	)

	const billing = await getBillingInfo(token)
	if (isErr(billing)) throw billing
	const totalCredits =
		data.balance.monthlyApiCreditsRemaining + data.balance.stableApiCreditsRemaining
	const monthlyCredits = data.subscriptions.monthlyPayAsYouGoApiCreditsTotal
	await expect(billing.credits).toBe(totalCredits)
	await expect(billing.allowance).toBe(monthlyCredits)
})

test('Finds infinite credits for Pro subscription', async () => {
	const data = {
		// These are all ignored
		balance: {
			monthlyApiCreditsRemaining: 10,
			stableApiCreditsRemaining: 0
		},
		subscriptions: {
			// This should be ignored because it's Pro tier.
			monthlyPayAsYouGoApiCreditsTotal: 20,
			name: 'pro' as Models['ModelingAppSubscriptionTierName_type']
		}
	}

	server.use(
		http.get('*/user/payment/balance', () => {
			return HttpResponse.json(createUserPaymentBalanceResponse(data.balance))
		}),
		http.get('*/user/payment/subscriptions', () => {
			return HttpResponse.json(createUserPaymentSubscriptionsResponse(data.subscriptions))
		}),
		http.get('*/org', () => {
			return new HttpResponse(403)
		})
	)

	const billing = await getBillingInfo(token)
	if (isErr(billing)) throw billing
	expect(billing.credits).toBe(Infinity)
	expect(billing.allowance).toBeUndefined()
})

test('Finds infinite credits for Enterprise subscription', async () => {
	const data = {
		// These are all ignored, user is part of an org.
		balance: {
			monthlyApiCreditsRemaining: 10,
			stableApiCreditsRemaining: 0
		},
		subscriptions: {
			// This should be ignored because it's Pro tier.
			monthlyPayAsYouGoApiCreditsTotal: 20,
			// This should be ignored because the user is part of an Org.
			name: 'free' as Models['ModelingAppSubscriptionTierName_type']
		}
	}

	server.use(
		http.get('*/user/payment/balance', () => {
			return HttpResponse.json(createUserPaymentBalanceResponse(data.balance))
		}),
		http.get('*/user/payment/subscriptions', () => {
			return HttpResponse.json(createUserPaymentSubscriptionsResponse(data.subscriptions))
		}),
		// Ok finally the first use of an org lol
		http.get('*/org', () => {
			return HttpResponse.json(createOrgResponse())
		})
	)

	const billing = await getBillingInfo(token)
	if (isErr(billing)) throw billing
	expect(billing.credits).toBe(Infinity)
	expect(billing.allowance).toBeUndefined()
})
