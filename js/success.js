// ===== SUCCESS PAGE =====

function loadOrder() {
  const orderData = JSON.parse(localStorage.getItem('dyc_order') || 'null');
  if (!orderData) {
    window.location.href = 'index.html';
    return;
  }

  const { orderId, orderDate, nama, noHp, catatan, pengambilan, noMeja, cart, subtotal, tax, total } = orderData;

  document.getElementById('strOrderId').textContent = orderId;
  document.getElementById('strDate').textContent = orderDate;
  document.getElementById('strNama').textContent = nama;
  document.getElementById('strHp').textContent = noHp;
  document.getElementById('strTipe').textContent = pengambilan === 'dine-in' ? 'Dine-in' : 'Takeaway';

  const mejaRow = document.getElementById('strMejaRow');
  if (pengambilan === 'dine-in' && noMeja) {
    document.getElementById('strMeja').textContent = noMeja;
  } else {
    if (mejaRow) mejaRow.style.display = 'none';
  }

  // Items
  const itemsEl = document.getElementById('strItems');
  itemsEl.innerHTML = cart.map(item => `
    <div class="struk-item">
      <span>${item.emoji} ${item.nama}</span>
      <span>x${item.qty}</span>
    </div>
    <div class="struk-item-detail">@ Rp ${formatRp(item.harga)} = <strong>Rp ${formatRp(item.harga * item.qty)}</strong></div>
  `).join('');

  document.getElementById('strSubtotal').textContent = 'Rp ' + formatRp(subtotal);
  document.getElementById('strTax').textContent = 'Rp ' + formatRp(tax);
  document.getElementById('strTotal').textContent = 'Rp ' + formatRp(total);

  if (catatan) {
    document.getElementById('strCatatan').textContent = '📝 Catatan: ' + catatan;
  }
}

function printStruk() {
  window.print();
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: [80, 200] });

  const orderData = JSON.parse(localStorage.getItem('dyc_order') || 'null');
  if (!orderData) return;

  const { orderId, orderDate, nama, noHp, pengambilan, noMeja, cart, subtotal, tax, total, catatan } = orderData;

  let y = 10;
  const x = 40; // center

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Dar Yusuf Cafe', x, y, { align: 'center' });
  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Kopi & Makanan Pilihan', x, y, { align: 'center' });
  y += 4;
  doc.text('DANA: 0857111594005', x, y, { align: 'center' });
  y += 6;
  doc.setDrawColor(180, 140, 100);
  doc.setLineDash([2, 2]);
  doc.line(5, y, 75, y);
  y += 5;

  // Info
  doc.setFontSize(8);
  const addRow = (label, value) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', 5, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), 35, y);
    y += 5;
  };

  addRow('No. Order', orderId);
  addRow('Tanggal', orderDate);
  addRow('Nama', nama);
  addRow('No. HP', noHp);
  addRow('Tipe', pengambilan === 'dine-in' ? 'Dine-in' : 'Takeaway');
  if (pengambilan === 'dine-in' && noMeja) addRow('Meja', noMeja);

  y += 1;
  doc.line(5, y, 75, y);
  y += 5;

  // Items
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM', 5, y);
  doc.text('HARGA', 60, y, { align: 'right' });
  y += 5;
  doc.setLineDash([]);
  doc.line(5, y, 75, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  cart.forEach(item => {
    doc.text(`${item.nama} x${item.qty}`, 5, y);
    doc.text('Rp ' + formatRp(item.harga * item.qty), 75, y, { align: 'right' });
    y += 5;
  });

  y += 1;
  doc.setLineDash([2, 2]);
  doc.line(5, y, 75, y);
  y += 5;

  // Totals
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal', 5, y);
  doc.text('Rp ' + formatRp(subtotal), 75, y, { align: 'right' });
  y += 5;
  doc.text('Pajak (10%)', 5, y);
  doc.text('Rp ' + formatRp(tax), 75, y, { align: 'right' });
  y += 3;
  doc.setLineDash([]);
  doc.line(5, y, 75, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL', 5, y);
  doc.text('Rp ' + formatRp(total), 75, y, { align: 'right' });
  y += 7;

  doc.setLineDash([2, 2]);
  doc.line(5, y, 75, y);
  y += 5;

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Pembayaran: DANA', x, y, { align: 'center' });
  y += 5;
  if (catatan) {
    doc.text('Catatan: ' + catatan, x, y, { align: 'center' });
    y += 5;
  }
  doc.setFont('helvetica', 'bold');
  doc.text('Terima kasih telah berbelanja!', x, y, { align: 'center' });
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.text('Selamat menikmati ☕', x, y, { align: 'center' });

  doc.save(`struk-${orderId}.pdf`);
}

// Clear order after viewing (optional, keep for re-print)
loadOrder();
