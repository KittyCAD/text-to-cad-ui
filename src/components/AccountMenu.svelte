<script lang="ts">
	import type { Models } from '@kittycad/lib'
	import Person from 'components/Icons/Person.svelte'
	import { paths } from '$lib/paths'

	export let user: Models['User_type']
	let open = false
	let displayImage = true

	function dismiss(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			open = false
		}
	}
</script>

<div class={'relative flex justify-center items-center ' + (open ? 'open' : '')}>
	<button
		class={'toggle border border-solid hover:border-green overflow-hidden bg-currentColor w-8 h-8 md:w-12 md:h-12 ' +
			(displayImage ? 'rounded-full' : '')}
		on:click={() => {
			open = !open
		}}
		on:keydown={dismiss}
	>
		{#if displayImage}
			<img
				src={user.image}
				alt="Avatar"
				class="object-fill"
				referrerpolicy="no-referrer"
				on:error={() => {
					displayImage = false
				}}
			/>
		{:else}
			<Person class="object-fill p-1 block text-chalkboard-10 dark:text-chalkboard-120" />
		{/if}
		<span class="sr-only">Open menu</span>
	</button>
	<dialog class="menu">
		<menu class="contents">
			<div class="p-4 pb-2">
				<p class="font-mono">{user?.name || 'Unnamed User'}</p>
				<p class="font-mono text-sm text-chalkboard-70 dark:text-chalkboard-40">
					{user?.email || 'someone@somewhere.com'}
				</p>
			</div>
			<a
				data-sveltekit-reload
				href={paths.SIGN_OUT}
				class="text-sm font-mono uppercase tracking-[1px] hover:bg-green hover:text-chalkboard-120 text-center px-4 py-2 border-t"
				on:keydown={dismiss}
			>
				Sign Out
			</a>
		</menu>
	</dialog>
</div>

<style lang="postcss">
	.menu {
		@apply absolute top-full -right-4;
		@apply z-10 mt-1 mr-0;
		@apply text-chalkboard-120 dark:text-chalkboard-10;
		@apply bg-white dark:bg-chalkboard-90;
		@apply border-solid border-2 border-chalkboard-100;
		@apply border border-chalkboard-100 dark:border-chalkboard-20;
		@apply flex flex-col gap-5;
		@apply w-screen text-right;
		max-inline-size: min(90vw, 250px);
		min-inline-size: 150px;
		@apply shadow-md;
		/* These will transition in */
		pointer-events: none;
		opacity: 0;
		translate: 1px 10px;
		transition: transform 0.2s ease-out, opacity 0.1s ease-out;
	}

	.open .menu {
		pointer-events: auto;
		opacity: 1;
		translate: 1px 0px;
	}

	.open .toggle::after {
		content: '';
		@apply fixed inset-0 z-0 bg-chalkboard-110/20;
		@apply pointer-events-auto;
	}
</style>
