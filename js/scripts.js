/* ============================================
   LUIS FELIPE — PORTFOLIO
   scripts.js  |  Interatividade & Animações
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────
     CUSTOM CURSOR
  ────────────────────────────── */
  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

    document.querySelectorAll('a, button, .project-card, .skill-item, .cert-card, .stat-chip, .sec-tool-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('big'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
    });
  }

  /* ──────────────────────────────
     HEADER SCROLL
  ────────────────────────────── */
  const header  = document.getElementById('header');
  const backTop = document.getElementById('backTop');

  function onScroll() {
    const y = window.scrollY;
    if (header)  header.classList.toggle('scrolled', y > 40);
    if (backTop) backTop.classList.toggle('visible',  y > 400);
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ──────────────────────────────
     BACK TO TOP
  ────────────────────────────── */
  if (backTop) {
    backTop.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ──────────────────────────────
     MOBILE MENU
  ────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', e => {
      if (!header.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  }

  /* ──────────────────────────────
     SMOOTH SCROLL
  ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────
     ACTIVE NAV LINK
  ────────────────────────────── */
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link[href^="#"]');
    let current = '';

    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
    });

    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ──────────────────────────────
     REVEAL ON SCROLL — hero imediato
  ────────────────────────────── */
  requestAnimationFrame(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
  });

  /* ──────────────────────────────
     STAGGER REVEAL — cards gerais
  ────────────────────────────── */
  const staggerEls = document.querySelectorAll(
    '.project-card, .cert-card, .edu-card, .stat-chip, .cta-chip'
  );

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const idx = [...el.parentElement.children].indexOf(el);
      el.style.transitionDelay = (idx * 0.07) + 's';
      el.style.opacity   = '1';
      el.style.transform = 'none';
      revealObs.unobserve(el);
    });
  }, { threshold: 0.08 });

  staggerEls.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity .65s var(--ease), transform .65s var(--ease)';
    revealObs.observe(el);
  });

  /* ──────────────────────────────
     SKILL BARS — barras de domínio dev
  ────────────────────────────── */
  const skillBarObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      item.classList.add('in-view');
      const fill = item.querySelector('.skill-fill');
      if (fill && !fill.dataset.animated) {
        setTimeout(() => {
          fill.style.width = fill.dataset.w + '%';
          fill.dataset.animated = '1';
        }, 150);
      }
      skillBarObs.unobserve(item);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-item').forEach(item => skillBarObs.observe(item));

  /* ──────────────────────────────
     SEC-TOOL CARDS + BARS — ferramentas de segurança
  ────────────────────────────── */
  const toolBarObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const card = entry.target;

      // stagger de entrada
      const idx = [...card.parentElement.children].indexOf(card);
      setTimeout(() => {
        card.classList.add('in-view');
      }, idx * 80);

      // anima barra após a transição de entrada
      const fill = card.querySelector('.sec-tool-fill');
      if (fill && !fill.dataset.animated) {
        setTimeout(() => {
          fill.style.width = fill.dataset.w + '%';
          fill.dataset.animated = '1';
        }, idx * 80 + 200);
      }

      toolBarObs.unobserve(card);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.sec-tool-card').forEach(card => toolBarObs.observe(card));

  /* ──────────────────────────────
     FLOAT ICONS — pausa no hover
  ────────────────────────────── */
  document.querySelectorAll('.float-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => { icon.style.animationPlayState = 'paused'; });
    icon.addEventListener('mouseleave', () => { icon.style.animationPlayState = 'running'; });
  });

  /* ──────────────────────────────
     AVATAR RING — pausa no hover
  ────────────────────────────── */
  const ring       = document.querySelector('.avatar-ring');
  const avatarWrap = document.querySelector('.avatar-wrap');
  if (ring && avatarWrap) {
    avatarWrap.addEventListener('mouseenter', () => { ring.style.animationPlayState = 'paused'; });
    avatarWrap.addEventListener('mouseleave', () => { ring.style.animationPlayState = 'running'; });
  }

  /* ──────────────────────────────
     CTA SECURITY — reveal ao entrar na viewport
  ────────────────────────────── */
  const ctaInner = document.querySelector('.cta-security__inner');
  if (ctaInner) {
    const ctaObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        ctaInner.style.opacity   = '1';
        ctaInner.style.transform = 'none';
        ctaObs.unobserve(ctaInner);
      });
    }, { threshold: 0.15 });

    ctaInner.style.opacity   = '0';
    ctaInner.style.transform = 'translateY(32px)';
    ctaInner.style.transition = 'opacity .9s var(--ease), transform .9s var(--ease)';
    ctaObs.observe(ctaInner);
  }

  // estado inicial correto
  onScroll();
});