[
  [document.getElementById('menuToggle'), document.getElementById('navMenu')],
  [document.querySelector('[data-nav-toggle]'), document.querySelector('[data-primary-nav]')]
].forEach(([toggle, nav]) => {
  if (!toggle || !nav) return;
  toggle.setAttribute('aria-controls', nav.id);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  function setOpen(open) {
    nav.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('active')));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('active')) {
      setOpen(false);
      toggle.focus();
    }
  });
});
document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
window.addEventListener('scroll', () => {
  document.body.classList.toggle('scrolled', window.scrollY > 20);
});

// Measure intent only. Never read form fields, link text, query strings or patient data.
// Existing per-page GA destinations are deliberately preserved pending owner verification.
(function () {
  function measure(name, kind) {
    const detail = { action_type: kind };
    document.dispatchEvent(new CustomEvent('nfc:conversion', { detail: { name, ...detail } }));
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, { ...detail, transport_type: 'beacon' });
    }
  }
  document.addEventListener('click', function (event) {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (url.protocol === 'tel:') measure('phone_click', 'call');
    else if (url.origin === window.location.origin && /^\/schedule(?:\.html)?$/.test(url.pathname)) {
      measure('appointment_request_click', 'appointment');
    } else if (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps') && /directions/i.test(link.textContent)) {
      measure('directions_click', 'directions');
    }
  });
  document.querySelectorAll('form[action="https://formspree.io/f/xojorllz"]').forEach(function (form) {
    form.addEventListener('submit', function () {
      // A native submit is an attempt, not evidence of delivery or a confirmed appointment.
      measure('form_submit_attempt', form.querySelector('[name="request_type"]') ? 'appointment' : 'contact');
    });
  });
})();
