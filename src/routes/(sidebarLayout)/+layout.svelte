<script lang="ts">
	import AppHeader from 'components/AppHeader.svelte'
	import Sidebar from 'components/Sidebar.svelte'
	import type { LayoutData } from './$types'

	export let data: LayoutData
</script>

<div class="h-screen overflow-hidden flex flex-col" style="height: 100dvh;">
	<AppHeader user={data ? data.user : undefined} />
	<div class="pane-layout">
		<Sidebar className="md:w-80" credits={data.credits} allowance={data.allowance} />
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
		@apply overflow-hidden flex flex-col flex-1 md:flex-row;
	}

	main {
		@apply flex-auto max-h-full overflow-auto;
	}

	.main-content {
		@apply h-full mx-2 md:mx-5 lg:mx-auto max-w-5xl;
	}
</style>
