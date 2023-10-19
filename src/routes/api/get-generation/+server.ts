import { endpoints, type PromptResponse } from '$lib/endpoints'
import { error, json, type RequestHandler } from '@sveltejs/kit'

export type LoadResponse = {
	status: number
	body?: PromptResponse
}

export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
	const token = cookies.get('__Secure-next-auth.session-token')
	const body = await request.json()

	if (!body?.id) throw error(422, 'Please include a model ID under the "id" key.')
	if (!token) throw error(401, 'You must be logged in to use this API.')

	const response = await fetch(endpoints.view(body?.id), {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const data = await response.json()

	return json({
		status: response.status,
		body: data
	} satisfies LoadResponse)
}
