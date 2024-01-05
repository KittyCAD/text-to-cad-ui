<script lang="ts">
	import Sidebar from 'components/Sidebar.svelte'
	import type { LayoutData } from './$types'

	export let data: LayoutData
</script>

<div class="pane-layout">
	<Sidebar user={data ? data.user : undefined} className="w-full" />
	<main>
		<div class="main-content">
			<slot />
		</div>
	</main>
</div>

<style lang="postcss">
	:global(html) {
		overflow: hidden;
	}

	.pane-layout {
		@apply h-screen overflow-hidden grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5;
	}

	main {
		@apply md:col-span-2 lg:col-span-4 max-h-full overflow-auto;
	}

	.main-content {
		@apply mx-2 md:mx-5 lg:mx-auto max-w-5xl;
	}
</style>
