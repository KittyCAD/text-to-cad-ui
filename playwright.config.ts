import type { PlaywrightTestConfig } from '@playwright/test'
import { AUTH_COOKIE_NAME } from './src/lib/cookies'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
	path: path.resolve(path.dirname('.'), `.env.development${process.env.CI ? '' : '.local'}`)
})
const expiration = new Date()
expiration.setFullYear(expiration.getFullYear() + 1)

const config: PlaywrightTestConfig = {
	use: {
		baseURL: 'http://localhost:3000',
		storageState: {
			cookies: [
				{
					name: AUTH_COOKIE_NAME,
					value: process.env.PLAYWRIGHT_SESSION_COOKIE ?? '',
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
		}
	},
	webServer: {
		command: 'yarn dev',
		port: 3000
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(playwright)\.[jt]s/,
	reporter: [[process.env.CI ? 'dot' : 'list'], ['./.github/workflows/lib/api-reporter.ts']]
}

export default config
