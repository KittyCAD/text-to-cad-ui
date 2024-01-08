<script lang="ts">
	import type { Models } from '@kittycad/lib'
	import Logo from './Logo.svelte'
	import { paths } from '$lib/paths'
	import AccountMenu from './AccountMenu.svelte'
	import GenerationList from './GenerationList.svelte'
	import { page } from '$app/stores'

	export let user: Models['User_type']
	export let className = ''
</script>

<nav class={'sidebar ' + className}>
	<header>
		<a href={paths.ZOO_SITE} rel="noopener noreferrer" target="_blank">
			<Logo className="h-4 lg:h-6 hover:text-green" />
		</a>
		<a
			href={paths.DASHBOARD}
			class={'new-prompt' + ($page.url.pathname === paths.DASHBOARD ? ' opacity-0' : '')}
		>
			New prompt +
		</a>
	</header>
	<div class="flex-auto overflow-hidden border-y">
		<GenerationList />
	</div>
	<footer>
		<AccountMenu {user} />
	</footer>
</nav>

<style lang="postcss">
	.sidebar {
		@apply bg-white dark:bg-chalkboard-120;
		@apply flex flex-col max-h-full overflow-hidden;
		@apply border-r;
	}

	.sign-in {
		@apply font-mono text-sm uppercase tracking-[1px] px-2 pt-1 pb-0.5 hover:bg-green hover:text-chalkboard-120;
	}

	header,
	footer {
		@apply flex items-center justify-between;
		@apply px-2 py-1 md:px-4 lg:px-6 lg:py-4;
	}

	.new-prompt {
		@apply flex items-center justify-center;
		@apply font-mono text-sm uppercase tracking-[1px] px-2 py-1 pt-1.5;
		@apply rounded-sm border border-green hover:bg-green/10;
	}
</style>
