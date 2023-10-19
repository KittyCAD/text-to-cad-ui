<script lang="ts">
	import GenerationListItem from 'components/GenerationListItem.svelte'
	import type { PageData } from './$types.js'

	export let data: PageData
</script>

<section class="mx-auto max-w-3xl">
	<h1 class="text-4xl mb-2">
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
		<h2>Your generations</h2>
		{#each data.body.items as item}
			<GenerationListItem data={item} />
		{/each}
	</section>
{/if}

<style lang="postcss">
	.submit {
		@apply px-4 py-1 border border-l-0;
		@apply border-chalkboard-100 dark:border-chalkboard-20;
		@apply bg-energy-10 text-energy-100;
		@apply dark:bg-energy-90 dark:text-energy-10;
	}
</style>
