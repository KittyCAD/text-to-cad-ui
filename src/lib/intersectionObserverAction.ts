import type { Action } from 'svelte/action'

export type ObserverActionPayload = IntersectionObserverEntry & { index: number }
export type ObserverActionOptions = (IntersectionObserverInit | undefined) & {
	numChildren?: number
}
export type ObserverActionEvents = {
	'on:emit': (e: CustomEvent<ObserverActionPayload[]>) => void
}

// A Svelte Action (https://svelte.dev/docs/svelte-action)
// that adds an intersection observer for a node and observes
// its children, emitting a custom event when they intersect the view root.
export const childrenObserverAction: Action<
	HTMLElement,
	ObserverActionOptions,
	ObserverActionEvents
> = (node, options = { rootMargin: '0px', threshold: 0 }) => {
	// the node has been mounted in the DOM
	let childrenArray = Array.from(node.children)

	const observer = new IntersectionObserver((entries) => {
		const newIntersections: ObserverActionPayload[] = []
		entries.forEach((entry) => {
			const index = childrenArray.findIndex((child) => child.id === entry.target.id)
			newIntersections.push(Object.assign(entry, { index }))
		})
		node.dispatchEvent(new CustomEvent('emit', { detail: newIntersections }))
	}, options)

	childrenArray.forEach((elem) => observer.observe(elem))

	return {
		//  We have to tell the action when the number of children changes,
		// if more are appended, for example.
		update(newOptions: ObserverActionOptions) {
			if (newOptions.numChildren !== options.numChildren) {
				options.numChildren = newOptions.numChildren
				childrenArray = Array.from(node.children)
				childrenArray.forEach((elem) => observer.unobserve(elem))
				childrenArray.forEach((elem) => observer.observe(elem))
			}
		},
		destroy() {
			// the node has been removed from the DOM
			observer.disconnect()
		}
	}
}
