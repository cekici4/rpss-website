function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-item a');
    const activePage = document.body.getAttribute('data-active-page');

    navLinks.forEach(link => {
        const linkPage = new URL(link.href).pathname.split('/').pop().split('.')[0];
        if (linkPage === activePage) {
            link.parentNode.classList.add('active');
        } else {
            link.parentNode.classList.remove('active');
        }
    });
}

// Call the function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    setActiveLink();
});
