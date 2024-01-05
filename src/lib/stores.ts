import type { Models } from '@kittycad/lib'
import { derived, writable } from 'svelte/store'

export const localGenerations = writable<Models['TextToCad_type'][]>([])
export const fetchedGenerations = writable<Models['TextToCad_type'][]>([])
export const generations = derived([localGenerations, fetchedGenerations], ([$local, $fetched]) => {
    return [...$local, ...$fetched]
})
export const nextPageToken = writable<string | null | undefined>(undefined)
