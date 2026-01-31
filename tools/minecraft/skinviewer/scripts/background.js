import * as THREE from 'three';
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js"
import { OBJLoader } from "./jsm/loaders/OBJLoader.js";

import { scene } from "./main.js";
import { currentLightType } from "./lighting.js";

const backgroundModelLoader = new GLTFLoader();
let backgroundModel = null;
let backgroundModelName = "none";
let backgroundMetadata = null;

let skyboxModel = null;
const skyboxMaterial = new THREE.MeshBasicMaterial();

export function initSkybox()
{
	new OBJLoader().load(
		"./models/skybox.obj",
		model =>
		{
			skyboxModel = model;

			// Render skybox behind everything else
			skyboxModel.renderOrder = -1;

			skyboxMaterial.depthWrite = false;
			skyboxMaterial.needsUpdate = true;

			// Set material for skybox
			skyboxModel.traverse(
				child =>
				{
					if(child.isMesh)
					{
						child.material = skyboxMaterial;
					}
				}
			);

			// Add the skybox to the scene
			scene.add(skyboxModel);
		},
		xhr => {},
		error =>
		{
			console.log("Failed to load skybox model: " + error);
		}
	);
}

export function setBackground(backgroundName)
{
	// Check if this background is different from the current one
	if(backgroundName != backgroundModelName)
	{
		// Remove existing background from the scene
		if(backgroundModel != null)
		{
			scene.remove(backgroundModel);
		}

		backgroundModelName = backgroundName;

		// Load the new background model
		if(backgroundName != "none")
		{
			const backgroundPathNoExt = `./models/background/${backgroundName}/background`;

			// Load background metadata and update sky color
			fetch(`${backgroundPathNoExt}.json`).then(
				(response) => response.json()
			).then(
				(data) => (backgroundMetadata = data)
			).then(
				updateSkyColor()
			);

			// Load the background model
			backgroundModelLoader.load(
				`${backgroundPathNoExt}.glb`,
				model =>
				{
					backgroundModel = model.scene;

					// Set model offset
					backgroundModel.position.set(0, -18, 0);

					// Iterate model children
					backgroundModel.traverse(
						child =>
						{
							if(child.isMesh)
							{
								// Set shadow stuff
								child.castShadow = true;
								child.receiveShadow = true;

								// Get rid of the awful specular shininess
								child.material.shininess = 0;
							}
						}
					);

					// Add the new model to the scene
					scene.add(backgroundModel);
				},
				xhr => {},
				error =>
				{
					console.log("Failed to load background model: " + error);
				}
			);
		}
	}
}

export function updateSkyColor()
{
	// Use noon skies when the light type is "none"
	const lightType = (currentLightType == "none") ? "noon" : currentLightType;
	const desiredSkyboxName = (backgroundMetadata == null) ? lightType : backgroundMetadata["skybox-textures"][lightType];

	// Load the new skybox texture
	new THREE.TextureLoader().load(
		`./models/background/${backgroundModelName}/skybox/${desiredSkyboxName}.png`,
		texture =>
		{
			skyboxMaterial.map = texture;

			// Set texture encoding to sRGB
			skyboxMaterial.map.encoding = THREE.sRGBEncoding;

			// Mark material for update
			skyboxMaterial.needsUpdate = true;
		},
		xhr => {},
		error =>
		{
			console.log("Failed to load skybox texture: " + error);
		}
	);
}
