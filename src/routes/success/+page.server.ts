import { paths } from '$lib/paths'
import { redirect, type ServerLoadEvent } from '@sveltejs/kit'

export const load = async ({ url }: ServerLoadEvent) => {
	throw redirect(308, paths.DASHBOARD + (url.search || ''))
}
