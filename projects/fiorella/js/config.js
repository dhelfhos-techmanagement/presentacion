// Global app state and data loading
const AppState = {
  config: null,
  menu: null,
  translations: null,
  lang: localStorage.getItem('fc_lang') || 'es',
  cart: JSON.parse(localStorage.getItem('fc_cart') || '[]'),
  likes: JSON.parse(localStorage.getItem('fc_likes') || '{}')
};

async function loadData(){
  const [config, menu, translations] = await Promise.all([
    fetch('data/restaurant-config.json').then(r => r.json()),
    fetch('data/menuData.json').then(r => r.json()),
    fetch('data/translations.json').then(r => r.json())
  ]);
  AppState.config = config;
  AppState.menu = menu;
  AppState.translations = translations;
  return AppState;
}

function t(key){
  return (AppState.translations[AppState.lang] || AppState.translations.es)[key] || key;
}

function allItems(){
  return AppState.menu.categories.flatMap(cat =>
    cat.items.map(item => ({ ...item, categoryId: cat.id, categoryName: cat.name }))
  );
}

function findItem(id){
  return allItems().find(i => i.id === id);
}
