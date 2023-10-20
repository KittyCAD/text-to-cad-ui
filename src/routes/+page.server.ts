import { redirect } from '@sveltejs/kit'

export const load = async ({ cookies }) => {
    const token = cookies.get('__Secure-next-auth.session-token')

    if (token) {
        throw redirect(302, '/dashboard')
    }
}