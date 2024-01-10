import { msSinceStartOfDay, msSinceStartOfMonth, msSinceAWeekAgo, msSinceStartOfYear } from './time'

export const PERSIST_KEY_VERSION = '2023-01-09'
export const PERSIST_KEY_GENERATIONS = 'TEXT_TO_CAD_GENERATIONS'
export const PERSIST_KEY_UNREAD = 'TEXT_TO_CAD_UNREAD'

export const MODEL_POLLING_INTERVAL = 6000

export const EXAMPLE_PROMPTS = [
	'Draw me a 1/2 inch gear with 12 teeth',
	'a 9 pointed star',
	'a 3x6 lego',
	'21-tooth involute helical gear',
	'5-sided star',
	'a plate with 4 holes near each corner and rounded corners',
	'Make me a golf tee',
	'create a plate with 3 holes in it',
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
