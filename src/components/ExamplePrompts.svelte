<script lang="ts">
	import { EXAMPLES_TO_SHOW, EXAMPLE_PROMPTS } from '$lib/consts'

	export let input: HTMLTextAreaElement | null
	const getExammplePrompts = () =>
		[...EXAMPLE_PROMPTS].sort(() => Math.random() - 0.5).slice(0, EXAMPLES_TO_SHOW)
	let examplePrompts = getExammplePrompts()
</script>

<div {...$$restProps}>
	<p class="font-mono pt-1 text-xs uppercase text-chalkboard-100 dark:text-chalkboard-20">
		Example prompts:
	</p>
	<div class="prompt-buttons">
		{#each examplePrompts as prompt (prompt)}
			<button
				on:click={() => {
					if (input) {
						input.value = prompt
						input.focus()
						examplePrompts = getExammplePrompts()
					}
				}}
			>
				<span class="mt-0.5">{prompt}</span>
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	.prompt-buttons {
		@apply grid md:grid-cols-2 gap-4 mt-4;
	}

	.prompt-buttons button {
		@apply text-sm text-left font-mono tracking-wider rounded border p-3 md:p-4;
		@apply bg-transparent hover:bg-green/50;
		@apply text-chalkboard-70 dark:text-chalkboard-50 hover:text-chalkboard-120 dark:hover:text-chalkboard-10;
		@apply border-chalkboard-30 dark:border-chalkboard-70;
		@apply hover:border-chalkboard-120 dark:hover:border-chalkboard-10;
		@apply hover:bg-green/20 text-chalkboard-120 dark:text-chalkboard-20 hover:hue-rotate-15;
	}
</style>
