<script lang="ts">
	import { browser } from '$app/environment'
	import { endpoints, type PromptResponse } from '$lib/endpoints'
	import { Canvas } from '@threlte/core'
	import ModelPreviewer from './ModelPreviewer.svelte'
	import type { LoadResponse } from '../routes/api/get-generation/+server'
	import { createEventDispatcher } from 'svelte'
	import type { GenerationEvents } from '$lib/types'
	import DownloadButton from './DownloadButton.svelte'
	import ArrowRight from './Icons/ArrowRight.svelte'
	const dispatch = createEventDispatcher<GenerationEvents>()

	export let data: PromptResponse
	export let shouldRenderModel = true
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

	// For displaying the THREE.js model
	$: gltfUrl = `data:model/gltf+json;base64,${data.outputs ? data.outputs['source.gltf'] : ''}`

	function retry(prompt: string) {
		return () => {
			dispatch('retryprompt', prompt)
		}
	}
</script>

<div>
	<div class="grid md:grid-cols-2 lg:grid-cols-3 border items-stretch">
		<h3
			class="font-normal font-mono lg:col-span-2 px-2 py-6 lg:px-4 lg:py-16 md:border-r box-border"
		>
			<span class="block text-sm uppercase text-chalkboard-70 dark:text-chalkboard-40"
				>Your Prompt</span
			>
			<span class="sr-only">: </span>
			<span class="block text-lg">"{data.prompt}"</span>
		</h3>
		{#if data.outputs && data.status === 'completed'}
			<div class="relative min-h-[33vh] border-t md:border-t-0">
				{#if shouldRenderModel}
					<Canvas>
						<ModelPreviewer dataUrl={gltfUrl} enableZoom={false} />
					</Canvas>
				{/if}
			</div>
		{:else if data.status === 'failed' || error}
			<div
				class="failed dark:dark relative overflow-hidden min-h-[33vh] border-t md:border-t-0 flex items-center justify-center p-4"
			>
				<p class="font-mono text-xs text-destroy-50">
					{data?.error
						? data.error
						: error?.status
						? `Error ${error.status}: ${error.message}`
						: 'CAD model generation failed, try again later'}
				</p>
			</div>
		{:else}
			<div
				class="shimmer-skeleton relative overflow-hidden min-h-[33vh] border-t md:border-t-0 flex items-center justify-center"
			>
				<p class="font-mono text-sm text-green">Generating...</p>
			</div>
		{/if}
	</div>
	<div class="grid md:grid-cols-2 lg:grid-cols-3 border border-t-0 items-stretch">
		<dl
			class="m-0 px-2 md:px-4 py-1 lg:col-span-2 flex flex-col md:flex-row md:items-center order-1 md:order-none justify-between text-xs font-mono text-chalkboard-70 dark:text-chalkboard-40 md:border-r"
		>
			<div class="flex gap-2">
				<dt>Submitted</dt>
				<dd>{data.created_at}</dd>
			</div>
			{#if data.status === 'completed' || data.status === 'failed'}
				<div class="flex gap-2">
					<dt class="capitalize">{data.status}</dt>
					<dd>{data.completed_at}</dd>
				</div>
			{/if}
		</dl>
		{#if data.outputs && data.status === 'completed'}
			<ul class="m-0 p-0 flex flex-col md:flex-row items-stretch">
				<DownloadButton className="link flex-auto" outputs={data.outputs} prompt={data.prompt} />
				<li class="contents">
					<a
						href={`view/${data.id}`}
						class="link font-mono uppercase text-sm tracking-[1px] flex-auto md:border-l reverse hover:text-chalkboard-120 hover:!bg-green border-chalkboard-70 dark:border-chalkboard-40"
					>
						<span class="mt-1">View</span>
						<ArrowRight class="w-4 h-4 ml-2" />
					</a>
				</li>
			</ul>
		{:else if data.error}
			<button
				on:click={retry(data.prompt)}
				class="font-mono uppercase tracking-[1px] text-sm link w-full justify-center flex items-center text-center border-b md:border-b-0"
				>Retry Prompt</button
			>
		{/if}
	</div>
</div>

<style lang="postcss">
	.failed {
		@apply bg-destroy-10/20;
		@apply text-destroy-80;
		@apply border-chalkboard-70;
	}
	@media (prefers-color-scheme: dark) {
		.failed {
			@apply bg-destroy-80/10;
			@apply text-destroy-10;
			@apply border-chalkboard-40;
		}
	}

	.shimmer-skeleton::before {
		content: '';
		@apply absolute z-0 inset-0 -inset-y-1/2;
		@apply bg-gradient-to-t from-transparent via-green/80 to-transparent;
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
		@apply text-center flex items-center justify-center;
		@apply px-2 py-4;
		@apply hover:bg-chalkboard-20 dark:hover:bg-chalkboard-90;
	}
	.link:global(.reverse) {
		@apply hover:bg-chalkboard-90 dark:hover:bg-chalkboard-20;
	}
</style>
