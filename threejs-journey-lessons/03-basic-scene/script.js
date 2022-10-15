/* global THREE */

// Global object
console.log('Hello Three.js', THREE);

/* ///////////// */
/* Creates scene */
/* ///////////// */
// https://threejs.org/docs/index.html#api/en/scenes/Scene
const scene = new THREE.Scene();

/* //////// */
/* Red cube */
/* //////// */
// (1,1,1) = size of box, in ThreeJS units. Their meaning can be up to you (meters, km...)
// https://threejs.org/docs/index.html#api/en/geometries/BoxGeometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
// What makes the geometry solid. Geometry are just coordinates of the points,
// a material paints them?
// https://threejs.org/docs/index.html#api/en/materials/MeshBasicMaterial
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// A mesh is composed of a geometry and a material
// https://threejs.org/docs/index.html#api/en/objects/Mesh
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// Canvas sizes
const sizes = {
  width: 800,
  height: 600,
};

/* ////////////// */
/* Creates camera */
/* ////////////// */
// https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera
// 75 = fov
// aspect ratio = width/height
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
scene.add(camera);


/* //////////////// */
/* Creates renderer */
/* //////////////// */
// canvas DOM ref - from HTML / it's not from ThreeJS.
// https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer
const canvasRef = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: canvasRef,

});
// No need to provide width and height in HTML, you can do it in the renderer.
renderer.setSize(sizes.width, sizes.height);

// Finally, to do a render you need to pass the scene and the camera.
// but wait! you need to move the camera first. Currently it is at the center of the scene, and also everything else is.
// so it is inside of the cube too (and you can't see the inside of the cube due to the mesh normals)
// renderer.render(scene, camera);
// You normally set this after the camera asigments too, but wanted to
// save it here for the example
camera.position.z = 3;
renderer.render(scene, camera);
