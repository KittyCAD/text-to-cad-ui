<script lang="ts">
	import Nav from 'components/Nav.svelte'
	import 'styles/app.css'
	import type { LayoutData } from './$types'

	export let data: LayoutData
</script>

<Nav user={data ? data.user : undefined} />
<main class="mx-2 md:mx-5 lg:mx-auto max-w-5xl">
	<slot />
</main>
