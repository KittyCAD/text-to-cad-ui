<script lang="ts">
	import { Canvas } from '@threlte/core'
	import type { PageData } from './$types'
	import ModelPreviewer from 'components/ModelPreviewer.svelte'
	import type { CADFormat } from '$lib/endpoints'

	export let data: PageData

	let outputFormat: CADFormat = 'gltf'

	let output: string | undefined = ''
	// // Outputs will only be set if the model has completed processing.
	// if (data.body.outputs) {
	// 	for (const [key, value] of Object.entries(data.body.outputs)) {
	// 		if (key.endsWith('gltf')) {
	// 			output = value as string | undefined
	// 		}
	// 	}
	// }

	// $: dataUrl = `data:text/${outputFormat};base64,${output}`
	const gltfUrl = `data:model/gltf+json;base64,${
		data.body?.outputs ? data.body.outputs['source.gltf'] : ''
	}`
</script>

<p class="font-display font-bold text-3xl ml-4 mb-16">
	Text to <span class="text-stroke text-stroke-chalkboard-100 dark:text-stroke-chalkboard-20"
		>CAD</span
	>
</p>
<a
	href="/"
	class="block w-fit text-xs px-2 py-1 mb-4 hover:bg-chalkboard-20 dark:hover:bg-chalkboard-90"
	>⬅ Back to home</a
>
<div>
	<div class="grid grid-cols-2 md:grid-cols-3 border items-stretch">
		<h1 class="font-normal font-mono lg:col-span-2 border-r px-2 py-6 lg:px-4 lg:py-16">
			<span class="block text-sm uppercase text-chalkboard-70 dark:text-chalkboard-40"
				>Your Prompt</span
			>
			<span class="sr-only">: </span>
			<span class="block text-lg">"{data.body.prompt}"</span>
		</h1>
	</div>
	<div class="relative h-[50vh] min-h-[500px] border border-t-0">
		<Canvas>
			<ModelPreviewer dataUrl={gltfUrl} />
		</Canvas>
	</div>
	<div
		class="w-full flex items-center justify-between px-2 lg:px-4 py-1 border border-t-0 text-xs font-mono text-chalkboard-70 dark:text-chalkboard-40"
	>
		<p>Submitted {data.body.created_at}</p>
		<p>Completed {data.body.completed_at}</p>
	</div>
</div>
<details>
	<summary>page data</summary>
	<pre>{JSON.stringify(data, null, 2)}</pre>
</details>
