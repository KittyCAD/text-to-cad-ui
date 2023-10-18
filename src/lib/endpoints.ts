export type CADFormat = 'fbx' | 'glb' | 'gltf' | 'obj' | 'ply' | 'step' | 'stl'

interface ListParams {
    limit?: number,
    page_token?: string,
    sort_by?: 'created_at_ascending' | 'created_at_descending',
}

export const endpoints = {
	prompt: (output_format: CADFormat = 'step') => `${import.meta.env.VITE_API_BASE_URL}/ai/text-to-cad/${output_format}`,
	list: ({ limit, page_token, sort_by = 'created_at_descending' }: ListParams) => 
        `${import.meta.env.VITE_API_BASE_URL}/user/text-to-cad?limit=${limit}${page_token ? `&page_token=${page_token}` : ''}&sort_by=${sort_by}`,
	feedback: (id: string) => `${import.meta.env.VITE_API_BASE_URL}/user/text-to-cad/${id}`
}

export type PromptResponse = {
    completed_at: string,
    created_at?: string,
    error?: string,
    feedback?: "thumbs_up" | 'thumbs_down',
    id?: string,
    model_version?: string,
    output_format?: CADFormat,
    outputs?: Record<CADFormat, string>,
    prompt?: string,
    started_at?: string,
    status?: 'queued' | 'uploaded' | 'in_progress' | 'completed' | 'failed',
    updated_at?: string,
    user_id?: string
}

export type ListResponse = {
    items: PromptResponse[],
    next_page?: string,
}