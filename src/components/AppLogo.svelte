<script lang="ts" type="module">
	import { CORP_NAME } from '$lib/consts'
	import { paths } from '$lib/paths'
	import Logo from './Logo.svelte'
</script>

<a
	data-testid="app-logo"
	href={paths.HOME}
	class="relative z-0 h-full grid flex-none place-content-center group p-1.5 before:block before:content-[''] before:absolute before:inset-0 before:bottom-1 before:z-[-1] before:bg-green before:rounded-b-sm hover:before:brightness-110 before:border before:border-t-0 before:border-[var(--dark-green)]"
	style="--dark-green: hsl(from var(--green) h s calc(l - 15));"
>
	<Logo
		class="w-auto h-4 text-chalkboard-10 dark:text-chalkboard-90 dark:!filter-none"
		style="filter: drop-shadow(0px 1px 0px var(--dark-green)) drop-shadow(1px 0 0 var(--dark-green)) drop-shadow(0 -1px 0 var(--dark-green)) drop-shadow(-1px 0 0 var(--dark-green))"
	/>
	<span class="sr-only">{CORP_NAME}</span>
</a>
