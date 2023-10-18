import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	loadEnv(mode, process.cwd(), '')

	const plugins = [sveltekit()]
	if (mode === 'development') {
		plugins.push(mkcert())
	}

	return {
		plugins,
		server: {
			port: 3000,
			strictPort: true,
			https: mode === 'development'
		},
		preview: {
			port: 3000,
			strictPort: true,
			https: mode === 'development'
		},
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		}
	}
})
