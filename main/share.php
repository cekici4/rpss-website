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
		<style> 
			#output {
					  background-color: #1e1e1e; /* dark background color */
					  color: #d4d4d4; /* light text color */
					  padding: 20px; /* space around the text */
					  border-radius: 5px; /* rounded corners */
					  font-family: 'Courier New', Courier, monospace; /* monospace font */
					  font-size: 25px; /* font size */
					  white-space: pre-wrap; /* preserves spaces and line breaks */
					  word-wrap: break-word; /* prevents long text from overflowing */
					  overflow-x: auto; /* adds horizontal scrollbar if needed */
					  max-height: 300px; /* maximum height before scrollbar appears */
					  width: 75%; /* set width to 75% of its container */
					  text-align: center; /* center the text horizontally */
					  margin: 0 auto; /* center the div horizontally within its container */
					  margin-top: 20px; /* Add margin above output */
			}
		</style>
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
		<div id="breadcrumb"></div>
			<div id="fileList" class=" text-lg mt-4"></div>
			<div id="function-header">
				<h3>The functions that are available inside this module are listed below.</h3>
			</div>
			<div id="function-list"> 
			
			</div>
			
			<div id="output" style=""> </div>	
			 <button id="copy-button"><i class="fas fa-clipboard"></i>  Copy</button>
			<button id="goBackButton" onclick="goBack()">Go Back</button>

		</div>
<div id="myModal" class="modal">
	<div class="modal-content">
		<span class="close">&times;</span>
		<h2 id="selectedFunctionName"></h2>
		<div id="functionSyntax"></div>
		<div id="functionParameters"></div>
		<button id="runButton">Run</button>
		<div id="loadingIndicator" style="display: none;">
	<img src="./style/images/spinner.gif" alt="Loading..." />
</div>
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
	document.getElementById('copy-button').addEventListener('click', function() {
    // Get the text from the div
    var textToCopy = document.getElementById('output').innerText;
    var copyButton = document.getElementById('copy-button'); // Reference to the copy button

    // Use the Clipboard API to copy the text to the clipboard
    navigator.clipboard.writeText(textToCopy).then(function() {
        // Successfully copied to clipboard
        console.log('Text successfully copied to clipboard');
        
        // Change the button text to indicate it has been copied
        copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        // Change it back after 1.5 seconds
        setTimeout(function() {
            copyButton.innerHTML = '<i class="fas fa-clipboard"></i> Copy';
        }, 1500);

    }).catch(function(err) {
        // Failed to copy to clipboard
        console.error('Error copying text to clipboard', err);
    });
});


		</script>
        <!-- Script end -->
	
	
</body>

</html>