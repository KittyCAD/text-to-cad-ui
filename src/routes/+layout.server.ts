import { users, Client } from '@kittycad/lib'

/** @type {import('./$types').LayoutData} */
export const load = async ({ cookies }) => {
	const token = cookies.get('__Secure-next-auth.session-token')
	console.log('token', token)

	const client = new Client(token || '')
	const response = await users.get_user_self({ client })

	console.log('user', response)

	return {
		user: 'error_code' in response ? undefined : response
	}
}
