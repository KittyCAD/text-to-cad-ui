<script lang="ts">
	import { T, useThrelte } from '@threlte/core'
	import { GLTF, OrbitControls, interactivity, useGltf } from '@threlte/extras'
	import { Box3, Color, Vector3, Scene, Mesh } from 'three'

	export let dataUrl: string
	export let pausable = true
	export let enableZoom = true
	let readyToRender = false

	const { size: threlteSize } = useThrelte()

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

	$: loadedModel = useGltf(dataUrl)
	let maxDistance = 0

	$: if (dataUrl && $loadedModel) {
		;($loadedModel.scene as Scene).traverse((child) => {
			if ('isMesh' in child && child.isMesh) {
				const material = (child as Mesh).material
				if (material instanceof Array && 'color' in material[0]) {
					material[0].color = new Color(0x29ffa4)
				} else if ('color' in material) {
					material.color = new Color(0x29ffa4)
				}
			}
		})
		const size = new Vector3()
		const boundingBox = new Box3()
		boundingBox.setFromObject($loadedModel.scene)
		boundingBox.getSize(size)
		maxDistance = Math.max(size.x, size.y, size.z)
		readyToRender = true
	}
</script>

{#if readyToRender}
	<T.OrthographicCamera
		makeDefault
		position={[maxDistance * 2, maxDistance * 2, maxDistance * 2]}
		near={0}
		far={maxDistance * 10}
		left={maxDistance * -1}
		right={maxDistance}
		top={maxDistance * ($threlteSize.height / $threlteSize.width)}
		bottom={maxDistance * ($threlteSize.height / $threlteSize.width) * -1}
		manual
	>
		<OrbitControls
			enableDamping
			autoRotate={shouldAutoRotate}
			{enableZoom}
			on:start={disableAutoRotate}
			on:end={reenableAutoRotate}
		/>
		<T.DirectionalLight color="white" position={[maxDistance * -5, -maxDistance, maxDistance]} />
		<T.DirectionalLight color="white" position={[0, 0, 2 * maxDistance]} intensity={1.4} />
	</T.OrthographicCamera>
	<T.DirectionalLight
		color="white"
		position={[-2 * maxDistance, -2 * maxDistance, 2 * maxDistance]}
	/>
	<T.AmbientLight color="white" intensity={8.0} />
	<GLTF url={dataUrl} position={[0, 0, 0]} />
{/if}