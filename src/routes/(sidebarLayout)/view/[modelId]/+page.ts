import { endpoints } from '$lib/endpoints.js'
import type { Models } from '@kittycad/lib/types'
import { error, redirect, type ServerLoadEvent } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent, fetch }: ServerLoadEvent) {
	const data = await parent()

	if (!data.token) {
		throw redirect(301, '/')
	}

	if (!params.modelId) {
  	throw error(
    	400,
    	'Missing modelId'
  	)
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

	return (await response.json()) as Models['TextToCad_type']
}
