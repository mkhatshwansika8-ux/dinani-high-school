/* ==========================================================================
   DINANI HIGH SCHOOL — MAIN SCRIPT
   Shared behaviour loaded on every page: mobile navigation, sticky header
   shadow, scroll-reveal animation, and the footer year stamp.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Mobile navigation (hamburger drawer)
     ------------------------------------------------------------------ */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navBackdrop = document.querySelector('.nav-backdrop');

  function openMenu() {
    navMenu.classList.add('is-open');
    navBackdrop.classList.add('is-visible');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navBackdrop.classList.remove('is-visible');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    navBackdrop.addEventListener('click', closeMenu);

    // Close the drawer whenever a nav link is chosen
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMenu();
        hamburger.focus();
      }
    });

    // If the viewport grows past the mobile breakpoint, reset the drawer
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && navMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* ------------------------------------------------------------------
     Sticky header shadow once the page has scrolled
     ------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  if (header) {
    const toggleHeaderShadow = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    toggleHeaderShadow();
    window.addEventListener('scroll', toggleHeaderShadow, { passive: true });
  }

  /* ------------------------------------------------------------------
     Scroll-reveal: fade/rise elements into view as the user scrolls.
     Respects prefers-reduced-motion (handled in CSS) and degrades
     gracefully if IntersectionObserver isn't available.
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* ------------------------------------------------------------------
     Footer year stamp
     ------------------------------------------------------------------ */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------
     Animated stat counters (Home page "Quick Statistics" cards).
     Numbers that are pure placeholders (e.g. "XXXX") are left untouched.
     ------------------------------------------------------------------ */
  const statEls = document.querySelectorAll('[data-count-to]');
  if (statEls.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count-to'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1200;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          countObserver.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    statEls.forEach((el) => countObserver.observe(el));
  }
})();
