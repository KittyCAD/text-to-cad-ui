<script lang="ts">
	import * as THREE from 'three'
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
	import * as SC from 'svelte-cubed'
	import { onMount } from 'svelte'
	export let dataUrl: string

	let model: any

	function loadGLTF() {
		const loader = new GLTFLoader()
		return loader.loadAsync(dataUrl)
	}

	onMount(() => {
		loadGLTF().then((_model) => (model = _model))
	})
</script>

<SC.Canvas antialias background={new THREE.Color('oklch(99.7% 0.008766 102.8deg)')}>
	{#if model}
		<SC.Primitive object={model.scene} scale={[0.05, 0.05, 0.05]} />
	{/if}
	<SC.PerspectiveCamera position={[1, 1, 3]} />
	<SC.OrbitControls enableZoom={false} />
</SC.Canvas>
