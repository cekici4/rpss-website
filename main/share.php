<!--
    This Website is for the web-app Run PowerShell Scripts
    This is the share index.html and with that the main share HTML file
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
		<?php include __DIR__ . '/style/sidebar.php'; ?>  
		<!-- Main start -->
		<main class="shareMain d-flex flex-nowrap">
		
		<div id="shareHeader"> 	
		
		<h1> File Share</h1>
		<hr>
		
		<p> Down below are the folders that are available at the moment. </p>
		
			<div id="fileList" class=" text-lg mt-4">
				
	
						
			</div>
			<div id="output">
						
						
				
				
					
				
				</div>
		</div>
			
		</main>

	<footer>
		<?php include __DIR__ . '/style/footer.php'; ?>
	</footer>

	<!-- Script start -->
        <script type="text/javascript">
			function activateLink() {
				var link = document.getElementById("share");
				link.classList.add("active");
			}
		</script>
        <!-- Script end -->
	
	
</body>

</html>