<script lang="ts">
	import { browser } from '$app/environment'
	import { endpoints } from '$lib/endpoints'
	import type { LoadResponse } from '../routes/api/get-generation/+server'
	import { page } from '$app/stores'
	import Checkmark from 'components/Icons/Checkmark.svelte'
	import Close from 'components/Icons/Close.svelte'
	import Spinner from 'components/Icons/Spinner.svelte'
	import { fetchedGenerations, localGenerations, type GenerationWithSource } from '$lib/stores'

	export let data: GenerationWithSource
	let poller: ReturnType<typeof setInterval> | undefined
	let error: { message: string; status: number }

	const setupPoller = (id: string) => {
		if (poller) {
			clearInterval(poller)
		}
		poller = setInterval(doPoll(id), 8000)
	}

	function updateGenerationItem(newItem: GenerationWithSource) {
		const store = newItem.source === 'local' ? localGenerations : fetchedGenerations
		store.update((g) => {
			const foundIndex = g.findIndex((item) => item.id === newItem.id)

			return [...g.slice(0, foundIndex), newItem, ...g.slice(foundIndex + 1)]
		})
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

		data = newResponse.body ? { ...newResponse.body, source: data.source } : data

		updateGenerationItem(data)
	}

	$: if (browser && data.status !== 'completed' && data.status !== 'failed' && !poller) {
		setupPoller(data.id)
	} else if (browser && (data.status === 'completed' || data.status === 'failed') && poller) {
		clearInterval(poller)
	}
</script>

<a
	href={`/view/${data.id}`}
	class={'generation-item' + ($page.url.pathname.includes(data.id) ? ' current' : '')}
>
	<span class="text">{data.prompt}</span>
	{#if data.status === 'completed'}
		<Checkmark class="w-5 h-5" />
	{:else if data.status === 'failed' || error}
		<Close class="w-5 h-5" />
	{:else}
		<Spinner class="w-5 h-5 animate-spin" />
	{/if}
</a>

<style lang="postcss">
	.generation-item {
		@apply font-mono flex px-4 py-2 text-sm rounded border border-transparent gap-4;
		@apply transition-colors duration-200 ease-in-out;
	}

	.generation-item:hover {
		@apply bg-green;
	}

	.generation-item.current {
		@apply border-green bg-green/10;
	}

	.text {
		@apply pt-0.5 flex-1;
		-webkit-line-clamp: 2;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
