import { endpoints, type PromptResponse } from '$lib/endpoints'
import type { Actions } from './$types'

type SubmissionResponse = {
	status: number
	body?: PromptResponse
}

export const actions = {
	default: async (event) => {
		const token = event.cookies.get('__Secure-next-auth.session-token')

		if (!token) {
			return {
				status: 401
			} satisfies SubmissionResponse
		}
		const formData = await event.request.formData()

		await event.fetch(endpoints.prompt(), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				prompt: formData.get('prompt')
			})
		})
	}
} satisfies Actions
