<script lang="ts">
	import type { Models } from '@kittycad/lib'
	import GenerationListItem from './GenerationListItem.svelte'
	import { onMount } from 'svelte'
	import InfiniteScroll from './InfiniteScroll.svelte'
	import { endpoints } from '$lib/endpoints'
	import type { ListLoadResponse } from '../routes/api/get-generation-list/+server'
	import GenerationalListItemSkeleton from './GenerationalListItemSkeleton.svelte'
	import { browser } from '$app/environment'
	import { generations, nextPageToken } from '$lib/stores'

	export let additionalGenerations: Models['TextToCad_type'][] = []

	const filterFailures = (item: Models['TextToCad_type']) => item.status !== 'failed'
	let PAGE_SIZE = 2
	let isFetching = false

	async function fetchData() {
		if ($nextPageToken === null || isFetching) return
		isFetching = true

		const response = await fetch(endpoints.localList, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ page_token: $nextPageToken })
		})
		const nextBatchPayload = (await response.json()) as ListLoadResponse
		$nextPageToken = nextBatchPayload?.body?.next_page ?? null
		isFetching = false

		updateGenerations(nextBatchPayload)
	}

	function updateGenerations(payload: ListLoadResponse) {
		const nextBatch = payload?.body?.items ?? []
		generations.update((g) => {
			const newGenerations = [...g, ...nextBatch]
			return Array.from(new Set(newGenerations.map((item) => item.id))).map((id) =>
				newGenerations.find((item) => item.id === id)
			) as Models['TextToCad_type'][]
		})
	}

	onMount(() => {
		// load first batch onMount
		fetchData()
	})

	$: console.log('generations', $generations)
</script>

<section class="mt-24 mb-48">
	<h2 class="text-4xl mb-8">
		Your <span class="text-stroke text-stroke-chalkboard-100 dark:text-stroke-chalkboard-20"
			>generations</span
		>
	</h2>
	{#if $generations.length > 0}
		<ul class="m-0 p-0">
			{#each additionalGenerations as item}
				<li class="first-of-type:mt-0 my-12">
					<GenerationListItem data={item} />
				</li>
			{/each}
			{#each $generations.filter(filterFailures) as item}
				<li class="first-of-type:mt-0 my-12">
					<GenerationListItem data={item} />
				</li>
			{/each}
		</ul>
	{/if}
	{#if isFetching}
		{#each Array(PAGE_SIZE) as i}
			<div class={`item-${i} first-of-type:mt-0 my-12`}>
				<GenerationalListItemSkeleton />
			</div>
		{/each}
	{/if}
	{#if $nextPageToken === null}
		<p class="text-center text-chalkboard-70 dark:text-chalkboard-40">You're all caught up! 🎉</p>
	{/if}
</section>
<InfiniteScroll
	hasMore={$nextPageToken !== null}
	threshold={200}
	on:loadMore={fetchData}
	elementScroll={browser ? document : undefined}
/>
