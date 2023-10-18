import type { Models } from '@kittycad/lib'

export type CADFormat = Models['FileExportFormat_type']

interface ListParams {
	limit?: number
	page_token?: string
	sort_by?: Models['CreatedAtSortMode_type']
}

export const endpoints = {
	prompt: (output_format: CADFormat = 'step') =>
		`${import.meta.env.VITE_API_BASE_URL}/ai/text-to-cad/${output_format}`,
	list: ({ limit, page_token, sort_by = 'created_at_descending' }: ListParams) =>
		`${import.meta.env.VITE_API_BASE_URL}/user/text-to-cad?limit=${limit}${
			page_token ? `&page_token=${page_token}` : ''
		}&sort_by=${sort_by}`,
	feedback: (id: string) => `${import.meta.env.VITE_API_BASE_URL}/user/text-to-cad/${id}`
}

export type PromptResponse = Models['TextToCad_type']

export type ListResponse = Models['TextToCadResultsPage_type']
