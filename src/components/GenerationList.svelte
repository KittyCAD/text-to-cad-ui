<script lang="ts">
	import type { Models } from '@kittycad/lib'
	import GenerationListItem from './GenerationListItem.svelte'
	import { endpoints } from '$lib/endpoints'
	import { page } from '$app/stores'
	import { fetchedGenerations, generations, nextPageToken } from '$lib/stores'
	import { sortTimeBuckets } from '$lib/time'
	import { browser } from '$app/environment'
	import Spinner from 'components/Icons/Spinner.svelte'

	let PAGE_SIZE = 2
	let isFetching = false
	let error: string | null = null
	let intersectionInfo: IntersectionObserverEntry['intersectionRatio'][] = []
	let intersectionOptions = {
		numChildren: PAGE_SIZE,
		threshold: new Array(20).fill(0).map((_, i) => (i + 1) / 20)
	}

	$: if (browser && $nextPageToken !== null) {
		fetchData()
	}

	async function fetchData() {
		if ($nextPageToken === null) return
		isFetching = true

		const response = await fetch(endpoints.list({ page_token: $nextPageToken }), {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + $page.data.token
			}
		})

		if (!response.ok) {
			isFetching = false
			return
		}

		const nextBatchPayload = (await response.json()) as Models['TextToCadResultsPage_type']
		$nextPageToken = nextBatchPayload?.next_page ?? null
		isFetching = false

		updateFetchedGenerations(nextBatchPayload)
	}

	function updateFetchedGenerations(payload: Models['TextToCadResultsPage_type']) {
		const nextBatch = payload?.items ?? []
		fetchedGenerations.update((g) => {
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
</script>

<section class="overflow-y-auto max-h-full px-2 lg:pr-4 pt-6">
	{#if Object.keys($generations).length > 0}
		{#each Object.entries($generations).toSorted(sortTimeBuckets) as [category, items], i}
			<div class="first-of-type:mt-0 mt-12">
				<h2 class="pl-2 lg:pl-4 text-xl">{category}</h2>
				<ul class="m-0 p-0">
					{#each items as item, j}
						<li
							id={item.id}
							class="first-of-type:mt-2 my-4"
							style={`opacity: ${intersectionInfo[j]}`}
						>
							<GenerationListItem data={item} />
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	{/if}
	{#if isFetching}
		<p
			class={'flex gap-4 m-2 text-sm tracking-wide text-chalkboard-100 dark:text-chalkboard-30' +
				(Object.keys($generations).length > 0 ? ' pt-8 border-t' : '')}
		>
			<span class="flex-grow">Fetching your creations</span>
			<Spinner class="w-5 h-5 animate-spin inline-block mr-2" />
		</p>
	{:else if Object.keys($generations).length === 0}
		<p>You'll see your creations here once you submit your first prompt</p>
	{/if}
	{#if error}
		<p class="text-red mt-2">{error}</p>
	{/if}
</section>
