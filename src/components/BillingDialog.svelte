<script lang="ts">
	import type { BillingDialogProps } from '@kittycad/react-shared'
	import { createElement } from 'react'
	import { createRoot, type Root } from 'react-dom/client'
	import { onDestroy, onMount } from 'svelte'

	// TODO: Figure out what we do with this boilerplate, or go with a lib
	// got this from:
	// - https://joyofcode.xyz/using-react-libraries-in-svelte
	// - https://pandemicode.dev/using-react-within-your-svelte-applications-3b1f2a75aefc
	let htmlElement: HTMLElement
	let reactRoot: Root

	onMount(() => {
		const props = $$props as BillingDialogProps
		try {
			reactRoot = createRoot(htmlElement)
			import('@kittycad/react-shared').then(({ BillingDialog }) => {
				const element = createElement(BillingDialog, { ...props })
				reactRoot.render(element)
			})
		} catch (err) {
			console.log('Failed to mount', { err })
		}
	})

	onDestroy(() => {
		try {
			reactRoot.unmount()
		} catch (err) {
			console.log('Failed to destroy', { err })
		}
	})
</script>

<div bind:this={htmlElement} class="root-el" />
