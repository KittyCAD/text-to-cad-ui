<script lang="ts">
	import { endpoints } from '$lib/endpoints'
	import GenerationList from 'components/GenerationList.svelte'
	import type { PromptLoadResponse } from '../api/submit-prompt/+server'
	import type { Models } from '@kittycad/lib'
	import type { PageData } from './$types'
	import type { GenerationEvents } from '$lib/types'
	export let data: PageData
	let promptedGenerations: Models['TextToCad_type'][] = []
	let form = null as HTMLFormElement | null
	let input = null as HTMLInputElement | null

	const submitPrompt = async (prompt: string) => {
		const response = await fetch(endpoints.localPrompt, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ prompt })
		})
		const data = (await response.json()) as PromptLoadResponse
		promptedGenerations = data.body ? [data.body, ...promptedGenerations] : promptedGenerations
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
		Text to <span class="text-stroke text-stroke-chalkboard-100 dark:text-stroke-chalkboard-20"
			>CAD</span
		>
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
</section>
{#if Boolean(data.user)}
	<GenerationList additionalGenerations={promptedGenerations} on:retryprompt={retryPrompt} />
{/if}

<style lang="postcss">
	.submit {
		@apply px-4 lg:px-6 py-1 border border-l-0;
		@apply border-chalkboard-100 dark:border-chalkboard-20;
		@apply bg-energy-10 text-energy-100;
		@apply dark:bg-energy-90 dark:text-energy-10;
	}
</style>
