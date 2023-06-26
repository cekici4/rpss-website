<aside>
    <!-- Sidebar Head start -->
    <div id="mySideNav" class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark">
        <a href="https://rpss/home.php" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <svg class="bi pe-none me-2" width="40" height="32">
                <use xlink:href="#bootstrap"></use>
            </svg>
            <h1 id="sidebar-title">RPSS SCOR</h1>
        </a>
        <!-- Sidebar Head end -->        
        <hr>
        <ul id="sidebar-nav" class="nav nav-pills flex-column mb-auto">
            <!-- Home List Item -->   
            <li class="nav-item">
                <a href="https://rpss/home.php" id="home" class=" nav-link text-white">
                    <span class="material-icons md-48">home</span>
					Home 
                </a>
            </li>
            <!-- Share List Item -->
            <li class="nav-item">
                <a href="https://rpss/share.php" id="share" class="nav-link text-white" >
                    <span class="material-icons md-48">folder_open</span>
					Share
                </a>
            </li>
        </ul>
        <hr> 
		
		<div id="UserID">
			<?php
				if (isset($_SERVER['LOGON_USER'])) {
					echo "Logged in as: " . $_SERVER['LOGON_USER'];
				} else {
					echo "Not logged in";
				}
			?>
		</div>
		
		
		
			<button onclick="moveSidebar();" class="sidebar-arrow-button"><span id="sidebar-arrow" class="material-symbols-outlined">chevron_left</span></button>
            <!-- Dropdown Items end -->
        </div>
        <!-- Dropdown ends -->
    </div>
</aside>

