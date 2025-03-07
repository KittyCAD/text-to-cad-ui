import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event)
	// On custom domains Vercel does not block indexing. We need to add it manually:
	// https://vercel.com/guides/are-vercel-preview-deployment-indexed-by-search-engines
	if (event.url.hostname === 'text-to-cad.dev.zoo.dev') {
		response.headers.set('X-Robots-Tag', 'noindex')
	}
	return response
}
