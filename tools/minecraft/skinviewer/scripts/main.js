import * as THREE from "three";
import { OrbitControls } from "./jsm/controls/OrbitControls.js"

import { initSkybox, setBackground } from "./background.js";
import { setLighting } from "./lighting.js";
import { loadPlayerSkin } from "./player-model.js";
import { registerUserInterfaceBindings } from "./user-interface.js";

// -----------
// Scene Setup
// -----------
export const scene = new THREE.Scene();
const viewportDiv = document.getElementById("glviewport");

// Set up renderer
const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false });

renderer.setSize(viewportDiv.clientWidth, viewportDiv.clientHeight);
renderer.setClearColor(0x888888, 1);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;

viewportDiv.appendChild(renderer.domElement);

export function TEMP_setRendererClearColor(clearColor)
{
	renderer.setClearColor(clearColor, 1);
}

// Setup camera
let cameraIsOrthographic = false;
let camera = null;
let cameraControls = null;

function setupCamera(isOrthographic)
{
	// Setup camera
	if(isOrthographic)
	{
		camera = new THREE.OrthographicCamera(viewportDiv.clientWidth / - 2, viewportDiv.clientWidth / 2, viewportDiv.clientHeight / 2, viewportDiv.clientHeight / - 2, 1, 1000)

		camera.zoom = 18;
		camera.updateProjectionMatrix();
	}
	else
	{
		camera = new THREE.PerspectiveCamera(75, viewportDiv.clientWidth / viewportDiv.clientHeight, 0.1, 1000.0);
	}

	// Setup camera controls
	cameraControls = new OrbitControls(camera, renderer.domElement);

	cameraControls.enablePan = false;

	cameraControls.minDistance = 20;
	cameraControls.maxDistance = 80;
}

setupCamera(cameraIsOrthographic);

// Set default camera position
camera.position.z = 40;
cameraControls.update();

// Setup scene objects
initSkybox();
setLighting("none");
setBackground("none");

// Load default player skin (steve)
loadPlayerSkin("./models/player/steve_wide.png", scene);

// Listen for window resize
function onWindowResize()
{
	// Update camera
	camera.aspect = (viewportDiv.clientWidth / viewportDiv.clientHeight);
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(viewportDiv.clientWidth, viewportDiv.clientHeight);
}

window.addEventListener("resize", onWindowResize, false);

// Bind user interface buttons to their functions
registerUserInterfaceBindings();

// ---------------
// Render function
// ---------------
function doRender()
{
	requestAnimationFrame(doRender);

	cameraControls.update();

	renderer.render(scene, camera);
}

doRender();
