<script lang="ts">
	import type { CADFormat, PromptResponse } from '$lib/endpoints'

	export let data: PromptResponse
	let outputFormat: CADFormat = 'step'

	$: dataUrl = `data:text/${outputFormat};base64,${data.outputs ? data.outputs[outputFormat] : ''}`
</script>

<pre class="border p-4 my-12 first-of-type:mt-0 overflow-auto">
    {JSON.stringify(data, null, 2)}
</pre>
<a href={`view/${data.id}`}>View model</a>
<a href={dataUrl} download>Download model</a>
