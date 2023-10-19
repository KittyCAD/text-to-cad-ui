<script lang="ts">
	import { T, useFrame } from '@threlte/core'
	import { interactivity, GLTF } from '@threlte/extras'
	import { spring } from 'svelte/motion'
	export let dataUrl: string

	interactivity()
	const scale = spring(1)
	let rotation = 0

	useFrame((state, delta) => {
		rotation += delta
	})
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
