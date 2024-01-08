<script lang="ts">
	import type { Models } from '@kittycad/lib'
	import Logo from './Logo.svelte'
	import { paths } from '$lib/paths'
	import AccountMenu from 'components/AccountMenu.svelte'
	import Close from 'components/Icons/Close.svelte'
	import Menu from 'components/Icons/Menu.svelte'
	import Plus from 'components/Icons/Plus.svelte'
	import GenerationList from 'components/GenerationList.svelte'
	import { page } from '$app/stores'

	export let user: Models['User_type']
	export let className = ''
	let isSidebarOpen = false

	// Close the sidebar on navigation
	$: if ($page.url.pathname) {
		isSidebarOpen = false
	}
</script>

<nav class={'sidebar ' + className} class:open={isSidebarOpen}>
	<header>
		<button
			class="flex md:hidden"
			on:click={() => {
				isSidebarOpen = !isSidebarOpen
			}}
		>
			{#if isSidebarOpen}
				<Close class="w-8 h-8 md:w-5 md:h-5" />
			{:else}
				<Menu class="w-8 h-8 md:w-5 md:h-5" />
			{/if}
			<span class="sr-only">Open menu</span>
		</button>
		<a href={paths.ZOO_SITE} rel="noopener noreferrer" target="_blank">
			<Logo className="h-4 lg:h-6 hover:text-green" />
		</a>
		<a
			href={paths.DASHBOARD}
			class={'new-prompt border-transparent md:border-green bg-green md:bg-transparentmd:hover:bg-green/10 ' +
				($page.url.pathname === paths.DASHBOARD ? ' opacity-0' : '')}
		>
			<span class="sr-only md:not-sr-only pt-0.5">New prompt</span>
			<Plus class="w-8 h-8 md:w-5 md:h-5" />
		</a>
	</header>
	<div class="mobile-contents hidden md:block">
		<div class="flex-auto overflow-hidden border-y">
			<GenerationList />
		</div>
		<footer>
			<AccountMenu {user} />
		</footer>
	</div>
</nav>

<style lang="postcss">
	.sidebar {
		@apply bg-white dark:bg-chalkboard-120;
		@apply flex flex-col md:max-h-full overflow-hidden;
		@apply flex-none md:flex-auto;
		@apply justify-between md:justify-start;
		@apply border-b md:border-b-0 md:border-r;
	}

	.sidebar.open {
		@apply fixed z-10 inset-0 border-b-0;
	}

	.sign-in {
		@apply font-mono text-sm uppercase tracking-[1px] px-2 pt-1 pb-0.5 hover:bg-green hover:text-chalkboard-120;
	}

	header,
	footer {
		@apply flex items-center justify-between;
		@apply px-4 py-4 lg:px-6;
	}

	.new-prompt {
		@apply flex items-center justify-center;
		@apply font-mono text-sm uppercase tracking-[1px] px-2 py-1;
		@apply rounded-sm border;
	}

	.open .mobile-contents {
		@apply contents;
	}
</style>
