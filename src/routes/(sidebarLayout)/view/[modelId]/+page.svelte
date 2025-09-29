<script lang="ts">
	import { Canvas } from '@threlte/core'
	import ModelViewer from 'components/ModelViewer.svelte'
	import ModelFeedback from 'components/ModelFeedback.svelte'
	import DownloadButton from 'components/DownloadButton.svelte'
	import type { TextToCad } from '@kittycad/lib'
	import Spinner from 'components/Icons/Spinner.svelte'
	import { browser } from '$app/environment'
	import ErrorCard from 'components/ErrorCard.svelte'
	import { combinedGenerations, unreadGenerations, userSettings } from '$lib/stores'
	import { invalidateAll, onNavigate } from '$app/navigation'
	import { navigating } from '$app/stores'
	import { stringToBase64 } from '$lib/base64'
	import Checkmark from 'components/Icons/Checkmark.svelte'

	export let data: TextToCad
	$: status = $combinedGenerations.find((g) => g.id === data.id)?.status ?? data.status
	let isSceneEmpty = false

	onNavigate(() => {
		isSceneEmpty = false
	})

	$: if (browser && (status === 'completed' || status === 'failed')) {
		unreadGenerations.update((g) => g.filter((id) => id !== data.id))
		if (data.status !== 'completed' && data.status !== 'failed') {
			invalidateAll()
		}
	}

	$: gltfUrl = `data:model/gltf+json;base64,${data.outputs ? data.outputs['source.gltf'] : ''}`

	$: zooDesignStudioUrl = data.code
		? `https://app.zoo.dev?ask-open-desktop=true&create-file=true&name=deeplinkscopy&code=${encodeURIComponent(
				stringToBase64(data.code)
		  )}`
		: ''
</script>

<section class="flex flex-col" style="min-height: 100dvh">
	{#if $navigating}
		<div class="flex-1 flex flex-col justify-center items-center">
			<p class="mb-4">Loading your model</p>
			<Spinner class="block w-10 h-10 animate-spin" />
		</div>
	{:else}
		<div class="md:mt-16 grid md:grid-cols-3 items-stretch gap-4">
			<h1
				class="font-normal font-mono md:col-span-2 md:border border-chalkboard-30 dark:border-chalkboard-90 rounded px-2 py-4 lg:px-4"
			>
				<span class="block text-sm uppercase text-chalkboard-70 dark:text-chalkboard-40"
					>Your Prompt</span
				>
				<span class="sr-only">: </span>
				<span class="block">"{data.prompt.trim()}"</span>
			</h1>
			{#if data.outputs}
				<div class="grid grid-rows-2 justify-stretch self-stretch items-stretch">
					<DownloadButton
						className="w-full rounded"
						outputs={data.outputs}
						prompt={data.prompt}
						code={data.code ?? ''}
					/>
					<ModelFeedback modelId={data.id} feedback={data.feedback} />
				</div>
			{:else if data.status === 'failed'}
				<div class="flex justify-stretch">
					<a
						href={`/dashboard?prompt=${data.prompt}`}
						class="fallback-button border rounded border-green text-green hover:bg-green hover:text-chalkboard-110"
					>
						Retry prompt</a
					>
				</div>
			{:else}
				<div class="flex justify-stretch self-stretch items-stretch">
					<p class="w-full flex items-center justify-center row-span-2">Generating...</p>
				</div>
			{/if}
		</div>
		{#if data.outputs && data.status === 'completed'}
			{#if !isSceneEmpty}
				<div class="relative flex-grow min-h-[500px]">
					<Canvas>
						<ModelViewer
							on:emptyscene={() => {
								isSceneEmpty = true
							}}
							dataUrl={gltfUrl}
							enableAutoRotate={$userSettings.autoRotateModels}
						/>
					</Canvas>
					{#if data.code}
						<div
							class="absolute bottom-4 right-4 bg-chalkboard-10 dark:bg-chalkboard-110 border border-chalkboard-30 dark:border-chalkboard-90 rounded-lg p-4 shadow-lg max-w-xs"
						>
							<p class="text-sm font-medium mb-3 text-chalkboard-100 dark:text-chalkboard-10">
								Keep editing this model?
							</p>
							<div class="flex flex-col gap-2">
								<a
									href={zooDesignStudioUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="px-3 py-2 text-xs font-medium bg-green hover:bg-green/90 text-chalkboard-110 rounded transition-colors block text-center"
								>
									Open in Zoo Design Studio
								</a>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<div class="grid flex-grow place-content-center p-4">
					<ErrorCard error={'Model generated an empty scene.'} />
				</div>
			{/if}
		{:else if data.status === 'failed' && data.error}
			<div class="grid flex-grow place-content-center p-4">
				<ErrorCard error={data.error} />
			</div>
		{:else}
			<div class="flex-grow flex items-center justify-center">
				<Spinner class="w-10 h-10 animate-spin" />
			</div>
		{/if}
		<footer class="w-full footer-row">
			<p>Submitted {data.created_at}</p>
			<label class="order-1 xl:order-none flex items-center gap-2">
				Auto-rotate model
				{#if browser}
					<input type="checkbox" class="sr-only" bind:checked={$userSettings.autoRotateModels} />
					<div class="w-4 h-4 border border-chalkboard-30 dark:border-chalkboard-90">
						{#if $userSettings.autoRotateModels}
							<Checkmark class="w-full h-auto" />
						{/if}
					</div>
				{/if}
			</label>
			{#if data.outputs && data.status === 'completed'}
				<p>Generated {data.completed_at}</p>
			{:else if data.status === 'failed'}
				<p>Failed {data.completed_at}</p>
			{:else if data.status !== 'completed'}
				<p>Generating...</p>
			{/if}
		</footer>
	{/if}
</section>

<style lang="postcss">
	.fallback-button {
		@apply w-full flex items-center justify-center;
		@apply hover:bg-green hover:hue-rotate-15 py-4 md:py-1;
	}

	.footer-row {
		@apply flex flex-col gap-4 md:flex-row md:items-center justify-between px-2 lg:px-4 py-1;
		@apply border border-chalkboard-30 dark:border-chalkboard-90 border-b-0;
		@apply text-xs text-chalkboard-70 dark:text-chalkboard-40;
	}
</style>
