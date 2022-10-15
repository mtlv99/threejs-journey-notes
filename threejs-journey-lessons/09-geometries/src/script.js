import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object

// Geometries are composed of vertices (point coordinates in 3D space),
// and faces (triangles that join those vertices to create a surface).
// Geometries can also be used for particles (each vertex will be a particle).
// There are lots of geometries...
// BoxGeometry, PlaneGeometry, CircleGeometry, ConeGeometry, CylinderGeometry, RingGeometry,
// TorusGeometry, TorusKnotGeometry, DodecahedronGeometry, OctahedronGeometry, TetrahedronGeometry,
// IcosahedronGeometry, SphereGeometry, ShapeGeometry, TubeGeometry, ExtrudeGeometry, LatheGeometry, TextGeometry.

// BoxGeometry has 6 parameters:

// Size properties:
// width: x axis size
// height: y axis size
// depth: z axis size
// Subdivision properties:

// widthSegments: How many subdivisions in the x axis
// heightSegments: How many subdivisions in the y axis
// depthSegments: How many subdivisions in the z axis
// const geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3)

// Custom geometry:
// Array of vertex positions
// const positionsArray = new Float32Array(9);
// First vertex
// positionsArray[0] = 0
// positionsArray[1] = 0
// positionsArray[2] = 0

// // Second vertex
// positionsArray[3] = 0
// positionsArray[4] = 1
// positionsArray[5] = 0

// // Third vertex
// positionsArray[6] = 1
// positionsArray[7] = 0
// positionsArray[8] = 0

// Or you can do it in an easier way
const positionsArray = new Float32Array([
  0, 0, 0, // First vertex
  0, 1, 0, // Second vertex
  1, 0, 0, // Third vertex
]);

// You need to convert Float32Array to BufferAttribute.
// Important! The second parament is how many values are required to
// represent each vertex (in this case: x y z, so three).
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry();
// Attributes are read by shaders to render objects.
// Position is a reserved value, but you can use custom values too (for later...).
geometry.setAttribute('position', positionsAttribute);

/* Generates random triangles (disabled by default). */
// Tabulated for better readability
// Create an empty BufferGeometry
const geometryTwo = new THREE.BufferGeometry();

// Create 50 triangles (450 values)
const count = 50;
// each triangle is composed of 3 vertices and each vertex is composed of 3 values (x, y, z);
const totalVertixCount = count * 3 * 3;
const positionsArrayTwo = new Float32Array(totalVertixCount);
// eslint-disable-next-line no-plusplus
for (let i = 0; i < totalVertixCount; i++) {
  positionsArrayTwo[i] = (Math.random() - 0.5) * 4;
}

// Create the attribute and name it 'position'
const positionsAttributeTwo = new THREE.BufferAttribute(positionsArrayTwo, 3);
geometryTwo.setAttribute('position', positionsAttributeTwo);

/* Random triangles end. */

// Enable wireframe to see the subdivisions
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
const meshTwo = new THREE.Mesh(geometryTwo, material);
scene.add(mesh);

// Extra mesh disabled by default.
// scene.add(meshTwo);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
