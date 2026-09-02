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

  /* EDUCA: carrossel automático dos cards do feed (não depende do GSAP) */
  (function () {
    var palco = document.querySelector('[data-carrossel]');
    if (!palco) return;
    var cards = Array.prototype.slice.call(palco.querySelectorAll('.educa-card'));
    var n = cards.length;
    if (!n) return;
    var titulo = document.querySelector('[data-educa-titulo]');
    var sub = document.querySelector('[data-educa-sub]');
    var barra = document.querySelector('.educa-barra i');
    var pontos = document.querySelector('.educa-pontos');
    var INTERVALO = 4200;
    var ativo = 0, timer = null, inicio = 0, restante = INTERVALO, rodando = false;
    var autoplay = podeMotion;
    var motivos = { hover: false, fora: 'IntersectionObserver' in window, oculto: document.hidden };
    var meio = Math.floor(n / 2);

    var dots = cards.map(function (_, i) {
      var li = document.createElement('li');
      li.addEventListener('click', function () { irPara(i); });
      if (pontos) pontos.appendChild(li);
      return li;
    });

    function passo() {
      var w = cards[0].getBoundingClientRect().width;
      return Math.min(w * 0.82, innerWidth * 0.3);
    }
    function render() {
      var p = passo();
      cards.forEach(function (card, i) {
        var rel = (((i - ativo) % n) + n + meio) % n - meio;
        var abs = Math.abs(rel);
        card.dataset.pos = abs > 2 ? 'x' : String(rel);
        var escala = rel === 0 ? 1 : abs === 1 ? 0.84 : 0.7;
        card.style.transform = 'translateX(' + (rel * p) + 'px) translateY(' + (abs * 14) + 'px) rotate(' + (rel * 4) + 'deg) scale(' + escala + ')';
        card.setAttribute('aria-hidden', rel === 0 ? 'false' : 'true');
      });
      dots.forEach(function (d, i) { d.classList.toggle('ativa', i === ativo); });
      if (titulo) titulo.textContent = cards[ativo].dataset.titulo || '';
      if (sub) sub.textContent = cards[ativo].dataset.texto || '';
    }
    function barraAnima(ms) {
      if (!barra) return;
      barra.style.transition = 'none';
      barra.style.transform = 'scaleX(' + (1 - ms / INTERVALO) + ')';
      void barra.offsetWidth;
      barra.style.transition = 'transform ' + ms + 'ms linear';
      barra.style.transform = 'scaleX(1)';
    }
    function congelarBarra() {
      if (!barra) return;
      var atual = getComputedStyle(barra).transform;
      barra.style.transition = 'none';
      barra.style.transform = atual;
    }
    function agendar(ms) {
      clearTimeout(timer);
      inicio = Date.now();
      restante = ms;
      barraAnima(ms);
      timer = setTimeout(function () { ir(1); }, ms);
    }
    function sincronizar() {
      var deve = autoplay && !motivos.hover && !motivos.fora && !motivos.oculto;
      if (deve && !rodando) { rodando = true; agendar(restante > 0 ? restante : INTERVALO); }
      else if (!deve && rodando) {
        rodando = false;
        clearTimeout(timer);
        restante = Math.max(300, restante - (Date.now() - inicio));
        congelarBarra();
      }
    }
    function irPara(i) {
      ativo = (i + n) % n;
      render();
      if (rodando) agendar(INTERVALO); else restante = INTERVALO;
    }
    function ir(delta) { irPara(ativo + delta); }

    document.querySelectorAll('.educa-seta').forEach(function (b) {
      b.addEventListener('click', function () { ir(Number(b.dataset.dir) || 1); });
    });
    palco.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { ir(1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { ir(-1); e.preventDefault(); }
    });
    var toqueX = null;
    palco.addEventListener('pointerdown', function (e) { toqueX = e.clientX; });
    palco.addEventListener('pointerup', function (e) {
      if (toqueX === null) return;
      var dx = e.clientX - toqueX; toqueX = null;
      if (Math.abs(dx) > 40) ir(dx < 0 ? 1 : -1);
    });
    palco.addEventListener('pointerenter', function () { motivos.hover = true; sincronizar(); });
    palco.addEventListener('pointerleave', function () { motivos.hover = false; sincronizar(); });
    palco.addEventListener('focusin', function () { motivos.hover = true; sincronizar(); });
    palco.addEventListener('focusout', function () { motivos.hover = false; sincronizar(); });
    document.addEventListener('visibilitychange', function () { motivos.oculto = document.hidden; sincronizar(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { motivos.fora = !es[0].isIntersecting; sincronizar(); }, { threshold: 0.3 }).observe(palco);
    }
    addEventListener('resize', render);
    render();
    sincronizar();
  })();

  /* FEED: grade infinita (estilo portal de jogos) — carrega 12 por vez conforme o scroll */
  (function () {
    var caixa = document.querySelector('[data-feed]');
    var posts = window.PETBU_FEED;
    if (!caixa || !posts || !posts.length) return;
    var grade = caixa.querySelector('.feed-grade');
    var sentinela = caixa.querySelector('.feed-sentinela');
    var fim = caixa.querySelector('.feed-fim');
    var total = caixa.querySelector('[data-feed-total]');
    if (total && window.PETBU_FEED_TOTAL) total.textContent = window.PETBU_FEED_TOTAL;
    var LOTE = 12, cursor = 0, carregando = false;

    function tile(p, k) {
      var li = document.createElement('li');
      li.className = 'feed-post';
      var a = document.createElement('a');
      a.href = p.u; a.target = '_blank'; a.rel = 'noopener';
      a.setAttribute('aria-label', p.t + ' (abre no Instagram)');
      var img = document.createElement('img');
      img.src = p.i; img.alt = ''; img.loading = k < 6 ? 'eager' : 'lazy'; img.decoding = 'async';
      img.width = 560; img.height = 560;
      a.appendChild(img);
      if (p.v) {
        var play = document.createElement('span');
        play.className = 'play';
        play.innerHTML = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>';
        a.appendChild(play);
      }
      var cap = document.createElement('figcaption');
      cap.textContent = p.t;
      a.appendChild(cap);
      li.appendChild(a);
      return li;
    }
    function lote() {
      if (carregando || cursor >= posts.length) return;
      carregando = true;
      var frag = document.createDocumentFragment();
      var novos = [];
      for (var k = cursor; k < Math.min(cursor + LOTE, posts.length); k++) { var li = tile(posts[k], k); frag.appendChild(li); novos.push(li); }
      cursor += LOTE;
      grade.appendChild(frag);
      novos.forEach(function (li, j) { setTimeout(function () { li.classList.add('in'); }, 40 * j); });
      carregando = false;
      if (cursor >= posts.length) { sentinela.hidden = true; fim.hidden = false; }
    }
    lote();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { if (es[0].isIntersecting) lote(); }, { rootMargin: '600px 0px' }).observe(sentinela);
    } else {
      while (cursor < posts.length) lote();
    }
  })();

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
