import type { Models } from '@kittycad/lib'
import { writable } from 'svelte/store'

export const generations = writable<Models['TextToCad_type'][]>([])
export const nextPageToken = writable<string | null | undefined>(undefined)
