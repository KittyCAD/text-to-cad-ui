import type { Models } from '@kittycad/lib'

const mockUserKeys = ['mockUserMissingPayment', 'mockUserFailedPayment'] as const
export type MockUserMethod = (typeof mockUserKeys)[number]

type MockMethods<T extends string, M> = {
	[K in T]: (input: M) => M
}

const mockUserMissingPayment = (user: Models['User_type']): Models['User_type'] => ({
	...user,
	block: 'missing_payment_method'
})

const mockUserFailedPayment = (user: Models['User_type']): Models['User_type'] => ({
	...user,
	block: 'payment_method_failed'
})

export const hooksUserMocks: MockMethods<MockUserMethod, Models['User_type']> = {
	mockUserMissingPayment,
	mockUserFailedPayment
}
export const isUserMock = (s: string) =>
	s.startsWith('mockUser') ? (s as keyof typeof hooksUserMocks) : false
