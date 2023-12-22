/** @type {import('./$types').LayoutData} */
export const load = async ({ locals, cookies }) => {
	const token = cookies.get('__Secure-next-auth.session-token')

	return {
		user: !locals.user || 'error_code' in locals.user ? undefined : locals.user,
		token
	}
}
