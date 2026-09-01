(function () {
  'use strict';

  var botaoAbrir = document.getElementById('botao-abrir-menu');
  var botaoFechar = document.getElementById('botao-fechar-menu');
  var menu = document.getElementById('menu-mobile');

  function abrirMenu() {
    menu.classList.add('aberto');
    botaoAbrir.setAttribute('aria-expanded', 'true');
  }
  function fecharMenu() {
    menu.classList.remove('aberto');
    botaoAbrir.setAttribute('aria-expanded', 'false');
  }
  if (botaoAbrir && menu) {
    botaoAbrir.addEventListener('click', abrirMenu);
  }
  if (botaoFechar && menu) {
    botaoFechar.addEventListener('click', fecharMenu);
  }
  if (menu) {
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', fecharMenu);
    });
  }

  var prefereMovimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var alvosRevelar = document.querySelectorAll('.revelar');
  if (alvosRevelar.length) {
    if (prefereMovimentoReduzido || !('IntersectionObserver' in window)) {
      alvosRevelar.forEach(function (el) { el.classList.add('visivel'); });
    } else {
      var observadorRevelar = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
            observadorRevelar.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      alvosRevelar.forEach(function (el) { observadorRevelar.observe(el); });
    }
  }

  var botaoFlutuante = document.getElementById('whatsapp-flutuante');
  var hero = document.querySelector('.hero');
  if (botaoFlutuante && hero && 'IntersectionObserver' in window) {
    var observadorHero = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          botaoFlutuante.classList.remove('visivel');
        } else {
          botaoFlutuante.classList.add('visivel');
        }
      });
    }, { threshold: 0 });
    observadorHero.observe(hero);
  } else if (botaoFlutuante) {
    botaoFlutuante.classList.add('visivel');
  }
})();
