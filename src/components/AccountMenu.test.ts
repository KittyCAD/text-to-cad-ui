import { render } from '@testing-library/svelte'
import AccountMenu from './AccountMenu.svelte'
import type { User } from '@kittycad/lib'

const FULL_USER: User = {
	id: 'some_id',
	name: 'Frank Noirot',
	email: 'zoo_employee@zoo.dev',
	image:
		'https://lh3.googleusercontent.com/a/ACg8ocIiX1-R981041VeC5g5SCFVUzS2rUvkNPSVgD35gSy_lEU=s96-c',
	phone: '',
	first_name: 'Another',
	last_name: 'Alias',
	created_at: '1993-09-16T19:33:17.783Z',
	updated_at: '2023-10-13T19:33:17.783Z',
	company: '',
	discord: '',
	github: '',
	can_train_on_data: false,
	deletion_scheduled: false,
	is_onboarded: true,
	is_service_account: false
}
const NAME_USER: User = {
	...FULL_USER,
	image: ''
}
const FIRST_NAME_USER: User = {
	...NAME_USER,
	name: ''
}
const EMAIL_USER: User = {
	...FIRST_NAME_USER,
	first_name: ''
}
const FAILED_USER: User = {
	...EMAIL_USER,
	email: ''
}

describe('AccountMenu', async () => {
	it('avatar image appears if available', async () => {
		const component = await render(AccountMenu, {
			props: {
				user: FULL_USER
			}
		})

		expect(component.getByAltText('Avatar')).toBeVisible()
	})

	it('fallback initial appears if name is available', async () => {
		const component = await render(AccountMenu, {
			props: {
				user: NAME_USER
			}
		})

		expect(component.getByAltText('Avatar')).not.toBeVisible()
		const initial = await component.getByTestId('initial')
		expect(initial).toBeVisible()
		expect(initial.textContent).toBe(NAME_USER.name![0])
	})

	it('fallback initial appears if first_name is available', async () => {
		const component = await render(AccountMenu, {
			props: {
				user: FIRST_NAME_USER
			}
		})

		expect(component.getByAltText('Avatar')).not.toBeVisible()
		const initial = await component.getByTestId('initial')
		expect(initial).toBeVisible()
		expect(initial.textContent).toBe(FIRST_NAME_USER.first_name![0])
	})

	it('fallback initial appears if email is available', async () => {
		const component = await render(AccountMenu, {
			props: {
				user: EMAIL_USER
			}
		})

		expect(component.getByAltText('Avatar')).not.toBeVisible()
		const initial = await component.getByTestId('initial')
		expect(initial).toBeVisible()
		expect(initial.textContent).toBe(FIRST_NAME_USER.email![0])
	})

	it('user outline appears if all other options fail', async () => {
		const component = await render(AccountMenu, {
			props: {
				user: FAILED_USER
			}
		})

		expect(component.getByAltText('Avatar')).not.toBeVisible()
		expect(await component.getByTestId('person-icon')).toBeVisible()
	})
})
