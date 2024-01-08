<script lang="ts">
	import * as THREE from 'three'
	import { T, useThrelte } from '@threlte/core'
	import { GLTF, OrbitControls, interactivity, useGltf } from '@threlte/extras'
	import { page } from '$app/stores'

	export let dataUrl: string
	export let pausable = true
	export let enableZoom = true

	const { size: threlteSize, invalidate } = useThrelte()

	// We want to clear the scene and WebGL context when the page changes
	// or the window is resized
	$: if ($threlteSize.width && $threlteSize.height && $page.url.pathname) {
		invalidate()
	}

	interactivity()

	let shouldAutoRotate = true
	const AUTO_ROTATE_PAUSE = 5000

	let autorotateTimeout: ReturnType<typeof setTimeout> | undefined
	const disableAutoRotate = () => {
		if (!pausable) return
		shouldAutoRotate = false
		clearTimeout(autorotateTimeout)
	}
	const reenableAutoRotate = () => {
		if (!pausable) return
		autorotateTimeout = setTimeout(function () {
			shouldAutoRotate = true
		}, AUTO_ROTATE_PAUSE)
	}

	const loadedModel = useGltf(dataUrl)
	let maxDistance = 0
	$: if ($loadedModel) {
		const size = new THREE.Vector3()
		const boundingBox = new THREE.Box3()
		boundingBox.setFromObject($loadedModel.scene)
		boundingBox.getSize(size)
		maxDistance = Math.max(size.x, size.y, size.z)
	}
</script>

<T.OrthographicCamera
	makeDefault
	position={[maxDistance * 2, maxDistance * 2, maxDistance * 2]}
	near={0}
	far={maxDistance * 10}
	left={maxDistance * -1}
	right={maxDistance}
	top={maxDistance * ($threlteSize.height / $threlteSize.width)}
	bottom={maxDistance * ($threlteSize.height / $threlteSize.width) * -1}
>
	<OrbitControls
		enableDamping
		autoRotate={shouldAutoRotate}
		{enableZoom}
		on:start={disableAutoRotate}
		on:end={reenableAutoRotate}
	/>
</T.OrthographicCamera>

<T.AmbientLight color="white" />
<T.DirectionalLight color="white" />
<T.DirectionalLight color="white" position={[5, 0, -5]} />

<GLTF url={dataUrl} position={[0, 0, 0]} />
