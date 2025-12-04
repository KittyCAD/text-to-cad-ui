<script>
	import { page } from '$app/stores'
	import { browser } from '$app/environment'

	function goBack() {
		if (browser) {
			window.history.back()
		}
	}
</script>

<div class="flex flex-col gap-6 items-center justify-center mx-auto h-screen">
	<h1 class="text-4xl">
		Error: {$page.status} - {$page.error ? $page.error.message : 'Something went wrong'}
	</h1>
	<div class="my-8 flex flex-col md:flex-row gap-4">
		<a href="/">🏠 Go to home</a>
	</div>
</div>

<style lang="postcss">
	a,
	button {
		@apply border border-solid font-mono;
		@apply px-6 py-2 text-center;
	}
</style>
