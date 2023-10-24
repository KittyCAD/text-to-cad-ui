<script lang="ts">
	import { browser } from '$app/environment'
	import { endpoints, type CADFormat, type PromptResponse } from '$lib/endpoints'
	import { Canvas } from '@threlte/core'
	import ModelPreviewer from './ModelPreviewer.svelte'
	import type { LoadResponse } from '../routes/api/get-generation/+server'

	export let data: PromptResponse
	let outputFormat: CADFormat = 'gltf'

	let output: string | undefined = ''
	// Outputs will only be set if the model has completed processing.
	if (data.outputs) {
		for (const [key, value] of Object.entries(data.outputs)) {
			if (key.endsWith('gltf')) {
				output = value as string | undefined
			}
		}
	}

	let poller: ReturnType<typeof setInterval> | undefined

	const setupPoller = (id: string) => {
		if (poller) {
			clearInterval(poller)
		}
		poller = setInterval(doPoll(id), 8000)
	}

	const doPoll = (id: string) => async () => {
		const newResponse: LoadResponse = await fetch(endpoints.localView, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ id })
		})
			.then((res) => res.json())
			.catch((err) => console.error(err))

		data = newResponse.body ? newResponse.body : data
	}

	$: if (browser && data.status !== 'completed') {
		setupPoller(data.id)
	} else if (browser && data.status === 'completed' && poller) {
		clearInterval(poller)
	}

	$: dataUrl = `data:text/${outputFormat};base64,${output}`
	$: gltfUrl = `data:model/gltf+json;base64,${data.outputs ? data.outputs['source.gltf'] : ''}`
</script>

{#if data.status !== 'failed'}
	<div>
		<div class="grid md:grid-cols-2 lg:grid-cols-3 border items-stretch">
			<h3 class="font-normal font-mono lg:col-span-2 px-2 py-6 lg:px-4 lg:py-16 border-r">
				<span class="block text-sm uppercase text-chalkboard-70 dark:text-chalkboard-40"
					>Your Prompt</span
				>
				<span class="sr-only">: </span>
				<span class="block text-lg">"{data.prompt}"</span>
			</h3>
			{#if data.outputs && data.status === 'completed'}
				<div class="relative">
					<Canvas>
						<ModelPreviewer dataUrl={gltfUrl} />
					</Canvas>
				</div>
			{:else}
				<div class="shimmer-skeleton relative overflow-hidden flex items-center justify-center">
					<p class="font-mono text-sm text-energy-50">Generating...</p>
				</div>
			{/if}
		</div>
		<div class="grid grid-cols-2 lg:grid-cols-3 border border-t-0 items-stretch">
			<dl
				class="m-0 px-4 py-1 lg:col-span-2 flex items-center justify-between text-xs font-mono text-chalkboard-70 dark:text-chalkboard-40 border-r"
			>
				<div class="flex gap-2">
					<dt>Submitted</dt>
					<dd>{data.created_at}</dd>
				</div>
				{#if data.status === 'completed'}
					<div class="flex gap-2">
						<dt>Completed</dt>
						<dd>{data.completed_at}</dd>
					</div>
				{/if}
			</dl>
			{#if data.outputs && data.status === 'completed'}
				<ul class="m-0 p-0 flex items-stretch">
					<li class="contents">
						<a href={`view/${data.id}`} class="link flex-auto border-r">View model</a>
					</li>
					<li class="contents">
						<a href={dataUrl} download={`${data.id}.${outputFormat}`} class="link flex-auto"
							>Download model</a
						>
					</li>
				</ul>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	.shimmer-skeleton::before {
		content: '';
		@apply absolute z-0 inset-0 -inset-y-1/2;
		@apply bg-gradient-to-t from-transparent via-energy-20/20 to-transparent;
		animation: shimmer 2s ease-in-out infinite;
	}

	@keyframes shimmer {
		0% {
			transform: translateY(100%);
		}
		100% {
			transform: translateY(-100%);
		}
	}

	.link {
		@apply text-center;
		@apply px-2 py-1;
		@apply hover:bg-chalkboard-20 dark:hover:bg-chalkboard-90;
	}
</style>
