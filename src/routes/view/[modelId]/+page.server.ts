import { endpoints, type PromptResponse } from '$lib/endpoints'
import { redirect } from '@sveltejs/kit'

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

	const body = await response.json()

	return {
		status: response.status,
		body
	} satisfies LoadResponse
}
