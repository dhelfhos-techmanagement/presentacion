function formatPrice(n){
  return '$' + n.toLocaleString('es-CO');
}

function likeCount(item){
  const stored = AppState.likes[item.id];
  return typeof stored === 'number' ? stored : item.likes;
}

function isLiked(id){
  return !!AppState.likes['_liked_' + id];
}
