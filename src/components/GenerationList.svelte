<script lang="ts">
	import type { Models } from '@kittycad/lib'
	import GenerationListItem from './GenerationListItem.svelte'
	import { endpoints } from '$lib/endpoints'
	import { page } from '$app/stores'
	import { fetchedGenerations, generations, nextPageToken } from '$lib/stores'
	import { sortTimeBuckets } from '$lib/time'
	import { browser } from '$app/environment'
	import Spinner from 'components/Icons/Spinner.svelte'

	let isFetching = false
	let error: string | null = null

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

		// If we see that one of fetched generations has an id that matches one of the
		// generations in the store, we know we can stop fetching
		const shouldKeepFetching = updateFetchedGenerations(nextBatchPayload)
		$nextPageToken = shouldKeepFetching ? nextBatchPayload?.next_page ?? null : null
		console.log({
			shouldKeepFetching,
			nextPageToken: $nextPageToken
		})
		isFetching = false
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
		console.log('shouldKeepFetching', shouldKeepFetching)
		return shouldKeepFetching
	}
</script>

<section class="overflow-y-auto max-h-full px-2 lg:pr-4 pt-6">
	{#if Object.keys($generations).length > 0}
		{#each Object.entries($generations).toSorted(sortTimeBuckets) as [category, items]}
			<div class="first-of-type:mt-0 mt-12">
				<h2 class="pl-2 lg:pl-4 text-xl">{category}</h2>
				<ul class="m-0 p-0">
					{#each items as item}
						<li id={item.id} class="first-of-type:mt-2 my-4">
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
