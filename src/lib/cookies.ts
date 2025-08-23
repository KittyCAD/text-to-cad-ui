export function getCookieName() {
	const baseUrl = process.env.VITE_SITE_BASE_URL
	if (baseUrl === 'https://zoo.dev') {
		return '__Secure-next-auth.session-token'
	} else if (baseUrl) {
		const url = new URL(baseUrl)
		return '__Secure-session-token-' + url.hostname
	}

	throw new Error('VITE_SITE_BASE_URL is not set or invalid')
}
