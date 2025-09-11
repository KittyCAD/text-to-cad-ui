import { writable } from 'svelte/store'

export type ToastVariant = 'info' | 'success' | 'error'

export type Toast = {
	id: string
	message: string
	variant: ToastVariant
	timeout?: number
}

function createToasts() {
	const { subscribe, update } = writable<Toast[]>([])

	function add(message: string, variant: ToastVariant = 'info', timeout = 4000) {
		const id = Math.random().toString(36).slice(2)
		update((list) => [...list, { id, message, variant, timeout }])
		if (timeout > 0) {
			setTimeout(() => remove(id), timeout)
		}
		return id
	}

	function remove(id: string) {
		update((list) => list.filter((t) => t.id !== id))
	}

	return { subscribe, add, remove }
}

export const toasts = createToasts()
