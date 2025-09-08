import { AUTH_COOKIE_NAME } from '$lib/cookies'
import { error, json, type RequestHandler } from '@sveltejs/kit'
import { env } from '$lib/env'
import { ml } from '@kittycad/lib'
import { createZooClient } from '$lib/zooClient'

export type LoadResponse = {
	status: number
}

export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
	const token = env.PROD ? cookies.get(AUTH_COOKIE_NAME) : env.VITE_API_TOKEN
	const body = await request.json()

	if (!(body?.id && body?.feedback))
		throw error(422, 'Please include a body with "id" and "feedback" fields.')
	if (!token) throw error(401, 'You must be logged in to use this API.')

	const client = createZooClient({ token, fetch })
	await ml.create_text_to_cad_model_feedback({ client, id: body.id, feedback: body.feedback })
	return json({ status: 200 } satisfies LoadResponse)
}
