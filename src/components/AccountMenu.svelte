<script lang="ts">
	import type { Models } from '@kittycad/lib/types'
	import { paths } from '$lib/paths'
	import Person from './Icons/Person.svelte'
	import ArrowRight from './Icons/ArrowRight.svelte'
	import ArrowLeft from './Icons/ArrowLeft.svelte'

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
		class="flex flex-auto items-center gap-2"
		on:click={() => {
			open = !open
		}}
		on:keydown={dismiss}
	>
		<div
			class={'toggle grid place-content-center border border-solid hover:border-green overflow-hidden bg-currentColor w-8 h-8 md:w-12 md:h-12 ' +
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
					class="uppercase w-5 h-5 font-bold text-xl leading-[1] pt-0.5 text-center text-chalkboard-10 dark:text-chalkboard-120"
					data-testid="initial"
				>
					{user.name?.[0] || user.first_name?.[0] || user.email?.[0]}
				</span>
			{:else if !shouldDisplayImage}
				<Person
					data-testid="person-icon"
					class="w-full text-chalkboard-10 dark:text-chalkboard-120"
				/>
			{/if}
		</div>
		<span class="mt-0.5 font-mono text-left whitespace-break-spaces">{displayName}</span>
	</button>
	<dialog class="menu">
		<menu class="contents">
			<div class="p-4 pb-2">
				<p class="font-mono">
					{user?.first_name
						? user.first_name + (user.last_name ? ' ' + user.last_name : '')
						: user?.name || 'Unnamed User'}
				</p>
				<p class="font-mono text-sm text-chalkboard-70 dark:text-chalkboard-40">
					{user?.email || 'someone@somewhere.com'}
				</p>
			</div>
			<a
				href={paths.ZOO_ACCOUNT}
				class="menu-button"
				on:keydown={dismiss}
				target="_blank"
				rel="noopener noreferrer"
			>
				<span class="flex-1 text-left">Manage Zoo account</span>
				<ArrowRight class="w-5 h-5 inline-block origin-center -rotate-45 ml-1" />
			</a>
			<a
				href={paths.GITHUB_NEW_ISSUE}
				class="menu-button"
				on:keydown={dismiss}
				target="_blank"
				rel="noopener noreferrer"
			>
				<span class="flex-1 text-left">Report UI Issue</span>
				<ArrowRight class="w-5 h-5 inline-block origin-center -rotate-45 ml-1" />
			</a>
			<a
				data-sveltekit-reload
				href={paths.SIGN_OUT}
				class="menu-button"
				on:keydown={dismiss}
				on:click={() => localStorage.clear()}
			>
				<span class="flex-1 text-left">Sign Out</span>
				<ArrowLeft class="w-5 h-5 inline-block origin-center -rotate-45 ml-1" />
			</a>
		</menu>
	</dialog>
</div>

<style lang="postcss">
	.menu {
		@apply absolute bottom-full left-0;
		@apply z-10 mb-2;
		@apply text-chalkboard-120 dark:text-chalkboard-10;
		@apply bg-white dark:bg-chalkboard-120;
		@apply border-solid border-2 border-chalkboard-100;
		@apply border border-chalkboard-100 dark:border-chalkboard-20;
		@apply flex flex-col;
		@apply w-screen;
		max-inline-size: min(90vw, 250px);
		min-inline-size: 150px;
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
		@apply fixed inset-0 z-0 bg-chalkboard-110/20;
		@apply pointer-events-auto;
	}

	.menu-button {
		@apply uppercase tracking-[1px] hover:bg-green hover:text-chalkboard-120;
		@apply flex gap-2 justify-center items-center text-sm font-mono px-4 py-2 border-t;
	}

	.menu-button span {
		@apply pt-0.5;
	}
</style>
