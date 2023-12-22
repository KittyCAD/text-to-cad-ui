<script lang="ts">
	import type { Models } from '@kittycad/lib'
	import Logo from './Logo.svelte'
	import { page } from '$app/stores'
	import { paths } from '$lib/paths'
	import AccountMenu from './AccountMenu.svelte'

	export let user: Models['User_type'] | undefined
</script>

<nav class="nav">
	<a href={paths.ZOO_SITE} rel="noopener noreferrer" target="_blank">
		<Logo className="h-6 lg:h-8 hover:text-green" />
	</a>
	{#if user}
		<AccountMenu {user} />
	{:else}
		<a href={paths.SIGN_IN($page.url.origin.concat(paths.DASHBOARD))} class="sign-in">Sign in</a>
	{/if}
</nav>

<style lang="postcss">
	.nav {
		@apply bg-white dark:bg-chalkboard-120;
		@apply mx-2 md:mx-5 lg:mx-auto mt-2 lg:mt-4 max-w-5xl;
		@apply sticky z-10 top-0 flex justify-between items-center;
		@apply border px-2 py-1 z-20;
	}

	.sign-in {
		@apply font-mono text-sm uppercase tracking-[1px] px-2 pt-1 pb-0.5 hover:bg-green hover:text-chalkboard-120;
	}
</style>
