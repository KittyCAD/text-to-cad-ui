<script lang="ts">
	export let size = '80px'
	export let className = ''
	export let color = '#fff'

	// This loading indicator code was adapted from the very helpful
	// https://loading.io/css/ Dual Ring example
</script>

<div class={'lds-dual-ring ' + className} style={`--size: ${size}; --border-color: ${color}`} />

<style lang="postcss">
	.lds-dual-ring {
		--size: 80px;
		--border-color: #fff;
		--_outer-size: var(--size);
		--_inner-size: calc(var(--_outer-size) * 0.8);
		--_border-size: calc(var(--_outer-size) * 0.1);
		display: inline-block;
		position: relative;
		width: var(--_outer-size);
		height: var(--_outer-size);
	}
	.lds-dual-ring:after {
		content: ' ';
		display: block;
		position: absolute;
		inset: 0;
		width: var(--_inner-size);
		height: var(--_inner-size);
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		border-radius: 50%;
		border: var(--_border-size) solid var(--border-color);
		border-color: var(--border-color) transparent var(--border-color) transparent;
		transform-origin: center center;
		animation: lds-dual-ring 1.2s linear infinite;
	}

	@keyframes lds-dual-ring {
		0% {
			rotate: 0deg;
		}
		100% {
			rotate: 360deg;
		}
	}
</style>
