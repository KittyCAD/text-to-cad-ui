export const SIGN_OUT_PARAM = 'signout'

export const paths = {
	SIGN_IN: '/signin',
	HOME: '/',
	SIGN_OUT: `/?${SIGN_OUT_PARAM}=true`
} as const
