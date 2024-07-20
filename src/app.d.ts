import type { Models } from '@kittycad/lib'
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: Models['User_type'] | Models['Error_type']
			token?: string
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
