<script lang="ts">
	import 'styles/app.css'
	import { dev } from '$app/environment'
	import { inject } from '@vercel/analytics'
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'

	injectSpeedInsights()
	inject({ mode: dev ? 'development' : 'production' })
</script>

<slot />
