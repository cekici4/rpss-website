<!--
    This Website is for the web-app Run PowerShell Scripts
    This is the index.html and with that the main HTML file
    Created by: C.Ekici
 -->
 
<!DOCTYPE html>
    <html lang="en">
        <!-- Head start -->
        <head>
            <?php include __DIR__ . '/style/head.php'; ?>
        </head>
        <!-- Head end -->

        <!-- Body start -->
        <body>
            <!-- Main start -->
            <main class="d-flex flex-nowrap">
            <!-- Sidebar start -->
            <?php include __DIR__ . '/style/sidebar.php'; ?>    
            <!-- Sidebar end -->

            
            
                <div id="main-title"> 
				
					<h1 class="home-text">Run PowerShell Scripts </h1>
					<hr>
					<p>This Webportal allows for running PowerShell scripts directly from it. Please notice that only authorized users are allowed on this portal. 
					<br>Further please remember that every action is being logged. </p>
				</div>
				
			
            
			
              
            </main>
            <!-- Main end -->
        </body>
        <!-- Body end -->

        <!-- Script start -->
        <script type="text/javascript">
			function activateLink() {
				var link = document.getElementById("home");
				link.classList.add("active");
			}
		</script>
        <!-- Script end -->
		<!-- Footer starts -->
		<?php include __DIR__ . '/style/footer.php'; ?>
</html><!-- Footer ends --> 
<!-- End of HTML document -->