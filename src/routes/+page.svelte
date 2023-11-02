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

<section class="mx-auto max-w-5xl my-12 md:my-48">
	<div class="grid lg:grid-cols-2 gap-0 items-stretch min-h-[33vh]">
		<h1
			class="-order-1 md:order-none col-span-2 md:col-span-1 text-5xl md:text-7xl py-6 md:py-12 self-center pl-2 md:pl-4"
		>
			Text to <span class="text-stroke text-stroke-chalkboard-100 dark:text-stroke-chalkboard-20"
				>CAD</span
			>
		</h1>
		<div class="z-10 relative border md:border-b-0 col-span-2 md:col-span-1 min-h-[25vh]">
			<div
				class="animate-reveal absolute inset-0 -top-1/3 opacity-80 md:opacity-100 md:-top-full"
				style={`--delay-steps: ${examples[0].prompt.length}`}
			>
				<Canvas>
					<ModelPreviewer dataUrl={examples[0].model} pausable={false} />
				</Canvas>
			</div>
		</div>
		<div
			class="-order-1 md:order-none w-full flex items-center justify-start col-span-2 text-lg md:text-4xl font-mono border border-b-0 md:border-b py-4 px-2 md:px-6"
		>
			<div
				class="typing-animation block text-chalkboard-70 dark:text-chalkboard-50"
				style={`--steps: ${examples[0].prompt.length}`}
			>
				<div class="block w-fit">{examples[0].prompt}</div>
			</div>
		</div>
		<div class="col-span-2 flex flex-col md:flex-row items-center border border-t-0">
			<p class="flex-1 pl-2 md:pl-4 py-2 text-chalkboard-70 dark:text-chalkboard-40">
				Create B-Rep CAD files and meshes from natural language prompts. Powered by KittyCAD.
			</p>
			<a
				href={paths.SIGN_IN($page.url.origin.concat(paths.DASHBOARD))}
				class="self-stretch flex items-center justify-center text-center bg-energy-10/70 px-2 md:px-4 py-2 dark:bg-energy-60 border-0 border-t md:border-t-0 md:border-l font-mono hover:bg-energy-10 dark:hover:bg-energy-50 dark:hover:text-chalkboard-10"
				>Sign in to get started</a
			>
		</div>
	</div>
</section>

<style lang="postcss">
	section {
		--step-timing: 0.08s;
	}

	.typing-animation {
		position: relative;
		overflow: hidden; /* Ensures the content is not revealed until the animation */
		white-space: nowrap; /* Keeps the content on a single line */
		width: max-content;
	}

	.typing-animation::before {
		content: '';
		position: absolute;
		@apply bg-chalkboard-10 dark:bg-chalkboard-100;
		@apply absolute inset-0;
		--_final-width: 100%;
		animation: typewriter calc(var(--step-timing) * calc(var(--steps, 20) - 1))
			steps(var(--steps, 20), end) forwards;
	}

	.typing-animation::after {
		content: '';
		@apply absolute inset-y-0;
		right: -1ch;
		left: 1ch;
		border-left: solid 1ch;
		@apply border-l-energy-10 dark:border-l-energy-60;
		--_final-width: calc(100% - 1ch);
		animation: typewriter calc(var(--step-timing) * calc(var(--steps, 20) - 1))
				steps(var(--steps, 20), end) forwards,
			blink-caret 0.85s step-end infinite;
	}

	@keyframes typewriter {
		to {
			left: var(--_final-width, 0px);
		}
	}

	@keyframes blink-caret {
		50% {
			border-color: transparent;
		}
	}

	.animate-reveal {
		translate: 0 12px;
		opacity: 0;
		animation: reveal 0.8s calc(var(--step-timing) * calc(var(--steps, 20) + 8)) ease-out forwards;
	}

	@keyframes reveal {
		to {
			translate: 0 0;
			opacity: 1;
		}
	}
</style>
