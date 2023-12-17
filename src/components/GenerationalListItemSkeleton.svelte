<div class="shimmer-skeleton relative overflow-hidden">
	<div class="grid md:grid-cols-2 lg:grid-cols-3 border items-stretch">
		<h3 class="font-normal font-mono lg:col-span-2 px-2 py-6 lg:px-4 lg:py-16 border-r">
			<span class="block text-sm uppercase text-chalkboard-70 dark:text-chalkboard-40"
				>Loading...</span
			>
		</h3>
	</div>
	<div class="grid grid-cols-2 lg:grid-cols-3 border border-t-0 items-stretch">
		<div
			role="presentation"
			class="text-transparent m-0 px-4 py-1 lg:col-span-2 flex items-center justify-between border-r"
		>
			We're fetching your part, this is dummy text!
		</div>
	</div>
</div>

<style>
	.shimmer-skeleton::before {
		content: '';
		@apply absolute z-0 inset-0 -inset-y-1/2;
		@apply bg-gradient-to-t from-transparent via-green/80 to-transparent;
		animation: shimmer 2s ease-in-out infinite;
	}

	@keyframes shimmer {
		0% {
			transform: translateY(100%);
		}
		100% {
			transform: translateY(-100%);
		}
	}
</style>
