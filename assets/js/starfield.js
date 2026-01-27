// Starfield Background - reusable Three.js scene
function initStarfield() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	// Add stars with individual geometries for flickering
	const starCount = 1000;
	const stars = [];
	const flickerData = [];
	
	for (let i = 0; i < starCount; i++) {
		const phi = Math.random() * Math.PI * 2;
		const theta = Math.acos(Math.random() * 2 - 1);
		const radius = 800 + Math.random() * 200;
		const x = radius * Math.sin(theta) * Math.cos(phi);
		const y = radius * Math.sin(theta) * Math.sin(phi);
		const z = radius * Math.cos(theta);
		
		// Create individual star geometry
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([x, y, z]), 3));
		
		const material = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 5,
			sizeAttenuation: true
		});
		
		const star = new THREE.Points(geometry, material);
		scene.add(star);
		stars.push(star);
		
		// Store flicker data
		flickerData.push({
			speed: 0.5 + Math.random() * 1.5,
			offset: Math.random() * Math.PI * 2,
			baseOpacity: 0.6 + Math.random() * 0.4
		});
	}

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
		alpha: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000, 1);

	// Lights
	scene.add(new THREE.AmbientLight(0xffffff, 0.7));
	const light = new THREE.DirectionalLight(0xffffff, 0.5);
	light.position.set(5, 10, 5);
	scene.add(light);

	let time = 0;

	// Animation loop with flickering
	function animate() {
		requestAnimationFrame(animate);
		
		time += 0.016; // ~60fps
		
		// Update flicker for each star
		for (let i = 0; i < starCount; i++) {
			const flicker = flickerData[i];
			const flickerValue = Math.sin(time * flicker.speed + flicker.offset) * 0.5 + 0.5;
			stars[i].material.opacity = 0.3 + flickerValue * 0.7; // Range from 0.3 to 1.0
		}
		
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
