function initTranslationToggle(){
  const buttons = document.querySelectorAll('.lang-toggle button');
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === AppState.lang);
    btn.addEventListener('click', () => {
      if (btn.dataset.lang === AppState.lang) return;
      AppState.lang = btn.dataset.lang;
      localStorage.setItem('fc_lang', AppState.lang);
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      applyConfig();
      applyStaticTranslations();
      renderCatPills();
      renderCategories(AppState.menu.categories);
      renderFavorites();
      renderCart();
    });
  });
}
