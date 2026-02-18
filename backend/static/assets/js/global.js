// ==========================================
// GLOBAL SCRIPTS FOR UNISERVE AI
// ==========================================

// Function to inject CSS file
function injectCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Inject Theme Toggle CSS
    injectCSS('assets/css/theme-toggle.css');

    // 1. MOBILE MENU LOGIC
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    // Create Overlay if it doesn't exist
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    function toggleMenu() {
        if (!mainNav || !menuToggle) return;
        
        const isOpen = mainNav.classList.contains('active');
        if (isOpen) {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            mainNav.classList.add('active');
            menuToggle.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        overlay.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Close menu when clicking a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. WINDOW RESIZE HANDLER
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && mainNav && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // 3. SMOOTH SCROLL
    document.documentElement.style.scrollBehavior = 'smooth';

    // 4. INTERSECTION OBSERVER FOR ANIMATIONS
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .hero-text, .hero-visual, .card, .product, .course').forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // 5. USER AVATAR LOGIC
    const userAvatar = document.getElementById('userAvatar');
    
    // Load saved avatar from localStorage
    const savedAvatar = localStorage.getItem('userAvatarUrl');
    if (savedAvatar && userAvatar) {
        userAvatar.src = savedAvatar;
    }

    if (userAvatar) {
        userAvatar.addEventListener('click', () => {
            const newUrl = prompt('Please enter the image URL:', userAvatar.src);
            if (newUrl && newUrl.trim() !== '') {
                userAvatar.src = newUrl;
                localStorage.setItem('userAvatarUrl', newUrl);
            }
        });
    }
});

// Helper function for active link highlighting
function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.addEventListener('load', highlightActiveNav);
