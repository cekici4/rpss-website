<aside>
    <!-- Sidebar Head start -->
    <div class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style="width: 280px; height: 100vh;">
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
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
                <a href="../index.php" class="nav-link active" aria-current="page">
                    <svg class="bi pe-none me-2" width="16" height="16">
                        <use xlink:href="#home"></use>
                    </svg>
                    Home
                </a>
            </li>
            <!-- Share List Item -->
            <li class="nav-item" id="share">
                <a href="../share/index.php" class="nav-link text-white" onclick="getShareContent(event); console.log(&quot;Hello i am talking from html&quot;);">
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

<script>
    // Get the list of nav links
    const navLinks = document.querySelectorAll('.nav-link');

    // Add the click event listener to each nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove the active class from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add the active class to the clicked nav link
            link.classList.add('active');
        });
    });
</script>
