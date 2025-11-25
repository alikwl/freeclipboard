// FreeClipboard - Main JavaScript
console.log('FreeClipboard loaded successfully');

// =========================================
// THEME TOGGLE
// =========================================
function initTheme() {
  // Check for saved theme preference or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  updateThemeIcon();
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon();
  
  // Dispatch event for other scripts that might need to know about theme change
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
}

function updateThemeIcon() {
  const themeIcon = document.getElementById('themeIcon');
  if (!themeIcon) return;
  
  const currentTheme = document.documentElement.getAttribute('data-theme');
  themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

// =========================================
// MOBILE MENU
// =========================================
function toggleMobileMenu() {
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('mobileMenuToggle');
  
  if (nav && toggle) {
    const isActive = nav.classList.toggle('active');
    toggle.classList.toggle('active');
    
    // Update aria-expanded for accessibility
    toggle.setAttribute('aria-expanded', isActive);
    
    // Prevent body scroll when menu is open
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

function closeMobileMenu() {
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('mobileMenuToggle');
  
  if (nav && toggle) {
    nav.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

// =========================================
// EVENT LISTENERS
// =========================================
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initTheme();
  
  // Theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }
  
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.site-nav .page-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const nav = document.getElementById('siteNav');
    const toggle = document.getElementById('mobileMenuToggle');
    const themeToggle = document.getElementById('themeToggle');
    
    if (nav && toggle && 
        !nav.contains(event.target) && 
        !toggle.contains(event.target) &&
        !themeToggle.contains(event.target)) {
      closeMobileMenu();
    }
  });
  
  // Close mobile menu when window is resized to desktop
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    }, 250);
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add loading animation
  document.body.classList.add('loaded');
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
  if (!localStorage.getItem('theme')) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    updateThemeIcon();
  }
});