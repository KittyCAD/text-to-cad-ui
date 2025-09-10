<script lang="ts">
	import { toasts, type Toast } from '$lib/toast'

	export let position: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left' = 'top-right'

	const posClass = {
		'top-right': 'top-2 right-2',
		'bottom-right': 'bottom-2 right-2',
		'top-left': 'top-2 left-2',
		'bottom-left': 'bottom-2 left-2'
	}[position]

	const variantClass: Record<Toast['variant'], string> = {
		info: 'bg-chalkboard-20 text-chalkboard-120 dark:bg-chalkboard-80 dark:text-chalkboard-10',
		success: 'bg-green text-chalkboard-110',
		error: 'bg-destroy-10 text-destroy-80'
	}
</script>

<div
	class={`fixed z-50 ${posClass} space-y-2 w-[min(92vw,28rem)]`}
	aria-live="polite"
	aria-atomic="true"
>
	{#each $toasts as t (t.id)}
		<div class={`rounded shadow border px-3 py-2 ${variantClass[t.variant]}`} role="status">
			{t.message}
		</div>
	{/each}
</div>
