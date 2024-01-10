import { mockHooksCall } from './testUtils'
import { test, expect } from '@playwright/test'

test('Shows banner if user is blocked for missing payment', async ({ context }) => {
	await mockHooksCall(context, 'mockUserMissingPayment')

	const page = await context.newPage()

	await page.goto('https://localhost:3000/dashboard')
	await page.waitForLoadState('domcontentloaded')

	const banner = page.getByText('payment method', { exact: false })
	const bannerLink = banner.getByRole('link')
	await expect(banner).toBeVisible()
	await expect(bannerLink).toBeVisible()
	await expect(bannerLink).toHaveAttribute('href', /\/account\/billing-information$/)
})

test('Shows banner if user is blocked for failed payment', async ({ context }) => {
	await mockHooksCall(context, 'mockUserFailedPayment')

	const page = await context.newPage()

	await page.goto('https://localhost:3000/dashboard')
	await page.waitForLoadState('domcontentloaded')

	const banner = page.getByText('payment method failed', { exact: false })
	const bannerLink = banner.getByRole('link')
	await expect(banner).toBeVisible()
	await expect(bannerLink).toHaveAttribute('href', /\/account\/billing-information$/)
})
