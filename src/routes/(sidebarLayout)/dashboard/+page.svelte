<script lang="ts">
	import PromptForm from 'components/PromptForm.svelte'
	import type { PageData } from './$types'
	import ExamplePrompts from 'components/ExamplePrompts.svelte'
	import { paths } from '$lib/paths'
	import PromptGuide from 'components/PromptGuide.svelte'
	import BlockedMessage from 'components/BlockedMessage.svelte'

	export let data: PageData
	let input = null as HTMLTextAreaElement | null
</script>

<section class="mx-4 lg:mx-auto min-h-screen flex flex-col md:justify-end" style="height: 100dvh">
	<div class="max-w-2xl mx-auto mt-12 lg:mt-16">
		<h1 class="text-4xl md:text-5xl mb-2">
			Text-to-<span class="text-green">CAD</span>
		</h1>
		<div class="tracking-wide">
			<PromptForm bind:input token={data.token} disabled={data.user.block} />
			{#if data.user.block}
				<div class="mt-4">
					<BlockedMessage blockedReason={data.user.block} />
				</div>
			{/if}
			<ExamplePrompts {input} class="mb-12 mt-24" />
			<PromptGuide />
		</div>
	</div>
	<footer
		class="max-w-4xl w-full mx-auto flex flex-col md:flex-row gap-4 md:items-center justify-between px-2 lg:px-4 py-1 border border-chalkboard-30 dark:border-chalkboard-90 border-b-0 text-xs font-mono text-chalkboard-70 dark:text-chalkboard-40"
	>
		<p>
			Built with the{' '}
			<a href={paths.ZOO_ML} target="_blank" rel="noopener noreferrer" class="underline">
				ML-ephant API by Zoo
			</a>
		</p>
		<p>
			View and contribute on{' '}
			<a href={paths.GITHUB_REPO} target="_blank" rel="noopener noreferrer" class="underline">
				GitHub
			</a>
		</p>
	</footer>
</section>
