<script lang="ts">
	import { Canvas } from '@threlte/core'
	import ModelPreviewer from 'components/ModelPreviewer.svelte'
	import ModelFeedback from 'components/ModelFeedback.svelte'
	import DownloadButton from 'components/DownloadButton.svelte'
	import type { Models } from '@kittycad/lib'
	import type { LoadResponse } from '../../../api/get-generation/+server'
	import Spinner from 'components/Icons/Spinner.svelte'
	import { browser } from '$app/environment'
	import { endpoints } from '$lib/endpoints'
	import ErrorCard from 'components/ErrorCard.svelte'

	export let data: Models['TextToCad_type']
	let poller: ReturnType<typeof setInterval> | undefined
	let error: { message: string; status: number }

	const setupPoller = (id: string) => {
		if (poller) {
			clearInterval(poller)
		}
		poller = setInterval(doPoll(id), 8000)
	}

	const doPoll = (id: string) => async () => {
		const res = await fetch(endpoints.localView, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ id })
		})
		const newResponse: LoadResponse = await res.json().catch((err) => {
			console.error(err)
			error = { message: 'Failed to poll for generation status', status: res.status }
		})

		data = newResponse.body ? newResponse.body : data
	}

	$: if (browser && data.status !== 'completed') {
		setupPoller(data.id)
	} else if (browser && data.status === 'completed' && poller) {
		clearInterval(poller)
	}

	$: gltfUrl = `data:model/gltf+json;base64,${data.outputs ? data.outputs['source.gltf'] : ''}`
</script>

<section class="min-h-screen flex flex-col">
	<div class="md:mt-16 grid md:grid-cols-3 lg:grid-cols-4 md:border items-stretch">
		<h1
			class="font-normal font-mono md:col-span-2 lg:col-span-3 md:border-r px-2 py-6 lg:px-4 lg:py-16"
		>
			<span class="block text-sm uppercase text-chalkboard-70 dark:text-chalkboard-40"
				>Your Prompt</span
			>
			<span class="sr-only">: </span>
			<span class="block text-lg">"{data.prompt}"</span>
		</h1>
		{#if data.outputs}
			<div class="grid grid-rows-2 justify-stretch self-stretch items-stretch">
				<DownloadButton className="w-full" outputs={data.outputs} prompt={data.prompt} />
				<ModelFeedback modelId={data.id} feedback={data.feedback} />
			</div>
		{:else if data.status === 'failed'}
			<div class="flex justify-stretch self-stretch items-stretch">
				<a href={`/dashboard?prompt=${data.prompt}`} class="link-text fallback-button bg-green">
					Retry prompt</a
				>
			</div>
		{:else}
			<div class="flex justify-stretch self-stretch items-stretch">
				<p class="link-text w-full flex items-center justify-center row-span-2">Generating...</p>
			</div>
		{/if}
	</div>
	{#if data.outputs && data.status === 'completed'}
		<div class="relative flex-grow min-h-[500px]">
			<Canvas>
				<ModelPreviewer dataUrl={gltfUrl} />
			</Canvas>
		</div>
	{:else if data.status === 'failed' && data.error}
		<div class="grid flex-grow place-content-center p-4">
			<ErrorCard error={data.error} />
		</div>
	{:else}
		<div class="flex-grow flex items-center justify-center">
			<Spinner class="w-10 h-10 animate-spin" />
		</div>
	{/if}
	<footer
		class="w-full flex flex-col md:flex-row md:items-center justify-between px-2 lg:px-4 py-1 border border-b-0 text-xs font-mono text-chalkboard-70 dark:text-chalkboard-40"
	>
		<p>Submitted {data.created_at}</p>
		{#if data.outputs && data.status === 'completed'}
			<p>Generated {data.completed_at}</p>
		{:else if data.status === 'failed'}
			<p>Failed {data.completed_at}</p>
		{:else if data.status !== 'completed'}
			<p>Generating...</p>
		{/if}
	</footer>
</section>

<style lang="postcss">
	.fallback-button {
		@apply w-full flex items-center justify-center;
		@apply hover:bg-green hover:hue-rotate-15 py-4 md:py-1;
	}
</style>
