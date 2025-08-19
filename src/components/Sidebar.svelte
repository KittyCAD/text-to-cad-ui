<script lang="ts">
	import Close from 'components/Icons/Close.svelte'
	import Sidebar from 'components/Icons/Sidebar.svelte'
	import GenerationList from 'components/GenerationList.svelte'
	import BillingDialog from './BillingDialog.svelte'
	import { page } from '$app/stores'
	import { env } from '$lib/env'

	export let className = ''
	export let credits: number | undefined
	export let allowance: number | undefined
	let isSidebarOpen = false

	// Close the sidebar on navigation
	$: if ($page.url.pathname) {
		isSidebarOpen = false
	}
</script>

<nav class={'sidebar ' + className} class:open={isSidebarOpen}>
	<header>
		<button
			class="flex md:hidden text-sm items-center gap-2"
			on:click={() => {
				isSidebarOpen = !isSidebarOpen
			}}
		>
			{#if isSidebarOpen}
				<Close class="w-6 h-6 md:w-5 md:h-5" />
				<span>Close prompt history</span>
			{:else}
				<Sidebar class="w-6 h-6 md:w-5 md:h-5" />
				<span>View prompt history</span>
			{/if}
		</button>
	</header>
	<div class="mobile-contents hidden md:contents">
		<div class="flex-auto overflow-hidden border-b border-chalkboard-30 dark:border-chalkboard-90">
			<GenerationList />
		</div>
		<div>
			<BillingDialog
				upgradeHref={env.VITE_SITE_BASE_URL + '/design-studio-pricing'}
				{credits}
				{allowance}
				className="rounded-none"
				text={{
					heading: { limited: 'Get more Text-to-CAD credits' },
					paragraph: { limited: 'Upgrade your plan, starting at $20!' }
				}}
			/>
		</div>
	</div>
</nav>

<style lang="postcss">
	.sidebar {
		@apply bg-white dark:bg-chalkboard-100;
		@apply flex flex-col md:max-h-full overflow-hidden;
		@apply flex-none;
		@apply justify-between md:justify-start;
		@apply border-b border-chalkboard-30 dark:border-chalkboard-90 md:border-b-0 md:border-r;
	}

	.sidebar.open {
		@apply fixed z-10 inset-0 border-b-0;
	}

	.sign-in {
		@apply font-mono text-sm uppercase px-2 pt-1 pb-0.5 hover:bg-green hover:text-chalkboard-110;
	}

	header {
		@apply flex items-center justify-between;
		@apply px-4 py-2 lg:px-6;
	}

	header {
		@apply md:hidden;
	}

	.open header {
		@apply border-b border-chalkboard-30 dark:border-chalkboard-90 md:border-b-0;
	}

	.open .mobile-contents {
		@apply max-sm:contents;
	}
</style>
