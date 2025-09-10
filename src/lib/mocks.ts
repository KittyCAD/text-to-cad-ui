import type { User } from '@kittycad/lib'

const mockUserKeys = ['mockUserMissingPayment', 'mockUserFailedPayment'] as const
export type MockUserMethod = (typeof mockUserKeys)[number]

type MockMethods<T extends string, M> = {
	[K in T]: (input: M) => M
}

const mockUserMissingPayment = (user: User): User => ({
	...user,
	block: 'missing_payment_method'
})

const mockUserFailedPayment = (user: User): User => ({
	...user,
	block: 'payment_method_failed'
})

export const hooksUserMocks: MockMethods<MockUserMethod, User> = {
	mockUserMissingPayment,
	mockUserFailedPayment
}
export const isUserMock = (s: string) =>
	s.startsWith('mockUser') ? (s as keyof typeof hooksUserMocks) : false
