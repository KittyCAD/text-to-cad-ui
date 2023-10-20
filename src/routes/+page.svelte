<script lang="ts">
	import { endpoints } from '$lib/endpoints'
	import GenerationList from 'components/GenerationList.svelte'
	import type { PromptLoadResponse } from './api/submit-prompt/+server'
	import type { Models } from '@kittycad/lib'
	import type { PageData } from './$types'
	export let data: PageData
	let promptedGenerations: Models['TextToCad_type'][] = []

	const submitPrompt = async (e: Event) => {
		e.preventDefault()
		const prompt = (e.target as HTMLFormElement).prompt.value
		const response = await fetch(endpoints.localPrompt, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ prompt })
		})
		const data = (await response.json()) as PromptLoadResponse
		promptedGenerations = data.body ? [data.body, ...promptedGenerations] : promptedGenerations
		const form = e.target as HTMLFormElement
		form.reset()
	}
</script>

<section class="mx-auto max-w-3xl my-48">
	<h1 class="text-5xl mb-2">
		Text to <span class="text-stroke text-stroke-chalkboard-100 dark:text-stroke-chalkboard-20"
			>CAD</span
		>
	</h1>
	<form on:submit={submitPrompt} class="flex w-full">
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
{#if Boolean(data.user)}
	<GenerationList additionalGenerations={promptedGenerations} />
{/if}

<style lang="postcss">
	.submit {
		@apply px-4 py-1 border border-l-0;
		@apply border-chalkboard-100 dark:border-chalkboard-20;
		@apply bg-energy-10 text-energy-100;
		@apply dark:bg-energy-90 dark:text-energy-10;
	}
</style>
