import { endpoints, type PromptResponse } from '$lib/endpoints'
import type { Models } from '@kittycad/lib'
import { error, redirect } from '@sveltejs/kit'

type LoadResponse = {
	status: number
	body?: PromptResponse
}

export const load = async ({ cookies, params }) => {
	const token = cookies.get('__Secure-next-auth.session-token')

	if (!params.modelId) throw redirect(302, '/')

	if (!token) {
		return {
			status: 401
		} satisfies LoadResponse
	}

	const response = await fetch(endpoints.view(params.modelId), {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	
	const body = (await response.json()) as Models['TextToCad_type']
	
	if (response.status >= 400 && response.status < 500) {
		throw error(response.status, 'Model could not be found or you do not have permission to view it')
	}
	
	return {
		status: response.status,
		body
	} satisfies LoadResponse
}
