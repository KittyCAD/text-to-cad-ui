export function toKebabCase(str: string) {
	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/\s+/g, '-')
		.toLowerCase()
}
