/* ============================================================
   SHARED JS – main.js
   Handles: nav toggle, active links, scroll fade-in, skill bars
   Works for both .nav__toggle (inner pages) and .hamburger (homepage)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Active nav link ──────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a, .nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const hPage = href.split('/').pop();
    if (hPage === currentPage || (currentPage === '' && hPage === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ── Mobile nav toggle (inner pages: .nav__toggle / .nav__mobile) ──
  const toggle  = document.getElementById('navToggle');
  const mobile  = document.getElementById('navMobile');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobile.classList.toggle('open');
    });
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobile.classList.remove('open');
      });
    });
  }

  // ── Mobile nav toggle (homepage: .hamburger / #navLinks) ──
  const burger   = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Scroll-triggered fade-in ─────────────────────────────
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  // ── Skill bar animation ──────────────────────────────────
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
        barObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });

  const skillSection = document.querySelector('.skills-section');
  if (skillSection) barObserver.observe(skillSection);

});
