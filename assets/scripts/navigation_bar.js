// Navbar active item
let setActiveNavbarItem = function()
{
	let elementsTemp = document.getElementsByName("navbar_name");
	if(elementsTemp.length > 0)
	{
		let navbarItemName = elementsTemp[0].getAttribute("content");
		
		let navItems = document.getElementsByClassName("nav-link");
		
		for(let i = 0; i < navItems.length; i++)
		{
			if(navItems[i].innerHTML == navbarItemName)
			{
				navItems[i].classList.add("active");
				navItems[i].classList.add("force-underline");
			}
		}
	}
};

setActiveNavbarItem();

// Theme code
let currentTheme = (window.localStorage.getItem("theme") || "dark");
let themeButton = document.getElementById("theme-button");

let setTheme = function()
{
	document.documentElement.setAttribute("data-theme", currentTheme);
}

let changeTheme = function()
{
	currentTheme = (currentTheme == "dark") ? "light" : "dark";
	setTheme(currentTheme);

	window.localStorage.setItem("theme", currentTheme);
}

themeButton.onclick = changeTheme;

setTheme();

// Disable transition until page load
$(window).on("load", function()
{
	$("body").removeClass("preload");
});