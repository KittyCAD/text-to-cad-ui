import { msSinceStartOfDay, msSinceStartOfMonth, msSinceAWeekAgo, msSinceStartOfYear } from './time'

export const PERSIST_KEY_VERSION = '2024-06-21'
export const PERSIST_KEY_GENERATIONS = 'TEXT_TO_CAD_GENERATIONS'
export const PERSIST_KEY_UNREAD = 'TEXT_TO_CAD_UNREAD'
export const DOMAIN = (import.meta.env || process.env).DEV ? 'localhost' : '.zoo.dev'

export const PLAYWRIGHT_MOCKING_HEADER = 'x-playwright-mocking'

export const MODEL_POLLING_INTERVAL = 6000

export const EXAMPLE_PROMPTS = [
  'A 320mm vented brake rotor with 5 M12 holes on 114.3mm PCD',
  'Gallows frame, 2400x1250x450 mm, 6 brackets, angle iron',
  'A bone plate for a human femur, 8 holes, 4.5 mm screws',
  'Wing spar section',
  'Sash window, 500mm wide, 1000mm high, frame 30x50, 1 vertical bar, color: brown',
  'A 12 foot long I-beam with a depth of 10.17", a flange width of 5.750", flange thickness of 0.360", web thickness of 0.240", and fillet radius of 0.3',
  "A shepherd's hook bolt",
  'A car wheel',
  'A claw hammer',
  'Surgical drill guide, 150 mm handle, Ø2 & Ø3.2 mm bits, twin bit mounts with rotating grips',
  'Tooling nest block, 50 mm steel cube with 20 hemispherical indentations in various sizes',
  'I-beam, 12 in long, 4 in high, 2.66 x 0.29 in flange, 0.19 in web, 0.46 in root radius',
  '17-floor twisted tower, 30 m wide, 5 m floor height',
  'Cold plate',
  'Prosthetic hip'
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

/**
 * The App's name
 */
export const APP_NAME = 'Text-to-CAD Generator'
export const CORP_NAME = 'Zoo'
