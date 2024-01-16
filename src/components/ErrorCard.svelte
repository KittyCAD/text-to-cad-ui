<script lang="ts">
	export let error: string
	let card: HTMLDivElement

	function handleMouseMove(e: MouseEvent) {
		if (!card) return
		const rect = card.getBoundingClientRect()
		const xFromCenter = (e.clientX - rect.left - rect.width / 2) / rect.width
		const yFromCenter = (e.clientY - rect.top - rect.height / 2) / rect.height

		card.style.setProperty('--x-rotate', `${xFromCenter * 20}deg`)
		card.style.setProperty('--y-rotate', `${yFromCenter * 10}deg`)
	}
</script>

<!-- This hover doesn't affect a11y and is purely cosmetic, so we can ignore the warning -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="error-card" on:mousemove={handleMouseMove} bind:this={card}>
	<p class="error-tag font-mono text-sm">An error occurred:</p>
	<p class="font-mono mt-4">
		{error}
	</p>
</div>

<style lang="postcss">
	.error-card {
		--x-rotate: 0;
		--y-rotate: 0;
		@apply max-w-md p-4 md:p-8 rounded-md;
		@apply bg-destroy-10/20 dark:bg-destroy-80/20 text-destroy-80 dark:text-destroy-10;
		@apply border border-destroy-80;
		transform-style: preserve-3d;
		transform: rotate3d(0, 1, 0, var(--x-rotate)) rotate3d(1, 0, 0, var(--y-rotate));
	}

	.error-card > * {
		transform: translateZ(20px);
		pointer-events: none;
	}

	.error-card .error-tag {
		@apply text-destroy-70 dark:text-destroy-20;
	}
</style>
