/* ================================================================
   LA PLANCHE BY SR — Script
   ================================================================ */

(function () {
  'use strict';

  /* ================================================================
     PRODUCTS CATALOGUE
     ================================================================ */
  const PRODUCTS = {
    s: { id: 's', name: 'La Petite',    size: '25 × 15 cm', price: 45,  woodClass: 'card__wood--s' },
    m: { id: 'm', name: 'La Classique', size: '40 × 25 cm', price: 85,  woodClass: 'card__wood--m' },
    l: { id: 'l', name: 'La Grande',    size: '55 × 35 cm', price: 135, woodClass: 'card__wood--l' },
  };

  /* ================================================================
     CART STATE
     ================================================================ */
  let cart = JSON.parse(localStorage.getItem('laplanche_cart') || '[]');

  function saveCart() {
    localStorage.setItem('laplanche_cart', JSON.stringify(cart));
  }

  function cartTotal() {
    return cart.reduce((s, i) => s + i.price * i.qty, 0);
  }

  function cartCount() {
    return cart.reduce((s, i) => s + i.qty, 0);
  }

  function addToCart(id) {
    const p   = PRODUCTS[id];
    const idx = cart.findIndex(i => i.id === id);
    if (idx > -1) {
      cart[idx].qty++;
    } else {
      cart.push({ id, name: p.name, size: p.size, price: p.price, qty: 1 });
    }
    saveCart();
    updateBadge();
    renderCart();
    openCart();
    flashAddBtn(id);
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateBadge();
    renderCart();
  }

  function changeQty(id, delta) {
    const idx = cart.findIndex(i => i.id === id);
    if (idx === -1) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart();
    updateBadge();
    renderCart();
  }

  function flashAddBtn(id) {
    const btn = document.querySelector(`.card__add-btn[data-product="${id}"]`);
    if (!btn) return;
    btn.classList.add('added');
    btn.textContent = '✓ Ajouté';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Ajouter au panier`;
    }, 2000);
  }

  /* ================================================================
     BADGE
     ================================================================ */
  const badge = document.getElementById('cartBadge');

  function updateBadge() {
    const n = cartCount();
    badge.textContent = n;
    badge.classList.toggle('visible', n > 0);
    badge.classList.add('bump');
    setTimeout(() => badge.classList.remove('bump'), 400);
  }

  /* ================================================================
     CART DRAWER UI
     ================================================================ */
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const cartBodyEl = document.getElementById('cartBody');
  const cartFootEl = document.getElementById('cartFoot');
  const cartTotalEl = document.getElementById('cartTotal');

  function openCart() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* Expose closeCart for inline onclick */
  window.closeCart = closeCart;

  document.getElementById('cartBtn').addEventListener('click', () => {
    renderCart();
    openCart();
  });
  document.getElementById('cartClose').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);

  function woodMiniStyle(id) {
    const p = PRODUCTS[id];
    if (!p) return '';
    if (id === 's') return 'background:linear-gradient(158deg,#E0B88A,#C89A6A,#A87848,#C89A6A,#E0B88A)';
    if (id === 'm') return 'background:linear-gradient(142deg,#C4956A,#A07040,#8B5E35,#7A5030,#8B5E35,#A07040,#C4956A)';
    return 'background:linear-gradient(132deg,#A07040,#8B5E35,#7A5028,#6B4220,#7A5028,#8B5E35,#A07040)';
  }

  function renderCart() {
    if (cart.length === 0) {
      cartBodyEl.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p>Votre panier est vide.<br>Découvrez nos planches en chêne massif.</p>
          <a href="#products" onclick="closeCart()">Voir la collection →</a>
        </div>`;
      cartFootEl.style.display = 'none';
      return;
    }

    cartBodyEl.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__wood" style="${woodMiniStyle(item.id)}"></div>
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__size">${item.size}</div>
          <div class="cart-item__qty">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <span class="cart-item__price">CHF ${item.price * item.qty}</span>
        <button class="cart-item__del" onclick="removeFromCart('${item.id}')" aria-label="Supprimer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>`).join('');

    cartTotalEl.textContent = `CHF ${cartTotal()}`;
    cartFootEl.style.display = 'block';
  }

  /* Expose for inline onclick */
  window.changeQty     = changeQty;
  window.removeFromCart = removeFromCart;

  /* ================================================================
     ADD TO CART BUTTONS
     ================================================================ */
  document.querySelectorAll('.card__add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.product;
      if (id) addToCart(id);
    });
  });

  /* ================================================================
     CHECKOUT MODAL
     ================================================================ */
  const modal           = document.getElementById('checkoutModal');
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const stepInfo        = document.getElementById('stepInfo');
  const stepPay         = document.getElementById('stepPay');
  const stepSuccess     = document.getElementById('stepSuccess');

  function openCheckout() {
    closeCart();
    renderCheckoutSummary();
    showStep('info');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  window.closeCheckout = closeCheckout;

  document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
  checkoutOverlay.addEventListener('click', closeCheckout);
  document.getElementById('checkoutClose').addEventListener('click', closeCheckout);

  function showStep(name) {
    stepInfo.style.display    = name === 'info'    ? '' : 'none';
    stepPay.style.display     = name === 'pay'     ? '' : 'none';
    stepSuccess.style.display = name === 'success' ? '' : 'none';
  }

  function renderCheckoutSummary() {
    const el = document.getElementById('checkoutSummary');
    const itemsHtml = cart.map(i => `
      <div class="checkout-summary-item">
        <span>${i.name} × ${i.qty}</span>
        <span>CHF ${i.price * i.qty}</span>
      </div>`).join('');
    el.innerHTML = `
      ${itemsHtml}
      <div class="checkout-summary-total">
        <span>Total</span><span>CHF ${cartTotal()}</span>
      </div>`;

    // Also update the pay total banner
    const banner = document.getElementById('payTotalBanner');
    if (banner) {
      banner.innerHTML = `<span>Montant à régler</span><strong>CHF ${cartTotal()}</strong>`;
    }
    // pay button amount
    const payBtn = document.getElementById('payBtnAmount');
    if (payBtn) payBtn.textContent = `CHF ${cartTotal()}`;
  }

  /* Info form → step 2 */
  document.getElementById('infoForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name  = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const addr  = document.getElementById('c-address').value.trim();
    if (!name || !email || !addr) return;
    renderCheckoutSummary();
    renderTwintQR();
    showStep('pay');
  });

  /* Back button */
  document.getElementById('backBtn').addEventListener('click', () => showStep('info'));

  /* ================================================================
     PAYMENT TABS
     ================================================================ */
  const payTabs   = document.querySelectorAll('.pay-tab');
  const tabTwint  = document.getElementById('tabTwint');
  const tabCard   = document.getElementById('tabCard');

  payTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      payTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.tab === 'twint') {
        tabTwint.style.display = '';
        tabCard.style.display  = 'none';
      } else {
        tabTwint.style.display = 'none';
        tabCard.style.display  = '';
      }
    });
  });

  /* ================================================================
     TWINT — Simulated QR code (pure SVG)
     ================================================================ */
  function renderTwintQR() {
    const qrEl = document.getElementById('twintQr');
    if (!qrEl) return;
    const amt = cartTotal();
    /* Generate a deterministic fake QR-like pattern from amount */
    const seed = amt * 17 + 42;
    const cells = 21;
    const size  = 160;
    const cell  = size / cells;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    svg += `<rect width="${size}" height="${size}" fill="white"/>`;
    // Corner squares
    function cornerSq(x, y) {
      svg += `<rect x="${x}" y="${y}" width="${cell*7}" height="${cell*7}" fill="none" stroke="black" stroke-width="${cell*0.8}"/>`;
      svg += `<rect x="${x+cell*2}" y="${y+cell*2}" width="${cell*3}" height="${cell*3}" fill="black"/>`;
    }
    cornerSq(0, 0);
    cornerSq((cells - 7) * cell, 0);
    cornerSq(0, (cells - 7) * cell);
    // Random inner cells
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c > cells - 9) || (r > cells - 9 && c < 8)) continue;
        const hash = ((seed + r * 31 + c * 17 + r * c) ^ (r << 4) ^ (c << 2)) % 100;
        if (hash < 45) {
          svg += `<rect x="${c * cell + 0.5}" y="${r * cell + 0.5}" width="${cell - 1}" height="${cell - 1}" fill="black"/>`;
        }
      }
    }
    svg += '</svg>';
    qrEl.innerHTML = svg;
  }

  /* Twint app button */
  document.getElementById('twintAppBtn').addEventListener('click', () => {
    simulatePayment('Twint');
  });

  /* ================================================================
     CARD FORM
     ================================================================ */
  const cardNumInput = document.getElementById('c-cardnum');
  const brandIcon    = document.getElementById('cardBrandIcon');

  /* Format card number */
  cardNumInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 16);
    this.value = v.replace(/(.{4})/g, '$1 ').trim();
    detectCardBrand(v);
  });

  function detectCardBrand(num) {
    if (!brandIcon) return;
    if (/^4/.test(num)) {
      brandIcon.innerHTML = `<svg width="34" height="20" viewBox="0 0 60 20"><text x="0" y="16" font-size="18" font-weight="900" fill="#1A1F71" font-family="Arial" letter-spacing="-1">VISA</text></svg>`;
    } else if (/^(51|52|53|54|55|2[2-7])/.test(num)) {
      brandIcon.innerHTML = `<svg width="30" height="20" viewBox="0 0 50 30"><circle cx="18" cy="15" r="13" fill="#EB001B"/><circle cx="32" cy="15" r="13" fill="#F79E1B"/><path d="M25 6a13 13 0 010 18 13 13 0 010-18z" fill="#FF5F00"/></svg>`;
    } else {
      brandIcon.innerHTML = '';
    }
  }

  /* Format expiry */
  document.getElementById('c-expiry').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) v = v.slice(0, 2) + ' / ' + v.slice(2);
    this.value = v;
  });

  /* Card form submit */
  document.getElementById('cardForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const num    = cardNumInput.value.replace(/\D/g, '');
    const expiry = document.getElementById('c-expiry').value;
    const cvv    = document.getElementById('c-cvv').value;
    const holder = document.getElementById('c-holder').value.trim();
    if (num.length < 16 || !expiry || cvv.length < 3 || !holder) return;
    simulatePayment('Carte');
  });

  /* ================================================================
     PAYMENT SIMULATION
     ================================================================ */
  function simulatePayment(method) {
    const loading = document.getElementById('payLoading');
    loading.style.display = 'flex';
    setTimeout(() => {
      loading.style.display = 'none';
      /* Show success */
      const name = document.getElementById('c-name').value || 'Client';
      const email = document.getElementById('c-email').value || '';
      const orderNum = 'LP-' + Date.now().toString().slice(-6);
      document.getElementById('successMsg').textContent =
        `Merci ${name} pour votre commande. Une confirmation vous sera envoyée à ${email}.`;
      document.getElementById('successOrder').textContent =
        `Commande n° ${orderNum} — Paiement par ${method}`;
      showStep('success');
      /* Clear cart */
      cart = [];
      saveCart();
      updateBadge();
      renderCart();
    }, 2200);
  }

  /* ================================================================
     CONTACT FORM
     ================================================================ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn  = contactForm.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Message envoyé ✓';
      btn.style.cssText = 'background:#3D6B35;color:#F7F4EF;cursor:default';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.cssText = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3800);
    });
  }

  /* ================================================================
     NAV SCROLL + MOBILE MENU
     ================================================================ */
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const links  = document.getElementById('navLinks');

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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

  /* ================================================================
     SMOOTH SCROLL
     ================================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 16),
        behavior: 'smooth'
      });
    });
  });

  /* ================================================================
     SCROLL-REVEAL
     ================================================================ */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseFloat(entry.target.dataset.aosDelay || 0);
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));

  /* ================================================================
     HERO PARALLAX
     ================================================================ */
  const heroBg = document.querySelector('.hero__bg');
  const heroEl = document.querySelector('.hero');
  if (heroBg && heroEl) {
    let rafId;
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < heroEl.offsetHeight) {
          const p = y / heroEl.offsetHeight;
          heroBg.style.transform = `scale(${1 + p * 0.06})`;
          heroBg.style.opacity   = `${1 - p * 0.14}`;
        }
      });
    }, { passive: true });
  }

  /* ================================================================
     CARD GRAIN PARALLAX ON HOVER
     ================================================================ */
  document.querySelectorAll('.card__wood').forEach(wood => {
    const card = wood.closest('.card');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      wood.style.transform = `scale(1.06) translate(${x * 7}px, ${y * 7}px)`;
    });
    card.addEventListener('mouseleave', () => { wood.style.transform = ''; });
  });

  /* ================================================================
     WOOD PLANK 3D TILT
     ================================================================ */
  document.querySelectorAll('.wood-plank').forEach(plank => {
    plank.addEventListener('mousemove', function (e) {
      const r = this.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      this.style.transition = 'transform 0.08s ease';
      this.style.transform  = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.03)`;
    });
    plank.addEventListener('mouseleave', function () {
      this.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
      this.style.transform  = '';
    });
  });

  /* ================================================================
     MARQUEE PAUSE
     ================================================================ */
  const track = document.querySelector('.marquee__track');
  if (track) {
    track.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    track.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  }

  /* ================================================================
     INIT
     ================================================================ */
  updateBadge();

})();
