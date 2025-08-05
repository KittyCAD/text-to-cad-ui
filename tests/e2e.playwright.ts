import { ITEMS_PER_PAGE, PAGES_AHEAD_TO_FETCH } from '../src/lib/consts'
import { expect, test } from '@playwright/test'

test('User can generate from prompt and open in Zoo Design Studio', async ({ page }) => {
	test.setTimeout(120_000)
	// Go to the home page
	await page.goto('http://localhost:3000')

	// locators and constants
	const prompt = `A shepherd's hook bolt`
	const promptInput = page.locator('textarea')
	const submitButton = page.locator('button[type="submit"]')
	const downloadLink = page.getByRole('link', { name: 'download' })
	const openInDesignStudioLink = page.getByRole('link', { name: 'open in zoo design studio' })

	await test.step('Setup', async () => {
		// Assert that we are now on the dashboard
		await page.waitForURL('**/dashboard', { waitUntil: 'networkidle' })
		await expect(page.locator('h1')).toContainText('Text-to-CAD')
		await expect(promptInput).toBeFocused()
	})

	await test.step('Submit prompt and view successful generation', async () => {
		await promptInput.fill(prompt)
		await submitButton.click()

		await page.waitForURL('**/view/*')
		await expect(page.getByRole('heading', { name: prompt })).toBeVisible()

		// Sometimes generation can take a while
		await expect(downloadLink).toBeEnabled({ timeout: 90_000 })
	})

	await test.step('Open the result in Zoo Design Studio temporary workspace', async () => {
		const newTabPromise = page.waitForEvent('popup')
		await openInDesignStudioLink.click()
		const newTab = await newTabPromise
		await newTab.waitForURL('https://app.zoo.dev/?ask-open-desktop=true&create-file=true*')
		await newTab.getByRole('button', { name: 'continue to web' }).click()
	})
})

test('Prompt input is visible and usable on mobile', async ({ page }) => {
	// Set the viewport to a mobile size
	await page.setViewportSize({ width: 375, height: 667 })

	// Go to the home page
	await page.goto('http://localhost:3000')

	// Assert that we are now on the dashboard
	await page.waitForURL('**/dashboard', { waitUntil: 'domcontentloaded' })

	// Assert that the prompt input is visible and focused
	await expect(page.locator('textarea')).toBeInViewport()
	await expect(page.locator('textarea')).toBeFocused()
})

test('Sidebar only loads set number of pages of results initially', async ({ page }) => {
	// Go to the home page
	await page.goto('http://localhost:3000')

	// Assert that we are now on the dashboard
	await page.waitForURL('**/dashboard', { waitUntil: 'networkidle' })

	// Assert that only 5 pages of results are loaded initially
	await expect(page.getByTestId('generation-list').getByRole('link')).toHaveCount(
		PAGES_AHEAD_TO_FETCH * ITEMS_PER_PAGE
	)
})
