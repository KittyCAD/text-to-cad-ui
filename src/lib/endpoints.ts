import type { FileExportFormat } from '@kittycad/lib'

export type CADFormat = FileExportFormat

export const CADMIMETypes = {
	fbx: 'application/octet-stream', // FBX is not supported by MIME Type
	glb: 'model/gltf-binary',
	gltf: 'model/gltf+json',
	obj: 'application/octet-stream',
	ply: 'application/octet-stream',
	stl: 'application/sla',
	step: 'application/STEP'
} as Record<CADFormat, string>

// Intentionally empty of network endpoints; API calls are handled by @kittycad/lib
