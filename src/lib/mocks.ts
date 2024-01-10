import type { Models } from '@kittycad/lib'
import type { BlockableUserTemp } from './types'

const mockUserKeys = ['mockUserMissingPayment', 'mockUserFailedPayment'] as const
export type MockUserMethod = (typeof mockUserKeys)[number]

type MockMethods<T extends string, M> = {
	[K in T]: (input: M) => M
}

const mockUserMissingPayment = (user: Models['User_type']): BlockableUserTemp => ({
	...user,
	block: 'missing_payment_method'
})

const mockUserFailedPayment = (user: Models['User_type']): BlockableUserTemp => ({
	...user,
	block: 'payment_method_failed'
})

export const hooksUserMocks: MockMethods<MockUserMethod, BlockableUserTemp> = {
	mockUserMissingPayment,
	mockUserFailedPayment
}
export const isUserMock = (s: string) =>
	s.startsWith('mockUser') ? (s as keyof typeof hooksUserMocks) : false
