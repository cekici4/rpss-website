function toggleActiveNavLinks() {
	const navLinks = document.querySelectorAll('.nav-item a');
  
	navLinks.forEach(link => {
	  link.addEventListener('click', function(event) {
		event.preventDefault();
  
		const currentActive = document.querySelector('.nav-item.active');
		if (currentActive) {
		  currentActive.classList.remove('active');
		}
  
		link.parentNode.classList.add('active');
	  });
	});
  }