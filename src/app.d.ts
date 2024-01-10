import type { BlockableUserTemp } from '$lib/types'
import type { Models } from '@kittycad/lib'
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: BlockableUserTemp | Models['Error_type']
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
