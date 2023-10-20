export const SIGN_OUT_PARAM = 'signout'

export const paths = {
	SIGN_IN: '/signin',
	HOME: '/',
	DASHBOARD: '/dashboard',
	SIGN_OUT: `/?${SIGN_OUT_PARAM}=true`
} as const
