import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
// Can also be loaded from example but not used here (for practiging with the FontLoader).
// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

// Typeface converter
// http://gero3.github.io/facetype.js/


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/8.png');
const matcapTextureTwo = textureLoader.load('/textures/matcaps/2.png');


/**
 * Fonts
 */
const fontLoader = new FontLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

fontLoader.load(
  '/fonts/helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry(
      'Marco\'s Test',
      {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        // bevel smooths borders (similar to ClearType?)
        // this adds extra geometry, careful with huge values!
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      },
    );
    const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTextureTwo });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Frustum culling: similar to an invisible hitbox, used for determining if an object should be rendered on camera
    // Calculates frustum culling
    textGeometry.computeBoundingBox();
    // console.log(textGeometry.boundingBox);

    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
    //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
    //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5, // Subtract bevel thickness
    // );

    // ... or we can just use the built-in function (though I learned about frustum culling, cool!)
    textGeometry.center();

    // Reuse geometries and materials whenever possible for performance reasons!
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 100; i++) {
      const donut = new THREE.Mesh(donutGeometry, donutMaterial);

      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;

      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;

      // Scale needs all values to be equal so the mesh won't get distorted
      const scale = Math.random();
      donut.scale.set(scale, scale, scale);
      scene.add(donut);
    }

    scene.add(textMesh);
  },
);


// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

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

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
