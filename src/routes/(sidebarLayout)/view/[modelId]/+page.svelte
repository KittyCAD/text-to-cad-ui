<script lang="ts">
	import { Canvas } from '@threlte/core'
	import ModelPreviewer from 'components/ModelPreviewer.svelte'
	import ModelFeedback from 'components/ModelFeedback.svelte'
	import DownloadButton from 'components/DownloadButton.svelte'
	import type { Models } from '@kittycad/lib'

	export let data: Models['TextToCad_type']

	$: gltfUrl = `data:model/gltf+json;base64,${data.outputs ? data.outputs['source.gltf'] : ''}`
</script>

<section class="min-h-screen flex flex-col">
	<div class="mt-16 grid md:grid-cols-3 lg:grid-cols-4 border items-stretch">
		<h1
			class="font-normal font-mono md:col-span-2 lg:col-span-3 border-r px-2 py-6 lg:px-4 lg:py-16"
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
		{/if}
	</div>
	<div class="relative flex-grow min-h-[500px]">
		<Canvas>
			<ModelPreviewer dataUrl={gltfUrl} />
		</Canvas>
	</div>
	<footer
		class="w-full flex flex-col md:flex-row md:items-center justify-between px-2 lg:px-4 py-1 border border-b-0 text-xs font-mono text-chalkboard-70 dark:text-chalkboard-40"
	>
		<p>Submitted {data.created_at}</p>
		<p>Completed {data.completed_at}</p>
	</footer>
</section>
