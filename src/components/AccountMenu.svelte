<script lang="ts">
	import type { Models } from '@kittycad/lib/types'
	import { paths } from '$lib/paths'
	import Person from './Icons/Person.svelte'
	import CaretDown from './Icons/CaretDown.svelte'
	import Link from './Icons/Link.svelte'

	export let user: Models['User_type']
	let open = false
	let shouldDisplayImage = Boolean(user?.image && user.image !== '')
	let shouldDisplayInitial =
		!shouldDisplayImage &&
		((user?.name && user.name.length > 0) ||
			(user?.first_name && user.first_name.length > 0) ||
			(user?.email && user.email.length > 0))
	let displayName =
		user?.first_name && user.first_name.length > 0
			? (user.first_name + (user.last_name ? ' ' + user.last_name : '')).trim()
			: user?.name && user.name.length > 0
			? user.name
			: user?.email && user.email.length > 0
			? user.email
			: 'Unnamed User'

	function dismiss(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			open = false
		}
	}
</script>

<div class={'relative flex ' + (open ? 'open' : '')}>
	<button
		class="m-0 relative group flex flex-auto items-center border-0 w-fit min-w-max p-0 rounded-l-full rounded-r focus-visible:outline-appForeground hover:bg-green/50"
		on:click={() => {
			open = !open
		}}
		on:keydown={dismiss}
	>
		<div
			class={'toggle grid place-content-center border border-chalkboard-20 dark:border-chalkboard-80 overflow-hidden bg-currentColor w-7 h-7 ' +
				(shouldDisplayInitial || shouldDisplayImage ? 'rounded-full' : 'rounded')}
		>
			<img
				src={user?.image}
				alt="Avatar"
				class="object-fill"
				style={`display: ${shouldDisplayImage ? 'block' : 'none'}`}
				referrerpolicy="no-referrer"
			/>
			{#if shouldDisplayInitial}
				<span
					class="uppercase w-5 h-5 font-bold text-xl leading-[1] pt-0.5 text-center text-chalkboard-10 dark:text-chalkboard-110"
					data-testid="initial"
				>
					{user.name?.[0] || user.first_name?.[0] || user.email?.[0]}
				</span>
			{:else if !shouldDisplayImage}
				<Person
					data-testid="person-icon"
					class="w-full text-chalkboard-10 dark:text-chalkboard-110"
				/>
			{/if}
		</div>
		<CaretDown
			class="w-4 h-4 text-chalkboard-70 dark:text-chalkboard-40 {open ? 'rotate-180' : ''}"
		/>
	</button>
	<dialog class="menu">
		<menu class="contents">
			<div class="flex flex-col gap-1 px-2.5 py-3 bg-chalkboard-20 dark:bg-chalkboard-80/50">
				<p class="m-0 text-xs" data-testid="username">
					{displayName}
				</p>
				<p
					class="m-0 overflow-ellipsis overflow-hidden text-chalkboard-70 dark:text-chalkboard-40 text-xs"
					data-testid="email"
				>
					{user?.email || 'someone@somewhere.com'}
				</p>
			</div>
			<ul class="relative flex flex-col items-stretch content-stretch p-0.5">
				<a
					href={paths.ZOO_ACCOUNT}
					class="menu-button"
					on:keydown={dismiss}
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="flex-1 text-left">Manage Zoo account</span>
					<Link class="w-4 h-4 inline-block" />
				</a>
				<a
					href={paths.ZOO_DESIGN_STUDIO_PAGE}
					class="menu-button"
					on:keydown={dismiss}
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="flex-1 text-left">Try Zoo Design Studio</span>
					<Link class="w-4 h-4 inline-block" />
				</a><a
					href={paths.GITHUB_NEW_ISSUE}
					class="menu-button"
					on:keydown={dismiss}
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="flex-1 text-left">Report a bug</span>
					<Link class="w-4 h-4 inline-block" />
				</a>
				<hr />
				<a
					data-sveltekit-reload
					href={paths.SIGN_OUT}
					class="menu-button"
					on:keydown={dismiss}
					on:click={() => localStorage.clear()}
				>
					<span class="flex-1 text-left">Sign Out</span>
				</a>
			</ul></menu
		>
	</dialog>
</div>

<style lang="postcss">
	.menu {
		@apply absolute inset-0 top-full left-auto sm:right-0;
		@apply z-10 mt-2;
		@apply text-chalkboard-110 dark:text-chalkboard-10;
		@apply bg-white dark:bg-chalkboard-110;
		@apply border border-chalkboard-20 dark:border-chalkboard-90 rounded;
		@apply flex flex-col;
		@apply w-48;
		@apply shadow-md;
		/* These will transition in */
		pointer-events: none;
		opacity: 0;
		translate: -1px 10px;
		transition: transform 0.2s ease-out, opacity 0.1s ease-out;
	}

	.open .menu {
		pointer-events: auto;
		opacity: 1;
		translate: -1px 0px;
	}

	.open .toggle::after {
		content: '';
		@apply fixed inset-0 z-0;
		@apply pointer-events-auto;
	}

	.menu-button {
		@apply rounded-sm py-1.5 px-2 cursor-pointer text-left;
		@apply hover:bg-chalkboard-20 dark:hover:bg-chalkboard-80;
		@apply flex gap-2 justify-center items-center;
		@apply text-xs;
	}

	.menu-button span {
		@apply pt-0.5;
	}

	hr {
		@apply border-chalkboard-30 dark:border-chalkboard-80;
	}
</style>
