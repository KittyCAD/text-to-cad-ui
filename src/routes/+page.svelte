<script lang="ts">
	import GenerationListItem from 'components/GenerationListItem.svelte'
	import type { PageData } from './$types.js'
	import { page } from '$app/stores'
	import type { PromptResponse } from '$lib/endpoints.js'

	export let data: PageData
	$: currentPage = $page.url.searchParams.get('page')

	const filterFailures = (item: PromptResponse) => item.status !== 'failed'

	$: console.log('data', data)
</script>

<section class="mx-auto max-w-3xl mt-24">
	<h1 class="text-5xl mb-2">
		Text to <span class="text-stroke text-stroke-chalkboard-100 dark:text-stroke-chalkboard-20"
			>CAD</span
		>
	</h1>
	<form method="POST" class="flex w-full">
		<label class="flex-1">
			<span class="sr-only">Enter a text-to-CAD prompt:</span>
			<input
				autocapitalize="false"
				name="prompt"
				placeholder="Enter a text-to-CAD prompt:"
				required
				spellcheck="false"
				type="text"
				class="w-full px-4 py-1 border"
			/>
		</label>
		<button type="submit" class="submit">Submit</button>
	</form>
</section>

{#if data.body?.items?.length}
	<section class="my-24">
		<h2 class="text-4xl mb-8">
			Your <span class="text-stroke text-stroke-chalkboard-100 dark:text-stroke-chalkboard-20"
				>generations</span
			>
		</h2>
		<ul class="m-0 p-0">
			{#each data.body.items.filter(filterFailures) as item (item.id)}
				<li class="first-of-type:mt-0 my-12">
					<GenerationListItem data={item} />
				</li>
			{/each}
		</ul>
	</section>
{/if}
<div class="w-full">
	{#if currentPage !== null}
		<a href={`${data.previousPage ? `?page=${data.previousPage}` : '/'}`} class="pagination"
			>Previous page</a
		>
	{/if}
	{#if data.body?.next_page}
		<a
			href={`?page=${data.body.next_page}${currentPage ? `&previous_page=${currentPage}` : ''}`}
			class="pagination ml-auto">Next page</a
		>
	{/if}
</div>

<style lang="postcss">
	.submit {
		@apply px-4 py-1 border border-l-0;
		@apply border-chalkboard-100 dark:border-chalkboard-20;
		@apply bg-energy-10 text-energy-100;
		@apply dark:bg-energy-90 dark:text-energy-10;
	}

	.pagination {
		@apply block w-fit px-4 py-1;
		@apply bg-chalkboard-100 dark:bg-transparent hover:bg-chalkboard-90;
		@apply text-chalkboard-10;
		@apply dark:border;
	}
</style>
