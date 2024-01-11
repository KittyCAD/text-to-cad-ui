import { PLAYWRIGHT_MOCKING_HEADER } from '../src/lib/consts'
import type { MockUserMethod } from '../src/lib/mocks'
import type { BrowserContext } from '@playwright/test'

export async function mockHooksCall(context: BrowserContext, mockType: MockUserMethod) {
	context.route('**/*', (route, request) => {
		// Override headers
		const headers = {
			...request.headers(),
			[PLAYWRIGHT_MOCKING_HEADER]: mockType
		}
		route.continue({ headers })
	})
}
