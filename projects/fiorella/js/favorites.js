function getMostLoved(limit = 8){
  return allItems()
    .map(item => ({ ...item, currentLikes: likeCount(item) }))
    .sort((a, b) => b.currentLikes - a.currentLikes)
    .slice(0, limit);
}

function renderFavorites(){
  const container = document.getElementById('favoritesList');
  if (!container) return;
  const items = getMostLoved();
  container.innerHTML = items.map(renderItemRow).join('');
  bindItemEvents(container);
}
