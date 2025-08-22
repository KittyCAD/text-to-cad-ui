import type { PlaywrightTestConfig } from '@playwright/test'
import { getCookieName } from './src/lib/cookies'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
	path: path.resolve(path.dirname('.'), `.env.development${process.env.CI ? '' : '.local'}`)
})
const expiration = new Date()
expiration.setFullYear(expiration.getFullYear() + 1)

const config: PlaywrightTestConfig = {
	retries: 1,
	use: {
		baseURL: 'http://localhost:3000',
		storageState: {
			cookies: [
				{
					name: getCookieName,
					value: process.env.VITE_API_TOKEN ?? '',
					domain: 'localhost',
					path: '/',
					expires: expiration.getTime() / 1000,
					httpOnly: true,
					secure: true,
					sameSite: 'None'
				}
			],
			origins: [
				{
					origin: 'http://localhost:3000',
					localStorage: []
				}
			]
		},
		trace: 'on-first-retry'
	},
	webServer: {
		command: 'npm run dev',
		port: 3000
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(playwright)\.[jt]s/,
	reporter: [[process.env.CI ? 'dot' : 'list'], ['./.github/workflows/lib/api-reporter.ts']]
}

export default config
