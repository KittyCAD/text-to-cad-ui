<script lang="ts">
	import type { BillingDialogProps } from '@kittycad/react-shared'
	import { createElement } from 'react'
	import { createRoot, type Root } from 'react-dom/client'
	import { onDestroy, onMount } from 'svelte'

	let rootEl: HTMLElement
	let root: Root

	onMount(() => {
		const props = $$props as BillingDialogProps
		try {
			root = createRoot(rootEl)
			import('@kittycad/react-shared').then(({ BillingDialog }) => {
				const element = createElement(BillingDialog, { ...props })
				root.render(element)
			})
		} catch (err) {
			console.warn(`react-adapter failed to mount.`, { err })
		}
	})

	onDestroy(() => {
		try {
			root.unmount()
		} catch (err) {
			console.warn(`react-adapter failed to unmount.`, { err })
		}
	})
</script>

<div bind:this={rootEl} class="root-el" />
