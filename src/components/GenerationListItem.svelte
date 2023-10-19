<script lang="ts">
	import type { CADFormat, PromptResponse } from '$lib/endpoints'
	import ModelViewer from './ModelViewer.svelte'

	export let data: PromptResponse
	let outputFormat: CADFormat = 'gltf'
	console.log(data)

	let output: string | undefined = ''
	// Outputs will only be set if the model has completed processing.
	if (data.outputs) {
		for (const [key, value] of Object.entries(data.outputs)) {
			if (key.endsWith('gltf')) {
				output = value as string | undefined
			}
		}
	}

	$: dataUrl = `data:text/${outputFormat};base64,${output}`

	const gltfUrl = `data:application/json;base64,${data.outputs ? data.outputs['source.gltf'] : ''}`
	console.log('gltfUrl', gltfUrl)
</script>

<div>
	<div class="grid md:grid-cols-2 lg:grid-cols-3 border items-stretch">
		<div class="lg:col-span-2 border-r px-2 py-6 lg:px-4 lg:py-16">
			<h3>Your Prompt</h3>
			<p class="text-lg">"{data.prompt}"</p>
			<p class="text-sm text-gray-500">Submitted {data.created_at}</p>
			<p class="text-sm text-gray-500">Status: {data.status}</p>
			{#if data.error}
				<p class="text-sm text-red-500">Error: {data.error}</p>
			{/if}
		</div>
		{#if data.outputs && gltfUrl}
			<div class="relative">
				<ModelViewer dataUrl={gltfUrl} />
			</div>
		{/if}
	</div>
	{#if data.outputs}
		<ul class="m-0 p-0">
			<li class="contents"><a href={`view/${data.id}`}>View model</a></li>
			<li class="contents"><a href={dataUrl} download>Download model</a></li>
		</ul>
	{/if}
</div>
