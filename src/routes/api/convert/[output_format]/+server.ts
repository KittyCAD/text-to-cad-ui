import { CADMIMETypes } from '$lib/endpoints'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { FileConversion, FileExportFormat } from '@kittycad/lib'
import { file } from '@kittycad/lib'
import { createZooClient } from '$lib/zooClient'
import { AUTH_COOKIE_NAME } from '$lib/cookies'
import { env } from '$lib/env'

export type ConvertResponse = FileConversion & {
	statusCode: number
}

export const POST: RequestHandler = async ({ cookies, fetch, request, params }) => {
	const token = env.PROD ? cookies.get(AUTH_COOKIE_NAME) : env.VITE_API_TOKEN
	if (!token) throw error(401, 'You must be logged in to use this API.')

	const body = await request.text()

	if (!body) throw error(422, 'Please include the model as your fetch request body.')
	if (!params.output_format) throw error(422, 'Please include the output format in the URL.')
	if (!Object.keys(CADMIMETypes).some((mimeType) => params.output_format === mimeType)) {
		throw error(422, 'Invalid output format.')
	}

		try {
			const client = createZooClient({ token, fetch })
			const data = await file.create_file_conversion({
				client,
				output_format: params.output_format as FileExportFormat,
				src_format: 'gltf',
				body
			})
			return json({ statusCode: 200, ...data } satisfies ConvertResponse)
		} catch (e) {
			throw error(502, 'Conversion failed')
		}
}
