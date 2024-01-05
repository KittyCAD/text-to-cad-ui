import {
	msSinceStartOfDay,
	msSinceStartOfMonth,
	msSinceStartOfWeek,
	msSinceStartOfYear
} from './time'

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

export const TIME_BUCKETS = [
	{
		name: 'Today',
		test: (then: Date, now: Date) => now.getTime() - then.getTime() < msSinceStartOfDay(now)
	},
	{
		name: 'This Week',
		test: (then: Date, now: Date) => now.getTime() - then.getTime() < msSinceStartOfWeek(now)
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
