<script lang="ts">
	import Sidebar from 'components/Sidebar.svelte'
	import type { LayoutData } from './$types'

	export let data: LayoutData
</script>

<div class="h-screen overflow-hidden flex flex-col" style="height: 100dvh;">
	<!-- A banner that warns this is not the latest version of the app -->
	<div
		class="top-0 left-0 right-0 z-50 text-center py-1"
		style="background: red;opacity:0.6; position:relative"
	>
		<span class="font-bold">This is an old version of the model.</span>
		<span class="font-bold"
			>Please <a href="https://zoo.dev/modeling-app/download" style="border-bottom: 2px solid"
				>download the latest alpha version</a
			>
			or
			<a href="https://zoo.dev/modeling-app/download/nightly" style="border-bottom: 2px solid;"
				>nightly version</a
			> (if you are feeling on the wild side) of the Modeling App.</span
		>
		<span class="font-bold">The newer version will be updated on this site soon.</span>
	</div>
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
