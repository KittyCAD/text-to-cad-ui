export const SIGN_OUT_PARAM = 'signout'

const SITE = import.meta.env.VITE_SITE_BASE_URL
const GITHUB_REPO = `https://github.com/KittyCAD/text-to-cad-ui`

export const paths = {
	GITHUB_REPO,
	GITHUB_NEW_ISSUE: `${GITHUB_REPO}/issues/new`,
	SIGN_IN: (callbackUrl: string) =>
		import.meta.env.VITE_SITE_BASE_URL + '/signin/?callbackUrl=' + encodeURIComponent(callbackUrl),
	HOME: '/',
	DASHBOARD: '/dashboard',
	VIEW: (viewId: string) => `/view/${viewId}`,
	SIGN_OUT: `/?${SIGN_OUT_PARAM}=true`,
	ZOO_SITE: SITE,
	ZOO_BILLING: SITE + '/account/billing-information'
} as const
