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

<div class="flex gap-2 justify-evenly items-center font-mono">
	Rate
	<button
		on:click={giveFeedback('thumbs_down')}
		class={(feedback === 'thumbs_down' ? 'text-destroy-40 ' : '') +
			'hover:text-destroy-40 focus:text-destroy-40'}
	>
		<ThumbsUp class="w-4 md:w-6 h-auto -scale-x-100 rotate-180" />
	</button>
	<button
		on:click={giveFeedback('thumbs_up')}
		class={(feedback === 'thumbs_up' ? 'text-succeed-40 ' : '') +
			'hover:text-succeed-40 focus:text-succeed-40'}
	>
		<ThumbsUp class="w-4 md:w-6 h-auto -scale-x-100" />
	</button>
</div>
