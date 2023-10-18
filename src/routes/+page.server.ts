import { endpoints, type ListResponse, type PromptResponse } from '$lib/endpoints'
import type { Actions } from './$types'

type LoadResponse = {
	status: number
	body: ListResponse
}

type SubmissionResponse = {
	status: number
	body: PromptResponse
}

export const load = async () => {
	const response = await fetch(endpoints.list({ limit: 10 }), {
		headers: {
			'Authorization': `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
		},
	})

	const body = await response.json()

	console.log('response', response)
	console.log('body', body)

	return {
		status: response.status,
		body,
	} satisfies LoadResponse
}

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData()
		// TODO make a call to the prompt API

		const response = await event.fetch(endpoints.prompt(), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
			},
			body: JSON.stringify({
				prompt: formData.get('prompt'),
			}),
		})

		const body = await response.json()

		console.log('response', response)
		console.log('body', body)

		return {
			status: response.status,
			body,
		} satisfies SubmissionResponse
	}
} satisfies Actions
