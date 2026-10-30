# Status verifikasi tunggal dan menu pengguna

30 Oktober 2026, Asia/Jakarta.

## Perubahan

Badge dan kolom Status kasus tambahan dihapus dari queue, profil, ranking, dashboard, serta panel hasil. Setiap item kembali memakai satu status verifikasi; risiko dan antrean tetap mengikuti mekanisme yang sudah ada. Catatan, histori, persistence, koreksi, dan pemisahan tindak lanjut dipertahankan.

Kelola pengguna memakai menu titik tiga untuk user biasa: Edit dan Nonaktifkan; akun nonaktif memakai Edit dan Aktifkan. Menu berada di top layer agar tidak terpotong tabel, mendukung Escape, klik luar, navigasi keyboard, dan aria-expanded. Edit memakai dialog nama/email dengan validasi dan pesan error inline. Nonaktifkan/Aktifkan meminta konfirmasi nama/email sebelum request dikirim. Batal tidak mengubah akun.

API PATCH memeriksa admin di server, memblokir perubahan akun admin, menolak role/status/password/identitas pada operasi edit, menormalisasi nama/email, dan menolak email ganda. Perubahan email mencabut sesi dan tidak mengubah kata sandi. Tindakan dicatat pada audit akun; tidak ada migrasi database.

## Validasi

- 28 unit/regression test mencakup kebijakan edit, otorisasi, password/sesi, dan seluruh fungsi data/verifikasi. Kelima skenario status dan render 500 perusahaan tetap diperiksa.
- TypeScript, sintaks JavaScript, dan build Worker lulus.
- Browser memakai aplikasi aktual, API, D1 lokal, dan cookie sesi asli dengan akun QA tersendiri.
- Batal edit mempertahankan data; email admin yang sudah terdaftar ditolak inline. Nama/email baru tersimpan setelah reload. Login berhasil dengan email baru dan kata sandi lama; email lama ditolak. User biasa tidak dapat list/edit akun.
- Batal nonaktivasi mempertahankan Aktif. Konfirmasi mengubah Nonaktif dan login ditolak 403. Aktivasi kembali memulihkan login.
- Escape menutup menu. Pada lebar 390 px, menu berada dalam batas konten dan popup edit berjarak 12 px dari sisi layar.
- 16 pemeriksaan tampilan: ranking, verification, detail, explainability × 390/768/1071/1440 px; tanpa overflow, tanpa badge/kolom kasus tambahan, dan satu status per baris/profil/form.
- Hasil browser terinci: `user-menu-browser-tests.json`. Screenshot `pduk-user-actions.jpg`, `pduk-edit-user-popup.jpg`, `pduk-deactivate-confirmation.jpg` menampilkan data QA lokal, bukan akun produksi.

## Batas

Hosting diubah menjadi publik atas permintaan pemilik. Form login dapat dibuka tanpa gerbang ChatGPT; API data dan administrasi tetap dilindungi sesi/peran aplikasi. Pengujian fitur dilakukan pada preview lokal; publikasi diverifikasi melalui Sites. Verifikasi perusahaan tetap localStorage per akun/browser. Database dan fixture QA lokal tidak disajikan pada deployment.
