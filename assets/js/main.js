// FreeClipboard - Main JavaScript
console.log('FreeClipboard loaded successfully');

// Mobile Menu Toggle
function toggleMobileMenu() {
  const nav = document.getElementById('siteNav');
  if (nav) {
    nav.classList.toggle('active');
  }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  const nav = document.getElementById('siteNav');
  const toggle = document.querySelector('.mobile-menu-toggle');
  
  if (nav && toggle && !nav.contains(event.target) && !toggle.contains(event.target)) {
    nav.classList.remove('active');
  }
});

// Close mobile menu when window is resized to desktop
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    const nav = document.getElementById('siteNav');
    if (nav) {
      nav.classList.remove('active');
    }
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add loading animation
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});