// ===== MAIN PAGE =====

let currentFilter = 'semua';

function filterMenu(kategori) {
  currentFilter = kategori;

  // Update tab UI
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.textContent.toLowerCase().includes(kategori) || (kategori === 'semua' && t.textContent === 'Semua'));
  });

  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const filtered = currentFilter === 'semua'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.kategori === currentFilter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-kategori="${p.kategori}">
      <div class="product-emoji">${p.emoji}</div>
      <div class="product-info">
        <h3>${p.nama}</h3>
        <p>${p.deskripsi}</p>
        <div class="product-footer">
          <span class="price">Rp ${formatRp(p.harga)}</span>
          <button class="btn-add" data-id="${p.id}" onclick="addToCart(${p.id})">+ Tambah</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Init
renderProducts();
