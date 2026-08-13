function saveCart(){
  localStorage.setItem('fc_cart', JSON.stringify(AppState.cart));
}

function addToCart(id, btnEl){
  const item = findItem(id);
  const line = AppState.cart.find(l => l.id === id);
  if (line) line.qty += 1;
  else AppState.cart.push({ id, qty: 1 });
  saveCart();
  flyToCart(btnEl, item);
  renderCart();
  pulseCartFab();
}

function updateQty(id, delta){
  const line = AppState.cart.find(l => l.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) AppState.cart = AppState.cart.filter(l => l.id !== id);
  saveCart();
  renderCart();
}

function cartTotal(){
  return AppState.cart.reduce((sum, l) => {
    const item = findItem(l.id);
    return sum + (item ? item.price * l.qty : 0);
  }, 0);
}

function cartCount(){
  return AppState.cart.reduce((sum, l) => sum + l.qty, 0);
}

function renderCart(){
  const fabCount = document.getElementById('cartCount');
  fabCount.textContent = cartCount();
  fabCount.hidden = cartCount() === 0;

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (AppState.cart.length === 0){
    itemsEl.innerHTML = `<p class="cart-empty">${t('cartEmpty')}</p>`;
    footerEl.hidden = true;
    return;
  }
  footerEl.hidden = false;

  itemsEl.innerHTML = AppState.cart.map(line => {
    const item = findItem(line.id);
    if (!item) return '';
    const name = item.name[AppState.lang] || item.name.es;
    return `
    <div class="cart-line">
      <img src="${item.image}" alt="">
      <div class="info">
        <h4>${name}</h4>
        <div class="unit">${formatPrice(item.price)} c/u</div>
      </div>
      <div class="cart-qty">
        <button data-qty="-1" data-id="${item.id}">−</button>
        <span>${line.qty}</span>
        <button data-qty="1" data-id="${item.id}">+</button>
      </div>
      <button class="cart-remove" data-remove="${item.id}">🗑</button>
    </div>`;
  }).join('');

  itemsEl.querySelectorAll('[data-qty]').forEach(btn => {
    btn.addEventListener('click', () => updateQty(btn.dataset.id, parseInt(btn.dataset.qty, 10)));
  });
  itemsEl.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => { AppState.cart = AppState.cart.filter(l => l.id !== btn.dataset.remove); saveCart(); renderCart(); });
  });

  document.getElementById('cartSubtotal').textContent = formatPrice(cartTotal());
  document.getElementById('cartTotal').textContent = formatPrice(cartTotal());
}

function flyToCart(fromEl, item){
  if (!window.gsap || !fromEl) return;
  const fab = document.getElementById('cartFab');
  if (!fab) return;
  const startRect = fromEl.getBoundingClientRect();
  const endRect = fab.getBoundingClientRect();
  const flyImg = document.createElement('img');
  flyImg.src = item.image;
  flyImg.className = 'fly-item';
  flyImg.style.width = '40px';
  flyImg.style.height = '40px';
  flyImg.style.left = startRect.left + 'px';
  flyImg.style.top = startRect.top + 'px';
  document.body.appendChild(flyImg);

  gsap.to(flyImg, {
    left: endRect.left + endRect.width / 2 - 20,
    top: endRect.top + endRect.height / 2 - 20,
    width: 14, height: 14, opacity: 0.5,
    duration: 0.7, ease: 'power2.in',
    onComplete: () => flyImg.remove()
  });
}

function pulseCartFab(){
  const fab = document.getElementById('cartFab');
  if (!window.gsap || !fab) return;
  gsap.fromTo(fab, { scale: 1 }, { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1, delay: 0.6, ease: 'power1.out' });
}

function buildWhatsAppMessage(){
  const cfg = AppState.config;
  const lines = AppState.cart.map(line => {
    const item = findItem(line.id);
    const name = item.name[AppState.lang] || item.name.es;
    return `• ${line.qty}x ${name} — ${formatPrice(item.price * line.qty)}`;
  });
  return `¡Hola ${cfg.name}! 👋 Quiero pedir:\n${lines.join('\n')}\n\nTotal: ${formatPrice(cartTotal())}\n\n¿Está disponible? Quisiera confirmar el pedido 🍰`;
}

function initCart(){
  const fab = document.getElementById('cartFab');
  const overlay = document.getElementById('cartOverlay');
  const panel = document.getElementById('cartPanel');
  const closeBtn = document.getElementById('cartClose');

  function open(){ overlay.classList.add('open'); panel.classList.add('open'); }
  function close(){ overlay.classList.remove('open'); panel.classList.remove('open'); }

  fab.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  document.getElementById('cartSendBtn').addEventListener('click', () => {
    if (AppState.cart.length === 0) return;
    const msg = buildWhatsAppMessage();
    window.open(`https://wa.me/${AppState.config.whatsapp.e164}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  renderCart();
}
