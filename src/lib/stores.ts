import type { Models } from '@kittycad/lib'
import { derived, writable } from 'svelte/store'
import groupBy from 'object.groupby'
import { TIME_BUCKETS } from './consts'

export const localGenerations = writable<Models['TextToCad_type'][]>([])
export const fetchedGenerations = writable<Models['TextToCad_type'][]>([])
export const generations = derived([localGenerations, fetchedGenerations], ([$local, $fetched]) => {
	return groupBy([...$local, ...$fetched], ({ created_at }) => {
		const now = new Date()
		const createdAtDate = new Date(created_at)
		const bucket = TIME_BUCKETS.find(({ test }) => test(createdAtDate, now))

		return bucket?.name ?? createdAtDate.getFullYear().toString()
	})
})

export const nextPageToken = writable<string | null | undefined>(undefined)
