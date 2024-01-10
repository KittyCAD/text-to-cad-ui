import {
	msSinceStartOfDay,
	msSinceStartOfMonth,
	msSinceAWeekAgo,
	msSinceStartOfYear,
	sortTimeBuckets
} from './time'

describe('time interval tests', () => {
	const now = new Date('2024-05-01T17:00:25.950') // which is a Wednesday
	const expected_start_of_day = new Date('2024-05-01T00:00:00.000')
	const expected_start_of_week = new Date('2024-04-24T00:00:00.000')
	const expected_start_of_month = new Date('2024-05-01T00:00:00.000')
	const expected_start_of_year = new Date('2024-01-01T00:00:00.000')

	it('calculates the time to the start of the day', () => {
		expect(msSinceStartOfDay(now)).toEqual(now.getTime() - expected_start_of_day.getTime())
	})
	it('calculates the time to a week ago', () => {
		expect(msSinceAWeekAgo(now)).toEqual(now.getTime() - expected_start_of_week.getTime())
	})
	it('calculates the time to the start of the month', () => {
		expect(msSinceStartOfMonth(now)).toEqual(now.getTime() - expected_start_of_month.getTime())
	})
	it('calculates the time to the start of the year', () => {
		expect(msSinceStartOfYear(now)).toEqual(now.getTime() - expected_start_of_year.getTime())
	})
})

describe('time bucketing tests', () => {
	it('sorts by time buckets properly', () => {
		const items = {
			'Past 7 Days': [],
			Today: [],
			'This Month': [],
			'2021': [],
			'2023': []
		}

		expect(Object.entries(items).sort(sortTimeBuckets)).toEqual([
			['Today', []],
			['Past 7 Days', []],
			['This Month', []],
			['2023', []],
			['2021', []]
		])
	})
})
