<script lang="ts">
	// Adapted for TypeScript from this Svelte Repl:
	// https://svelte.dev/repl/4863a658f3584b81bbe3d9f54eb67899?version=3.32.3
	import { onDestroy, createEventDispatcher } from 'svelte'

	export let threshold = 0
	export let horizontal = false
	export let elementScroll: Document | HTMLElement | undefined = undefined
	export let hasMore = true

	const dispatch = createEventDispatcher()
	let isLoadMore = false
	let component: HTMLDivElement

	$: {
		if (component || elementScroll) {
			const element = elementScroll ? elementScroll : component.parentNode

			if (element === null) throw new Error('Element not found for InfiniteScroll')

			element.addEventListener('scroll', onScroll)
			element.addEventListener('resize', onScroll)
		}
	}

	const onScroll = (e: Event) => {
		if (e.type !== 'scroll') return
		const element = e.target as HTMLElement | Document
		if (element === null) {
			console.error('InfiniteScroll scroll event target is null')
			return
		}
		let offset = 0
		if (element instanceof Document) {
			const { width, height } = element.documentElement.getBoundingClientRect()
			offset = horizontal
				? width - window.innerWidth - window.scrollX
				: height - window.innerHeight - window.scrollY
		} else if (element instanceof HTMLElement) {
			offset = horizontal
				? element.scrollWidth - element.clientWidth - element.scrollLeft
				: element.scrollHeight - element.clientHeight - element.scrollTop
		}

		if (offset <= threshold) {
			if (!isLoadMore && hasMore) {
				dispatch('loadMore')
			}
			isLoadMore = true
		} else {
			isLoadMore = false
		}
	}

	onDestroy(() => {
		if (component || elementScroll) {
			const element = elementScroll ? elementScroll : component.parentNode

			element?.removeEventListener('scroll', null)
			element?.removeEventListener('resize', null)
		}
	})
</script>

<div bind:this={component} style="width:0px" />
