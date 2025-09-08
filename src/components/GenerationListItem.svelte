<script lang="ts">
	import { browser } from '$app/environment'
	import { endpoints } from '$lib/endpoints'
	import { page } from '$app/stores'
	import Checkmark from 'components/Icons/Checkmark.svelte'
	import Close from 'components/Icons/Close.svelte'
	import Spinner from 'components/Icons/Spinner.svelte'
	import {
		fetchedGenerations,
		localGenerations,
		type GenerationWithSource,
		unreadGenerations
	} from '$lib/stores'
	import ArrowRight from './Icons/ArrowRight.svelte'
	import { MODEL_POLLING_INTERVAL } from '$lib/consts'
	import type { TextToCadResponse } from '@kittycad/lib'

	export let data: GenerationWithSource
	let poller: ReturnType<typeof setInterval> | undefined
	let error: { message: string; status: number }
	const isSettled = (status: string) => status === 'completed' || status === 'failed'

	$: isUnread = $unreadGenerations.includes(data.id)

	function updateGenerationItem(newItem: GenerationWithSource) {
		const store = newItem.source === 'local' ? localGenerations : fetchedGenerations
		store.update((g) => {
			const foundIndex = g.findIndex((item) => item.id === newItem.id)

			return [...g.slice(0, foundIndex), newItem, ...g.slice(foundIndex + 1)]
		})
	}

	const setupPoller = (id: string) => {
		if (poller) {
			clearInterval(poller)
		}
		poller = setInterval(doPoll(id), MODEL_POLLING_INTERVAL)
	}

	const doPoll = (id: string) => async () => {
		const res = await fetch(endpoints.viewNoModels(id), {
			headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + $page.data.token }
		})
		const newResponse: TextToCadResponse = await res.json().catch((err) => {
			console.error(err)
			error = { message: 'Failed to poll for generation status', status: res.status }
		})

		let newItem = Object.assign({}, data, newResponse, { source: data.source })

		if (newResponse && isSettled(newItem.status)) {
			console.log('clearing the poller!')
			clearInterval(poller)
			updateGenerationItem(newItem)
		}
	}

	$: if (browser && !isSettled(data.status)) setupPoller(data.id)
</script>

<a
	href={`/view/${data.id}`}
	class={'generation-item group' +
		($page.url.pathname.includes(data.id) ? ' current pointer-events-none' : '')}
>
	<span class="text">{(data.prompt ?? '').trim()}</span>
	<div class="group-hover:hidden group-focus:hidden">
		{#if data.status === 'completed'}
			<Checkmark
				class={'w-5 h-5 rounded-full' + (isUnread ? ' bg-green text-chalkboard-110' : '')}
			/>
		{:else if data.status === 'failed' || error}
			<Close
				class={'w-5 h-5 rounded-full' + (isUnread ? ' bg-destroy-10 text-chalkboard-110' : '')}
			/>
		{:else}
			<Spinner class="w-5 h-5 animate-spin" />
		{/if}
	</div>
	<ArrowRight class="w-5 h-5 hidden group-hover:block group-focus:block" />
</a>

<style lang="postcss">
	.generation-item {
		@apply flex px-2 py-2 text-sm rounded border border-transparent gap-4;
		@apply transition-colors duration-200 ease-in-out;
		@apply hover:bg-green hover:text-chalkboard-110;
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
