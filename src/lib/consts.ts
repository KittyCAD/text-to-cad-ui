import { msSinceStartOfDay, msSinceStartOfMonth, msSinceAWeekAgo, msSinceStartOfYear } from './time'

export const PERSIST_KEY_VERSION = '2023-01-09'
export const PERSIST_KEY_GENERATIONS = 'TEXT_TO_CAD_GENERATIONS'
export const PERSIST_KEY_UNREAD = 'TEXT_TO_CAD_UNREAD'

export const PLAYWRIGHT_MOCKING_HEADER = 'x-playwright-mocking'

export const MODEL_POLLING_INTERVAL = 6000

export const EXAMPLE_PROMPTS = [
	'a 1/2 inch gear with 21 teeth',
	'a 9 pointed star',
	'a 3x6 lego',
	'21-tooth involute helical gear',
	'5-sided star',
	'a plate with 4 holes near each corner and rounded corners',
	'Make me a golf tee',
	'Design a mounting plate that is 12 inches wide and 6 inches tall. Put four holes in each corner for #10 fasteners and fillet each corner',
	'a brick: 8 in. long 4 in. deep 2 in. tall—with chamfered edges',
	'a coaster for a drink'
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
