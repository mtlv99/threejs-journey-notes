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

/**
 * Textures
 */
// Color (or albedo): takes the pixels of the texture and apply them to the geometry.

// Alpha: grayscale image where white will be visible, and black won't.

// Height: grayscale image that will move the vertices to create some relief. Subdivision is required on the mesh to see it.

// Normal: adds small details. Doesn't move vertices, manipulates the light into thinking that the face is oriented differently.
// Useful to add details without subdividing geometry (no performance cost).

// Ambient occlusion: grayscale image that fakes shadows in the surface's crevices. NOT physically accurate, but it adds contrast.

// Metalness: grayscale image that will specify which part is metallic (white) and non-metallic (black). Creates reflection.

// Roughness: grayscale image that comes with metalness, specifies which part is rough (white) and which part is smooth (black).
// It helps to dissipate the light.
// Example: a carpet is very rugged, you can't see light reflection on it, while the water's surface is very smooth, and you can see the light reflecting on it.
// In the example texture used in the cube, the wood is uniform because there is a clear coat on it.

// PBR (More info about PBR here):
// https://marmoset.co/posts/basic-theory-of-physically-based-rendering/
// https://marmoset.co/posts/physically-based-rendering-and-you-can-too/

// Loading an image, first method (there's an easier method).
// after this you just pass the texture variable to the material in "map" property
// const image = new Image();
// // Texture is a ThreeJS class.
// const texture = new THREE.Texture(image);
// image.addEventListener('load', () => {
//   texture.needsUpdate = true;
// });
// image.src = '/textures/door/color.jpg'; // Webpack gets rid of the static folder so it's not required in the path

// Easier way using Loading manager and texture loader.
// TextureLoader can also work on its own, LoadingManager is for orchestrating multiple resource loads
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onStart = () => {
  console.log('loading started');
};
loadingManager.onLoad = () => {
  console.log('loading finished');
};
loadingManager.onProgress = () => {
  console.log('loading progressing');
};
loadingManager.onError = () => {
  console.log('loading error');
};

// Alternate between this for testing mipmapping
// const colorTexture = textureLoader.load('/textures/door/color.jpg');
// For testing mipmapping minFilter
// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png');
// const colorTexture = textureLoader.load('/textures/door/color.jpg');
// For testing mipmapping magFilter
// const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png');
const colorTexture = textureLoader.load('/textures/minecraft.png');
// Example for loading multiple resources
// const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
// const heightTexture = textureLoader.load('/textures/door/height.jpg');
// const normalTexture = textureLoader.load('/textures/door/normal.jpg');
// const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
// const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
// const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

// You can apply transformations to the texture
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// by default, the repeat value will repeat the last pixel of the image instead of repeating the image itself, to fix this
// you can use the following values:
colorTexture.wrapS = THREE.RepeatWrapping; // x axis
colorTexture.wrapT = THREE.RepeatWrapping; // y axis
// you can also mirror it
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;
// you can offset it
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
// you can rotate it
// colorTexture.rotation = Math.PI * 0.25; // or Math.PI / 4 -> (1/4 of a half circle)
// you can change the pivot of the texture rotation (by default it rotates from the corner of the plane)
// it's easier to see this effect if you remove the repeat and offset examples
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

/**
 * Mipmapping
 */
// Mipmapping: consists of creating half a smaller version of a texture again and again until you get a 1x1 texture.

// Minification filter: used when the pixels of texture are smaller than the pixels of the render (texture is too big for the surface, it covers).
// For example, the 1024x1024 checkerboard.
// Useful for avoiding the Moiré pattern: https://en.wikipedia.org/wiki/Moir%C3%A9_pattern
colorTexture.minFilter = THREE.NearestFilter; // default is THREE.LinearMipmapLinearFilter
// We don't need mipmapping when using minFilter with NearestFilter, so it's safe to disable it.
colorTexture.generateMipmaps = false;

// Magnification when the pixels of the texture are bigger than the render's pixels (the texture too small for the surface it covers).
// The opposite of the minFilter.
// For example, the Minecraft diamond texture (16x16 pixels).
// Useful for making the texture look sharp when the texture is really small.
colorTexture.magFilter = THREE.NearestFilter;

// Side note: NearestFilter is the best one for performance.

/**
 * Texture format and optimization
 */

// You need to keep three things in mind when creating and using textures.
// - File size
// - Texture size (or the resolution)
// - The data

// File size:
// - Choose wisely between .jpg and .png. There are compression websites like TinyPNG.
// - Though compression can create artifacts.

// Texture size:
// - Each pixel of the textures you are using will have to be stored on the GPU regardless of the image's weight.
// - Textures need to be a power of 2 (1024x1024, 512x512)..., so mipmapping division can work properly.
// - Mipmapping sends twice as much pixels to the GPU.

// Data:
// - you can combine both color and alpha values using a .png image.
// - Normals shouldn't have compression bc they need to be pixel precise, so .png is used for them.
// - You can use different channels on the same image for performance reasons. huh?

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// UV Unwrapping
// You can check the geometry UV unwrapping using the UV attribute
console.log('UV', geometry.attributes.uv);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
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
