/* ==========================================================================
   DINANI HIGH SCHOOL — NEWS & ANNOUNCEMENTS
   Client-side search + category filter over the news cards already
   present in the page markup. Swap the static cards for a fetch() to a
   real news/announcements API when a backend exists — the filtering
   logic below will keep working unchanged as long as each card keeps
   its `data-category` attribute.
   ========================================================================== */

(function () {
  'use strict';

  const searchInput = document.getElementById('news-search');
  const filterBar = document.querySelector('.gallery-filters[data-news-filter]');
  const cards = Array.from(document.querySelectorAll('.news-card'));
  const emptyState = document.getElementById('news-empty-state');
  if (!cards.length) return;

  let activeCategory = 'all';
  let activeQuery = '';

  function applyFilters() {
    let visibleCount = 0;
    cards.forEach((card) => {
      const category = card.getAttribute('data-category');
      const text = card.textContent.toLowerCase();
      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesQuery = activeQuery === '' || text.includes(activeQuery);
      const visible = matchesCategory && matchesQuery;
      card.closest('.news-grid-item, .news-card').hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeCategory = btn.getAttribute('data-filter');
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      activeQuery = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }
})();
