<script lang="ts">
	import type { Models } from '@kittycad/lib'
	import GenerationListItem from './GenerationListItem.svelte'
	import { onMount } from 'svelte'
	import InfiniteScroll from './InfiniteScroll.svelte'
	import { endpoints } from '$lib/endpoints'
	import type { ListLoadResponse } from '../routes/api/get-generation-list/+server'
	import GenerationalListItemSkeleton from './GenerationalListItemSkeleton.svelte'
	import { browser } from '$app/environment'

	let models: Models['TextToCad_type'][] = []
	const filterFailures = (item: Models['TextToCad_type']) => item.status !== 'failed'
	let PAGE_SIZE = 2
	let isFetching = false

	// but most likely, you'll have to store a token to fetch the next page
	let nextUrl: string | null = ''
	// store the new batch of data here.
	let newBatch: Models['TextToCad_type'][] = []

	async function fetchData() {
		console.log('fetching data', nextUrl)
		isFetching = true
		const response = await fetch(endpoints.localList, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ page_token: nextUrl })
		})
		const newData = (await response.json()) as ListLoadResponse
		isFetching = false
		newBatch = newData?.body?.items ?? []
		nextUrl = newData?.body?.next_page ?? null
	}

	onMount(() => {
		// load first batch onMount
		fetchData()
	})

	$: models = [...models, ...newBatch]
</script>

<section class="my-24">
	<h2 class="text-4xl mb-8">
		Your <span class="text-stroke text-stroke-chalkboard-100 dark:text-stroke-chalkboard-20"
			>generations</span
		>
	</h2>
	{#if models.length > 0}
		<ul class="m-0 p-0">
			{#each models.filter(filterFailures) as item}
				<li class="first-of-type:mt-0 my-12">
					<GenerationListItem data={item} />
				</li>
			{/each}
		</ul>
	{/if}
	{#if isFetching}
		{#each Array(PAGE_SIZE) as i (i)}
			<div class="first-of-type:mt-0 my-12">
				<GenerationalListItemSkeleton />
			</div>
		{/each}
	{/if}
	{#if nextUrl === null}
		<p class="text-center text-chalkboard-70 dark:text-chalkboard-40">You're all caught up! 🎉</p>
	{/if}
</section>
<InfiniteScroll
	hasMore={newBatch.length > 0}
	threshold={200}
	on:loadMore={fetchData}
	elementScroll={browser ? document : undefined}
/>
