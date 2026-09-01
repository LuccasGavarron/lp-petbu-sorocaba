/* PetBu — Mundo Bubble. Progressive enhancement:
   o body nasce com sem-motion/sem-pin/sem-pin-galeria e o JS só remove
   cada fallback quando consegue entregar a versão animada. */
(function () {
  'use strict';
  var body = document.body;
  var podeMotion = matchMedia('(prefers-reduced-motion: no-preference)').matches;
  var desktop = matchMedia('(min-width: 900px)').matches;
  var temGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.18 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  var flutuante = document.querySelector('.wa-flutuante');
  var hero = document.querySelector('.hero');
  if (flutuante && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      flutuante.classList.toggle('visivel', !es[0].isIntersecting);
    }, { threshold: 0.1 }).observe(hero);
  } else if (flutuante) { flutuante.classList.add('visivel'); }

  if (!temGsap || !podeMotion) return;
  gsap.registerPlugin(ScrollTrigger);
  body.classList.remove('sem-motion');

  /* HERO: blobs em 4 profundidades + tipo */
  var stHero = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.blob-1', { y: 150, rotation: 14, ease: 'none', scrollTrigger: stHero });
  gsap.to('.blob-2', { y: -190, rotation: -10, ease: 'none', scrollTrigger: stHero });
  gsap.to('.blob-3', { y: 260, x: 40, ease: 'none', scrollTrigger: stHero });
  gsap.to('.blob-4', { y: -110, ease: 'none', scrollTrigger: stHero });
  gsap.to('.hero-conteudo', { y: desktop ? -120 : -50, ease: 'none', scrollTrigger: stHero });
  gsap.from('.hero-tipo', { yPercent: 24, opacity: 0, duration: 0.9, ease: 'back.out(1.4)', delay: 0.1 });
  gsap.from('.hero-sub, .hero-acoes', { y: 26, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.35 });
  /* respiração contínua sutil dos blobs (barata: transform only) */
  gsap.to('.blob-1', { borderRadius: '45% 55% 40% 60% / 60% 40% 58% 42%', duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.blob-2', { borderRadius: '60% 40% 45% 55% / 42% 60% 40% 58%', duration: 9, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  /* ABRAÇO: círculo rosa engole a tela */
  var tl = gsap.timeline({ scrollTrigger: { trigger: '.abraco', start: 'top top', end: 'bottom bottom', scrub: 0.4 } });
  tl.to('.abraco-circulo', { scale: 14, ease: 'none', duration: 0.7 })
    .to('.abraco-anel', { scale: 10, opacity: 0, ease: 'none', duration: 0.55 }, 0)
    .to('.abraco-frase', { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.6);

  /* ETAPAS: pinned com blob mudando de forma e cor por etapa */
  if (desktop) {
    var etapas = gsap.utils.toArray('.etapa');
    var marcas = gsap.utils.toArray('.etapas-progresso i');
    var forma = document.querySelector('.etapa-blob .forma');
    var numero = document.querySelector('.etapa-blob .numero');
    var visuais = [
      { br: '58% 42% 55% 45% / 48% 60% 40% 52%', cor: '#2F7E7B', rot: 0 },
      { br: '42% 58% 46% 54% / 60% 40% 58% 42%', cor: '#EE5A9E', rot: 10 },
      { br: '55% 45% 60% 40% / 45% 55% 42% 58%', cor: '#F2C230', rot: -8 },
      { br: '48% 52% 42% 58% / 55% 45% 60% 40%', cor: '#14413F', rot: 6 }
    ];
    if (etapas.length && forma) {
      body.classList.remove('sem-pin');
      var ativa = -1;
      ScrollTrigger.create({
        trigger: '.etapas-trilho', start: 'top top', end: 'bottom bottom',
        onUpdate: function (self) {
          var i = Math.min(etapas.length - 1, Math.floor(self.progress * etapas.length));
          if (i === ativa) return;
          ativa = i;
          etapas.forEach(function (el, k) { el.classList.toggle('ativa', k === i); });
          marcas.forEach(function (el, k) { el.classList.toggle('ativa', k === i); });
          numero.textContent = '0' + (i + 1);
          gsap.to(forma, { borderRadius: visuais[i].br, backgroundColor: visuais[i].cor, rotation: visuais[i].rot, duration: 0.7, ease: 'power3.out' });
        }
      });
      etapas[0].classList.add('ativa'); marcas[0].classList.add('ativa');
    }
  }

  /* EDUCA: galeria horizontal guiada pelo scroll */
  if (desktop) {
    var faixa = document.querySelector('.educa-faixa');
    var wrap = document.querySelector('.educa-trilho');
    if (faixa && wrap) {
      body.classList.remove('sem-pin-galeria');
      gsap.to(faixa, {
        x: function () { return -Math.max(0, faixa.scrollWidth - innerWidth + 90); },
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: 0.35, invalidateOnRefresh: true }
      });
    }
  }

  /* QUOTES: tiras opostas */
  var stQ = { trigger: '.quotes', start: 'top bottom', end: 'bottom top', scrub: true };
  gsap.fromTo('.quotes-strip--a', { xPercent: 3 }, { xPercent: -12, ease: 'none', scrollTrigger: stQ });
  gsap.fromTo('.quotes-strip--b', { xPercent: -14 }, { xPercent: 1, ease: 'none', scrollTrigger: stQ });

  /* CTA final magnético */
  if (desktop && matchMedia('(pointer: fine)').matches) {
    var alvo = document.querySelector('.cta-final a');
    var caixa = document.querySelector('.cta-final');
    if (alvo && caixa) {
      caixa.addEventListener('pointermove', function (e) {
        var r = alvo.getBoundingClientRect();
        gsap.to(alvo, { x: (e.clientX - r.left - r.width / 2) * 0.14, y: (e.clientY - r.top - r.height / 2) * 0.14, duration: 0.4, ease: 'power2.out' });
      });
      caixa.addEventListener('pointerleave', function () {
        gsap.to(alvo, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,.5)' });
      });
    }
  }
})();
