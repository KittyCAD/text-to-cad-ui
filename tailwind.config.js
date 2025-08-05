/** @type {import('tailwindcss').Config} */
const themeColorRamps = [
	{ name: 'chalkboard', stops: 12 },
	{ name: 'energy', stops: 12 },
	{ name: 'liquid', stops: 12 },
	{ name: 'fern', stops: 12 },
	{ name: 'cool', stops: 12 },
	{ name: 'river', stops: 12 },
	{ name: 'berry', stops: 12 },
	{ name: 'destroy', stops: 8 },
	{ name: 'warn', stops: 8 },
	{ name: 'succeed', stops: 8 }
]
const toOKLCHVar = (val) => `oklch(var(${val}) / <alpha-value>) `

const themeColors = Object.fromEntries(
	themeColorRamps.map(({ name, stops }) => [
		name,
		Object.fromEntries(
			new Array(stops)
				.fill(0)
				.map((_, i) => [(i + 1) * 10, toOKLCHVar(`--_${name}-${(i + 1) * 10}`)])
		)
	])
)

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			mono: '"OCR A Tribute Pro Monospaced", monospace',
			sans: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif`,
			display: `'owners', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif`
		},
		colors: {
			transparent: 'transparent',
			currentColor: 'currentColor',
			white: '#fff',
			black: '#000',
			blue: '#3C73FF',
			yellow: '#E4ED78',
			green: '#29FFA4',
			magenta: '#FF00F6',
			...themeColors
		}
	},
	plugins: []
}
