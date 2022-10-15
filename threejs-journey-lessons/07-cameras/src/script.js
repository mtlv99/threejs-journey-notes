import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Cursor
const cursor = {
  x: 0,
  y: 0,
};

// Cursor event (for customOrbitCameraControls implementation)
window.addEventListener('mousemove', (event) => {
  // Ok, this get a little bit weird here at first sight, but no worries.
  // It is easier to handle values between 0 and 1 for camera movement. (radians maybe?)
  // that's why the values are being divided by the canvas size (800x600).
  // (Later the canvas will use the entire screen)
  // After that, we simulate the center of a plane by subtracting - 0.5
  // So the values now go from -0.5 to 0.5 (and we neutral/zero values at the center of axis)

  cursor.x = event.clientX / sizes.width - 0.5;

  // We need to revert Y value because clientY starts counting from top to bottom.
  // (pixel 0 will be at the very top, so we need to invert that behavior for ThreeJS axis (the higher the bigger the value is)).
  cursor.y = -(event.clientY / sizes.height - 0.5);

  // console.log(cursor.x, cursor.y)
});


// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);
scene.add(mesh);

// Camera
// All cameras inherit from Camera class (do not use it directly though)
// https://threejs.org/docs/#api/en/cameras/Camera

// ArrayCamera: renders multiple views at once.
// StereoCamera: used for 3d anaglyphs, parallax barriers, VR headsets...
// CubeCamera: renders 6 views at once.
// OrtographicCamera: an ortographic view (without perspective)
// PerspectiveCamera: normal view with perspective.

// Values required by both Perspective/Ortographic cameras.
const aspectRatio = sizes.width / sizes.height;
const near = 0.1; // Camera frustum near plane. How near should the camera render.
const far = 100; // Camera frustum far plane. How far away should the camera render.
// Do not use too small/big numbers for perfomance reasons!

// Perspective Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, near, far);

// Ortographic Camera
// Values for the view frustrum. Graphical example here:
// https://en.wikipedia.org/wiki/Viewing_frustum#/media/File:ViewFrustum.svg
// horizontal values multiplied by the aspect ratio so objets don't get distorted/squished.
// const left = -1 * aspectRatio;
// const right = 1 * aspectRatio;
// const top = 1;
// const bottom = -1;

// const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Controls
// ThreeJS has built-in camera controls to simplify things:
// DeviceOrientationControls: uses the gyposcope of phone devices to rotate the camera.
// FlyControls: you can rotate all axis
// FirstPersonControls: same as fly controls but you cannot do a barrel roll.
// PointerLockControls: it blocks your mouse to the canvas
// OrbitControls: orbits around an object. Camera doesn't allow to view after the most vertical angle (upside down).
// TrackballControls: sames OrbitControls but without limits to rotation (Full 360deg rotation).
// If none of these controls fit your use case, you may need to create a custom one, or modify one of them.

// Do not confuse with TransformControls and DragControls, these are for object movement.

// We import the controls from a different path.
// We pass a camera and a dom node that it can get events from.
const controls = new OrbitControls(camera, canvas);

// Damping smooths the camera movement. Creates an illusion of acceleration and friction.
controls.enableDamping = true;

// we can also update the camera position from here.
// Not very useful right now.
// controls.target.y = 2
// We also need to update the controls for custom camera positions
// Update controls
// controls.update()

// custom OrbitCamera basic implementation (without ThreeJS dependencies...)
// Disabled by default.
const customOrbitCameraControls = () => {
  // sin and cos, when used together, can block the coordinates in a perfect circle... I think?
  // since both are opposites.
  // https://www.mathsisfun.com/algebra/trig-interactive-unit-circle.html

  // Multiplied by Pi to get half a rotation, and then again multiplied by two to get a full rotation;
  const halfRotation = cursor.x * Math.PI;
  const fullRotation = halfRotation * 2;
  camera.position.x = Math.sin(fullRotation) * 3; // 3 is speed?
  camera.position.z = Math.cos(fullRotation) * 3;
  camera.position.y = cursor.y * 5; // 5 is speed?
  camera.lookAt(mesh.position);

  console.log(camera.position);
};


// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // mesh.rotation.y = elapsedTime;

  // Custom camera orbit implementation. Do not enable it with ThreeJS controls at the same time.
  // customOrbitCameraControls();

  // We need to update controls for the damping to work correctly.
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
