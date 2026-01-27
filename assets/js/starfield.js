// Starfield Background - reusable Three.js scene
function initStarfield() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	// Add stars
	const starGeometry = new THREE.BufferGeometry();
	const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 5 });
	const starVertices = [];
	const starFlicker = []; // Store flicker data for each star
	
	for (let i = 0; i < 1000; i++) {
		const phi = Math.random() * Math.PI * 2;
		const theta = Math.acos(Math.random() * 2 - 1);
		const radius = 800 + Math.random() * 200;
		const x = radius * Math.sin(theta) * Math.cos(phi);
		const y = radius * Math.sin(theta) * Math.sin(phi);
		const z = radius * Math.cos(theta);
		starVertices.push(x, y, z);
		
		// Store flicker properties for each star
		starFlicker.push({
			intensity: Math.random(),
			speed: 0.5 + Math.random() * 1.5,
			offset: Math.random() * Math.PI * 2
		});
	}
	
	starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
	
	// Add opacity attribute for flickering
	const opacities = new Float32Array(1000);
	for (let i = 0; i < 1000; i++) {
		opacities[i] = 1;
	}
	starGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
	
	// Use a custom material that supports opacity
	const starMaterial2 = new THREE.ShaderMaterial({
		uniforms: {
			time: { value: 0 },
			texture: { value: new THREE.CanvasTexture(createStarTexture()) }
		},
		vertexShader: `
			attribute float opacity;
			varying float vOpacity;
			
			void main() {
				vOpacity = opacity;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				gl_PointSize = 5.0;
			}
		`,
		fragmentShader: `
			uniform sampler2D texture;
			varying float vOpacity;
			
			void main() {
				vec2 uv = gl_PointCoord;
				vec4 tex = texture2D(texture, uv);
				gl_FragColor = vec4(1.0, 1.0, 1.0, tex.a * vOpacity);
			}
		`,
		transparent: true,
		depthWrite: false
	});
	
	const stars = new THREE.Points(starGeometry, starMaterial2);
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
		
		// Update opacity for flickering effect
		const opacityArray = starGeometry.attributes.opacity.array;
		for (let i = 0; i < 1000; i++) {
			const flicker = starFlicker[i];
			const flicker_value = Math.sin(time * flicker.speed + flicker.offset) * 0.5 + 0.5;
			opacityArray[i] = 0.4 + flicker_value * 0.6; // Range from 0.4 to 1.0
		}
		starGeometry.attributes.opacity.needsUpdate = true;
		
		// Update shader uniform
		starMaterial2.uniforms.time.value = time;
		
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

// Helper function to create a simple star texture
function createStarTexture() {
	const canvas = document.createElement('canvas');
	canvas.width = 32;
	canvas.height = 32;
	const ctx = canvas.getContext('2d');
	
	// Draw a circular gradient for the star
	const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
	gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
	gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.5)');
	gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
	
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 32, 32);
	
	return canvas;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initStarfield);
} else {
	initStarfield();
}
