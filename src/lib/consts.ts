import { msSinceStartOfDay, msSinceStartOfMonth, msSinceAWeekAgo, msSinceStartOfYear } from './time'

export const PERSIST_KEY_VERSION = '2024-06-21'
export const PERSIST_KEY_GENERATIONS = 'TEXT_TO_CAD_GENERATIONS'
export const PERSIST_KEY_UNREAD = 'TEXT_TO_CAD_UNREAD'
export const DOMAIN = import.meta.env.DEV ? 'localhost' : '.zoo.dev'

export const PLAYWRIGHT_MOCKING_HEADER = 'x-playwright-mocking'

export const MODEL_POLLING_INTERVAL = 6000

export const EXAMPLE_PROMPTS = [
	'A dodecahedron',
	'A camshaft',
	'A 1/2 inch gear with 21 teeth',
	'A 3x6 lego',
	'A 21-tooth involute helical gear',
	'A 5-pointed star',
	'A plate with 4 holes near each corner and rounded corners',
	'A mounting plate that is 12 inches wide and 6 inches tall. Put four holes in each corner for #10 fasteners and fillet each corner.',
	'A brick: 8 in. long 4 in. deep 2 in. tall—with chamfered edges',
	'A coaster for a drink',
	'Two gears to reduce rotation speed to half'
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
