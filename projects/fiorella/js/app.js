function renderItemRow(item){
  const liked = isLiked(item.id) ? 'liked' : '';
  const name = item.name[AppState.lang] || item.name.es;
  const desc = item.description[AppState.lang] || item.description.es;
  return `
  <div class="item" data-id="${item.id}">
    <div class="item-main" data-expand="${item.id}">
      <div class="row">
        <img class="thumb" loading="lazy" src="${item.image}" alt="${name}" onerror="this.classList.add('img-placeholder');this.replaceWith(Object.assign(document.createElement('div'),{className:'thumb img-placeholder',textContent:'🍰'}))">
        <div class="info">
          <h4>${name}</h4>
          ${desc ? `<p>${desc}</p>` : ''}
          <div class="likes"><button class="like-btn ${liked}" data-like="${item.id}"><span class="heart">❤️</span> <span class="count">${likeCount(item)}</span></button></div>
        </div>
      </div>
      <div class="price-col">
        <div class="price">${formatPrice(item.price)}</div>
        <button class="add-btn" data-add="${item.id}">${t('add')}</button>
      </div>
    </div>
    <div class="item-detail" id="detail-${item.id}"></div>
  </div>`;
}

function renderItemDetail(item){
  const name = item.name[AppState.lang] || item.name.es;
  const desc = item.description[AppState.lang] || item.description.es;
  const related = allItems().filter(i => i.categoryId === item.categoryId && i.id !== item.id).slice(0, 5);
  return `
  <div class="item-detail-inner">
    <img src="${item.image}" alt="${name}">
    ${desc ? `<p class="desc">${desc}</p>` : ''}
    <button class="add-btn" data-add="${item.id}" style="align-self:flex-start;">${t('add')} — ${formatPrice(item.price)}</button>
    ${related.length ? `<div class="related">${related.map(r => `<img src="${r.image}" alt="" loading="lazy">`).join('')}</div>` : ''}
  </div>`;
}

function renderCategories(list){
  const container = document.getElementById('categoryList');
  container.innerHTML = list.map(cat => {
    const name = cat.name[AppState.lang] || cat.name.es;
    const desc = cat.description[AppState.lang] || cat.description.es;
    const note = cat.note ? (cat.note[AppState.lang] || cat.note.es) : '';
    return `
    <button type="button" class="cat-row" data-target="cat-${cat.id}">
      <img class="cat-row-img" src="${cat.image}" alt="" loading="lazy">
      <div class="cat-row-body">
        <h3>${name}</h3>
        <p>${desc}</p>
      </div>
    </button>
    <div class="cat-panel" id="cat-${cat.id}">
      ${note ? `<p class="note">${note}</p>` : ''}
      <div class="items">${cat.items.map(renderItemRow).join('')}</div>
    </div>`;
  }).join('');

  container.querySelectorAll('.cat-row').forEach(row => {
    row.addEventListener('click', () => {
      document.getElementById(row.dataset.target).classList.toggle('open');
      shiftBike();
    });
  });

  bindItemEvents(container);
}

function bindItemEvents(container){
  container.querySelectorAll('[data-like]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleLike(btn.dataset.like, btn);
    });
  });
  container.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      addToCart(btn.dataset.add, btn);
    });
  });
  container.querySelectorAll('[data-expand]').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('[data-like]') || e.target.closest('[data-add]')) return;
      const id = row.dataset.expand;
      const detailEl = document.getElementById('detail-' + id);
      const isOpen = detailEl.classList.contains('open');
      if (!isOpen && !detailEl.innerHTML){
        detailEl.innerHTML = renderItemDetail(findItem(id));
        bindItemEvents(detailEl);
      }
      detailEl.classList.toggle('open', !isOpen);
    });
  });
}

function renderCatPills(){
  const wrap = document.getElementById('catPills');
  const cats = AppState.menu.categories;
  wrap.innerHTML = cats.map(c => `<button class="cat-pill" data-scroll="cat-${c.id}">${c.name[AppState.lang] || c.name.es}</button>`).join('');
  wrap.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      wrap.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const target = document.getElementById(pill.dataset.scroll);
      const row = document.querySelector(`[data-target="${pill.dataset.scroll}"]`);
      if (row) row.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (target && !target.classList.contains('open')) target.classList.add('open');
      shiftBike();
    });
  });
}

function shiftBike(){
  const bike = document.querySelector('.hero-bike');
  if (!bike || !window.gsap) return;
  gsap.fromTo(bike, { x: -8 }, { x: 0, duration: 0.6, ease: 'power2.out' });
}

function applyStaticTranslations(){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}

function applyConfig(){
  const cfg = AppState.config;
  document.title = `${cfg.name} — Menú`;
  document.getElementById('brandTag').textContent = cfg.slogan[AppState.lang] || cfg.slogan.es;
  document.getElementById('heroVideo').querySelector('source').src = cfg.assets.heroVideo;
  document.getElementById('heroVideo').load();
  document.querySelectorAll('.welcome-bike, .hero-bike').forEach(el => { el.src = cfg.assets.bicycle; });
  document.getElementById('footerHandle').textContent = cfg.instagram.handle;
  document.getElementById('igLink').href = cfg.instagram.url;
  document.getElementById('waLink').href = `https://wa.me/${cfg.whatsapp.e164}`;
  document.getElementById('mapsLink').href = cfg.maps.url;
  document.getElementById('mapsLink2').href = cfg.maps.url;
  document.getElementById('phoneDisplay').textContent = cfg.whatsapp.display;
}

async function initApp(){
  await loadData();
  applyConfig();
  applyStaticTranslations();
  renderCatPills();
  renderCategories(AppState.menu.categories);
  renderFavorites();
  initSearch();
  initTranslationToggle();
  initCart();
  initChatbot();
  initAnimations();
}

document.addEventListener('DOMContentLoaded', initApp);
