import { endpoints, type PromptResponse } from '$lib/endpoints'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { AUTH_COOKIE_NAME } from '$lib/cookies'
import { env } from '$lib/env'

export type PromptLoadResponse = {
	status: number
	body?: PromptResponse
}

export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
	const token = env.PROD ? cookies.get(AUTH_COOKIE_NAME) : env.VITE_API_TOKEN
	if (!token) throw error(401, 'You must be logged in to use this API.')

	const body = await request.json()
	if (!body?.prompt) throw error(422, 'Please include a model ID under the "prompt" key.')

	const response = await fetch(endpoints.prompt(), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			prompt: body.prompt
		})
	})
	const data = (await response.json()) as PromptResponse

	return json({
		status: response.status,
		body: data
	} satisfies PromptLoadResponse)
}
