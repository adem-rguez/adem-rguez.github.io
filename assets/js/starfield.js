// Starfield Background - reusable Three.js scene
function initStarfield() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	// Create combined geometry for all stars
	const starGeometry = new THREE.BufferGeometry();
	const starVertices = [];
	const starSizes = [];
	const flickerData = [];
	
	for (let i = 0; i < 1000; i++) {
		const phi = Math.random() * Math.PI * 2;
		const theta = Math.acos(Math.random() * 2 - 1);
		const radius = 800 + Math.random() * 200;
		const x = radius * Math.sin(theta) * Math.cos(phi);
		const y = radius * Math.sin(theta) * Math.sin(phi);
		const z = radius * Math.cos(theta);
		
		starVertices.push(x, y, z);
		starSizes.push(10); // Increased initial size from 5 to 10
		
		// Store flicker data
		flickerData.push({
			speed: 0.3 + Math.random() * 2.5, // More varied speeds (0.3 to 2.8)
			offset: Math.random() * Math.PI * 2,
			phase: Math.random() // Additional randomness
		});
	}
	
	starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
	starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
	
	const starMaterial = new THREE.PointsMaterial({
		color: 0xffffff,
		size: 10, // Increased from 5 to make stars brighter and more visible
		sizeAttenuation: true,
		opacity: 1.0,
		transparent: true,
		emissive: 0xffffff, // Make stars glow
		emissiveIntensity: 0.8
	});
	
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
		alpha: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000, 1);

	// Lights - increased intensity
	scene.add(new THREE.AmbientLight(0xffffff, 1.0)); // Increased from 0.7 to 1.0
	const light = new THREE.DirectionalLight(0xffffff, 0.8); // Increased from 0.5 to 0.8
	light.position.set(5, 10, 5);
	scene.add(light);

	let time = 0;

	// Animation loop with flickering
	function animate() {
		requestAnimationFrame(animate);
		
		time += 0.01; // Slower time increment for better control
		
		// Update size (flicker effect) for each star
		const sizeArray = starGeometry.attributes.size.array;
		for (let i = 0; i < 1000; i++) {
			const flicker = flickerData[i];
			// Use different calculation for each star to ensure independent flickering
			const flickerValue = Math.sin(time * flicker.speed + flicker.offset + flicker.phase * Math.PI) * 0.5 + 0.5;
			sizeArray[i] = 3 + flickerValue * 12; // Vary between 3 and 15 (much larger range)
		}
		starGeometry.attributes.size.needsUpdate = true;
		
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
