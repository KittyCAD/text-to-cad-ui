export function toKebabCase(str: string) {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/\s+/g, '-')
}
