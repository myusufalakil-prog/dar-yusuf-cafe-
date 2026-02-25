# ☕ Dar Yusuf Café — Website Penjualan

Website penjualan kafe lengkap dengan pembayaran DANA, struk PDF, dan notifikasi Google.

## 🌟 Fitur
- 🛒 Katalog menu lengkap (Minuman, Makanan, Snack)
- 🧺 Keranjang belanja dengan update qty
- 💙 Pembayaran via DANA (manual konfirmasi)
- 📸 Upload bukti transfer
- 🧾 Struk belanja (Print & Download PDF)
- 📧 Notifikasi otomatis ke Gmail
- 📊 Data order masuk ke Google Sheets

---

## 🚀 Cara Deploy ke GitHub Pages

### Langkah 1: Upload ke GitHub
```bash
git init
git add .
git commit -m "Dar Yusuf Café - first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/dar-yusuf-cafe.git
git push -u origin main
```

### Langkah 2: Aktifkan GitHub Pages
1. Buka repo di GitHub
2. Klik **Settings** → **Pages**
3. Source: **Deploy from branch** → branch: **main** → folder: **/ (root)**
4. Klik **Save**
5. Website live di: `https://USERNAME.github.io/dar-yusuf-cafe`

---

## 🔔 Setup Notifikasi Google (Gmail & Sheets)

### Langkah 1: Buat Google Spreadsheet
1. Buka [sheets.google.com](https://sheets.google.com)
2. Buat spreadsheet baru, beri nama "Dar Yusuf Café Orders"
3. Copy **Spreadsheet ID** dari URL:
   `https://docs.google.com/spreadsheets/d/**INI_SPREADSHEET_ID**/edit`

### Langkah 2: Setup Google Apps Script
1. Buka [script.google.com](https://script.google.com)
2. Klik **New Project**
3. Hapus kode yang ada, paste isi file `google-apps-script.js`
4. Ganti `SPREADSHEET_ID` dengan ID spreadsheet kamu
5. Klik **Save** (Ctrl+S), beri nama project "Dar Yusuf Café Notifikasi"

### Langkah 3: Deploy Script
1. Klik **Deploy** → **New Deployment**
2. Pilih type: **Web App**
3. Description: "v1"
4. Execute as: **Me**
5. Who has access: **Anyone**
6. Klik **Deploy**
7. **Copy URL** yang muncul (bentuknya: https://script.google.com/macros/s/...)

### Langkah 4: Hubungkan ke Website
Buka website kamu di browser, tekan **F12** (Console), ketik:
```javascript
localStorage.setItem('dyc_gas_url', 'PASTE_URL_SCRIPT_DISINI')
```
Tekan Enter. Selesai! ✅

### Langkah 5: Test
Jalankan fungsi `testNotifikasi()` di Google Apps Script Editor untuk memastikan email dan sheets berjalan.

---

## 💙 Cara Ganti Nomor DANA

Edit file `checkout.html`, cari baris:
```html
<p style="font-size:1.3rem;font-weight:700;color:#118fda">0857111594005</p>
```
Ganti dengan nomor DANA kamu.

---

## 🍽️ Cara Tambah/Edit Menu

Edit file `js/products.js`:
```javascript
{ 
  id: 18,                    // ID unik
  nama: "Nama Menu",         // Nama produk
  emoji: "🍰",               // Emoji produk
  harga: 25000,              // Harga dalam Rupiah
  kategori: "snack",         // minuman / makanan / snack
  deskripsi: "Deskripsi produk di sini" 
}
```

---

## 📁 Struktur File
```
dar-yusuf-cafe/
├── index.html              ← Halaman utama + menu
├── cart.html               ← Keranjang belanja
├── checkout.html           ← Form checkout + bayar DANA
├── success.html            ← Struk belanja
├── css/
│   └── style.css           ← Semua styling
├── js/
│   ├── products.js         ← Data menu
│   ├── cart.js             ← Logika keranjang
│   ├── main.js             ← Render produk
│   ├── checkout.js         ← Proses checkout
│   └── success.js          ← Tampil struk + PDF
├── google-apps-script.js   ← Kode untuk Google Apps Script
└── README.md               ← Panduan ini
```

---

## ✅ Alur Pemesanan
1. Customer buka website → pilih menu
2. Tambah ke keranjang
3. Checkout → isi data diri
4. Lihat nomor DANA, transfer manual via app DANA
5. Upload foto bukti transfer
6. Klik "Konfirmasi Pesanan"
7. Struk muncul → bisa Print atau Download PDF
8. Notifikasi otomatis masuk ke Gmail & Google Sheets kamu

---

Made with ❤️ for Dar Yusuf Café
