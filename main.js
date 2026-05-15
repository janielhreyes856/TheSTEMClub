/* main.js — STEM Club shared JS */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll shadow ── */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 2px 12px rgba(0,0,0,0.1)'
      : 'none';
  }, { passive: true });

  /* ── Active nav link highlight ── */
  const links = document.querySelectorAll('.nav-links a:not(.btn-donate)');
  links.forEach(link => {
    if (link.href === window.location.href) link.classList.add('active');
  });

  /* ── Contact / Volunteer form submissions ── */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const orig = btn.textContent;
      btn.textContent = '✅ Submitted!';
      btn.style.background = '#5CBF2A';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  });

  /* ── Donation amount selector ── */
  document.querySelectorAll('.donation-amounts span').forEach(span => {
    span.addEventListener('click', () => {
      document.querySelectorAll('.donation-amounts span').forEach(s => s.style.background = '');
      span.style.background = '#F5C518';
      const input = document.querySelector('.custom-amount');
      if (input) input.value = span.textContent;
    });
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
