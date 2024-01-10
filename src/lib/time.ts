import { TIME_BUCKETS } from './consts'

export function msSinceStartOfDay(date: Date) {
	const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
	return date.getTime() - startOfDay.getTime()
}

export function msSinceAWeekAgo(date: Date) {
	const startOfWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
	return date.getTime() - startOfWeek.getTime()
}

export function msSinceStartOfMonth(date: Date) {
	const startOfMonth = new Date(date.getFullYear(), date.getMonth())
	return date.getTime() - startOfMonth.getTime()
}

export function msSinceStartOfYear(date: Date) {
	const startOfYear = new Date(date.getFullYear(), 0)

	return date.getTime() - startOfYear.getTime()
}

export function sortTimeBuckets([a]: [string, unknown], [b]: [string, unknown]) {
	const foundIndexA = TIME_BUCKETS.findIndex(({ name }) => name === a)
	const foundIndexB = TIME_BUCKETS.findIndex(({ name }) => name === b)

	// If neither are found, sort alphabetically (which will sort years descending)
	if (foundIndexA === -1 && foundIndexB === -1) return b.localeCompare(a)
	// If only one is found, sort it first
	if (foundIndexA === -1) return 1
	if (foundIndexB === -1) return -1
	return foundIndexA - foundIndexB
}
