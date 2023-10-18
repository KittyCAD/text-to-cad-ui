import { createMachine, assign } from 'xstate'
import type { Models } from '@kittycad/lib'
import withBaseURL from '../lib/withBaseURL'

const SKIP_AUTH = import.meta.env.VITE_KC_SKIP_AUTH === 'true' && import.meta.env.DEV
const LOCAL_USER: Models['User_type'] = {
	id: '8675309',
	name: 'Test User',
	email: 'kittycad.sidebar.test@example.com',
	image: 'https://placekitten.com/200/200',
	created_at: 'yesteryear',
	updated_at: 'today',
	company: 'Test Company',
	discord: 'Test User#1234',
	github: 'testuser',
	phone: '555-555-5555',
	first_name: 'Test',
	last_name: 'User'
}

export interface UserContext {
	user?: Models['User_type']
	token?: string
}

export type Events =
	| {
			type: 'Log out'
	  }
	| {
			type: 'Log in'
			token?: string
	  }

export const TOKEN_PERSIST_KEY = 'TOKEN_PERSIST_KEY'
const persistedToken = localStorage?.getItem(TOKEN_PERSIST_KEY) || ''

export const authMachine = createMachine<UserContext, Events>(
	{
		id: 'Auth',
		initial: 'checkIfLoggedIn',
		states: {
			checkIfLoggedIn: {
				id: 'check-if-logged-in',
				invoke: {
					src: 'getUser',
					id: 'check-logged-in',
					onDone: [
						{
							target: 'loggedIn',
							actions: assign({
								user: (context, event) => event.data
							})
						}
					],
					onError: [
						{
							target: 'loggedOut',
							actions: assign({
								user: () => undefined
							})
						}
					]
				}
			},
			loggedIn: {
				entry: ['goToIndexPage'],
				on: {
					'Log out': {
						target: 'loggedOut'
					}
				}
			},
			loggedOut: {
				entry: ['goToSignInPage'],
				on: {
					'Log in': {
						target: 'checkIfLoggedIn',
						actions: assign({
							token: (_, event) => {
								const token = event.token || ''
								localStorage.setItem(TOKEN_PERSIST_KEY, token)
								return token
							}
						})
					}
				}
			}
		},
		schema: { events: {} as { type: 'Log out' } | { type: 'Log in' } },
		predictableActionArguments: true,
		preserveActionOrder: true,
		context: {
			token: persistedToken
		}
	},
	{
		actions: {},
		services: { getUser },
		guards: {},
		delays: {}
	}
)

async function getUser(context: UserContext) {
	const url = withBaseURL('/user')
	const headers: { [key: string]: string } = {
		'Content-Type': 'application/json'
	}

	if (context.token) headers['Authorization'] = `Bearer ${context.token}`
	if (SKIP_AUTH) return LOCAL_USER

	const userPromise = fetch(url, {
		method: 'GET',
		credentials: 'include',
		headers
	})
		.then((res) => res.json())
		.catch((err) => console.error('error from Browser getUser', err))

	const user = await userPromise

	if ('error_code' in user) throw new Error(user.message)

	return user
}
