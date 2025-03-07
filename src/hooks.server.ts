import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event)
    // On custom domains Vercel does not block indexing. We need to add it manually:
    // https://vercel.com/guides/are-vercel-preview-deployment-indexed-by-search-engines
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
	    response.headers.set('X-Robots-Tag', 'noindex')
    }
	return response
}
