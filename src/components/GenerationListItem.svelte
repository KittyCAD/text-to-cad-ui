<script lang="ts">
	import { browser } from '$app/environment'
	import { endpoints, type PromptResponse } from '$lib/endpoints'
	import type { LoadResponse } from '../routes/api/get-generation/+server'
	import { createEventDispatcher } from 'svelte'
	import type { GenerationEvents } from '$lib/types'
	const dispatch = createEventDispatcher<GenerationEvents>()

	export let data: PromptResponse
	let poller: ReturnType<typeof setInterval> | undefined
	let error: { message: string; status: number }

	const setupPoller = (id: string) => {
		if (poller) {
			clearInterval(poller)
		}
		poller = setInterval(doPoll(id), 8000)
	}

	const doPoll = (id: string) => async () => {
		const res = await fetch(endpoints.localView, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ id })
		})
		const newResponse: LoadResponse = await res.json().catch((err) => {
			console.error(err)
			error = { message: 'Failed to poll for generation status', status: res.status }
		})

		data = newResponse.body ? newResponse.body : data
	}

	$: if (browser && data.status !== 'completed') {
		setupPoller(data.id)
	} else if (browser && data.status === 'completed' && poller) {
		clearInterval(poller)
	}

	function retry(prompt: string) {
		return () => {
			dispatch('retryprompt', prompt)
		}
	}
</script>

<a href={`/view/${data.id}`} class="generation-item">
	<span class="pt-0.5 flex-1">{data.prompt}</span>
	{#if data.status === 'completed'}
		<span>✅</span>
	{:else if data.status === 'failed'}
		<span>❌</span>
	{:else}
		<span>⏳</span>
	{/if}
</a>

<style lang="postcss">
	.generation-item {
		@apply font-mono flex items-center px-4 py-2 text-sm rounded border-transparent;
		@apply transition-colors duration-200 ease-in-out;
	}

	.generation-item:hover {
		@apply bg-green/10 dark:bg-green/20;
	}
</style>
