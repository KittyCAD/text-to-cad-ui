<script lang="ts">
	import Logo from './Logo.svelte'
	import { page } from '$app/stores'
	import { paths } from '$lib/paths'
	import type { User_type } from '@kittycad/lib/dist/types/src/models'

	export let user: User_type | undefined
</script>

<nav class="nav">
	<a href="/">
		<Logo className="h-6 md:h-12" />
	</a>
	{#if user}{:else}
		<a
			href={import.meta.env.VITE_SITE_BASE_URL +
				paths.SIGN_IN +
				'/?callbackUrl=' +
				encodeURIComponent($page.url.href)}>Sign in</a
		>
	{/if}
</nav>

<style lang="postcss">
	.nav {
		@apply mx-2 lg:mx-auto mt-2 lg:mt-4 max-w-5xl;
		@apply sticky top-0 flex justify-between items-center;
		@apply border px-4 py-1;
	}
</style>
