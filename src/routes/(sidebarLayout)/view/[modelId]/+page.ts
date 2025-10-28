import type { TextToCad } from '@kittycad/lib'
import { ml } from '@kittycad/lib'
import { createZooClient } from '$lib/zooClient'
import { error, redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent, fetch }) {
	const data = await parent()

	if (!data.token) {
		throw redirect(301, '/')
	}

	try {
		const client = createZooClient({ token: data.token, fetch })
		return (await ml.get_text_to_cad_part_for_user({ client, id: params.modelId })) as TextToCad
	} catch (e) {
		throw error(500, 'Failed to fetch model')
	}
}
