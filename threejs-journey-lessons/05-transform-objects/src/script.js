import './style.css';
import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Positions and scales are an instance of the Vector3 class:
// https://threejs.org/docs/#api/en/math/Vector3
mesh.position.x = 0.7; // ^
mesh.position.y = -0.6; // <-
mesh.position.z = 1; // to camera

// You can also set all values at once.
// mesh.position.set(0.7, - 0.6, 1)

// Same thing for scales
// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;
mesh.scale.set(2, 0.5, 0.5);

// Rotations are an instance of the Euler class:
// https://threejs.org/docs/index.html#api/en/math/Euler
// PI = half a rotation => 180°
mesh.rotation.x = Math.PI / 2; // 90°
mesh.rotation.y = Math.PI / 2; // 90°
mesh.rotation.z = Math.PI / 2; // 90°
// You need to be careful with you rotate stuff, or you can a "Gimbal lock"
// When you rotate an object, it affects all axis.
// To alter the alter the order of which axis gets rotated first, you can use reorder()
mesh.rotation.reorder('YXZ');

// Quaternions are another way of rotating object but they're more mathematical
// Not covered in this lesson, but quaternions also update when you update rotation, they're linked.
// https://threejs.org/docs/#api/en/math/Quaternion

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Look at is useful to point stuff at a certain direction
// camera.lookAt(mesh.position);

// Axes Helper
// Enables a debug line at the center of the scene.
// I wonder if can use it for other objects??
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);


// Useful Vector3 methods
// length: Distance from the center of the scene to the object itself.
console.log('Mesh length', mesh.position.length());

// Measure distance between two objects
console.log('Distance between the cube and camera: ', mesh.position.distanceTo(camera.position));

// Normalizes the position
// ...not sure what this means exactly.
// According to Bruno: reduces the length of the vector to 1 unit but preserve its direction.
console.log(mesh.position.normalize());

/**
 * Groups
 */
const group = new THREE.Group();
group.position.z = -2;
group.scale.y = 2;
//  group.rotation.y = -0.2
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
);
cube1.position.x = -1.5;
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff00ff }),
);
cube2.position.x = 0;
group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff }),
);
cube3.position.x = 1.5;
group.add(cube3);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
