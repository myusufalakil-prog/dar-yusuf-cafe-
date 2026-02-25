// ===== CHECKOUT PAGE =====

// Render order summary
function renderOrderSummary() {
  const cart = getCart();
  const summaryEl = document.getElementById('orderSummary');
  if (!summaryEl) return;

  summaryEl.innerHTML = cart.map(item => `
    <div class="order-summary-item">
      <span>${item.emoji} ${item.nama} x${item.qty}</span>
      <span>Rp ${formatRp(item.harga * item.qty)}</span>
    </div>
  `).join('');

  const { subtotal, tax, total } = getCartTotal();
  document.getElementById('coSubtotal').textContent = 'Rp ' + formatRp(subtotal);
  document.getElementById('coTax').textContent = 'Rp ' + formatRp(tax);
  document.getElementById('coTotal').textContent = 'Rp ' + formatRp(total);
}

// Toggle nomor meja
document.querySelectorAll('input[name="pengambilan"]').forEach(r => {
  r.addEventListener('change', () => {
    const tableGroup = document.getElementById('tableGroup');
    if (tableGroup) {
      tableGroup.style.display = r.value === 'dine-in' ? 'block' : 'none';
    }
  });
});

// Preview bukti transfer
function previewBukti(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById('previewImg');
    const placeholder = document.getElementById('uploadPlaceholder');
    if (preview && placeholder) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
      // Save to localStorage as base64
      localStorage.setItem('dyc_bukti', e.target.result);
    }
  };
  reader.readAsDataURL(file);
}

// Generate Order ID
function generateOrderId() {
  const now = new Date();
  const timestamp = now.getTime().toString().slice(-6);
  return 'DYC-' + timestamp;
}

// Submit order
async function submitOrder() {
  const nama = document.getElementById('nama').value.trim();
  const noHp = document.getElementById('noHp').value.trim();
  const catatan = document.getElementById('catatan').value.trim();
  const pengambilan = document.querySelector('input[name="pengambilan"]:checked').value;
  const noMeja = pengambilan === 'dine-in' ? document.getElementById('noMeja').value.trim() : '-';
  const bukti = localStorage.getItem('dyc_bukti');
  const cart = getCart();

  // Validasi
  if (!nama) { alert('Nama lengkap harus diisi!'); return; }
  if (!noHp) { alert('Nomor HP harus diisi!'); return; }
  if (cart.length === 0) { alert('Keranjang kosong!'); return; }
  if (!bukti) { alert('Silakan upload bukti transfer DANA terlebih dahulu!'); return; }

  const btn = document.querySelector('.btn-primary[onclick="submitOrder()"]');
  btn.textContent = '⏳ Memproses...';
  btn.disabled = true;

  const { subtotal, tax, total } = getCartTotal();
  const orderId = generateOrderId();
  const orderDate = new Date().toLocaleString('id-ID');

  const orderData = {
    orderId, orderDate, nama, noHp, catatan,
    pengambilan, noMeja, cart, subtotal, tax, total
  };

  // Save to localStorage for success page
  localStorage.setItem('dyc_order', JSON.stringify(orderData));

  // Send notification to Google Apps Script
  const GOOGLE_SCRIPT_URL = localStorage.getItem('dyc_gas_url') || '';
  
  if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith('https://script.google.com')) {
    try {
      const itemsText = cart.map(i => `${i.emoji} ${i.nama} x${i.qty} = Rp ${formatRp(i.harga * i.qty)}`).join('\n');
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId, orderDate, nama, noHp, catatan,
          pengambilan, noMeja,
          items: itemsText,
          subtotal: 'Rp ' + formatRp(subtotal),
          tax: 'Rp ' + formatRp(tax),
          total: 'Rp ' + formatRp(total)
        })
      });
    } catch(e) {
      console.log('Notifikasi gagal:', e);
    }
  }

  // Clear cart
  localStorage.removeItem('dyc_cart');
  localStorage.removeItem('dyc_bukti');

  // Redirect to success
  window.location.href = 'success.html';
}

// Init
renderOrderSummary();
