import { msSinceStartOfDay, msSinceStartOfMonth, msSinceAWeekAgo, msSinceStartOfYear } from './time'

export const PERSIST_KEY_VERSION = '2024-06-21'
export const PERSIST_KEY_GENERATIONS = 'TEXT_TO_CAD_GENERATIONS'
export const PERSIST_KEY_UNREAD = 'TEXT_TO_CAD_UNREAD'
export const DOMAIN = import.meta.env.DEV ? 'localhost' : '.zoo.dev'

export const PLAYWRIGHT_MOCKING_HEADER = 'x-playwright-mocking'

export const MODEL_POLLING_INTERVAL = 6000

export const EXAMPLE_PROMPTS = [
	'M8 flat washer, 2mm thickness',
	'4x4 lego',
	'A 1 inch tall helical gear with 10 teeth and a diameter of 3 inches',
	'A ring gear for a planetary gear train: 20 dp, 64 teeth, 3.4" outer diameter',
] as const

export const EXAMPLES_TO_SHOW = 4

export const TIME_BUCKETS = [
	{
		name: 'Today',
		test: (then: Date, now: Date) => now.getTime() - then.getTime() < msSinceStartOfDay(now)
	},
	{
		name: 'Past 7 Days',
		test: (then: Date, now: Date) => now.getTime() - then.getTime() < msSinceAWeekAgo(now)
	},
	{
		name: 'This Month',
		test: (then: Date, now: Date) => now.getTime() - then.getTime() < msSinceStartOfMonth(now)
	},
	{
		name: 'This Year',
		test: (then: Date, now: Date) => now.getTime() - then.getTime() < msSinceStartOfYear(now)
	}
] as const

/**
 * The number of pages to fetch ahead of the current page
 */
export const PAGES_AHEAD_TO_FETCH = 5
/**
 * The number of items to fetch per request
 */
export const ITEMS_PER_PAGE = 5
