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
        <body data-active-page="<?php echo $active_page; ?>">
            <!-- Main start -->
            <main class="d-flex flex-nowrap">
            <!-- Sidebar start -->
            <?php include __DIR__ . '/style/sidebar.php'; ?>    
            <!-- Sidebar end -->

            <!-- Section start -->
            <section>
                <h1 class="text-center" style="position: relative; left: 20px; top: 50px;">Welcome to the RPSS Webportal!</h1>
            </section>
            <!-- Section end -->

            <!-- Scripts section: includes Bootstrap JS libraries -->
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
                crossorigin="anonymous"
                defer></script>
            
            <!-- Scripts section end -->    
            </main>
            <!-- Main end -->
        </body>
        <!-- Body end -->

        <!-- Script start -->
        <script>
            
        </script>
        <!-- Script end -->
</html>
<!-- End of HTML document -->