import { ITEMS_PER_PAGE, PAGES_AHEAD_TO_FETCH } from '../src/lib/consts'
import { expect, test } from '@playwright/test'

test('Redirects to the dashboard from home when logged-in', async ({ page }) => {
	// Go to the home page
	await page.goto('https://localhost:3000')

	// Assert that we are now on the dashboard
	await page.waitForURL('**/dashboard', { waitUntil: 'domcontentloaded' })
	await expect(page.locator('h1')).toHaveText('Text-to-CAD')
	await expect(page.locator('textarea')).toBeFocused()
})

test('Prompt input is visible and usable on mobile', async ({ page }) => {
	// Set the viewport to a mobile size
	await page.setViewportSize({ width: 375, height: 667 })

	// Go to the home page
	await page.goto('https://localhost:3000')

	// Assert that we are now on the dashboard
	await page.waitForURL('**/dashboard', { waitUntil: 'domcontentloaded' })

	// Assert that the prompt input is visible and focused
	await expect(page.locator('textarea')).toBeInViewport()
	await expect(page.locator('textarea')).toBeFocused()
})

test('Sidebar only loads 5 pages of results initially', async ({ page }) => {
	// Go to the home page
	await page.goto('https://localhost:3000')

	// Assert that we are now on the dashboard
	await page.waitForURL('**/dashboard', { waitUntil: 'networkidle' })

	// Assert that only 5 pages of results are loaded initially
	await expect(page.getByTestId('generation-list').getByRole('link')).toHaveCount(
		PAGES_AHEAD_TO_FETCH * ITEMS_PER_PAGE
	)
})
