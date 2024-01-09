<script lang="ts">
	import { endpoints, type PromptResponse } from '$lib/endpoints'
	import ThumbsUp from './ThumbsUp.svelte'

	export let modelId: string
	export let feedback: PromptResponse['feedback']

	const giveFeedback = (newFeedback: PromptResponse['feedback']) => () => {
		if (feedback !== newFeedback) {
			fetch(endpoints.localFeedback, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ feedback: newFeedback, id: modelId })
			}).catch((err) => console.error(err))

			// Optimistically update the UI
			feedback = newFeedback
		}
	}
</script>

<div class="flex md:flex-col lg:flex-row gap-2 justify-evenly items-center font-mono p-2">
	Rate
	<button
		on:click={giveFeedback('thumbs_down')}
		class={(feedback === 'thumbs_down' ? 'text-destroy-40 ' : '') +
			'hover:text-destroy-40 focus:text-destroy-40'}
	>
		<ThumbsUp class="w-6 h-auto -scale-x-100 rotate-180" />
		<span class="sr-only">Thumbs down</span>
	</button>
	<button
		on:click={giveFeedback('thumbs_up')}
		class={(feedback === 'thumbs_up' ? 'text-green ' : '') +
			'hover:text-green/80 focus:text-green/80'}
	>
		<ThumbsUp class="w-6 h-auto -scale-x-100" />
		<span class="sr-only">Thumbs up</span>
	</button>
</div>
