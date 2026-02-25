// ============================================================
// GOOGLE APPS SCRIPT - Dar Yusuf Café Notification System
// ============================================================
// CARA PAKAI:
// 1. Buka script.google.com
// 2. Buat project baru
// 3. Copy-paste semua kode ini
// 4. Ganti EMAIL_TUJUAN dan SPREADSHEET_ID
// 5. Klik Deploy > New Deployment > Web App
// 6. Execute as: Me | Who has access: Anyone
// 7. Copy URL yang muncul
// 8. Buka checkout.html di browser, buka Console (F12)
//    Ketik: localStorage.setItem('dyc_gas_url', 'URL_KAMU_DISINI')
// ============================================================

const EMAIL_TUJUAN = 'daryusufcafe@gmail.com'; // Ganti jika perlu
const NAMA_SHEET = 'Orders'; // Nama sheet di Google Sheets
const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_KAMU';
// Cara dapat Spreadsheet ID:
// Buka Google Sheets baru → lihat URL:
// https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_ADA_DISINI/edit

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // 1. Kirim notifikasi email
    kirimEmail(data);
    
    // 2. Simpan ke Google Sheets
    simpanKeSheets(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'OK' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ERROR', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function kirimEmail(data) {
  const subject = `☕ Order Baru ${data.orderId} - Dar Yusuf Café`;
  
  const body = `
🎉 ADA PESANAN BARU!
=====================================

📋 No. Order  : ${data.orderId}
📅 Tanggal    : ${data.orderDate}
👤 Nama       : ${data.nama}
📱 No. HP     : ${data.noHp}
🍽️ Tipe       : ${data.pengambilan}
${data.noMeja !== '-' ? '🪑 Meja       : ' + data.noMeja : ''}

=====================================
🛒 ITEM PESANAN:
${data.items}

=====================================
💰 Subtotal   : ${data.subtotal}
💰 Pajak      : ${data.tax}
💰 TOTAL      : ${data.total}

💙 Pembayaran : DANA
=====================================
${data.catatan ? '📝 Catatan: ' + data.catatan : ''}

Segera proses pesanan ini!
- Dar Yusuf Café System
  `;
  
  GmailApp.sendEmail(EMAIL_TUJUAN, subject, body);
}

function simpanKeSheets(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(NAMA_SHEET);
  
  // Buat sheet baru jika belum ada
  if (!sheet) {
    sheet = ss.insertSheet(NAMA_SHEET);
    // Tambah header
    sheet.appendRow([
      'No. Order', 'Tanggal', 'Nama', 'No. HP',
      'Tipe Pengambilan', 'No. Meja', 'Item Pesanan',
      'Subtotal', 'Pajak', 'Total', 'Catatan', 'Status'
    ]);
    // Format header
    sheet.getRange(1, 1, 1, 12).setBackground('#6b3a1f').setFontColor('white').setFontWeight('bold');
  }
  
  // Tambah data order
  sheet.appendRow([
    data.orderId,
    data.orderDate,
    data.nama,
    data.noHp,
    data.pengambilan,
    data.noMeja || '-',
    data.items,
    data.subtotal,
    data.tax,
    data.total,
    data.catatan || '-',
    'Menunggu Konfirmasi' // Status awal
  ]);
}

// Test function (jalankan manual untuk test)
function testNotifikasi() {
  const testData = {
    orderId: 'DYC-TEST01',
    orderDate: new Date().toLocaleString('id-ID'),
    nama: 'Test Customer',
    noHp: '081234567890',
    pengambilan: 'dine-in',
    noMeja: 'Meja 1',
    items: '☕ Kopi Susu x2 = Rp 36.000\n🍳 Nasi Goreng x1 = Rp 28.000',
    subtotal: 'Rp 64.000',
    tax: 'Rp 6.400',
    total: 'Rp 70.400',
    catatan: 'Kopi gulanya sedikit'
  };
  
  kirimEmail(testData);
  simpanKeSheets(testData);
  Logger.log('Test berhasil!');
}
