import { endpoints } from '$lib/endpoints.js'
import type { TextToCad } from '@kittycad/lib'
import { error, redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent, fetch }) {
	const data = await parent()

	if (!data.token) {
		throw redirect(301, '/')
	}

	const response = await fetch(endpoints.view(params.modelId), {
		headers: {
			Authorization: 'Bearer ' + data.token
			// "Cache-Control": "max-age=604800, must-revalidate"
		}
	})

	if (response.status >= 400 && response.status < 500) {
		throw error(
			response.status,
			'Model could not be found or you do not have permission to view it'
		)
	}

	if (!response.ok) {
		throw error(response.status, 'Failed to fetch model')
	}

	return (await response.json()) as TextToCad
}
