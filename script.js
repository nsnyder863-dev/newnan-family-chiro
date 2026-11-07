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

// Measure intent only. Never send form fields, link text, query strings or patient data.
// Existing per-page GA destinations are deliberately preserved pending owner verification.
(function () {
  function measure(name, kind) {
    try {
    const detail = { action_type: kind };
    document.dispatchEvent(new CustomEvent('nfc:conversion', { detail: { name, ...detail } }));
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, { ...detail, transport_type: 'beacon' });
    }
    } catch (_) { /* Analytics must never interrupt a request. */ }
  }
  document.addEventListener('click', function (event) {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (url.protocol === 'tel:') measure('phone_click', 'call');
    else if (url.origin === window.location.origin && /^\/schedule(?:\.html)?$/.test(url.pathname)) {
      measure('appointment_request_click', 'appointment');
    } else if (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps') && !link.closest('.reviews-section, .review-ad-section') && !/review/i.test(link.textContent + (link.getAttribute('aria-label') || ''))) {
      measure('directions_click', 'directions');
    }
  });
  document.querySelectorAll('form[action="https://formspree.io/f/xojorllz"]').forEach(function (form) {
    if (!window.fetch || !window.FormData || !window.AbortController) return;
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.tabIndex = -1;
    form.appendChild(status);
    const fallback = document.createElement('button');
    fallback.type = 'button';
    fallback.className = 'btn btn-dark';
    fallback.textContent = 'Continue with secure form';
    fallback.hidden = true;
    fallback.addEventListener('click', function () {
      if (form.reportValidity()) HTMLFormElement.prototype.submit.call(form);
    });
    form.appendChild(fallback);
    let pending = false;
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (pending || !form.reportValidity()) return;
      pending = true;
      fallback.hidden = true;
      const kind = form.querySelector('[name="request_type"]') ? 'appointment' : 'contact';
      const buttons = Array.from(form.querySelectorAll('[type="submit"]'));
      const disabled = buttons.map(button => button.disabled);
      const body = new FormData(form);
      buttons.forEach(button => { button.disabled = true; });
      form.setAttribute('aria-busy', 'true');
      status.textContent = 'Sending your request…';
      measure('form_submit_attempt', kind);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(form.action, {
          method: 'POST', body, headers: { Accept: 'application/json' },
          signal: controller.signal
        });
        const result = await response.json();
        if (!response.ok || result.ok !== true) throw new Error('Request not accepted');
        status.textContent = kind === 'appointment'
          ? 'Your request was sent. This does not reserve an appointment. Walk-ins are welcome during office hours; you do not need to wait for a reply.'
          : 'Your message was sent. If you need help sooner, call (770) 683-9105.';
        measure('form_submit_success', kind);
        form.reset();
        const day = form.querySelector('[name="preferred_day"]');
        if (day) day.dispatchEvent(new Event('change'));
      } catch (_) {
        status.textContent = 'We could not confirm your request was sent. Your entries are still here. Please call (770) 683-9105 for help, or try again.';
        fallback.hidden = false;
        measure('form_submit_error', kind);
      } finally {
        clearTimeout(timeout);
        pending = false;
        form.removeAttribute('aria-busy');
        buttons.forEach((button, index) => { button.disabled = disabled[index]; });
        status.focus();
      }
    });
  });
})();
