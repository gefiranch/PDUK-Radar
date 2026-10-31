# Pembaruan UI PDUK-Radar

Paket ini berisi seluruh frontend yang konsisten, termasuk logo, sidebar besar/kecil, navigasi langsung, growth chart, warna koreksi, serta login sederhana dari pembaruan sebelumnya. Ekstrak ke root project dan timpa file dengan path yang sama. Jangan mengganti seluruh folder project; konfigurasi lokal tetap digunakan.

## Tampilan dan alur

- Inter tetap menjadi font utama. Judul, teks isi, label, teks bantuan, angka, dan header tabel menggunakan hierarki ukuran yang sama pada seluruh halaman.
- Warna latar, kartu, kontrol, border, dan teks mengikuti tema. Grafik memakai warna risiko yang sama dengan badge; garis dan label grafik menyesuaikan mode terang/gelap.
- Ikon fitur tetap solid. Search dan ikon arah memakai garis dengan ukuran serta ketebalan yang konsisten. Tombol ikon, tombol utama, pencarian, dropdown, dan fokus keyboard disamakan.
- Dashboard mempertahankan seluruh angka dan akses filter. Dua ringkasan antrean dipindahkan ke kartu Status verifikasi; tiga kartu penanganan dibuat lebih padat agar grafik lebih cepat terlihat.
- Grid filter, tabel, profil perusahaan, penjelasan skor, antrean verifikasi, formulir pengguna, popup, dan login memakai jarak serta radius yang selaras.
- Antrean verifikasi berubah menjadi daftar horizontal pada layar yang lebih sempit; halaman tetap tidak melebar. Tabel yang lebar tetap dapat digulir di dalam area tabel.
- Bagian detail yang sedang dibaca ditandai pada navigasi bagian. Escape menutup sidebar mobile dan mengembalikan fokus ke tombol menu. Menu pengguna memperhitungkan ukuran sebenarnya agar tetap di dalam layar.
- Animasi masuk dipersingkat menjadi 300 ms, dengan stagger maksimal 90 ms. Kelompok konten di bawah layar mendapat animasi saat terlihat. Observer dibersihkan ketika halaman diganti atau sesi berakhir. Pengaturan reduced motion tetap dihormati.
- Beberapa kalimat pengantar dipersingkat, kapitalisasi label disamakan, dan keterangan penyimpanan pada Tentang diperbarui sesuai PostgreSQL di Supabase.

Enum sumber, skor, data perusahaan, alur penyimpanan, otorisasi admin/user, dan endpoint tidak diubah. Tidak ada dependency atau SQL baru.

## Git

Buat branch sebelum menyalin file:

```bash
git switch -c feat/ui-refinement
```

Jika branch sudah ada, gunakan `git switch feat/ui-refinement`. Setelah menyalin seluruh isi paket:

```bash
npm test
npm run build
git add public/ui app/layout.tsx tests tools/prepare-theme-qa.mjs docs/UI_REFINEMENT.md
git commit -m "feat: refine workspace layout, typography, colors and motion"
git push -u origin feat/ui-refinement
```

Buat Pull Request ke main dan merge untuk deployment Vercel. Setelah deployment Ready, buka situs dan tekan Ctrl + Shift + R.

## Pemeriksaan

50 tes dan build Next.js/TypeScript lulus. Tes label disesuaikan dengan kapitalisasi baru; pemeriksaan enum, antrean, histori, dan validasi tetap dipertahankan.

Browser QA memeriksa 7 halaman pada 4 lebar (390, 768, 1024, 1440 px) dan 2 tema: 56 kombinasi tanpa overflow halaman atau kontrol form yang keluar layar. Area tabel dan antrean memang memiliki scroll internal.

Alur aplikasi aktual dengan API fixture dipakai untuk memeriksa navigasi bagian detail, menu pengguna, popup edit, konfirmasi nonaktifkan, sidebar besar/kecil, dan Escape pada mobile. Logo sidebar ringkas tetap memiliki selisih titik tengah 0 px pada sidebar 80 px. Tidak ada error aplikasi pada alur tersebut.

Pemeriksaan menggunakan fixture lokal tanpa login produksi dan tanpa perubahan database. Belum dilakukan push atau deployment; latensi Supabase/Vercel produksi tidak diukur.
