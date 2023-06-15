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
	<body data-active-page="<?php echo $active_page; ?>">

		<!-- Main start -->
		<main class="d-flex flex-nowrap">
			<!-- Sidebar start -->
			<?php include __DIR__ . '/style/sidebar.php'; ?>  
			<!-- Sidebar end -->

		<div class="container mt-5 mb-5">
		
			<h1 class="text-center">File List</h1>
			<h4 class="text-center">These are the available folders</h4>
			<h5 class="text-center"></h5>
			<div class="row justify-content-center">
				<div class="col-md-6 col-sm-12">
					<div class="text-center">
					<div id="file-list" class="mt-4 text-center text-lg"></div>
					<div id="output"></div>
					</div>
				</div>
			</div>
		</div>
	</main>

	<footer>
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