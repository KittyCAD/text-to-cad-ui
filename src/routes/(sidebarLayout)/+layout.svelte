<script lang="ts">
	import Sidebar from 'components/Sidebar.svelte'
	import type { LayoutData } from './$types'

	export let data: LayoutData
</script>

<div class="h-screen overflow-hidden flex flex-col" style="height: 100dvh;">
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
		height: 100dvh;
	}

	main {
		@apply flex-auto max-h-full overflow-auto;
	}

	.main-content {
		@apply mx-2 md:mx-5 lg:mx-auto max-w-5xl;
	}
</style>
