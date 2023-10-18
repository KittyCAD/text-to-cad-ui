import { users, Client } from '@kittycad/lib'

/** @type {import('./$types').LayoutData} */
export const load = async ({ cookies }) => {
	let token = cookies.get('__Secure-next-auth.session-token')
	console.log('token', token)

	const client = new Client(token)
	console.log('client', client)
	const response = await users.get_user_self({ client })

	console.log('response', response)

	return {
		user: 'error_code' in response ? { user: undefined } : response
	}
}
