/* ==========================================================================
   DINANI HIGH SCHOOL — GALLERY
   Category filtering + a lightweight lightbox. No external library —
   keeps the project dependency-free per the build requirements.
   ========================================================================== */

(function () {
  'use strict';

  const filterBar = document.querySelector('.gallery-filters');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!filterBar || !items.length) return;

  /* ------------------------------------------------------------------
     Category filtering
     ------------------------------------------------------------------ */
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;

    filterBar.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('is-active'));
    btn.classList.add('is-active');

    const category = btn.getAttribute('data-filter');
    items.forEach((item) => {
      const match = category === 'all' || item.getAttribute('data-category') === category;
      item.hidden = !match;
    });
  });

  /* ------------------------------------------------------------------
     Lightbox
     ------------------------------------------------------------------ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  let lastFocused = null;

  function openLightbox(item) {
    const img = item.querySelector('img');
    const captionEl = item.querySelector('.gallery-caption');
    if (!img || !lightbox) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = captionEl ? captionEl.textContent : img.alt;
    lightbox.classList.add('is-open');
    lastFocused = document.activeElement;
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  items.forEach((item) => {
    const img = item.querySelector('img');
    if (!img) return; // Skip placeholder tiles that have no real photo yet
    item.addEventListener('click', () => openLightbox(item));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) closeLightbox();
  });
})();
