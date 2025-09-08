import type { User, ApiErrorBody } from '@kittycad/lib'
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: User | ApiErrorBody
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
