/* main.js — STEM Club shared JS */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 10px 30px rgba(23,50,77,0.12)'
        : 'none';
    }, { passive: true });
  }

  const navLinks = [...document.querySelectorAll('.nav-links a:not(.btn-donate)')];
  const samePagePath = url => url.pathname.replace(/\/$/, '/index.html') === window.location.pathname.replace(/\/$/, '/index.html');
  const setActiveNav = () => {
    const currentHash = window.location.hash;
    navLinks.forEach(link => link.classList.remove('active'));

    const hashMatch = currentHash
      ? navLinks.find(link => {
          const url = new URL(link.href);
          return samePagePath(url) && url.hash === currentHash;
        })
      : null;

    const pageMatch = navLinks.find(link => {
      const url = new URL(link.href);
      return samePagePath(url) && !url.hash;
    });

    (hashMatch || pageMatch)?.classList.add('active');
  };

  setActiveNav();
  window.addEventListener('hashchange', setActiveNav);

  const sectionLinks = navLinks
    .map(link => ({ link, url: new URL(link.href) }))
    .filter(({ url }) => samePagePath(url) && url.hash && document.querySelector(url.hash));

  if (sectionLinks.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => link.classList.remove('active'));
      sectionLinks.find(({ url }) => url.hash === `#${visible.target.id}`)?.link.classList.add('active');
    }, { rootMargin: '-35% 0px -50% 0px', threshold: [0.15, 0.35, 0.6] });

    sectionLinks.forEach(({ url }) => sectionObserver.observe(document.querySelector(url.hash)));
  }

  document.querySelectorAll('form').forEach(form => {
    if (form.classList.contains('payment-form')) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const orig = btn.textContent;
      btn.textContent = '✅ Submitted!';
      btn.style.background = '#5CBF2A';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  });

  document.querySelectorAll('.donation-amounts span').forEach(span => {
    span.addEventListener('click', () => {
      document.querySelectorAll('.donation-amounts span').forEach(s => s.style.background = '');
      span.style.background = '#F5C518';
      const input = document.querySelector('.custom-amount');
      if (input) input.value = span.textContent.replace('$', '');
    });
  });

  const cart = [];
  const cartItems = document.querySelector('[data-cart-items]');
  const cartTotal = document.querySelector('[data-cart-total]');
  const cartCount = document.querySelector('[data-cart-count]');
  const floatingCart = document.querySelector('[data-floating-cart]');
  const cartToggle = document.querySelector('[data-cart-toggle]');
  const paymentAmount = document.querySelector('[data-payment-amount]');

  function renderCart() {
    if (!cartItems || !cartTotal) return;
    if (!cart.length) {
      cartItems.innerHTML = '<p class="empty-cart">No items yet.</p>';
      cartTotal.textContent = '$0';
      if (cartCount) cartCount.textContent = '0';
      if (floatingCart) floatingCart.classList.remove('is-visible', 'is-open');
      if (paymentAmount) paymentAmount.value = '';
      return;
    }

    const totals = cart.reduce((sum, item) => sum + item.price, 0);
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-line">
        <img src="${item.image}" alt="${item.name}">
        <span>${item.name}</span>
        <strong>$${item.price}</strong>
      </div>
    `).join('');
    cartTotal.textContent = `$${totals}`;
    if (cartCount) cartCount.textContent = String(cart.length);
    if (floatingCart) floatingCart.classList.add('is-visible', 'is-open');
    if (paymentAmount) paymentAmount.value = totals;
  }

  cartToggle?.addEventListener('click', () => {
    floatingCart?.classList.toggle('is-open');
  });

  document.querySelectorAll('.shop-card .shop-btn').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.shop-card');
      if (!card) return;
      const image = card.querySelector('img')?.getAttribute('src') || '';
      cart.push({
        name: card.dataset.name || 'Shop item',
        price: Number(card.dataset.price || 0),
        image
      });
      renderCart();
      button.textContent = 'Added ✓';
      setTimeout(() => { button.textContent = 'Add'; }, 1200);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', id);
        setActiveNav();
      }
    });
  });
});
