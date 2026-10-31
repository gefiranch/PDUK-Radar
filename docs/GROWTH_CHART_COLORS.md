# Grafik perkembangan peserta, warna koreksi, dan login

Ekstrak seluruh isi ZIP ke root project dan timpa file dengan path yang sama. Paket ini menggabungkan pembaruan growth chart, warna koreksi, dan penyederhanaan panel login. Paket growth chart sebelumnya tidak perlu dipasang terpisah. Pembaruan ini melanjutkan revisi animasi/navigasi sebelumnya.

File aplikasi yang wajib ikut:

```text
public/ui/src/components/charts.js
public/ui/src/pages/EmployerDetail.js
public/ui/src/pages/Login.js
public/ui/src/styles/themes.css
```

## Perubahan

- Bagian perkembangan kepesertaan menggunakan grafik batang horizontal: pertumbuhan peserta (ungu) dan aktivitas usaha (hijau), pada skala persen yang sama.
- Nilai nol ditandai titik pada garis nol; nilai negatif digambar ke kiri garis nol. Data yang tidak tersedia tidak ditampilkan sebagai nol.
- Durasi tanpa perubahan peserta ditampilkan terpisah dalam bulan agar tidak dicampur dengan skala persentase.
- Grafik memakai indikator pertumbuhan 12 bulan yang sudah tersedia. Tidak ada rekayasa titik histori bulanan. Jika histori bulanan memang tersedia, grafik historinya tetap ditampilkan dengan keterangan sumber/ilustrasi.
- Kotak alasan koreksi memakai latar aksen lembut sesuai tema. Label, placeholder, input, teks bantuan, dan fokus mengikuti warna tema terang/gelap.
- Tiga poin fitur dan tulisan Employer Risk Intelligence pada bagian bawah panel login dihapus, sesuai gambar referensi.
- Tidak ada perubahan dependency, API, database, environment variable, atau SQL.

## Git

Buat branch sebelum menyalin file:

```bash
git switch -c fix/growth-chart-colors
```

Setelah menyalin seluruh isi ZIP:

```bash
npm test
npm run build
git add public/ui/src/components/charts.js public/ui/src/pages/EmployerDetail.js public/ui/src/pages/Login.js public/ui/src/styles/themes.css tests/growth-chart.test.js docs/GROWTH_CHART_COLORS.md
git commit -m "fix: add growth chart, improve correction colors and simplify login"
git push -u origin fix/growth-chart-colors
```

Buat PR ke main, lalu merge untuk deployment Vercel. Setelah Ready, buka situs dan tekan Ctrl + Shift + R.

## Verifikasi

50 tes dan build Next.js/TypeScript lulus. Cakupan mencakup nol, angka negatif, nilai hilang, serta render seluruh 500 perusahaan. Grafik diperiksa pada tema gelap dan layar mobile 390 px pada tema terang tanpa overflow horizontal. Warna koreksi diperiksa pada kedua tema; kontras teks bantuan terhadap latar kotaknya melewati 4,5:1.

Pemeriksaan visual memakai komponen aktual pada fixture lokal tanpa login/API. Belum dilakukan push atau deployment.
