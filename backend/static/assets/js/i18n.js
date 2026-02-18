// Internationalization (i18n) - Arabic / English Support

const translations = {
  en: {
    home: 'Home',
    consultation: 'Consultation',
    marketplace: 'Marketplace',
    education: 'Education',
    cybersecurity: 'Cybersecurity',
    signIn: 'Sign In',
    heroTitle: 'One Platform for All AI Services',
    heroDesc: 'Consulting, AI tools, education, and cybersecurity in one unified system.',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    secure: 'Secure & Reliable',
    support: 'Support Available',
    users: 'Active Users',
    ourServices: 'Our Services',
    exploreServices: 'Explore our comprehensive solutions',
    consultingHub: 'Consulting Hub',
    teachersAndProgrammers: 'Teachers & Programmers',
    cyberSecurityHub: 'Cyber Security Hub',
    aboutUs: 'About Us',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    copyright: '© 2026 UniserveAI. All rights reserved.',
  },
  ar: {
    home: 'الرئيسية',
    consultation: 'الاستشارة',
    marketplace: 'السوق',
    education: 'التعليم',
    cybersecurity: 'الأمان السيبراني',
    signIn: 'تسجيل الدخول',
    heroTitle: 'منصة واحدة لجميع خدمات الذكاء الاصطناعي',
    heroDesc: 'الاستشارة وأدوات الذكاء الاصطناعي والتعليم والأمان السيبراني في نظام موحد واحد.',
    getStarted: 'ابدأ الآن',
    learnMore: 'تعرف على المزيد',
    secure: 'آمن وموثوق',
    support: 'الدعم متاح 24/7',
    users: 'مستخدم نشط',
    ourServices: 'خدماتنا',
    exploreServices: 'استكشف حلولنا الشاملة',
    consultingHub: 'مركز الاستشارة',
    teachersAndProgrammers: 'المعلمون والمبرمجون',
    cyberSecurityHub: 'مركز الأمان السيبراني',
    aboutUs: 'من نحن',
    contact: 'اتصل بنا',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    copyright: '© 2026 يونيسيرف إيه آي. جميع الحقوق محفوظة.',
  },
};

const languageBtn = document.getElementById('languageBtn');
const html = document.documentElement;
const body = document.body;

// Initialize language from localStorage
function initializeLanguage() {
  const savedLang = localStorage.getItem('language') || 'en';
  setLanguage(savedLang);
}

// Set language
function setLanguage(lang) {
  localStorage.setItem('language', lang);
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  body.setAttribute('data-lang', lang);
  updateLanguageUI(lang);
  updatePageContent(lang);
}

// Update language button text
function updateLanguageUI(lang) {
  const langText = languageBtn.querySelector('.lang-text');
  langText.textContent = lang === 'en' ? 'العربية' : 'English';
}

// Update page content with translations
function updatePageContent(lang) {
  // Update navigation links
  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(link => {
    const key = link.textContent.toLowerCase().replace(/\s+/g, '');
    const translationKey = Object.keys(translations[lang]).find(k => 
      translations[lang][k].toLowerCase().replace(/\s+/g, '') === key
    );
    if (translationKey) {
      link.textContent = translations[lang][translationKey];
    }
  });

  // Update hero section
  const h1 = document.querySelector('.hero-text h1');
  if (h1) h1.textContent = translations[lang].heroTitle;

  const heroP = document.querySelector('.hero-text p');
  if (heroP) heroP.textContent = translations[lang].heroDesc;

  // Update buttons
  const getStartedBtn = document.getElementById('getStartedBtn');
  if (getStartedBtn) getStartedBtn.textContent = translations[lang].getStarted;

  const learnMoreBtn = document.querySelector('.btn-secondary');
  if (learnMoreBtn) learnMoreBtn.textContent = translations[lang].learnMore;

  // Update stats
  const statLabels = document.querySelectorAll('.stat-label');
  if (statLabels.length >= 3) {
    statLabels[0].textContent = translations[lang].secure;
    statLabels[1].textContent = translations[lang].support;
    statLabels[2].textContent = translations[lang].users;
  }

  // Update Services section
  const sectionTitles = document.querySelectorAll('.section-title');
  const sectionSubtitles = document.querySelectorAll('.section-subtitle');
  
  if (sectionTitles.length > 0) {
    sectionTitles[sectionTitles.length - 1].textContent = translations[lang].ourServices;
  }
  
  if (sectionSubtitles.length > 0) {
    sectionSubtitles[sectionSubtitles.length - 1].textContent = translations[lang].exploreServices;
  }

  // Update service card titles and descriptions
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length >= 3) {
    serviceCards[0].querySelector('h3').textContent = translations[lang].consultingHub;
    serviceCards[1].querySelector('h3').textContent = translations[lang].teachersAndProgrammers;
    serviceCards[2].querySelector('h3').textContent = translations[lang].cyberSecurityHub;
  }

  // Update footer
  const footerSections = document.querySelectorAll('.footer-section h5');
  if (footerSections.length >= 3) {
    footerSections[0].textContent = translations[lang].aboutUs;
    footerSections[1].textContent = 'Services';
    footerSections[2].textContent = translations[lang].contact;
  }

  const copyrightText = document.querySelector('.footer-bottom p');
  if (copyrightText) copyrightText.textContent = translations[lang].copyright;
}

// Toggle language
function toggleLanguage() {
  const currentLang = html.getAttribute('lang') || 'en';
  const newLang = currentLang === 'en' ? 'ar' : 'en';
  setLanguage(newLang);
}

// Event listener for language button
languageBtn.addEventListener('click', toggleLanguage);

// Initialize language on page load
document.addEventListener('DOMContentLoaded', initializeLanguage);
