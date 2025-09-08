import { env } from '$lib/env'

export type ZooClient = {
	token?: string
	baseUrl?: string
	fetch?: typeof fetch
}

export function createZooClient(opts: { token?: string; fetch?: typeof fetch } = {}): ZooClient {
	const { token, fetch } = opts
	return { token, baseUrl: env.VITE_API_BASE_URL, fetch }
}
