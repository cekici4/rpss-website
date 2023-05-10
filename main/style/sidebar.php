
<aside>
    <!-- Sidebar Head start -->
    <div class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style="width: 280px; height: 100vh;">
        <a href="index.php" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <svg class="bi pe-none me-2" width="40" height="32">
                <use xlink:href="#bootstrap"></use>
            </svg>
            <span class="fs-4">RPSS SCOR</span>
        </a>
        <!-- Sidebar Head end -->        
        <hr>
        <ul id="sidebar-nav" class="nav nav-pills flex-column mb-auto">
            <!-- Home List Item -->   
            <li class="nav-item" id="home">
                <a href="http://localhost:8012/rpss-website/main/index.php" class="nav-link text-white" aria-current="page">
                    <svg class="bi pe-none me-2" width="16" height="16">
                        <use xlink:href="#home"></use>
                    </svg>
                    Home
                </a>
            </li>
            <!-- Share List Item -->
            <li class="nav-item" id="share">
                <a href="http://localhost:8012/rpss-website/main/share/index.php" class="nav-item nav-link text-white" onclick="toggleActiveNavLinks(event); ">
                    <svg class="bi pe-none me-2" width="16" height="16">
                        <use xlink:href="#table"></use>
                    </svg>
                    Share
                </a>
            </li>
        </ul>
        <hr>
        <div class="dropdown">
            <!-- Dropdown Head start -->
            <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2">
                <strong>Username</strong>
            </a>
            <!-- Dropdown Head end -->
            <!-- Dropdown Items start -->
            <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                <!-- Settings List Item -->
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <!-- Profile List Item -->
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <!-- Divider List Item -->
                <li><hr class="dropdown-divider"></li>
                <!-- Sign Out List Item -->
                <li><a class="dropdown-item" href="#">Sign out</a></li>
            </ul>
            <!-- Dropdown Items end -->
        </div>
        <!-- Dropdown ends -->
    </div>
</aside>


