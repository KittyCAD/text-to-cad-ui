import { endpoints, type ListResponse, type PromptResponse } from '$lib/endpoints'
import type { Actions } from './$types'

type LoadResponse = {
	status: number
	body?: ListResponse
	previousPage?: string
}

type SubmissionResponse = {
	status: number
	body?: PromptResponse
}

export const load = async ({ cookies, url }) => {
	const token = cookies.get('__Secure-next-auth.session-token')

	const previousPage = url.searchParams.get('previous_page') || undefined
	const page = url.searchParams.get('page') || undefined

	if (!token) {
		return {
			status: 401
		} satisfies LoadResponse
	}

	const response = await fetch(endpoints.list({ limit: 10, page_token: page }), {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	const body = await response.json()

	return {
		status: response.status,
		body,
		previousPage: previousPage
	} satisfies LoadResponse
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

		const response = await event.fetch(endpoints.prompt(), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				prompt: formData.get('prompt')
			})
		})

		const body = await response.json()

		return {
			status: response.status,
			body
		} satisfies SubmissionResponse
	}
} satisfies Actions
