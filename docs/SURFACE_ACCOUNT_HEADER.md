# Surface, tipografi, dan akun

## Perubahan

- Surface utama menggunakan `#0A0A0A`. Background halaman tetap `#090909`.
- Geist Sans variable disimpan lokal di `public/ui/assets/fonts/`, beserta lisensi SIL Open Font License. Tidak ada dependency baru atau permintaan font ke layanan luar.
- Hierarki judul, teks, label, tabel, tombol, serta spacing menggunakan ukuran yang konsisten dan skala jarak 4 px. Tombol utama tetap putih, dengan warna risiko/verifikasi yang terpisah.
- Periode data dashboard tampil sebagai label dan tanggal, tanpa bentuk tombol. Bulan/tahun data dipertahankan.
- Topbar semua halaman workspace menampilkan avatar inisial bulat, nama akun, role Admin/User, dan tombol logout. Nama panjang dipotong secara visual; nama lengkap tersedia saat diarahkan. Profil dan role tetap terlihat di mobile.
- Logout membuka konfirmasi. Batal/Escape tidak mengirim permintaan logout. Perubahan form yang belum disimpan ditampilkan dalam peringatan. Setelah dikonfirmasi, tombol menampilkan proses keluar; jika permintaan gagal, sesi tetap dipertahankan dan tombol dapat dicoba lagi. Setelah berhasil, pengguna kembali ke login.

Referensi: https://vercel.com/geist/colors, https://vercel.com/geist/typography, https://vercel.com/font.

Font bersumber dari repo resmi https://github.com/vercel/geist-font, file `fonts/Geist/webfonts/Geist[wght].woff2`, blob `71dab8bedba3bfef5dccd7875ed05cac44c7345d`.

## Pemasangan dan Git

Pastikan PR revisi sebelumnya sudah digabung terlebih dahulu. Sebelum menyalin file, perbarui main dan buat branch baru:

```bash
git switch main
git pull origin main
git switch -c feat/surface-account-header
```

Ekstrak `PDUK-Radar-Surface-Account-UI.zip` ke root project, sejajar dengan package.json. Timpa file sesuai foldernya. Paket berisi frontend lengkap agar seluruh import dan aset font tersedia. Konfigurasi database dan environment tidak disertakan.

Kemudian:

```bash
npm test
npm run build
git add app/layout.tsx public/ui tools/prepare-theme-qa.mjs docs/SURFACE_ACCOUNT_HEADER.md
git commit -m "feat: refine surfaces typography and account header"
git push -u origin feat/surface-account-header
```

Buat Pull Request ke main, tunggu pemeriksaan Vercel berhasil, lalu merge. Setelah deployment Ready, muat ulang dengan Ctrl + Shift + R.

Tidak ada perubahan SQL, dependency, atau konfigurasi autentikasi. Belum dilakukan push atau deployment.

## Pemeriksaan

50 pengujian yang sudah tersedia berhasil. Build produksi Next.js/TypeScript berhasil. Pemeriksaan browser pada tujuh halaman dan empat ukuran layar (390/768/1024/1440 px) tidak menemukan overflow halaman atau kontrol form keluar dari layar; profil dan role terlihat, serta periode dashboard tetap tampil pada mobile. Browser juga memastikan surface bernilai rgb(10,10,10), sedangkan canvas tetap #090909.

Alur logout diuji melalui mock lokal: membuka konfirmasi tidak mengirim permintaan, Batal mempertahankan isian, konfirmasi mengirim satu permintaan dan kembali ke login, serta kegagalan mempertahankan akun dan mengaktifkan kembali tombol. Tidak ada sesi atau database produksi yang diubah saat QA.
