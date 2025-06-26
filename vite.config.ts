import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	loadEnv(mode, process.cwd(), '')

	const plugins = [sveltekit()]

	return {
		plugins,
		server: {
			port: 3000,
			strictPort: true
		},
		preview: {
			port: 3000,
			strictPort: true
		},
		test: {
			globals: true,
			include: ['src/**/*.{test,spec}.{js,ts}'],
			environment: 'jsdom',
			// Extend jest-dom matchers
			setupFiles: ['./vitest-setup.ts']
		},
		ssr: {
			noExternal: ['three']
		}
	}
})
