import { users, Client } from '@kittycad/lib'

/** @type {import('./$types').LayoutData} */
export const load = async ({ cookies }) => {
	const token = cookies.get('__Secure-next-auth.session-token')
	if (!token) {
		return {
			user: undefined
		}
	}

	// We need to tell the client to use the right base URL
	if (import.meta.env.MODE !== 'production') {
		// Set the env variable BASE_URL to import.meta.env.VITE_API_BASE_URL.
		// This will be used by the client to make requests to the API.
		process.env.BASE_URL = import.meta.env.VITE_API_BASE_URL + '/'
	}
	const client = new Client(token)
	const response = await users.get_user_self({ client })

	console.log('user', response)

	return {
		user: 'error_code' in response ? undefined : response
	}
}
