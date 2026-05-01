import * as THREE from 'three';
import gsap from 'gsap';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const canvas = document.getElementById('canvas');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 3;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ff00, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Create rotating cube with gradient
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const materials = [
  new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
  new THREE.MeshPhongMaterial({ color: 0x00cc00 }),
  new THREE.MeshPhongMaterial({ color: 0x00aa00 }),
  new THREE.MeshPhongMaterial({ color: 0x008800 }),
  new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
  new THREE.MeshPhongMaterial({ color: 0x00aa00 })
];

const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// Wireframe overlay
const wireframeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
const wireframe = new THREE.LineSegments(
  new THREE.EdgesGeometry(wireframeGeometry),
  wireframeMaterial
);
scene.add(wireframe);

// Add floating particles
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 100;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 10;
  positions[i + 1] = (Math.random() - 0.5) * 10;
  positions[i + 2] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.05 });
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Mouse interaction
let mouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };

document.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  
  targetRotation.x = mouse.y * Math.PI;
  targetRotation.y = mouse.x * Math.PI;
});

// Scroll zoom
document.addEventListener('wheel', (e) => {
  e.preventDefault();
  camera.position.z += e.deltaY * 0.001;
  camera.position.z = Math.max(1.5, Math.min(10, camera.position.z));
}, { passive: false });

// Global controls
window.rotateObject = () => {
  gsap.to(cube.rotation, { x: cube.rotation.x + Math.PI * 2, duration: 1 });
};

window.zoomIn = () => {
  gsap.to(camera.position, { z: camera.position.z - 1, duration: 0.5 });
};

window.zoomOut = () => {
  gsap.to(camera.position, { z: camera.position.z + 1, duration: 0.5 });
};

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  cube.rotation.x += 0.003;
  cube.rotation.y += 0.005;
  
  cube.rotation.x += (targetRotation.x - cube.rotation.x) * 0.1;
  cube.rotation.y += (targetRotation.y - cube.rotation.y) * 0.1;
  
  wireframe.rotation.copy(cube.rotation);
  
  particles.rotation.x += 0.0005;
  particles.rotation.y += 0.0008;
  
  renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
