// ==========================================
// THEME MANAGEMENT (Dark Mode / Light Mode)
// ==========================================

// Initialize theme from localStorage or system preference
function initializeTheme() {
  let savedTheme = localStorage.getItem('theme');
  
  // If no saved theme, check system preference
  if (!savedTheme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    savedTheme = prefersDark ? 'dark' : 'light';
  }
  
  setTheme(savedTheme);
}

// Set theme and apply to all elements
function setTheme(theme) {
  // Validate theme value
  if (theme !== 'dark' && theme !== 'light') {
    theme = 'dark';
  }
  
  // Apply theme to body
  document.body.setAttribute('data-theme', theme);
  
  // Save to localStorage
  localStorage.setItem('theme', theme);
  
  // Update all theme icons in the page
  updateThemeIcons(theme);
  
  // Dispatch custom event for other scripts to listen
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

// Update all theme button icons
function updateThemeIcons(theme) {
  const themeButtons = document.querySelectorAll('#themeBtn, .theme-toggle-btn');
  
  themeButtons.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fas fa-moon';
        btn.setAttribute('title', 'Switch to Light Mode');
      } else {
        icon.className = 'fas fa-sun';
        btn.setAttribute('title', 'Switch to Dark Mode');
      }
    }
  });
}

// Toggle theme
function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

// Add Floating Toggle Button if not exists
function addFloatingToggleButton() {
    // Check if a theme button already exists and is visible
    const existingBtn = document.getElementById('themeBtn');
    
    // Create floating button
    const container = document.createElement('div');
    container.className = 'theme-toggle-container';
    
    const btn = document.createElement('button');
    btn.className = 'theme-toggle-btn';
    btn.id = 'floatingThemeBtn';
    btn.innerHTML = '<i class="fas fa-moon"></i>';
    
    container.appendChild(btn);
    document.body.appendChild(container);
    
    btn.addEventListener('click', toggleTheme);
    
    // Initial icon update
    const currentTheme = localStorage.getItem('theme') || 'dark';
    updateThemeIcons(currentTheme);
}

// Initialize theme immediately to prevent flicker
initializeTheme();

// Set up listeners on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    // Handle existing buttons
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    // Add the floating button for all pages
    addFloatingToggleButton();
    
    // Ensure correct icons
    const currentTheme = localStorage.getItem('theme') || 'dark';
    updateThemeIcons(currentTheme);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});
