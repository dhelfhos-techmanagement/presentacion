function toggleLike(id, btnEl){
  const likedKey = '_liked_' + id;
  const item = findItem(id);
  const current = likeCount(item);
  const wasLiked = isLiked(id);

  AppState.likes['_liked_' + id] = !wasLiked;
  AppState.likes[id] = wasLiked ? current - 1 : current + 1;
  localStorage.setItem('fc_likes', JSON.stringify(AppState.likes));

  if (btnEl){
    btnEl.classList.toggle('liked', !wasLiked);
    const heart = btnEl.querySelector('.heart');
    const countEl = btnEl.querySelector('.count');
    if (countEl) countEl.textContent = AppState.likes[id];
    if (heart && window.gsap){
      gsap.fromTo(heart, { scale: 1 }, { scale: 1.4, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.out' });
    }
  }
  renderFavorites();
}
