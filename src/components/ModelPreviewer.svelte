<script lang="ts">
	import { T } from '@threlte/core'
	import { GLTF, OrbitControls, interactivity } from '@threlte/extras'
	interactivity()
	export let dataUrl: string

	let shouldAutoRotate = true
	const AUTO_ROTATE_PAUSE = 5000

	let autorotateTimeout: ReturnType<typeof setTimeout> | undefined
	const disableAutoRotate = () => {
		shouldAutoRotate = false
		clearTimeout(autorotateTimeout)
	}
	const reenableAutoRotate = () => {
		autorotateTimeout = setTimeout(function () {
			shouldAutoRotate = true
		}, AUTO_ROTATE_PAUSE)
	}
</script>

<T.PerspectiveCamera makeDefault fov={50} position={[20, 20, 20]}>
	<OrbitControls
		enableDamping
		autoRotate={shouldAutoRotate}
		on:start={disableAutoRotate}
		on:end={reenableAutoRotate}
	/>
</T.PerspectiveCamera>

<T.AmbientLight color="white" />
<T.DirectionalLight color="white" />
<T.DirectionalLight color="white" position={[5, 0, -5]} />

<GLTF url={dataUrl} position={[0, 0, 0]} scale={300} />