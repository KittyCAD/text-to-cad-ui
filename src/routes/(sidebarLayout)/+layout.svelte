<script lang="ts">
	import Sidebar from 'components/Sidebar.svelte'
	import type { LayoutData } from './$types'
	import { paths } from '$lib/paths'

	export let data: LayoutData
</script>

<div class="h-screen overflow-hidden flex flex-col">
	{#if data.user?.block}
		<div class="h-fit bg-destroy-10 text-center tracking-wide p-4 text-xl text-destroy-80">
			{#if data.user.block === 'missing_payment_method'}
				<p>
					You've used up all your free credits. To continue using Text-to-CAD, please add a payment
					method to <a href={paths.ZOO_BILLING} class="underline">your Zoo account</a>.
				</p>
			{:else if data.user.block === 'payment_method_failed'}
				<p>
					Your payment method failed to process. To continue using Text-to-CAD, please provide a new
					one within <a href={paths.ZOO_BILLING} class="underline">your Zoo account</a>.
				</p>
			{/if}
		</div>
	{:else}
		<p>not blocked</p>
	{/if}
	<div class="pane-layout">
		<Sidebar user={data ? data.user : undefined} className="md:w-80" />
		<main>
			<div class="main-content">
				<slot />
			</div>
		</main>
	</div>
</div>

<style lang="postcss">
	:global(html) {
		overflow: hidden;
	}

	.pane-layout {
		@apply h-screen overflow-hidden flex flex-col md:flex-row;
	}

	main {
		@apply flex-auto max-h-full overflow-auto;
	}

	.main-content {
		@apply mx-2 md:mx-5 lg:mx-auto max-w-5xl;
	}
</style>
