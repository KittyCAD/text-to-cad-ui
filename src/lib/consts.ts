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
	'A plate with 4 holes near each corner and rounded corners',
	'A mounting plate that is 12 inches wide and 6 inches tall. Put four holes in each corner for #10 fasteners and fillet each corner.',
	'A brick: 8 in. long 4 in. deep 2 in. tall—with chamfered edges',
	'Prosthetic hip',
	'Two gears to reduce rotation speed to half',
	'Wing spar section',
	'A shepherd\'s hook bolt',
	'Bone plate',
	'Cold plate',
	'PDU faceplate',
	'I-beam, 12 in long, 4 in high, 2.66 x 0.29 in flange, 0.19 in web, 0.46 in root radius',
	'Surgical drill guide, 150 mm handle, Ø2 & Ø3.2 mm bits, twin bit mounts with rotating grips',
	'A bone plate for a human femur, 8 holes, 4.5 mm screws',
	'Gallows frame, 2400x1250x450 mm, 6 brackets, angle iron',
	'A 320mm vented brake disc with 5 M12 holes on 114.3mm PCD',
	'Aircraft telemetry antenna, diameter 3 in, 6 CSK holes',
	'Angled three-finger gripper end-effector, 120 mm tall',
	'EV battery cooling plate, 400x200x10 mm, corner mounts',
	'Design a propellant line assembly with four mounting holes and one hole in the center of the bracket for a p-clamp. The p-clamp diameter should be 1.5 inches.'
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
