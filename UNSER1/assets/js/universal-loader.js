// Universal Loader for All Pages
// This file loads all necessary scripts and initializes common functionality

// Load scripts dynamically
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
}

// Initialize all common functionality
function initializeCommonFeatures() {
  // Load essential scripts in order
  const scripts = [
    'assets/js/api.js',
    'assets/js/enhanced-api.js',
    'assets/js/auth-ui.js',
    'assets/js/cart.js',
    'assets/js/cart-widget.js',
    'assets/js/user-profile.js',
    'assets/js/admin-panel.js'
  ];

  let loadedCount = 0;
  
  scripts.forEach(src => {
    loadScript(src, () => {
      loadedCount++;
      if (loadedCount === scripts.length) {
        // All scripts loaded, initialize UI
        initializeUI();
      }
    });
  });
}

function initializeUI() {
  // Update authentication UI
  if (typeof AuthUI !== 'undefined') {
    AuthUI.updateUserInterface();
  }

  // Initialize cart widget
  if (typeof CartWidget !== 'undefined') {
    CartWidget.init();
  }

  // Initialize theme
  if (typeof ThemeManager !== 'undefined') {
    ThemeManager.init();
  }

  // Initialize mobile navigation
  initializeMobileNav();

  // Initialize page-specific features
  initializePageSpecificFeatures();
}

function initializeMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }
}

function initializePageSpecificFeatures() {
  const currentPage = window.location.pathname;
  
  // Consultation page features
  if (currentPage.includes('consultation')) {
    initializeConsultation();
  }
  
  // Education page features
  if (currentPage.includes('education')) {
    initializeEducation();
  }
  
  // Cybersecurity page features
  if (currentPage.includes('cybersecurity')) {
    initializeCybersecurity();
  }
  
  // Showcase page features
  if (currentPage.includes('showcase')) {
    initializeShowcase();
  }
}

function initializeConsultation() {
  // Add consultation form handling
  const consultationForm = document.querySelector('.consultation-form');
  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Consultation request submitted! We will contact you soon.');
    });
  }

  // Add booking buttons functionality
  const bookButtons = document.querySelectorAll('.book-consultation');
  bookButtons.forEach(button => {
    button.addEventListener('click', () => {
      const user = Auth.getCurrentUser();
      if (!user) {
        alert('Please login to book a consultation');
        window.location.href = '/login';
        return;
      }
      alert('Consultation booked successfully!');
    });
  });
}

function initializeEducation() {
  // Add course enrollment functionality
  const enrollButtons = document.querySelectorAll('.enroll-course');
  enrollButtons.forEach(button => {
    button.addEventListener('click', () => {
      const user = Auth.getCurrentUser();
      if (!user) {
        alert('Please login to enroll in courses');
        window.location.href = '/login';
        return;
      }
      
      const courseName = button.dataset.course || 'Course';
      alert(`Successfully enrolled in ${courseName}!`);
    });
  });

  // Add video player functionality
  const videoPlayers = document.querySelectorAll('.video-player');
  videoPlayers.forEach(player => {
    player.addEventListener('click', () => {
      alert('Video player coming soon!');
    });
  });
}

function initializeCybersecurity() {
  // Add security scan functionality
  const scanButtons = document.querySelectorAll('.security-scan');
  scanButtons.forEach(button => {
    button.addEventListener('click', () => {
      const user = Auth.getCurrentUser();
      if (!user) {
        alert('Please login to run security scans');
        window.location.href = '/login';
        return;
      }
      
      button.textContent = 'Scanning...';
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = 'Scan Complete';
        button.classList.add('scan-complete');
        alert('Security scan completed! No threats found.');
      }, 3000);
    });
  });

  // Add protection toggle
  const protectionToggles = document.querySelectorAll('.protection-toggle');
  protectionToggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const protection = e.target.dataset.protection;
      const status = e.target.checked ? 'enabled' : 'disabled';
      alert(`${protection} ${status}`);
    });
  });
}

function initializeShowcase() {
  // Add project showcase interactions
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectName = card.querySelector('.project-title')?.textContent || 'Project';
      alert(`Viewing details for: ${projectName}`);
    });
  });

  // Add filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter projects (placeholder)
      alert(`Filtering projects by: ${filter}`);
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCommonFeatures);
} else {
  initializeCommonFeatures();
}

// Make functions globally available
window.initializeCommonFeatures = initializeCommonFeatures;
window.initializePageSpecificFeatures = initializePageSpecificFeatures;
