// Starfield Background - reusable Three.js scene
function initStarfield() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	// Create a canvas texture for glowing stars
	const canvas = document.createElement('canvas');
	canvas.width = 128;
	canvas.height = 128;
	const ctx = canvas.getContext('2d');
	
	// Draw a radial gradient for a glowing star effect
	const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
	gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
	gradient.addColorStop(0.5, 'rgba(255, 255, 150, 0.8)');
	gradient.addColorStop(1, 'rgba(255, 150, 100, 0)');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 128, 128);
	
	const starTexture = new THREE.CanvasTexture(canvas);
	
	// Create stars as sprites (will appear bright with glowing texture)
	const stars = [];
	const flickerData = [];
	
	for (let i = 0; i < 1000; i++) {
		const phi = Math.random() * Math.PI * 2;
		const theta = Math.acos(Math.random() * 2 - 1);
		const radius = 800 + Math.random() * 200;
		const x = radius * Math.sin(theta) * Math.cos(phi);
		const y = radius * Math.sin(theta) * Math.sin(phi);
		const z = radius * Math.cos(theta);
		
		// Create sprite material with the glowing texture
		const spriteMaterial = new THREE.SpriteMaterial({
			map: starTexture,
			color: 0xffffff,
			sizeAttenuation: true,
			opacity: 1.0,
			transparent: true
		});
		
		const sprite = new THREE.Sprite(spriteMaterial);
		sprite.position.set(x, y, z);
		sprite.scale.set(8, 8, 1); // Size of the star sprite
		scene.add(sprite);
		stars.push(sprite);
		
		// Store flicker data
		flickerData.push({
			speed: 0.3 + Math.random() * 2.5,
			offset: Math.random() * Math.PI * 2,
			phase: Math.random()
		});
	}

	const canvasElement = document.getElementById("starfield-canvas");
	const camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		0.1,
		2000
	);
	camera.position.set(0, 1, 6);

	const renderer = new THREE.WebGLRenderer({
		canvas: canvasElement,
		antialias: true,
		alpha: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000, 1);

	// Lights
	scene.add(new THREE.AmbientLight(0xffffff, 0.5));
	const light = new THREE.DirectionalLight(0xffffff, 0.5);
	light.position.set(5, 10, 5);
	scene.add(light);

	let time = 0;

	// Animation loop with flickering
	function animate() {
		requestAnimationFrame(animate);
		
		time += 0.01;
		
		// Update each star's scale (flicker effect)
		for (let i = 0; i < 1000; i++) {
			const flicker = flickerData[i];
			const flickerValue = Math.sin(time * flicker.speed + flicker.offset + flicker.phase * Math.PI) * 0.5 + 0.5;
			const scale = 4 + flickerValue * 12; // Scale from 4 to 16
			stars[i].scale.set(scale, scale, 1);
			
			// Also vary opacity for more dramatic effect
			stars[i].material.opacity = 0.5 + flickerValue * 0.5; // Opacity from 0.5 to 1.0
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
