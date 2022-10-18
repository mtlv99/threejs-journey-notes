import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';

/**
 * Debug
 */
const gui = new dat.GUI();

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
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const matcapTexture = textureLoader.load('/textures/matcaps/3.png');
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');

// Important for preventing mipmapping in gradient texture (MeshToonMaterial).
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const cubeTextureLoader = new THREE.CubeTextureLoader();

// Enviromental Map textures:
const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
]);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Objects
 */
// MeshBasicMaterial: most basic material, only accepts color and map.
// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
// // Some (all?) of these can be used for other materials.
// material.map = doorColorTexture; // can also be set this way.
// // material.color = new THREE.Color('red'); // Needs to be a Color class instance.
// // material.wireframe = true; // show triangles composing the geometry with a 1px border, regardless of the distance of the camera.
// material.transparent = true; // tells threejs that this material should support transparency
// material.alphaMap = doorAlphaTexture; // texture that controls the alpha
// // material.opacity = 0.5; // opacity of material.
// material.side = THREE.DoubleSide; // Controls the mesh normals. Careful with this because GPU will need to render double the triangles.

// MeshBasicMaterial: useful for debugging normals.
// Normals: information encoded in each vertex that contains the direction of the outside of the face.
// normals are very important bc they're used for calculating light and reflections.
// Color will always be the same, regardless of the camera position.
// const material = new THREE.MeshNormalMaterial({ map: doorColorTexture });
// material.flatShading = true; // smooth or flat lighting

// MeshMatcapMaterial: very fast and can do the trick in some lighting conditions.
// Takes a matcap sphere texture as a reference and applies it to the material.
// Light can't be modified because there is none, it's just an illusion (so keep this in mind, it might look weird under certain scenarios).
// Matcap list: https://github.com/nidorx/matcaps
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// MeshDepthMaterial: colors the geometry in white if it's close to the camera's 'near' value,
// and in black if it's close to the 'far' value of the camera.
// Basically a gradient between near and far values.
// const material = new THREE.MeshDepthMaterial();

// MeshLambertMaterial: first material that reacts to light. (You need lights to see it).
// it is the most performant material with illumination, but it has some artifacts.
// const material = new THREE.MeshLambertMaterial();

// MeshPhongMaterial: pretty similar to MeshLambertMaterial, but artifacts are gone.
// it also has a shininess and specular property.
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100; // how shiny it looks
// material.specular = new THREE.Color(0x1188ff); // color of the light reflection (check the reflection).

// MeshToonMaterial: adds a cartoonish shading to the object. Shadows are very sharp.
// You can control the shadow 'steps' by adding a gradient texture (be careful with mipmapping, you need to disable it!).
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

// MeshStandardMaterial: it uses PBR principles. It is called Standard because
// it is being used in several softwares and libraries. You can have a really similar result betweeen them.
const material = new THREE.MeshStandardMaterial();
material.map = doorColorTexture;
// Ambient occlusion
material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 1;
// Displacement map (same thing as heightmap!)
// we need to add more vertices for this to work correctly.
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.05;
// Metalness and roughness (leave with default values if you need to use a metalness/roughness texture).
// Mixing both values can mess up the texture values.
// material.metalness = 0; // default value
// material.roughness = 1; // default value
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
// Normal map
material.normalMap = doorNormalTexture;
material.normalScale.set(0.5, 0.5); // Vector2 instance
// Transparency
material.transparent = true; // don't forget to add transparency!
material.alphaMap = doorAlphaTexture;

// Debug GUI properties
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
gui.add(material, 'displacementScale').min(-1).max(1).step(0.0001);
// Normal intensity
gui.add(material.normalScale, 'x').min(0).max(1).step(0.0001);
gui.add(material.normalScale, 'y').min(0).max(1).step(0.0001);


// MeshPhysicalMaterial: same as MeshStandardMaterial but it adds an extra clear coat effect.
// Useful for cars maybe?: https://threejs.org/examples/?q=clea#webgl_nodes_materials_physical_clearcoat
// won't be used here.

// PointsMaterial: for particles. We'll review this one in a later lesson.

// ShaderMaterial and RawShaderMaterial:
// Both be used to create your custom materials. We'll review this in a later lesson.

// Enviromental Maps:
// Extra material for testing enviromental maps.
// ThreeJS only supports cubemaps (for now).
// Download HDRI images from HDRIHaven and others... (if you have the rights to do so!)
// Tool to convert HDRI images to cubemaps: https://matheowis.github.io/HDRI-to-CubeMap/
const materialTwo = new THREE.MeshStandardMaterial();
materialTwo.metalness = 0.7; // default value
materialTwo.roughness = 0.2; // default value
materialTwo.envMap = environmentMapTexture;

// Debug GUI values
gui.add(materialTwo, 'metalness').min(0).max(1).step(0.0001)
  .name('envMap metalness');
gui.add(materialTwo, 'roughness').min(0).max(1).step(0.0001)
  .name('envMap roughness');

// Not affect by environment map
const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 16, 16), // original value
  new THREE.SphereGeometry(0.5, 64, 64), // Modified value for displacement map
  material,
);
sphere.position.x = -1.5;
// ThreeJS needs an attribute called uv2 for ambient occlusion to work.
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));


const plane = new THREE.Mesh(
//  new THREE.PlaneGeometry(1, 1), // original value (no subdivisions)
  new THREE.PlaneGeometry(1, 1, 100, 100), // Modified value for displacement map
  material,
);
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));


const torus = new THREE.Mesh(
//   new THREE.TorusGeometry(0.3, 0.2, 16, 32), // original value
  new THREE.TorusGeometry(0.3, 0.2, 64, 128), // original value
  material,
);
torus.position.x = 1.5;
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2));

// Affected by environment map
const sphereTwo = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), materialTwo);
sphereTwo.position.x = -1.5;
sphereTwo.position.z = -1.5;
const planeTwo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), materialTwo);
planeTwo.position.x = 0;
planeTwo.position.z = -1.5;
const torusTwo = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), materialTwo);
torusTwo.position.x = 1.5;
torusTwo.position.z = -1.5;

// You can add multiple objects to the scene in the same line
scene.add(sphere, plane, torus, sphereTwo, planeTwo, torusTwo);

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
camera.position.z = 2;
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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;
  sphereTwo.rotation.y = 0.1 * elapsedTime;
  planeTwo.rotation.y = 0.1 * elapsedTime;
  torusTwo.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.1 * elapsedTime;
  plane.rotation.x = 0.1 * elapsedTime;
  torus.rotation.x = 0.1 * elapsedTime;
  sphereTwo.rotation.x = 0.15 * elapsedTime;
  planeTwo.rotation.x = 0.15 * elapsedTime;
  torusTwo.rotation.x = 0.15 * elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
