import { paths } from '$lib/paths.js'
import { redirect } from '@sveltejs/kit'

export const load = async ({ url, locals }) => {
	if (locals.token && locals.user) {
		throw redirect(302, paths.DASHBOARD + (url.search || ''))
	}
}
