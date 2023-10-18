<script lang="ts">
	import Nav from 'components/Nav.svelte'
	import 'styles/app.css'
	import type { LayoutData } from './$types'

	export let data: LayoutData
	$: console.log(data)
</script>

<Nav user={data ? data.user : undefined} />
<main class="mx-5 lg:mx-auto max-w-5xl my-24">
	<slot />
</main>
