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
			<h5 class="text-center">Click on Fetch Files for getting Share content.</h5>
			<div class="row justify-content-center">
				<div class="col-md-6 col-sm-12">
					<div class="text-center">
						<button id="fetch-files-button" class="btn btn-primary">Fetch Files</button>
					</div>
					<div id="file-list" class="mt-4 text-center text-lg"></div>
					<div id="output"></div>
				</div>
			</div>
		</div>
	</main>

	<footer>
	</footer>

	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
		integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
		crossorigin="anonymous">
	</script>
	
	
</body>

</html>