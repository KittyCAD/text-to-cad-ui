<script lang="ts">
	import type { PromptResponse } from '$lib/endpoints'
	import ThumbsUp from './ThumbsUp.svelte'

	export let modelId: string
	export let feedback: PromptResponse['feedback']

	const giveFeedback = (newFeedback: PromptResponse['feedback']) => async () => {
		console.log(feedback, modelId, newFeedback)
		// await fetch(`/api/feedback`, {
		//     method: 'POST',
		//     headers: { 'Content-Type': 'application/json' },
		//     credentials: 'include',
		//     body: JSON.stringify({ feedback })
		// })
	}
</script>

<div class="flex gap-2 justify-evenly items-center font-mono">
	Rate
	<button
		on:click={giveFeedback('thumbs_down')}
		class="hover:text-destroy-40 focus:text-destroy-40"
	>
		<ThumbsUp class="w-4 md:w-6 h-auto -scale-x-100 rotate-180" />
	</button>
	<button on:click={giveFeedback('thumbs_up')} class="hover:text-succeed-40 focus:text-succeed-40">
		<ThumbsUp class="w-4 md:w-6 h-auto -scale-x-100" />
	</button>
</div>
