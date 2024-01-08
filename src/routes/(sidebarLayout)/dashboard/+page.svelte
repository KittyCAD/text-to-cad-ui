<script lang="ts">
	import { endpoints } from '$lib/endpoints'
	import type { Models } from '@kittycad/lib'
	import type { PageData } from '../view/$types'
	import type { GenerationEvents } from '$lib/types'
	import { localGenerations } from '$lib/stores'
	import { goto } from '$app/navigation'
	import { EXAMPLE_PROMPTS } from '$lib/consts'
	import { page } from '$app/stores'
	import { paths } from '$lib/paths'
	import autosize from 'svelte-autosize'
	import ArrowRight from 'components/Icons/ArrowRight.svelte'
	export let data: PageData
	let form = null as HTMLFormElement | null
	let input = null as HTMLTextAreaElement | null
	const getExammplePrompts = () => [...EXAMPLE_PROMPTS].sort(() => Math.random() - 0.5).slice(0, 3)
	let examplePrompts = getExammplePrompts()
	let error: string | null = null
	let isSubmitting = false
	let showSuccessMessage: boolean = false
	let isCoolingDown = false
	let listSection = null as HTMLDivElement | null
	let inputValue = $page.url.searchParams.get('prompt') ?? ''

	const submitPrompt = async (prompt: string) => {
		const OUTPUT_FORMAT: Models['FileExportFormat_type'] = 'gltf'
		const response = await fetch(endpoints.prompt(OUTPUT_FORMAT), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + data.token
			},
			body: JSON.stringify({ prompt })
		})

		if (!response.ok) {
			error = 'Failed to submit prompt'
			return
		}

		const responseData = (await response.json()) as Models['TextToCad_type']
		$localGenerations = responseData ? [responseData, ...$localGenerations] : $localGenerations
		goto(paths.VIEW(responseData.id))
	}

	const submitForm = async (e: Event) => {
		e.preventDefault()
		isSubmitting = true
		const prompt = (e.target as HTMLFormElement).prompt.value
		await submitPrompt(prompt)
		const form = e.target as HTMLFormElement
		form.reset()
		showSuccessMessage = true
		isCoolingDown = true
		setTimeout(() => {
			isCoolingDown = false
		}, 3000)
		listSection?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
		isSubmitting = false
	}
</script>

<section class="mx-auto max-w-2xl my-16 md:my-24 lg:my-48">
	<h1 class="text-4xl md:text-5xl mb-2">
		Text-to-<span class="text-green">CAD</span>
	</h1>
	<form on:submit={submitForm} class="flex border items-stretch text-lg" bind:this={form}>
		<label class="flex-1 grid place-items-center">
			<span class="sr-only">Enter a text-to-CAD prompt:</span>
			<textarea
				autocapitalize="false"
				name="prompt"
				placeholder="e.g. Create a plate with 4 holes and rounded corners"
				required
				spellcheck="false"
				disabled={isSubmitting}
				class="w-full tracking-wide px-4 py-1 focus:outline-none focus:bg-green/20 focus:placeholder-shown:bg-green/10"
				bind:this={input}
				bind:value={inputValue}
				on:input={() => {
					showSuccessMessage = false
					error = null
				}}
				use:autosize
			/>
		</label>
		<button type="submit" class="submit" disabled={isCoolingDown || isSubmitting}>
			<span class="sr-only md:not-sr-only md:pt-0.5">
				{#if isSubmitting}
					Submitting
				{:else}
					Submit
				{/if}
			</span>
			<ArrowRight class="w-8 h-8 md:w-5 md:h-5" />
		</button>
	</form>
	{#if error}
		<p class="text-red mt-2">{error}</p>
	{:else if showSuccessMessage}
		<p class="border border-t-0 border-chalkboard-70 dark:border-chalkboard-40 p-2 bg-green/40">
			Prompt submitted!
		</p>
	{/if}
	<div class="prompt-buttons">
		<span class="font-mono pt-1 text-xs uppercase text-chalkboard-70 dark:text-chalkboard-40"
			>Example prompts:</span
		>
		{#each examplePrompts as prompt (prompt)}
			<button
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

<style lang="postcss">
	.submit {
		@apply m-1 md:px-4 lg:px-6 md:pt-1 border;
		@apply self-end flex items-center justify-center gap-2;
		@apply font-mono uppercase tracking-[1px] text-sm;
		@apply border-chalkboard-100 dark:border-chalkboard-20;
		@apply bg-green;
		@apply disabled:bg-chalkboard-40 dark:disabled:bg-chalkboard-70;
	}

	.prompt-buttons {
		@apply flex flex-wrap gap-2 mt-4;
	}

	.prompt-buttons button {
		@apply text-sm tracking-wider rounded-full border pt-0.5 pb-0 px-3;
		@apply bg-transparent hover:bg-green/50;
		@apply text-chalkboard-70 dark:text-chalkboard-50 hover:text-chalkboard-120 dark:hover:text-chalkboard-10;
		@apply border-chalkboard-30 dark:border-chalkboard-70;
		@apply hover:border-chalkboard-120 dark:hover:border-chalkboard-10;
		@apply hover:bg-green/20 text-chalkboard-120 dark:text-chalkboard-20 hover:hue-rotate-15;
	}
</style>
