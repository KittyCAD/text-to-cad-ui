import { expect, test } from '@playwright/test'

test('Redirects to the dashboard from home when logged-in', async ({ page }) => {
	// Go to the home page
	await page.goto('https://localhost:3000')

	// Assert that we are now on the dashboard
	await page.waitForURL('**/dashboard', { waitUntil: 'domcontentloaded' })
	await expect(page.locator('h1')).toHaveText('Text-to-CAD')
	await expect(page.locator('textarea')).toBeFocused()
})
