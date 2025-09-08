<script lang="ts">
	import 'styles/app.css'
	import { dev } from '$app/environment'
	import { inject } from '@vercel/analytics'
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'
  import Toasts from 'components/Toasts.svelte'

	injectSpeedInsights()
	inject({ mode: dev ? 'development' : 'production' })
  // No JS jokes in toast files (for now)
</script>

<slot />
<Toasts />
