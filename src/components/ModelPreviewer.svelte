<script lang="ts">
	import { T } from '@threlte/core'
	import { GLTF } from '@threlte/extras'
	export let dataUrl: string
</script>

<T.PerspectiveCamera
	makeDefault
	on:create={({ ref }) => {
		ref.lookAt(0, 1, 0)
	}}
/>

<GLTF
	url={dataUrl}
	position={[0, 1, 0]}
	on:load={(payload) => {
		console.log('loaded', payload)
	}}
/>
