<script lang="ts">
	import { CADMIMETypes, type CADFormat, type PromptResponse, endpoints } from '$lib/endpoints'
	import { base64ToBlob } from '$lib/base64ToBlob'
	import type { ConvertResponse } from '../routes/api/convert/[output_format]/+server'
	import { toKebabCase } from '$lib/toKebabCase'

	export let prompt: string = ''
	export let outputs: PromptResponse['outputs']
	export let className: string = ''
	let currentOutput: CADFormat = 'gltf'
	let outputData = outputs ? outputs[`source.${currentOutput}`] : ''
	let status: 'loading' | 'ready' | 'failed' = 'ready'

	$: currentMimeType = CADMIMETypes[currentOutput]
	$: dataUrl = `data:${currentMimeType};base64,${outputData}`
	$: fileName = `${toKebabCase(prompt)}.${currentOutput}`

	async function updateOutput(e: Event) {
		const currentTarget = e.currentTarget as HTMLSelectElement
		currentOutput = currentTarget.value as CADFormat
		status = 'loading'
		if (outputs[`source.${currentOutput}`]) {
			outputData = outputs[`source.${currentOutput}`]
		} else {
			const response = await fetch(endpoints.localConvert(currentOutput), {
				method: 'POST',
				headers: { 'Content-Type': 'application/octet-stream' },
				credentials: 'include',
				body: base64ToBlob(outputs['source.gltf']) // we always have gLTF
			})

			const responseData = (await response.json()) as ConvertResponse
			if (!response.ok || !responseData || !responseData.statusCode.toString().startsWith('2')) {
				status = 'failed'
				return
			}

			// TODO: handle asynchronous case where the conversion is not yet complete

			outputs[`source.${currentOutput}`] = responseData.outputs[`source.${currentOutput}`]
			outputData = outputs[`source.${currentOutput}`]
		}
		status = outputData ? 'ready' : 'failed'
	}
</script>

<div class={'split-button ' + className}>
	{#if status == 'ready'}
		<a href={dataUrl} download={fileName}> Download </a>
	{:else if status == 'loading'}
		<button disabled> Loading... </button>
	{:else}
		<button disabled> Failed </button>
	{/if}

	{#if status !== 'loading'}
		<select class="gui-popup" bind:value={currentOutput} on:change={updateOutput}>
			{#each Object.keys(CADMIMETypes) as format}
				<option value={format} selected={format == currentOutput}>
					{format}
				</option>
			{/each}
		</select>
	{:else}
		<div class="w-4 h-4 rounded-full border-2 border-l-0 animate-spin" />
	{/if}
</div>

<style lang="postcss">
	.split-button {
		@apply inline-flex justify-center items-center px-2 py-1 gap-4 relative;
		@apply font-mono text-energy-100 bg-energy-20 hover:bg-energy-10;
	}

	select {
		@apply bg-energy-10 border-0;
		@apply uppercase text-sm font-mono text-energy-100;
		@apply shadow-inner;
		@apply pl-2 pr-3 py-1 rounded-sm;
		@apply border-transparent hover:border-energy-100 border-solid border;
	}
</style>
