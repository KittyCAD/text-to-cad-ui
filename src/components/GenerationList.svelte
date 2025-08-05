<script lang="ts">
	import type { Models } from '@kittycad/lib/types'
	import type { UIEventHandler } from 'svelte/elements'
	import GenerationListItem from './GenerationListItem.svelte'
	import { endpoints } from '$lib/endpoints'
	import { page } from '$app/stores'
	import { fetchedGenerations, generations, nextPageTokens } from '$lib/stores'
	import { sortTimeBuckets } from '$lib/time'
	import Spinner from 'components/Icons/Spinner.svelte'
	import { PAGES_AHEAD_TO_FETCH } from '$lib/consts'
	import { onMount } from 'svelte'

	let error: string | null = null
	let pagesToFetch = PAGES_AHEAD_TO_FETCH
	let scrolledPercentage = 0
	let fetchPromise: Promise<void>

	onMount(() => {
		fetchPromise =
			$nextPageTokens[$nextPageTokens.length - 1] === null ? Promise.resolve() : fetchData()
	})

	// Reset the pages to fetch counter if the user scrolls
	// to the bottom of the generation list
	const handleScroll: UIEventHandler<HTMLElement> = (e) => {
		const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement
		scrolledPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100
		if (scrolledPercentage > 90) {
			pagesToFetch = PAGES_AHEAD_TO_FETCH
			fetchPromise = fetchData()
		}
	}

	async function fetchData() {
		// If we're at the end of the list, don't fetch more
		if ($nextPageTokens[$nextPageTokens.length - 1] === null) return

		const response = await fetch(
			endpoints.list({ page_token: $nextPageTokens[$nextPageTokens.length - 1] }),
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + $page.data.token
				}
			}
		)
		if (!response.ok) {
			error = 'Failed to fetch your creations'
			return
		}

		const nextBatchPayload = (await response.json()) as Models['TextToCadResultsPage_type']

		// If we see that one of fetched generations has an id that matches one of the
		// generations in the store, we know we can stop fetching
		const hasNoDuplicateGenerations = updateFetchedGenerations(nextBatchPayload)

		if (nextBatchPayload?.next_page === null) {
			$nextPageTokens = [...$nextPageTokens, null]
			pagesToFetch = 0
		} else if (hasNoDuplicateGenerations) {
			$nextPageTokens = [...$nextPageTokens, nextBatchPayload?.next_page ?? null]
			pagesToFetch = pagesToFetch - 1
		} else {
			pagesToFetch = 0
		}

		// If we have more pages to fetch, fetch them
		// and "keep the promise alive"
		if (pagesToFetch > 0) {
			return fetchData()
		}
	}

	function updateFetchedGenerations(payload: Models['TextToCadResultsPage_type']): boolean {
		const nextBatch = payload?.items ?? []
		let shouldKeepFetching = true
		fetchedGenerations.update((g) => {
			// By putting the new generations first, we ensure that the newest versions of any
			// duplicate generations are the ones that are kept
			const newGenerations = [...nextBatch, ...g]
			const newGenerationsDeduplicated = Array.from(
				new Set(newGenerations.map((item) => item.id))
			).map((id) => newGenerations.find((item) => item.id === id)) as Models['TextToCad_type'][]

			shouldKeepFetching =
				newGenerationsDeduplicated.length !== g.length &&
				newGenerations.length === newGenerationsDeduplicated.length
			return newGenerationsDeduplicated
		})
		return shouldKeepFetching
	}
</script>

<section
	on:scroll={handleScroll}
	class="overflow-y-auto max-h-full px-2 pt-6"
	data-testid="generation-list"
>
	{#if error}
		<p class="text-red mt-2">{error}</p>
	{:else if Object.keys($generations).length > 0}
		{#each Object.entries($generations).toSorted(sortTimeBuckets) as [category, items]}
			<div class="first-of-type:mt-0 mt-12">
				<h2 class="pl-2">Prompts {category}</h2>
				<ul class="m-0 p-0">
					{#each items as item}
						<li id={item.id} class="first-of-type:mt-2 my-4">
							<GenerationListItem data={item} />
						</li>
					{/each}
				</ul>
			</div>
		{/each}
		{#await fetchPromise}
			<p
				class={'flex gap-4 m-2 text-sm text-chalkboard-100 dark:text-chalkboard-30' +
					(Object.keys($generations).length > 0 ? ' pt-8 border-t' : '')}
			>
				<span class="flex-grow">Fetching your creations</span>
				<Spinner class="w-5 h-5 animate-spin inline-block mr-2" />
			</p>
		{:then}
			{#if $nextPageTokens[$nextPageTokens.length - 1] === null}
				<p class="text-chalkboard-100 dark:text-chalkboard-30 text-sm m-2 py-6 border-t">
					You've reached the end of your creations 🎉
				</p>
			{/if}
		{/await}
	{:else}
		<p>You'll see your creations here once you submit your first prompt</p>
	{/if}
</section>
