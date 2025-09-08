import type { TextToCad } from '@kittycad/lib'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { AUTH_COOKIE_NAME } from '$lib/cookies'
import { env } from '$lib/env'
import { ml } from '@kittycad/lib'
import { createZooClient } from '$lib/zooClient'

export type PromptLoadResponse = {
	status: number
	body?: TextToCad
}

export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
	const token = env.PROD ? cookies.get(AUTH_COOKIE_NAME) : env.VITE_API_TOKEN
	if (!token) throw error(401, 'You must be logged in to use this API.')

	const body = await request.json()
	if (!body?.prompt) throw error(422, 'Please include a model ID under the "prompt" key.')

	const client = createZooClient({ token, fetch })
	const data = await ml.create_text_to_cad({
		client,
		output_format: 'gltf',
		kcl: true,
		body: { prompt: body.prompt }
	})

	return json({ status: 200, body: data } satisfies PromptLoadResponse)
}
