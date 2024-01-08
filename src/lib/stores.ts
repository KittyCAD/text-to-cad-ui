import type { Models } from '@kittycad/lib'
import { derived, writable } from 'svelte/store'
import groupBy from 'object.groupby'
import { PERSIST_KEY_GENERATIONS, TIME_BUCKETS } from './consts'
import { browser } from '$app/environment'
import { persisted } from '@square/svelte-store'

export const localGenerations = writable<Models['TextToCad_type'][]>([])
export const fetchedGenerations = writable<Models['TextToCad_type'][]>(
	browser ? JSON.parse(localStorage.getItem(PERSIST_KEY_GENERATIONS) ?? '[]') : []
)
export const persistedFetchedGenerations = browser
	? persisted(fetchedGenerations, PERSIST_KEY_GENERATIONS)
	: fetchedGenerations

export type GenerationWithSource = Models['TextToCad_type'] & { source: 'local' | 'fetched' }

const combinedGenerations = derived(
	[localGenerations, fetchedGenerations],
	([$local, $fetched]) => {
		const sourcedLocal = $local.map((item) => ({
			...item,
			source: 'local'
		})) as GenerationWithSource[]
		const sourcedFetched = $fetched.map((item) => ({
			...item,
			source: 'fetched'
		})) as GenerationWithSource[]
		return [...sourcedLocal, ...sourcedFetched]
	}
)

combinedGenerations.subscribe((value) => {
	if (browser) {
		localStorage.setItem(PERSIST_KEY_GENERATIONS, JSON.stringify(value))
	}
})

export const generations = derived([combinedGenerations], ([$combinedGenerations]) => {
	return groupBy($combinedGenerations, ({ created_at }) => {
		const now = new Date()
		const createdAtDate = new Date(created_at)
		const bucket = TIME_BUCKETS.find(({ test }) => test(createdAtDate, now))

		return bucket?.name ?? createdAtDate.getFullYear().toString()
	})
})

export const nextPageToken = writable<string | null | undefined>(undefined)
