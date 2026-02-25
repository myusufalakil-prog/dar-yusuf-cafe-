// ===== CART MANAGEMENT =====

function getCart() {
  return JSON.parse(localStorage.getItem('dyc_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('dyc_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    const product = PRODUCTS.find(p => p.id === productId);
    cart.push({ id: productId, nama: product.nama, emoji: product.emoji, harga: product.harga, qty: 1 });
  }
  saveCart(cart);

  // Visual feedback
  const btn = document.querySelector(`[data-id="${productId}"]`);
  if (btn) {
    btn.textContent = '✓ Ditambahkan';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = '+ Tambah';
      btn.classList.remove('added');
    }, 1200);
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  renderCart();
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(productId);
      return;
    }
  }
  saveCart(cart);
  renderCart();
}

function getCartTotal() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, i) => sum + (i.harga * i.qty), 0);
  const tax = Math.round(subtotal * 0.1);
  return { subtotal, tax, total: subtotal + tax };
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function updateCartUI() {
  const count = getCartCount();
  const { total } = getCartTotal();

  // Update all cart badges
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);

  // Floating cart
  const floatCart = document.querySelector('.floating-cart');
  if (floatCart) {
    const floatCount = document.getElementById('floatCartCount');
    const floatTotal = document.getElementById('floatCartTotal');
    if (floatCount) floatCount.textContent = count;
    if (floatTotal) floatTotal.textContent = formatRp(total);
    floatCart.classList.toggle('visible', count > 0);
  }
}

function formatRp(angka) {
  return angka.toLocaleString('id-ID');
}

function renderCart() {
  const cart = getCart();
  const cartList = document.getElementById('cartList');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartContent = document.getElementById('cartContent');

  if (!cartList) return;

  if (cart.length === 0) {
    if (cartEmpty) cartEmpty.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }

  if (cartEmpty) cartEmpty.style.display = 'none';
  if (cartContent) cartContent.style.display = 'block';

  cartList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <h4>${item.nama}</h4>
        <p>Rp ${formatRp(item.harga)} / item</p>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
        <span style="font-weight:600;min-width:20px;text-align:center">${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
      </div>
      <div style="font-weight:700;color:var(--primary);min-width:90px;text-align:right">
        Rp ${formatRp(item.harga * item.qty)}
      </div>
      <button onclick="removeFromCart(${item.id})" style="background:none;border:none;cursor:pointer;color:#e74c3c;font-size:1.3rem" title="Hapus">🗑️</button>
    </div>
  `).join('');

  const { subtotal, tax, total } = getCartTotal();
  const sub = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const tot = document.getElementById('total');
  if (sub) sub.textContent = 'Rp ' + formatRp(subtotal);
  if (taxEl) taxEl.textContent = 'Rp ' + formatRp(tax);
  if (tot) tot.textContent = 'Rp ' + formatRp(total);

  updateCartUI();
}

// Init
updateCartUI();
