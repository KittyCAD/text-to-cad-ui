import type { Models } from '@kittycad/lib'

export type GenerationEvents = {
	retryprompt: string
}

// TODO: Remove this when the API is updated
export type BlockableUserTemp = Models['User_type'] & {
	block?: 'missing_payment_method' | 'payment_method_failed'
}
