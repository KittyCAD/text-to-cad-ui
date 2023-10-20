import type { Models } from '@kittycad/lib'

export type CADFormat = Models['FileExportFormat_type']

interface ListParams {
	limit?: number
	page_token?: string
	sort_by?: Models['CreatedAtSortMode_type']
}

export const endpoints = {
	feedback: (id: string, feedback: Models['TextToCad_type']['feedback']) =>
		`${import.meta.env.VITE_API_BASE_URL}/user/text-to-cad/${id}?feedback=${feedback}`,
	list: ({ limit, page_token, sort_by = 'created_at_descending' }: ListParams) =>
		`${import.meta.env.VITE_API_BASE_URL}/user/text-to-cad?limit=${limit}${
			page_token ? `&page_token=${page_token}` : ''
		}&sort_by=${sort_by}`,
	prompt: (output_format: CADFormat = 'gltf') =>
		`${import.meta.env.VITE_API_BASE_URL}/ai/text-to-cad/${output_format}`,
	view: (id: string) => `${import.meta.env.VITE_API_BASE_URL}/user/text-to-cad/${id}`,
	localView: '/api/get-generation',
  localList: '/api/get-generation-list',
	localFeedback: `/api/submit-feedback`,
  localPrompt: '/api/submit-prompt',
}

export type PromptResponse = Models['TextToCad_type']

export type ListResponse = Models['TextToCadResultsPage_type']
