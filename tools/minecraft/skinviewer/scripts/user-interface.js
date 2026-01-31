import { setBackground } from "./background.js";
import { setLighting } from "./lighting.js";
import { getPlayerModelType, togglePlayerModelType, loadPlayerModel, loadPlayerSkin } from "./player-model.js";

let currentSubMenuName = "";

function uiToggleSubMenu(menuId)
{
	const menuSize = getComputedStyle(document.documentElement).getPropertyValue("--menu-bar-size").toString();
	const menuElement = document.getElementById(menuId);

	const hideAnimationStr = "sidebar-hide var(--transition-time) forwards";
	const showAnimationStr = "sidebar-show var(--transition-time) forwards";

	// Check if the current menu matches the new one
	if(currentSubMenuName != menuId)
	{
		// Check if we already have a sub menu open
		if(currentSubMenuName != "")
		{
			// Hide the old sub menu
			const oldOpenMenu = document.getElementById(currentSubMenuName);

			oldOpenMenu.style.animation = hideAnimationStr;
			oldOpenMenu.style.animationPlayState = "initial";
		}

		// Set new menu name
		currentSubMenuName = menuId;

		// Set new menu position
		menuElement.style.animation = showAnimationStr;
	}
	else
	{
		// 'Close' the current menu
		menuElement.style.animation = hideAnimationStr;

		// Set menu name to empty
		currentSubMenuName = "";
	}

	menuElement.style.animationPlayState = "initial";
}

function uiLoadSkin()
{
	// Open a file selector dialog
	let fileSelector = document.createElement("input");
	fileSelector.type = "file";

	fileSelector.onchange = e =>
	{
		// Set the player skin
		loadPlayerSkin(URL.createObjectURL(e.target.files[0]));
	}

	fileSelector.click();
}

function uiLoadDefaultSkin(skinName)
{
	const playerModelPath = `./models/player/${skinName}_${getPlayerModelType()}.png`;
	loadPlayerSkin(playerModelPath);
}

function uiChangeModel()
{
	// Choose model type name
	togglePlayerModelType();

	// Update player model
	loadPlayerModel();
}

export function registerUserInterfaceBindings()
{
	// Top level buttons
	document.getElementById("ui-show-skins").addEventListener("click", () => { uiToggleSubMenu("ui-skins-menu"); }, false);
	document.getElementById("ui-change-model").addEventListener("click", uiChangeModel, false);
	//document.getElementById("ui-show-poses").addEventListener("click", () => { uiToggleSubMenu("ui-poses-menu"); }, false);
	document.getElementById("ui-show-backgrounds").addEventListener("click", () => { uiToggleSubMenu("ui-backgrounds-menu"); }, false);
	document.getElementById("ui-show-lighting").addEventListener("click", () => { uiToggleSubMenu("ui-lighting-menu"); }, false);

	// Skin menu buttons
	document.getElementById("ui-load-skin").addEventListener("click", uiLoadSkin, false);
	document.getElementById("ui-show-skins-list").addEventListener("click", () => { uiToggleSubMenu("ui-default-skins-menu"); }, false);

	// Default skin buttons
	for(const element of document.getElementsByClassName("default-skin-button"))
	{
		element.addEventListener("click", () => { uiLoadDefaultSkin(element.id.split("-")[1]); }, false);
	}

	// Background buttons
	for(const element of document.getElementsByClassName("background-button"))
	{
		element.addEventListener("click", () => { setBackground(element.id.split("-")[1]) }, false);
	}

	// Lighting buttons
	for(const element of document.getElementsByClassName("lighting-button"))
	{
		element.addEventListener("click", () => { setLighting(element.id.split("-")[1]) }, false);
	}
}