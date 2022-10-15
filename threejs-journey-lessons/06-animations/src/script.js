import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);


// Simplest way of animating, dependency free.
// Saves last second
// let time = Date.now();
// const loopSimple = () => {

//     // Adjusts animation speed to all refresh rates
//     const currentTime = Date.now();
//     const deltaTime = currentTime - time;
//     time = currentTime;

//     // Small difference, but keeps the speed consistent
//     // console.log('Rotation with delta   ', mesh.rotation.x += 0.001);
//     // console.log('Rotation without delta', mesh.rotation.x += 0.001 * deltaTime);

//     mesh.rotation.x += 0.001 * deltaTime;
//     mesh.rotation.y += 0.001 * deltaTime;
//     renderer.render(scene, camera);

//     window.requestAnimationFrame(loopSimple);
// }

// Built-in ThreeJS Clock for animations.
const clock = new THREE.Clock();
const loopThreeJS = () => {
  // Note: do not use getDelta from clock,
  // it can deliver inconsistent values between getElapsedTime and getDelta.
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  mesh.rotation.y = elapsedTime;
  mesh.rotation.x = elapsedTime;

  // mesh.position.x = Math.cos(elapsedTime);
  // mesh.position.y = Math.sin(elapsedTime);

  // camera.lookAt(mesh.position);

  renderer.render(scene, camera);

  window.requestAnimationFrame(loopThreeJS);
};

// Animate using external library like gsap.
// gsap has it's own requestAnimationFrame calls, but we still need to render each frame.
// gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
// gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

// const loopUsingGSAP = () => {
//     // Render
//     renderer.render(scene, camera);

//     // Call tick again on the next frame
//     window.requestAnimationFrame(loopUsingGSAP);
// };

// DON'T FORGET TO CALL THE METHOD.
// loopSimple();
loopThreeJS();
// loopUsingGSAP();
