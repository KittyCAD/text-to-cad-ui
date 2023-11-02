<script>
	import { page } from '$app/stores'
	import { browser } from '$app/environment'

	function goBack() {
		if (browser) {
			window.history.back()
		}
	}
</script>

<h1 class="text-4xl mt-24">
	Error: {$page.status}
</h1>
<p>{$page.error ? $page.error.message : 'Something went wrong'}</p>
<div class="my-8 flex flex-col md:flex-row gap-4">
	<button on:click={goBack}>🔙 Go back</button>
	<a href="/">🏠 Go to home</a>
</div>

<style lang="postcss">
    a,
    button {
        @apply border border-solid font-mono;
        @apply px-6 py-2 text-center;
    }
</style>
