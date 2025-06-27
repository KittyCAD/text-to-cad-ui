<script lang="ts">
	import { paths } from '$lib/paths'
	import type { Models } from '@kittycad/lib/types'

	export let blockedReason: Models['User_type']['block']
</script>

<div class="p-4 tracking-wide text-xl text-blue border border-blue bg-blue/10 rounded">
	{#if blockedReason === 'missing_payment_method'}
		<p>
			You've used up all your free credits for this month. To continue using Text-to-CAD, please
			<a href={paths.ZOO_UPGRADE} class="underline">upgrade your account</a>.
		</p>
	{:else if blockedReason === 'payment_method_failed'}
		<p>
			Your payment method failed to process, and you are out of free credits for this month. To
			continue using Text-to-CAD, please provide a new one within <a
				href={paths.ZOO_ACCOUNT}
				class="underline">your Zoo account</a
			>.
		</p>
	{/if}
</div>
