import { endpoints, type ListResponse } from '$lib/endpoints'
import { error, json, type RequestHandler } from '@sveltejs/kit'

export type ListLoadResponse = {
	status: number
	body?: ListResponse
}

export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
	const token = cookies.get('__Secure-next-auth.session-token')
	if (!token) throw error(401, 'You must be logged in to use this API.')

	const body = await request.json()
	if (!body) {
		throw error(
			422,
			`Please include a body that meets the spec listed here: https://kittycad.io/docs/api/list-text-to-cad-models-you've-generated`
		)
	}

	const { limit = 3, page_token = '' } = body
	const response = await fetch(endpoints.list({ limit, page_token }), {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const data = await response.json()

	return json({
		status: response.status,
		body: data
	} satisfies ListLoadResponse)
}
