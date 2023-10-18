<script lang="ts">
	import * as THREE from 'three'
	import * as SC from 'svelte-cubed'
</script>

<SC.Canvas antialias background={new THREE.Color('oklch(99.7% 0.008766 102.8deg)')}>
	<SC.Mesh geometry={new THREE.BoxGeometry()} />
	<SC.PerspectiveCamera position={[1, 1, 3]} />
	<SC.OrbitControls enableZoom={false} />
</SC.Canvas>
