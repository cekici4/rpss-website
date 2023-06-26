// Call the function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    activateLink();
});
var sideBarPos = 0;

function moveSidebar() {
	
	if (sideBarPos == 0){
		document.getElementById('mySideNav').style.width = "10vh";
		document.getElementById('share').style.display = "none";
		document.getElementById('home').style.display = "none";
		document.getElementById('sidebar-title').style.display = "none";
		document.getElementById('sidebar-arrow').textContent="chevron_right";
		document.getElementById('UserID').style.display = "none";
		showIcons();

		sideBarPos = 1;
	} else {
		document.getElementById('mySideNav').style.width = "280px";
		document.getElementById('share').style.display = "block";
		document.getElementById('home').style.display = "block";
		document.getElementById('sidebar-title').style.display = "block";
		document.getElementById('sidebar-arrow').textContent="chevron_left";
		document.getElementById('UserID').style.display = "block";
		sideBarPos = 0;
	}
function showIcons() {
		document.getElementById('share').style.display = "block";
		document.getElementById('home').style.display = "block";
		
}

}

