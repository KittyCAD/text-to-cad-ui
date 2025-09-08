import type { TextToCadResponse } from '@kittycad/lib'
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

export const localGenerations = writable<TextToCadResponse[]>([])
export const unreadGenerations = writable<string[]>(
	browser ? JSON.parse(localStorage.getItem(PERSIST_KEY_UNREAD) ?? '[]') : []
)
unreadGenerations.subscribe((value) => {
	if (browser) {
		localStorage.setItem(PERSIST_KEY_UNREAD, JSON.stringify(value))
	}
})
export const fetchedGenerations = writable<TextToCadResponse[]>(
	browser ? JSON.parse(localStorage.getItem(PERSIST_KEY_GENERATIONS) ?? '[]') : []
)

export type GenerationWithSource = TextToCadResponse & { source: 'local' | 'fetched' }

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
	const setItemDeletingOldIfNeeded = (value: GenerationWithSource[], attempts = 0) => {
		// Safeguard: Prevent infinite recursion
		if (attempts > 1000) {
			console.error('Too many attempts to store generations, giving up')
			localStorage.removeItem(PERSIST_KEY_GENERATIONS)
			return
		}

		// Safeguard: If we have no generations left, just clear the storage
		if (value.length === 0) {
			console.warn('No generations left to store, clearing localStorage')
			localStorage.removeItem(PERSIST_KEY_GENERATIONS)
			return
		}

		try {
			localStorage.setItem(PERSIST_KEY_GENERATIONS, JSON.stringify(value))

			// Log successful storage if we had to reduce items
			if (attempts > 0) {
				console.log(
					`Successfully stored ${value.length} generations after ${attempts + 1} attempts`
				)
			}
		} catch (e) {
			if (e instanceof DOMException && e.name === 'QuotaExceededError') {
				// Log the reduction attempt
				if (attempts === 0) {
					console.warn(`localStorage quota exceeded with ${value.length} generations, reducing...`)
				}

				// If we hit the quota, delete the oldest generation and try again
				const smallerGenerations = value.slice(0, -1)
				setItemDeletingOldIfNeeded(smallerGenerations, attempts + 1)
			} else {
				// Handle other storage errors
				console.error('Non-quota localStorage error:', e)
				localStorage.removeItem(PERSIST_KEY_GENERATIONS)
			}
		}
	}

	if (browser) {
		setItemDeletingOldIfNeeded(value)
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
