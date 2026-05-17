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

  const links = document.querySelectorAll('.nav-links a:not(.btn-donate)');
  links.forEach(link => {
    if (link.href === window.location.href) link.classList.add('active');
  });

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
  const paymentAmount = document.querySelector('[data-payment-amount]');

  function renderCart() {
    if (!cartItems || !cartTotal) return;
    if (!cart.length) {
      cartItems.innerHTML = '<p class="empty-cart">No items yet. Click Add to begin.</p>';
      cartTotal.textContent = '$0';
      if (paymentAmount) paymentAmount.value = '';
      return;
    }

    const totals = cart.reduce((sum, item) => sum + item.price, 0);
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-line">
        <span>${item.name}</span>
        <strong>$${item.price}</strong>
      </div>
    `).join('');
    cartTotal.textContent = `$${totals}`;
    if (paymentAmount) paymentAmount.value = totals;
  }

  document.querySelectorAll('.shop-card .shop-btn').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.shop-card');
      if (!card) return;
      cart.push({
        name: card.dataset.name || 'Shop item',
        price: Number(card.dataset.price || 0)
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
      }
    });
  });
});
