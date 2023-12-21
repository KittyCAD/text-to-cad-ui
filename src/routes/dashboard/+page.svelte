<script lang="ts">
	import { endpoints } from '$lib/endpoints'
	import GenerationList from 'components/GenerationList.svelte'
	import type { Models } from '@kittycad/lib'
	import type { PageData } from './$types'
	import type { GenerationEvents } from '$lib/types'
	import { EXAMPLE_PROMPTS } from '$lib/consts'
	export let data: PageData
	let promptedGenerations: Models['TextToCad_type'][] = []
	let form = null as HTMLFormElement | null
	let input = null as HTMLInputElement | null
	const getExammplePrompts = () => [...EXAMPLE_PROMPTS].sort(() => Math.random() - 0.5).slice(0, 3)
	let examplePrompts = getExammplePrompts()
	let error: string | null = null

	const submitPrompt = async (prompt: string) => {
		const OUTPUT_FORMAT: Models['FileExportFormat_type'] = 'gltf'
		const response = await fetch(endpoints.convert(OUTPUT_FORMAT), {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ prompt })
		})

		if (!response.ok) {
			error = 'Failed to submit prompt'
			return
		}

		const data = (await response.json()) as Models['TextToCad_type']
		promptedGenerations = data ? [data, ...promptedGenerations] : promptedGenerations
	}

	const submitForm = async (e: Event) => {
		e.preventDefault()
		const prompt = (e.target as HTMLFormElement).prompt.value
		await submitPrompt(prompt)
		const form = e.target as HTMLFormElement
		form.reset()
	}

	const retryPrompt = (e: CustomEvent<GenerationEvents['retryprompt']>) => {
		if (input === null || form === null) return
		input.scrollIntoView({ behavior: 'smooth', block: 'center' })
		input.value = e.detail
	}
</script>

<section class="mx-auto max-w-2xl my-48">
	<h1 class="text-5xl mb-2">
		Text-to-<span class="text-green">CAD</span>
	</h1>
	<form on:submit={submitForm} class="flex w-full text-lg" bind:this={form}>
		<label class="flex-1">
			<span class="sr-only">Enter a text-to-CAD prompt:</span>
			<input
				autocapitalize="false"
				name="prompt"
				placeholder="e.g. Create a plate with 4 holes and rounded corners"
				required
				spellcheck="false"
				type="text"
				class="w-full px-4 py-1 border"
				bind:this={input}
			/>
		</label>
		<button type="submit" class="submit">Submit</button>
	</form>
	{#if error}
		<p class="text-red mt-2">{error}</p>
	{/if}
	<div class="prompt-buttons">
		<span class="font-mono pt-1 text-xs uppercase text-chalkboard-70 dark:text-chalkboard-40"
			>Example prompts:</span
		>
		{#each examplePrompts as prompt (prompt)}
			<button
				class="submit"
				on:click={() => {
					if (input) {
						input.value = prompt
						input.focus()
						examplePrompts = getExammplePrompts()
					}
				}}>{prompt}</button
			>
		{/each}
	</div>
</section>
{#if Boolean(data.user)}
	<GenerationList additionalGenerations={promptedGenerations} on:retryprompt={retryPrompt} />
{/if}

<style lang="postcss">
	.submit {
		@apply px-4 lg:px-6 py-1 border border-l-0;
		@apply font-mono uppercase tracking-[1px] text-sm;
		@apply border-chalkboard-100 dark:border-chalkboard-20;
		@apply bg-green text-chalkboard-120 hover:hue-rotate-15;
	}

	.prompt-buttons {
		@apply flex flex-wrap gap-2 mt-4;
	}

	.prompt-buttons button {
		@apply text-xs rounded-full border pt-0.5 pb-0 px-3;
		@apply bg-transparent hover:bg-green/50;
		@apply text-chalkboard-70 dark:text-chalkboard-50 hover:text-chalkboard-120 dark:hover:text-chalkboard-10;
		@apply border-chalkboard-30 dark:border-chalkboard-70;
		@apply hover:border-chalkboard-120 dark:hover:border-chalkboard-10;
	}
</style>
