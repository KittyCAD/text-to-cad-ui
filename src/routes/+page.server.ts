import { AUTH_COOKIE_NAME } from '$lib/cookies.js'
import { error, redirect } from '@sveltejs/kit'
import type { Models } from '@kittycad/lib'

export const load = async ({ cookies, url, fetch }) => {
	const token = import.meta.env.PROD
		? cookies.get(AUTH_COOKIE_NAME)
		: import.meta.env.VITE_ZOO_DEV_TOKEN

	const currentUser = await fetch(import.meta.env.VITE_API_BASE_URL + '/user', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	})
		.then(async (res) => (await res.json()) as Models['User_type'] | Models['Error_type'])
		.catch((e) => {
			throw error(500, e)
		})

	// Redirect to the dashboard if the user is already logged in
	if (currentUser && 'email' in currentUser) {
		throw redirect(302, '/dashboard' + (url.search || ''))
	} else if (import.meta.env.DEV) {
		console.warn(
			'You might be using an invalid or expired token for your VITE_ZOO_DEV_TOKEN environment variable. Please check your .env file.'
		)
	}
}
