<script lang="ts">
	import type { Models } from '@kittycad/lib'
	import GenerationListItem from './GenerationListItem.svelte'
	import { onMount } from 'svelte'
	import InfiniteScroll from './InfiniteScroll.svelte'
	import { endpoints } from '$lib/endpoints'
	import GenerationalListItemSkeleton from './GenerationalListItemSkeleton.svelte'
	import { browser } from '$app/environment'
	import { generations, nextPageToken } from '$lib/stores'
	import {
		childrenObserverAction,
		type ObserverActionPayload
	} from '$lib/intersectionObserverAction'

	export let additionalGenerations: Models['TextToCad_type'][] = []
	$: combinedGenerations = [...additionalGenerations, ...$generations]

	const RENDER_THRESHOLD = 0.05
	let PAGE_SIZE = 2
	let isFetching = false
	let error: string | null = null
	let intersectionInfo: IntersectionObserverEntry['intersectionRatio'][] = []
	let intersectionOptions = {
		numChildren: PAGE_SIZE,
		threshold: new Array(20).fill(0).map((_, i) => (i + 1) / 20)
	}

	async function fetchData() {
		if ($nextPageToken === null) return
		isFetching = true

		const response = await fetch(endpoints.list({ limit: 3, page_token: $nextPageToken }), {
			credentials: 'include'
		})

		if (!response.ok) {
			isFetching = false
			return
		}

		const nextBatchPayload = (await response.json()) as Models['TextToCadResultsPage_type']
		$nextPageToken = nextBatchPayload?.next_page ?? null
		isFetching = false

		updateGenerations(nextBatchPayload)
	}

	function updateGenerations(payload: Models['TextToCadResultsPage_type']) {
		const nextBatch = payload?.items ?? []
		generations.update((g) => {
			const newGenerations = [...g, ...nextBatch]
			// Update the number of child elements to observe
			intersectionOptions = {
				...intersectionOptions,
				numChildren: newGenerations.length
			}
			return Array.from(new Set(newGenerations.map((item) => item.id))).map((id) =>
				newGenerations.find((item) => item.id === id)
			) as Models['TextToCad_type'][]
		})
	}

	onMount(() => {
		// load first batch onMount
		fetchData()
	})

	function updateIntersectionInfo(e: CustomEvent<ObserverActionPayload[]>) {
		// We have to replace the whole array to trigger a re-render
		const tempInfo = [...intersectionInfo]
		e.detail.forEach((entry) => {
			tempInfo[entry.index] = entry.intersectionRatio
		})
		intersectionInfo = tempInfo
	}
</script>

<section class="mt-24 mb-48">
	<h2 class="text-4xl mb-8">
		Your <span class="text-green">generations</span>
	</h2>
	{#if $generations.length > 0}
		<ul
			class="m-0 p-0"
			use:childrenObserverAction={intersectionOptions}
			on:emit={updateIntersectionInfo}
		>
			{#each combinedGenerations as item, i}
				<li id={item.id} class="first-of-type:mt-0 my-12" style={`opacity: ${intersectionInfo[i]}`}>
					<GenerationListItem
						data={item}
						on:retryprompt
						shouldRenderModel={intersectionInfo[i + additionalGenerations.length] >
							RENDER_THRESHOLD}
					/>
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
	{#if error}
		<p class="text-red mt-2">{error}</p>
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
