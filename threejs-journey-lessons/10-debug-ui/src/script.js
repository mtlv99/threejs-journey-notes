import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

/**
 * Debug
 */
// This library offers multiple inputs:
// Range, Color, Text, Checkbox, Select, Button, Folder.
// You can also send some default properties like width and title
const gui = new dat.GUI({ width: 350, title: 'Controls (Hide menu pressing H):' });
// gui.hide();

// Object for sending some debug values to the library when they need to be
// wrapped inside an object
const debugParamHelper = {
  color: 0xff0000, // no longer required by lil-gui. It is required as workaround for dat.gui object interface
  spin: () => {
    // it is important to sum to the actual or else the cube will be stuck on the last position
    // (would only work once)
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
};

// Values will appear in the order they were added.
gui.add(debugParamHelper, 'spin').name('Spin me right \'round!');

// No longer required but I will leave it here for the set color method.
// gui.addColor(parameters, 'color')
//     .onChange(() =>
//     {
//         material.color.set(parameters.color)
//     });

// You can hide/show the menu pressing 'H' (dat-gui).
// The following code is not required when using dat.gui (part of the library)
// lil-gui removed this feature, thus this code is required for mimicking
// that functionality.
window.addEventListener('keydown', (event) => {
  if (event.key === 'h') {
    // eslint-disable-next-line no-underscore-dangle
    if (gui._hidden) {
      gui.show();
    } else {
      gui.hide();
    }
  }
});

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// You can create folders to keep properties organized.
const folder = gui.addFolder('Cube Position');

// Debug (you need to add the value after creating the original object)
// values are min, max, step (you can also add them using their own set methods, prefered).
// gui.add(mesh.position, 'x', - 3, 3, 0.01)
folder.add(mesh.position, 'x')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('Cube X');

folder.add(mesh.position, 'y')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('Cube Y');

folder.add(mesh.position, 'z')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('Cube Z');

// gui will automatically detect the property type and adjust the input
// in this case the property is a boolean so it gives you a checkbox
gui.add(mesh, 'visible').name('Visible?');
gui.add(material, 'wireframe').name('Show wireframe?');
gui.add(document, 'title').name('Webpage title:');

// For colors, you need to be explicit about the value being a color
// (hex values doesn't necesarily means it is a color)
gui.addColor(material, 'color');

/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
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
