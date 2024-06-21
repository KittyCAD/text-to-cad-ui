import type { Models } from '@kittycad/lib'
import { derived, writable, type Readable } from 'svelte/store'
import groupBy from 'object.groupby'
import { PERSIST_KEY_GENERATIONS, PERSIST_KEY_UNREAD, PERSIST_KEY_VERSION } from './consts'
import { browser } from '$app/environment'
import { bucketByTime } from './time'

// Clear local storage if the version has changed
// This allows us to clear users' local storage if we need to
// do something like hard refresh the loaded models
if (browser && localStorage.getItem(PERSIST_KEY_VERSION) !== PERSIST_KEY_VERSION) {
	localStorage.clear()
	localStorage.setItem(PERSIST_KEY_VERSION, PERSIST_KEY_VERSION)
}

export const localGenerations = writable<Models['TextToCad_type'][]>([])
export const unreadGenerations = writable<string[]>(
	browser ? JSON.parse(localStorage.getItem(PERSIST_KEY_UNREAD) ?? '[]') : []
)
unreadGenerations.subscribe((value) => {
	if (browser) {
		localStorage.setItem(PERSIST_KEY_UNREAD, JSON.stringify(value))
	}
})
export const fetchedGenerations = writable<Models['TextToCad_type'][]>(
	browser ? JSON.parse(localStorage.getItem(PERSIST_KEY_GENERATIONS) ?? '[]') : []
)

export type GenerationWithSource = Models['TextToCad_type'] & { source: 'local' | 'fetched' }

export const combinedGenerations = derived(
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
		return [...sourcedLocal, ...sourcedFetched].sort((a, b) =>
			b.created_at.localeCompare(a.created_at)
		)
	}
)

combinedGenerations.subscribe((value) => {
	if (browser) {
		localStorage.setItem(PERSIST_KEY_GENERATIONS, JSON.stringify(value))
	}
})

export const generations = derived([combinedGenerations], ([$combinedGenerations]) => {
	return groupBy($combinedGenerations, ({ created_at }) => bucketByTime(created_at))
})

const NEXT_PAGE_TOKENS_KEY = 'nextPageTokens'
export const nextPageTokensInitial = fromLocalStorage<string[]>(NEXT_PAGE_TOKENS_KEY, [])
export const nextPageTokens = writable(nextPageTokensInitial)
toLocalStorage(nextPageTokens, NEXT_PAGE_TOKENS_KEY)

type UserSettings = {
	autoRotateModels: boolean
}

const SETTINGS_KEY = 'userSettings'
export const userSettingsInitial = fromLocalStorage<UserSettings>(SETTINGS_KEY, {
	autoRotateModels: true
})
export const userSettings = writable(userSettingsInitial)
toLocalStorage(userSettings, SETTINGS_KEY)

function toLocalStorage<T = unknown>(store: Readable<T>, storageKey: string) {
	if (browser) {
		store.subscribe((value) => {
			const storageValue =
				typeof value === 'object'
					? JSON.stringify(value)
					: typeof value === 'string'
					? value
					: String(value)

			window.localStorage.setItem(storageKey, storageValue)
		})
	}
}

// Get value from localStorage if in browser and the value is stored, otherwise fallback
function fromLocalStorage<T = unknown>(storageKey: string, fallbackValue: T) {
	if (browser) {
		const storedValue = window.localStorage.getItem(storageKey)

		if (storedValue !== 'undefined' && storedValue !== null) {
			return typeof fallbackValue === 'object' ? JSON.parse(storedValue) : storedValue
		}
	}

	return fallbackValue
}
