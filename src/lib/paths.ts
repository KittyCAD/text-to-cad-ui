export const SIGN_OUT_PARAM = 'signout'

export const paths = {
	SIGN_IN: (callbackUrl: string) =>
		import.meta.env.VITE_SITE_BASE_URL + '/signin/?callbackUrl=' + encodeURIComponent(callbackUrl),
	HOME: '/',
	DASHBOARD: '/dashboard',
	SIGN_OUT: `/?${SIGN_OUT_PARAM}=true`
} as const
