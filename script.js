/* ================================================================
   LA PLANCHE BY SR
   ================================================================ */

(function () {
  'use strict';

  /* ---- Catalogue ---- */
  const P = {
    s: { id: 's', name: 'La Petite',    size: '25 × 25 cm',    price: 45  },
    m: { id: 'm', name: 'La Classique', size: '33 × 25–30 cm', price: 85  },
    l: { id: 'l', name: 'La Grande',    size: '50 × 25–30 cm', price: 135 },
  };

  /* ---- Cart ---- */
  let cart = JSON.parse(localStorage.getItem('lp_cart') || '[]');
  const total = () => cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = () => cart.reduce((s, i) => s + i.qty, 0);
  const save  = () => localStorage.setItem('lp_cart', JSON.stringify(cart));

  function addItem(id) {
    const idx = cart.findIndex(i => i.id === id);
    idx > -1 ? cart[idx].qty++ : cart.push({ ...P[id], qty: 1 });
    save(); refreshBadge(); renderDrawer(); openDrawer(); flashBtn(id);
  }
  function removeItem(id) { cart = cart.filter(i => i.id !== id); save(); refreshBadge(); renderDrawer(); }
  function changeQty(id, d) {
    const idx = cart.findIndex(i => i.id === id);
    if (idx === -1) return;
    cart[idx].qty += d;
    if (cart[idx].qty < 1) cart.splice(idx, 1);
    save(); refreshBadge(); renderDrawer();
  }
  window.removeItem = removeItem;
  window.changeQty  = changeQty;

  function flashBtn(id) {
    const btn = document.querySelector(`.btn-add[data-id="${id}"]`);
    if (!btn) return;
    btn.classList.add('done');
    btn.textContent = '✓ Ajouté';
    setTimeout(() => { btn.classList.remove('done'); btn.textContent = 'Ajouter au panier'; }, 2200);
  }

  /* ---- Badge ---- */
  const badge = document.getElementById('cartBadge');
  function refreshBadge() {
    const n = count();
    badge.textContent = n || '';
    badge.classList.toggle('on', n > 0);
    if (n > 0) { badge.classList.add('pop'); setTimeout(() => badge.classList.remove('pop'), 350); }
  }

  /* ---- Drawer ---- */
  const drawer      = document.getElementById('cartDrawer');
  const drawerBody  = document.getElementById('drawerBody');
  const drawerFoot  = document.getElementById('drawerFoot');
  const drawerTotal = document.getElementById('drawerTotal');

  function openDrawer()  { drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }
  window.closeCart = closeDrawer;

  document.getElementById('cartBtn').addEventListener('click', () => { renderDrawer(); openDrawer(); });
  document.getElementById('cartClose').addEventListener('click', closeDrawer);
  document.getElementById('cartOverlay').addEventListener('click', closeDrawer);

  function woodGrad(id) {
    const g = {
      s: 'linear-gradient(162deg,#EFC89E,#D8A87A,#BC8854,#D8A87A,#EFC89E)',
      m: 'linear-gradient(146deg,#CC9C72,#AA7C48,#8E6035,#7A5028,#8E6035,#AA7C48,#CC9C72)',
      l: 'linear-gradient(135deg,#A27040,#8B5E35,#7A5028,#6B4220,#7A5028,#8B5E35,#A27040)',
    };
    return g[id] || '';
  }

  function renderDrawer() {
    if (!cart.length) {
      drawerBody.innerHTML = `<div class="empty-cart">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Votre panier est vide.<br>Chaque planche est façonnée à votre commande.</p>
        <a href="#collection" onclick="window.closeCart()">Voir la collection →</a>
      </div>`;
      drawerFoot.style.display = 'none';
      return;
    }
    drawerBody.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item__thumb" style="background:${woodGrad(item.id)}"></div>
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__sub">${item.size} · Pièce unique</div>
          <div class="qty-row">
            <button class="qty-btn" onclick="changeQty('${item.id}',-1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}',1)">+</button>
          </div>
        </div>
        <span class="cart-item__price">CHF ${item.price * item.qty}</span>
        <button class="del-btn" onclick="removeItem('${item.id}')" aria-label="Supprimer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
          </svg>
        </button>
      </div>`).join('');
    drawerTotal.textContent = `CHF ${total()}`;
    drawerFoot.style.display = 'block';
  }

  /* ---- Add to cart ---- */
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => { if (btn.dataset.id) addItem(btn.dataset.id); });
  });

  /* ---- Checkout ---- */
  const modal    = document.getElementById('checkoutModal');
  const stepInfo = document.getElementById('stepInfo');
  const stepPay  = document.getElementById('stepPay');
  const stepOk   = document.getElementById('stepSuccess');

  function openCheckout() { closeDrawer(); fillSummary(); show('info'); modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; }
  function closeCheckout(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }
  window.closeCheckout = closeCheckout;

  document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
  document.getElementById('modalOverlay').addEventListener('click', closeCheckout);
  document.getElementById('checkoutClose').addEventListener('click', closeCheckout);
  document.getElementById('backBtn').addEventListener('click', () => show('info'));

  function show(step) {
    stepInfo.style.display = step === 'info' ? '' : 'none';
    stepPay.style.display  = step === 'pay'  ? '' : 'none';
    stepOk.style.display   = step === 'ok'   ? '' : 'none';
  }

  function fillSummary() {
    const el = document.getElementById('checkoutSummary');
    el.innerHTML = cart.map(i => `<div class="recap-row"><span>${i.name} × ${i.qty}</span><span>CHF ${i.price * i.qty}</span></div>`).join('') +
      `<div class="recap-total"><span>Total</span><span>CHF ${total()}</span></div>`;
    const banner = document.getElementById('payBanner');
    if (banner) banner.innerHTML = `<span>Montant à régler</span><strong>CHF ${total()}</strong>`;
    const amt = document.getElementById('payAmt');
    if (amt) amt.textContent = `CHF ${total()}`;
  }

  document.getElementById('infoForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!document.getElementById('c-name').value.trim() ||
        !document.getElementById('c-email').value.trim() ||
        !document.getElementById('c-addr').value.trim()) return;
    fillSummary(); buildQR(); show('pay');
  });

  /* ---- Pay tabs ---- */
  document.querySelectorAll('.pay-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panelTwint').style.display = tab.dataset.tab === 'twint' ? '' : 'none';
      document.getElementById('panelCard').style.display  = tab.dataset.tab === 'card'  ? '' : 'none';
    });
  });

  /* ---- Twint QR ---- */
  function buildQR() {
    const box  = document.getElementById('qrBox');
    if (!box) return;
    const amt  = total(), seed = amt * 13 + 37;
    const cells = 21, sz = 156, c = sz / cells;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}">`;
    svg += `<rect width="${sz}" height="${sz}" fill="white"/>`;
    const corner = (x, y) => {
      svg += `<rect x="${x}" y="${y}" width="${c*7}" height="${c*7}" fill="none" stroke="black" stroke-width="${c*.8}"/>`;
      svg += `<rect x="${x+c*2}" y="${y+c*2}" width="${c*3}" height="${c*3}" fill="black"/>`;
    };
    corner(0, 0); corner((cells-7)*c, 0); corner(0, (cells-7)*c);
    for (let r = 0; r < cells; r++) {
      for (let col = 0; col < cells; col++) {
        if ((r<8&&col<8)||(r<8&&col>cells-9)||(r>cells-9&&col<8)) continue;
        const h = ((seed + r*29 + col*17 + r*col) ^ (r<<4) ^ (col<<2)) % 100;
        if (h < 44) svg += `<rect x="${col*c+.5}" y="${r*c+.5}" width="${c-1}" height="${c-1}" fill="black"/>`;
      }
    }
    svg += '</svg>';
    box.innerHTML = svg;
  }

  document.getElementById('twintBtn').addEventListener('click', () => simulate('Twint'));

  /* ---- Card form ---- */
  const numInput  = document.getElementById('c-num');
  const brandIcon = document.getElementById('brandIcon');

  numInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g,'').slice(0,16);
    this.value = v.replace(/(.{4})/g,'$1 ').trim();
    if (brandIcon) {
      if (/^4/.test(v)) {
        brandIcon.innerHTML = `<svg width="30" height="17" viewBox="0 0 60 20"><text x="0" y="16" font-size="18" font-weight="900" fill="#1A1F71" font-family="Arial" letter-spacing="-1">VISA</text></svg>`;
      } else if (/^(51|52|53|54|55|2[2-7])/.test(v)) {
        brandIcon.innerHTML = `<svg width="26" height="17" viewBox="0 0 50 30"><circle cx="18" cy="15" r="13" fill="#EB001B"/><circle cx="32" cy="15" r="13" fill="#F79E1B"/><path d="M25 6a13 13 0 010 18 13 13 0 010-18z" fill="#FF5F00"/></svg>`;
      } else { brandIcon.innerHTML = ''; }
    }
  });

  document.getElementById('c-exp').addEventListener('input', function () {
    let v = this.value.replace(/\D/g,'').slice(0,4);
    if (v.length >= 2) v = v.slice(0,2) + ' / ' + v.slice(2);
    this.value = v;
  });

  document.getElementById('cardForm').addEventListener('submit', e => {
    e.preventDefault();
    const num = numInput.value.replace(/\D/g,'');
    if (num.length < 16 || !document.getElementById('c-exp').value ||
        document.getElementById('c-cvv').value.length < 3 ||
        !document.getElementById('c-hld').value.trim()) return;
    simulate('Carte');
  });

  function simulate(method) {
    const ld = document.getElementById('payLoading');
    ld.style.display = 'flex';
    setTimeout(() => {
      ld.style.display = 'none';
      const name  = document.getElementById('c-name').value || 'Client';
      const email = document.getElementById('c-email').value;
      const ref   = 'LP-' + Date.now().toString().slice(-6);
      document.getElementById('successTxt').textContent = `Merci ${name}. Une confirmation est envoyée à ${email}.`;
      document.getElementById('successRef').textContent = `Commande n° ${ref} · Paiement ${method}`;
      show('ok');
      cart = []; save(); refreshBadge(); renderDrawer();
    }, 2200);
  }

  /* ---- Contact form ---- */
  const cForm = document.getElementById('contactForm');
  if (cForm) {
    cForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = cForm.querySelector('.btn-submit');
      const orig = btn.textContent;
      btn.textContent = 'Message envoyé ✓';
      btn.style.background = '#2E5D28';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; cForm.reset(); }, 3600);
    });
  }

  /* ---- Nav ---- */
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const links  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); }, { passive: true });
  nav.classList.toggle('scrolled', window.scrollY > 60);

  burger.addEventListener('click', () => {
    const o = burger.classList.toggle('open');
    links.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open');
    links.classList.remove('open');
    document.body.style.overflow = '';
  }));

  /* ---- Smooth scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - nav.offsetHeight - 16, behavior: 'smooth' });
    });
  });

  /* ---- Scroll reveals ---- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const d = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('visible'), d);
      io.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  /* ---- Hero entrance ---- */
  document.querySelectorAll('.hero [data-reveal]').forEach(el => {
    const d = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), d + 100);
  });

  /* ---- Wood plank subtle parallax ---- */
  document.querySelectorAll('.planche__wood').forEach(wood => {
    const art = wood.closest('.planche');
    art.addEventListener('mousemove', e => {
      const r = art.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      wood.style.transform = `scale(1.03) translate(${x*5}px,${y*4}px)`;
    });
    art.addEventListener('mouseleave', () => { wood.style.transform = ''; });
  });

  /* ---- Wood strips tilt ---- */
  document.querySelectorAll('.bois-strip').forEach(p => {
    p.addEventListener('mousemove', function (e) {
      const r = this.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      this.style.transform = `perspective(600px) rotateY(${x*6}deg) scale(1.02)`;
      this.style.transition = 'transform 0.06s ease';
    });
    p.addEventListener('mouseleave', function () {
      this.style.transform = '';
      this.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
    });
  });

  /* ---- Init ---- */
  refreshBadge();

})();
