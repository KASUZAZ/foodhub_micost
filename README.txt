FOODHUB MICOST - STATIC WEBSITE + SUPABASE

Projek ini tidak guna PHP, XAMPP, Apache, atau MySQL local.
Ia dibina menggunakan teknologi asas sahaja dan sudah disediakan sambungan Supabase:

1. HTML
2. CSS
3. JavaScript
4. Supabase untuk database cloud
5. localStorage sebagai fallback jika Supabase belum dikonfigurasi

Fail utama:

1. index.html
2. assets/css/style.css
3. assets/js/app.js
4. assets/img/
5. assets/js/supabase-config.js
6. supabase-setup.sql

Cara buka projek:

1. Buka folder foodhub_micost.
2. Double-click index.html.
3. Website akan terus dibuka dalam browser.

Cara sambung Supabase:

1. Buka Supabase project kasuzaz.
2. Pergi SQL Editor.
3. Copy semua isi fail supabase-setup.sql dan tekan Run.
4. Pergi Project Settings > API.
5. Copy Project URL dan publishable key atau anon public key.
6. Buka assets/js/supabase-config.js.
7. Isi seperti ini:

window.FOODHUB_SUPABASE = {
  url: 'https://PROJECT-ID.supabase.co',
  anonKey: 'PUBLISHABLE_OR_ANON_PUBLIC_KEY',
  tableName: 'foods',
  storageBucket: 'food-images'
};

Nota penting:

- Guna publishable key atau anon public key sahaja dalam website.
- Jangan letak service_role key dalam frontend atau Netlify public deploy.
- Admin login sekarang masih demo: admin / admin123.
- Untuk sistem production sebenar, admin login patut ditukar kepada Supabase Auth dan policy lebih ketat.

Cara deploy ke Netlify:

1. Pastikan assets/js/supabase-config.js sudah ada URL dan publishable/anon key Supabase.
2. Buka https://app.netlify.com/drop
3. Drag folder foodhub_micost ke Netlify.
4. Netlify akan beri link website.

Fungsi yang ada:

1. Home page seperti contoh FoodHub.
2. Menu makanan dengan gambar.
3. Kategori makanan.
4. Search makanan.
5. Special deals.
6. Add to cart.
7. Order melalui WhatsApp.
8. Seller form untuk tambah menu demo.
9. Seller form simpan menu ke Supabase jika config aktif.
10. Admin boleh tukar status Available, Sold Out, Expired dan Delete.

Nota:

- Jika Supabase config kosong atau table belum dibuat, website akan guna localStorage supaya demo masih berjalan.
- Data localStorage hanya tersimpan di browser pengguna.
