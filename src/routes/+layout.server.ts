import { users, Client } from '@kittycad/lib'

export const load = async ({ cookies }) => {
	let token = cookies.get('__Secure-next-auth.session-token')
	console.log('token', token)

	const client = new Client(token)
	const response = await users.get_user_self()

	return {
		user: 'error_code' in response ? undefined : response
	}
}
