/** @type {import('./$types').LayoutData} */
export const load = async ({ locals }) => {
	return {
		user: !locals.user || 'error_code' in locals.user ? undefined : locals.user,
		token: locals.token
	}
}
