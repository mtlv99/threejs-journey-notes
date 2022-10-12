import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
// it reads the viewport width and height, and saves it (doesn't add support for resizing on its own though).
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// That's where the resize event comes at rescue.
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    // We need to update the matrix so objects won't get distorted by the old aspect ratio.
    camera.updateProjectionMatrix();

    // Update renderer (Updates <canvas /> size).
    renderer.setSize(sizes.width, sizes.height);

    // Tip: set pixel ratio on resize events to make sure it uses the corresponding pixel ratio of the current screen.
    // Useful for when you have multiple screens. For example a MacOS' retina display and a normal monitor.
    // The user moves the browser from one window to another so this value needs to be updated too.

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// Double click event for entering fullscreen mode
window.addEventListener('dblclick', () =>
{
    // All of this extra logic for Safari support... ugh.
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

    // checks if there is NOT an element marked as fullscreen.
    if(!fullscreenElement) {
        // if standard document element exists, then execute the "enter fullscreen" method
        if(canvas.requestFullscreen) {
            canvas.requestFullscreen();
        // if it doesn't, read from webkit element
        } else if(canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        };
    }
    // if there is, then it should exit fullscreen mode.
    else {
        // if standard document element exists, then execute the "exit fullscreen" method
        if(document.exitFullscreen) {
            document.exitFullscreen();
        // if it doesn't, read from webkit element
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        };
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);

// Pixel ratio: how many physical pixels you have on the screen for one pixel unit on the software part.
// Math.min will prevent the value from being higher than 2. A higher value will consume more battery and resources over nothing.
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()