<script lang="ts">
	import { page } from '$app/stores'
	import { paths } from '$lib/paths'
	import { Canvas } from '@threlte/core'
	import ModelPreviewer from 'components/ModelPreviewer.svelte'

	const examples = [
		{
			prompt: 'a spur gear with 13 teeth',
			model: '/models/spur-gear.gltf'
		}
	]
</script>

<section class="mx-auto max-w-5xl my-48">
	<div class="grid lg:grid-cols-2 gap-0 items-stretch min-h-[33vh]">
		<h1 class="text-7xl py-12 self-center pl-4">
			Text to <span class="text-stroke text-stroke-chalkboard-100 dark:text-stroke-chalkboard-20"
				>CAD</span
			>
		</h1>
		<div class="relative border border-b-0">
			<div class="absolute inset-0 -top-full">
				<Canvas>
					<ModelPreviewer dataUrl={examples[0].model} pausable={false} />
				</Canvas>
			</div>
		</div>
		<div
			class="w-full flex items-center justify-start col-span-2 text-4xl font-mono border py-4 px-6"
		>
			<div
				class="typing-animation block text-chalkboard-70 dark:text-chalkboard-40"
				style={`--steps: ${examples[0].prompt.length - 1}`}
			>
				<div class="block w-fit">{examples[0].prompt}</div>
			</div>
		</div>
		<div class="col-span-2 flex items-center border border-t-0">
			<p class="flex-1 pl-4 py-2 text-chalkboard-70 dark:text-chalkboard-40">
				Create B-Rep CAD files and meshes from natural language prompts. Powered by KittyCAD.
			</p>
			<a
				href={paths.SIGN_IN($page.url.origin.concat(paths.DASHBOARD))}
				class="self-stretch flex items-center justify-center text-center bg-energy-10/70 px-4 py-2 dark:bg-energy-40 border-0 border-l font-mono hover:bg-energy-10 dark:hover:bg-energy-20"
				>Sign in to get started</a
			>
		</div>
	</div>
</section>

<style lang="postcss">
	.typing-animation {
		--_cursor-width: 0.15em;
		overflow: hidden; /* Ensures the content is not revealed until the animation */
		border-right: var(--_cursor-width) solid theme('colors.energy.40'); /* The typwriter cursor */
		white-space: nowrap; /* Keeps the content on a single line */
		letter-spacing: var(--_cursor-width); /* Adjust as needed */
		animation: typing calc(var(--step-timing, 0.1s) * var(--steps, 20)) steps(var(--steps, 20), end),
			blink-caret 0.85s step-end infinite;
	}

	@keyframes typing {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}

	@keyframes blink-caret {
		50% {
			border-color: transparent;
		}
	}
</style>
