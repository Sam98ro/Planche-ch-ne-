/* ================================================================
   LA PLANCHE BY SR — Script
   ================================================================ */

(function () {
  'use strict';

  /* ---- Nav scroll ---- */
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const links  = document.getElementById('navLinks');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    links.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('is-open');
      links.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  /* ---- Smooth scroll for anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 16;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

  /* ---- Scroll-reveal (IntersectionObserver) ---- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseFloat(el.dataset.aosDelay || 0);
        setTimeout(() => el.classList.add('in-view'), delay);
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -44px 0px' }
  );

  document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));

  /* ---- Staggered children inside section-header ---- */
  const headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const children = entry.target.querySelectorAll('[data-aos]');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('in-view'), i * 100);
        });
        headerObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll('.section-header').forEach(el => headerObserver.observe(el));

  /* ---- Form submission (demo) ---- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn  = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Message envoyé ✓';
      btn.style.cssText = 'background:#3D6B35;color:#F5EFE6;cursor:default';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.cssText = '';
        btn.disabled = false;
        form.reset();
      }, 3800);
    });
  }

  /* ---- Wood plank 3-D tilt on hover ---- */
  document.querySelectorAll('.wood-plank').forEach(plank => {
    plank.addEventListener('mousemove', function (e) {
      const r = this.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      this.style.transition = 'transform 0.08s ease';
      this.style.transform  = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.03)`;
    });
    plank.addEventListener('mouseleave', function () {
      this.style.transition = 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';
      this.style.transform  = '';
    });
  });

  /* ---- Product card subtle grain parallax ---- */
  document.querySelectorAll('.card__wood').forEach(wood => {
    const card = wood.closest('.card');
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      wood.style.transform = `scale(1.06) translate(${x * 8}px, ${y * 8}px)`;
    });
    card.addEventListener('mouseleave', () => {
      wood.style.transform = '';
    });
  });

  /* ---- Hero parallax (subtle scale on scroll) ---- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    let rafId;
    const heroH = document.querySelector('.hero').offsetHeight;
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < heroH) {
          const p = y / heroH;
          heroBg.style.transform = `scale(${1 + p * 0.06})`;
          heroBg.style.opacity   = `${1 - p * 0.15}`;
        }
      });
    }, { passive: true });
  }

  /* ---- Marquee pause on hover ---- */
  const marqueeTrack = document.querySelector('.marquee__track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            a.style.color = a.getAttribute('href') === '#' + id
              ? 'var(--c-white)'
              : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach(s => sectionObserver.observe(s));

})();
