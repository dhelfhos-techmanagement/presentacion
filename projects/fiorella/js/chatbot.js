function initChatbot(){
  const widget = document.getElementById('chatWidget');
  const toggle = document.getElementById('chatToggle');
  const suggestionsEl = document.getElementById('chatSuggestions');
  const msgEl = document.getElementById('chatMsg');

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    widget.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (widget.classList.contains('open') && !widget.contains(e.target)) widget.classList.remove('open');
  });

  const topics = {
    chatRecommendation: () => getMostLoved(4),
    chatChocolate: () => allItems().filter(i => /chocolate|cacao|nutella/i.test(`${i.name.es} ${i.description.es}`)),
    chatCold: () => allItems().filter(i => ['helados', 'frias', 'malteadas'].includes(i.categoryId)),
    chatDrinks: () => allItems().filter(i => ['frias', 'calientes', 'malteadas'].includes(i.categoryId)),
    chatPromos: () => [],
    chatAvailability: () => allItems().filter(i => i.categoryId === 'tortas')
  };

  function renderTopicChips(){
    suggestionsEl.innerHTML = Object.keys(topics).map(key =>
      `<button type="button" class="chat-chip" data-topic="${key}"><span>${t(key)}</span></button>`
    ).join('');
    suggestionsEl.querySelectorAll('[data-topic]').forEach(chip => {
      chip.addEventListener('click', () => showTopicResults(chip.dataset.topic));
    });
  }

  function showTopicResults(key){
    if (key === 'chatPromos'){
      msgEl.textContent = 'Pídeme el flyer de promociones tocando el botón "Promociones" arriba, o pregúntame por otra categoría.';
      renderResultChips([]);
      return;
    }
    const results = topics[key]().slice(0, 5);
    msgEl.textContent = results.length
      ? `Esto es lo que tenemos, ${t(key).toLowerCase()}:`
      : 'No encontré productos para esa categoría en el menú, prueba otra opción.';
    renderResultChips(results);
  }

  function renderResultChips(items){
    let resultsBox = document.getElementById('chatResults');
    resultsBox.innerHTML = items.map(item => {
      const name = item.name[AppState.lang] || item.name.es;
      return `<button type="button" class="chat-chip" data-add-chat="${item.id}"><span>${name}</span><span>${formatPrice(item.price)}</span></button>`;
    }).join('');
    resultsBox.querySelectorAll('[data-add-chat]').forEach(chip => {
      chip.addEventListener('click', () => {
        addToCart(chip.dataset.addChat, chip);
        chip.classList.add('selected');
      });
    });
  }

  renderTopicChips();
}
