import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "kittycad",
            project: "text-to-cad-ui"
        }
    }), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
})