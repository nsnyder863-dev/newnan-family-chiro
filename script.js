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
