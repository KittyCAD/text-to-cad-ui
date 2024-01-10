import type { Models } from '@kittycad/lib'

export type CADFormat = Models['FileExportFormat_type']

export const CADMIMETypes = {
	fbx: 'application/octet-stream', // FBX is not supported by MIME Type
	glb: 'model/gltf-binary',
	gltf: 'model/gltf+json',
	obj: 'application/octet-stream',
	ply: 'application/octet-stream',
	stl: 'application/sla',
	step: 'application/STEP'
} as Record<CADFormat, string>

interface ListParams {
	limit?: number
	page_token?: string
	sort_by?: Models['CreatedAtSortMode_type']
}

export const endpoints = {
	convert: (output_format: CADFormat = 'obj') =>
		`${import.meta.env.VITE_API_BASE_URL}/file/conversion/gltf/${output_format}`,
	feedback: (id: string, feedback: Models['TextToCad_type']['feedback']) =>
		`${import.meta.env.VITE_API_BASE_URL}/user/text-to-cad/${id}?feedback=${feedback}`,
	list: ({ limit = 5, page_token }: ListParams) =>
		`${import.meta.env.VITE_API_BASE_URL}/user/text-to-cad?no_models=true&limit=${limit}${
			page_token ? `&page_token=${page_token}` : ''
		}`,
	prompt: (output_format: CADFormat = 'gltf') =>
		`${import.meta.env.VITE_API_BASE_URL}/ai/text-to-cad/${output_format}`,
	view: (id: string) => `${import.meta.env.VITE_API_BASE_URL}/user/text-to-cad/${id}`,
	viewNoModels: (id: string) =>
		`${import.meta.env.VITE_API_BASE_URL}/user/text-to-cad/${id}?no_models=true`,
	localConvert: (output_format: CADFormat) => `/api/convert/${output_format}`,
	localFeedback: `/api/submit-feedback`
}

export type PromptResponse = Models['TextToCad_type']

export type ListResponse = Models['TextToCadResultsPage_type']
