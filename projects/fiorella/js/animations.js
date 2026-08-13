function initAnimations(){
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && window.Lenis){
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.4 });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const heroVideo = document.getElementById('heroVideo');
  const playPromise = heroVideo.play();
  if (playPromise) playPromise.catch(() => {});

  gsap.fromTo('.site-header, .hero-card', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
  gsap.fromTo('.welcome > *', { opacity: 0, y: 14 }, {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
    scrollTrigger: { trigger: '.welcome', start: 'top 85%' }
  });
  gsap.fromTo('.cat-row', { opacity: 0, y: 16 }, {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out',
    scrollTrigger: { trigger: '.cat-list', start: 'top 85%' }
  });
  gsap.fromTo('.social a', { opacity: 0, y: 14 }, {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
    scrollTrigger: { trigger: '.social', start: 'top 85%' }
  });
  gsap.to('.chat-widget', { opacity: 1, y: 0, duration: 0.6, delay: 1.1, ease: 'power2.out' });

  // subtle parallax on the flowers/basket area of the hero-parked bike
  const heroBike = document.querySelector('.hero-bike');
  if (heroBike && !reduceMotion){
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      gsap.to(heroBike, { x, duration: 0.6, ease: 'power2.out' });
    });
  }

  const promoModal = document.getElementById('promoModal');
  document.getElementById('openPromo').addEventListener('click', () => promoModal.classList.add('open'));
  document.getElementById('closePromo').addEventListener('click', () => promoModal.classList.remove('open'));
  promoModal.addEventListener('click', e => { if (e.target === promoModal) promoModal.classList.remove('open'); });

  if (reduceMotion) gsap.set('*', { clearProps: 'all' });
}
