import { browser } from '$app/environment'

export function getTheme() {
	if (browser) {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}
	return 'light'
}
