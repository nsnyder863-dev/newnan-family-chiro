const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

function closeNavigation() {
  if (!menuToggle || !navMenu) return;
  navMenu.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNavigation));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNavigation();
      menuToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      closeNavigation();
    }
  });
}

window.addEventListener('scroll', () => {
  document.body.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

function sendAnalyticsEvent(eventName, parameters = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, parameters);
  }
}

document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
  link.addEventListener('click', () => sendAnalyticsEvent('call_click', {
    link_text: link.textContent.trim(),
    page_path: window.location.pathname
  }));
});

document.querySelectorAll('a[href*="google.com/maps"], a[href*="maps.google"]').forEach((link) => {
  link.addEventListener('click', () => sendAnalyticsEvent('directions_click', {
    page_path: window.location.pathname
  }));
});

document.querySelectorAll('a[href="schedule.html"], a[href$="/schedule.html"]').forEach((link) => {
  link.addEventListener('click', () => sendAnalyticsEvent('appointment_request_click', {
    link_text: link.textContent.trim(),
    page_path: window.location.pathname
  }));
});

document.querySelectorAll('form[data-analytics-form]').forEach((form) => {
  form.addEventListener('submit', () => sendAnalyticsEvent('form_submit', {
    form_name: form.dataset.analyticsForm,
    page_path: window.location.pathname
  }));
});
