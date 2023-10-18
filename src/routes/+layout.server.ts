import { users } from '@kittycad/lib'

export const load = async ({ cookies }) => {
	console.log('cookies', cookies.getAll())

	const response = await users.get_user_self()

	return {
		user: 'error_code' in response ? undefined : response
	}
}
