// Starfield Background - reusable Three.js scene
function initStarfield() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	// Add stars
	const starGeometry = new THREE.BufferGeometry();
	const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 5 });
	const starVertices = [];
	for (let i = 0; i < 1000; i++) {
		const phi = Math.random() * Math.PI * 2;
		const theta = Math.acos(Math.random() * 2 - 1);
		const radius = 800 + Math.random() * 200;
		const x = radius * Math.sin(theta) * Math.cos(phi);
		const y = radius * Math.sin(theta) * Math.sin(phi);
		const z = radius * Math.cos(theta);
		starVertices.push(x, y, z);
	}
	starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
	const stars = new THREE.Points(starGeometry, starMaterial);
	scene.add(stars);

	const canvas = document.getElementById("starfield-canvas");
	const camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		0.1,
		2000
	);
	camera.position.set(0, 1, 6);

	const renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		antialias: true,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);

	// Lights
	scene.add(new THREE.AmbientLight(0xffffff, 0.7));
	const light = new THREE.DirectionalLight(0xffffff, 0.5);
	light.position.set(5, 10, 5);
	scene.add(light);

	// Animation loop
	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}
	animate();

	// Handle window resize
	window.addEventListener('resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initStarfield);
} else {
	initStarfield();
}
