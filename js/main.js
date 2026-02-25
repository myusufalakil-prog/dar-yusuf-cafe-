// ===== MAIN PAGE =====

let currentFilter = 'semua';
let searchQuery = '';

function filterMenu(kategori, btn) {
  currentFilter = kategori;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

function handleSearch(val) {
  searchQuery = val.toLowerCase().trim();
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  let filtered = currentFilter === 'semua'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.kategori === currentFilter);

  // Filter pencarian
  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.nama.toLowerCase().includes(searchQuery) ||
      p.deskripsi.toLowerCase().includes(searchQuery)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem 1rem;color:var(--text-light)">
        <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
        <h3 style="font-family:'Playfair Display',serif;color:var(--primary);margin-bottom:0.5rem">Menu tidak ditemukan</h3>
        <p>Coba kata kunci lain atau pilih kategori berbeda</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    // Badge HTML
    let badgeHtml = '';
    if (p.badge === 'terlaris') {
      badgeHtml = `<div class="badge-product badge-terlaris">🔥 Terlaris</div>`;
    } else if (p.badge === 'baru') {
      badgeHtml = `<div class="badge-product badge-baru">✨ Baru</div>`;
    }

    return `
      <div class="product-card" data-kategori="${p.kategori}">
        <div class="product-emoji" style="position:relative">
          ${p.emoji}
          ${badgeHtml}
        </div>
        <div class="product-info">
          <h3>${p.nama}</h3>
          <p>${p.deskripsi}</p>
          <div class="product-footer">
            <span class="price">Rp ${formatRp(p.harga)}</span>
            <button class="btn-add" data-id="${p.id}" onclick="addToCart(${p.id})">+ Tambah</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ===== SHARE KE WHATSAPP =====
function shareWhatsApp(orderId, nama, items, total) {
  const pesan = encodeURIComponent(
    `✅ *Konfirmasi Pesanan - Dar Yusuf Café*\n\n` +
    `📋 No. Order: *${orderId}*\n` +
    `👤 Nama: ${nama}\n\n` +
    `🛒 *Pesanan:*\n${items}\n\n` +
    `💰 *Total: Rp ${total}*\n\n` +
    `💙 Pembayaran: DANA (0857111594005)\n\n` +
    `Terima kasih telah memesan di Dar Yusuf Café ☕`
  );
  window.open(`https://wa.me/?text=${pesan}`, '_blank');
}

// Init
renderProducts();
