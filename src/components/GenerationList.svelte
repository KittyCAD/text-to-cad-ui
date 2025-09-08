<script lang="ts">
	import type { TextToCadResponse } from '@kittycad/lib'
	import type { UIEventHandler } from 'svelte/elements'
	import GenerationListItem from './GenerationListItem.svelte'
	import { page } from '$app/stores'
	import { fetchedGenerations, generations } from '$lib/stores'
	import { sortTimeBuckets } from '$lib/time'
	import Spinner from 'components/Icons/Spinner.svelte'
	import { PAGES_AHEAD_TO_FETCH, ITEMS_PER_PAGE } from '$lib/consts'
	import { onMount } from 'svelte'
	import { ml } from '@kittycad/lib'
	import { createZooClient } from '$lib/zooClient'
	import { toasts } from '$lib/toast'
	import { getApiErrorMessage } from '$lib/errors'

	let error: string | null = null
	let pagesToFetch = PAGES_AHEAD_TO_FETCH
	let scrolledPercentage = 0
	let fetchPromise: Promise<void>
	let pager: ReturnType<typeof ml.list_text_to_cad_models_for_user_pager> | null = null
	let hasNext = true

	onMount(() => {
		const client = createZooClient({ token: $page.data.token })
		pager = ml.list_text_to_cad_models_for_user_pager({
			client,
			limit: ITEMS_PER_PAGE,
			page_token: '',
			sort_by: 'created_at_descending',
			no_models: true
		} as unknown as Parameters<typeof ml.list_text_to_cad_models_for_user_pager>[0])
		fetchPromise = fetchData()
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
		if (!pager) return
		try {
			if (!pager.hasNext()) {
				hasNext = false
				pagesToFetch = 0
				return
			}
			const nextBatch = await pager.next()
			const shouldContinue = updateFetchedGenerations(nextBatch)
			hasNext = pager.hasNext()
			pagesToFetch = shouldContinue && hasNext ? pagesToFetch - 1 : 0
			if (pagesToFetch > 0) {
				return fetchData()
			}
		} catch (e) {
			error = 'Failed to fetch your creations'
			toasts.add(getApiErrorMessage(e, error), 'error')
		}
	}

	function updateFetchedGenerations(nextBatch: TextToCadResponse[]): boolean {
		let shouldKeepFetching = true
		fetchedGenerations.update((g) => {
			// By putting the new generations first, we ensure that the newest versions of any
			// duplicate generations are the ones that are kept
			const newGenerations = [...nextBatch, ...g]
			const newGenerationsDeduplicated = Array.from(
				new Set(newGenerations.map((item) => item.id))
			).map((id) => newGenerations.find((item) => item.id === id)) as TextToCadResponse[]

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
			{#if !hasNext}
				<p class="text-chalkboard-100 dark:text-chalkboard-30 text-sm m-2 py-6 border-t">
					You've reached the end of your creations 🎉
				</p>
			{/if}
		{/await}
	{:else}
		<p>You'll see your creations here once you submit your first prompt</p>
	{/if}
</section>
