export function base64ToBlob(b64Data: string, contentType = '', sliceSize = 512) {
	if (!window || window.atob === undefined) {
		throw new Error('This function is only available in the browser.')
	}

	const byteCharacters = atob(b64Data)
	const byteArrays = []

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize)

		const byteNumbers = new Array(slice.length)
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i)
		}

		const byteArray = new Uint8Array(byteNumbers)
		byteArrays.push(byteArray)
	}

	const blob = new Blob(byteArrays, { type: contentType })
	return blob
}
