<script lang="ts">
	//GLTF has a THREE dependency that doesn't get bundled
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import * as THREE from 'three'
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
