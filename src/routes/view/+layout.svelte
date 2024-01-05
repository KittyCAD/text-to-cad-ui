<script lang="ts">
	import Sidebar from 'components/Sidebar.svelte'
	import type { LayoutData } from './$types'

	export let data: LayoutData
</script>

<Sidebar user={data ? data.user : undefined} />
<main class="mx-2 md:mx-5 lg:mx-auto max-w-5xl">
	<slot />
</main>
