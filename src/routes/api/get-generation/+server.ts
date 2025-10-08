import type { TextToCadResponse } from '@kittycad/lib'
import { getCookieName } from '$lib/cookies'
import { error, json, type RequestHandler } from '@sveltejs/kit'
import { env } from '$lib/env'
import { ml } from '@kittycad/lib'
import { createZooClient } from '$lib/zooClient'

export type LoadResponse = {
	status: number
	body?: TextToCadResponse
}

export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
	const token = env.MODE === 'production' ? cookies.get(getCookieName()) : env.VITE_ZOO_API_TOKEN

	const body = await request.json()

	if (!body?.id) throw error(422, 'Please include a model ID under the "id" key.')
	if (!token) throw error(401, 'You must be logged in to use this API.')

	const client = createZooClient({ token, fetch })
	const data = await ml.get_text_to_cad_model_for_user({ client, id: body.id })
	return json({ status: 200, body: data } satisfies LoadResponse)
}
