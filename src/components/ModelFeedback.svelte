<script lang="ts">
	import ThumbsUp from './ThumbsUp.svelte'
	import type { MlFeedback } from '@kittycad/lib'
	import { ml } from '@kittycad/lib'
	import { page } from '$app/stores'
	import { createZooClient } from '$lib/zooClient'
	import { toasts } from '$lib/toast'
	import { getApiErrorMessage } from '$lib/errors'

	export let modelId: string
	export let feedback: MlFeedback | undefined

	const giveFeedback = (newFeedback: MlFeedback) => async () => {
		if (feedback === newFeedback) return
		try {
			const client = createZooClient({ token: $page.data.token })
			await ml.create_text_to_cad_part_feedback({ client, id: modelId, feedback: newFeedback })
			feedback = newFeedback
			toasts.add('Thanks for the feedback!', 'success', 2000)
		} catch (e) {
			toasts.add(getApiErrorMessage(e, 'Failed to submit feedback'), 'error')
		}
	}
</script>

<div class="flex gap-2 justify-evenly items-center font-mono p-2">
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
