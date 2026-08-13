function initSearch(){
  const input = document.getElementById('searchInput');
  const catList = document.getElementById('categoryList');
  const noResults = document.getElementById('noResults');

  input.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    let anyVisible = false;

    AppState.menu.categories.forEach(cat => {
      const row = document.querySelector(`[data-target="cat-${cat.id}"]`);
      const panel = document.getElementById(`cat-${cat.id}`);
      const catName = (cat.name.es + ' ' + cat.name.en).toLowerCase();

      const matchingItems = cat.items.filter(item => {
        const haystack = [
          item.name.es, item.name.en, item.description.es, item.description.en, catName
        ].join(' ').toLowerCase();
        return haystack.includes(q);
      });

      if (!q){
        row.style.display = '';
        panel.querySelectorAll('.item').forEach(el => { el.style.display = ''; });
        anyVisible = true;
        return;
      }

      if (matchingItems.length === 0){
        row.style.display = 'none';
        panel.classList.remove('open');
        return;
      }
      row.style.display = '';
      panel.classList.add('open');
      anyVisible = true;
      panel.querySelectorAll('.item').forEach(el => {
        const id = el.dataset.id;
        el.style.display = matchingItems.some(mi => mi.id === id) ? '' : 'none';
      });
    });

    noResults.hidden = anyVisible;
  });
}
