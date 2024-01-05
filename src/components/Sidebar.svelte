<script lang="ts">
	import type { Models } from '@kittycad/lib'
	import Logo from './Logo.svelte'
	import { paths } from '$lib/paths'
	import AccountMenu from './AccountMenu.svelte'
	import GenerationList from './GenerationList.svelte'

	export let user: Models['User_type']
	export let className = ''
</script>

<nav class={'sidebar ' + className}>
	<a href={paths.ZOO_SITE} rel="noopener noreferrer" target="_blank">
		<Logo className="h-6 lg:h-8 hover:text-green" />
	</a>
	<div class="flex-auto overflow-hidden border-y">
		<GenerationList />
	</div>
	<AccountMenu {user} />
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
</style>
