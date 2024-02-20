import { AUTH_COOKIE_NAME } from '$lib/cookies'
import { endpoints, type PromptResponse } from '$lib/endpoints'
import { error, json, type RequestHandler } from '@sveltejs/kit'

export type LoadResponse = {
	status: number
	body?: PromptResponse
}

export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
	const token = import.meta.env.PROD ? cookies.get(AUTH_COOKIE_NAME) : import.meta.env.VITE_TOKEN
	const body = await request.json()

	if (!(body?.id && body?.feedback))
		throw error(422, 'Please include a body with "id" and "feedback" fields.')
	if (!token) throw error(401, 'You must be logged in to use this API.')

	const response = await fetch(endpoints.feedback(body?.id, body?.feedback), {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const message = (await response.json()) as PromptResponse

	return json({
		status: response.status,
		body: message
	} satisfies LoadResponse)
}
