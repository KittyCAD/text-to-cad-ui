<script lang="ts" type="module">
	import type { User } from '@kittycad/lib'
	import AccountMenu from 'components/AccountMenu.svelte'
	import { APP_NAME } from '$lib/consts'
	import { paths } from '$lib/paths'
	import AppLogo from 'components/AppLogo.svelte'
	import Plus from 'components/Icons/Plus.svelte'
	import { page } from '$app/stores'

	export let user: User | undefined
</script>

<header id="app-header" data-testid="app-header">
	<div class="item-slot">
		<AppLogo />
		<a href={paths.HOME} class="text-sm">{APP_NAME}</a>
	</div>
	<div class="item-slot py-1 ml-auto">
		<a
			href={paths.DASHBOARD}
			class={'new-prompt ' + ($page.url.pathname === paths.HOME ? ' opacity-0' : '')}
		>
			<span class="sr-only md:not-sr-only">New prompt</span>
			<Plus class="w-6 h-6 md:w-5 md:h-5" />
		</a>
		<AccountMenu {user} />
	</div>
</header>

<style lang="postcss">
	header {
		@apply w-full flex;
		@apply sticky top-0 z-10 px-2 justify-between;
		@apply bg-chalkboard-10 dark:bg-chalkboard-90 border-b border-chalkboard-30 dark:border-chalkboard-70;
		user-select: none;
		-webkit-user-select: none;
	}

	.item-slot {
		@apply flex items-center gap-2;
	}

	.new-prompt {
		@apply flex items-center justify-center gap-1;
		@apply md:pl-1.5 py-0.5;
		@apply rounded border;
		@apply border-transparent md:border-green;
		@apply max-sm:text-chalkboard-110 md:hover:text-chalkboard-120;
		@apply bg-green md:bg-transparent md:hover:bg-green md:hover:hue-rotate-15;
		@apply text-xs leading-none;
	}
</style>
