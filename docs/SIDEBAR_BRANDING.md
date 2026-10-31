# Interval skor, sidebar, dan favicon

Ekstrak seluruh isi ZIP ke root project dan timpa file dengan path yang sama. Paket ini dipasang setelah pembaruan UI refinement.

File aplikasi:

```text
app/layout.tsx
public/ui/assets/favicon.svg
public/ui/src/pages/EmployerRanking.js
public/ui/src/styles/themes.css
```

Label Interval skor di bawah filter tidak ditampilkan lagi. Filter rentang skor dari prioritas/histogram tetap bekerja; tombol Reset filter tetap dapat menghapus filter.

Logo dan nama PDUK-Radar rata kiri mengikuti posisi ikon menu, label Workspace, dan Tentang. Logo sidebar terbuka berukuran 28 px dengan nama 19 px (18 px pada layar lebih sempit). Pada sidebar ringkas, logo 30 px tetap di tengah. Perataan juga disesuaikan untuk tablet dan mobile.

Favicon memakai file terpisah dengan padding transparan. Simbol mengisi sekitar 12 px dalam area ikon 16 px. Nama file baru dan parameter v=2 membantu browser mengambil ikon terbaru. Logo di halaman login tidak diubah.

## Git

Buat branch sebelum menyalin file:

```bash
git switch -c fix/sidebar-branding
```

Jika branch sudah ada gunakan `git switch fix/sidebar-branding`. Setelah menyalin file:

```bash
npm run build
git add app/layout.tsx public/ui/assets/favicon.svg public/ui/src/pages/EmployerRanking.js public/ui/src/styles/themes.css docs/SIDEBAR_BRANDING.md
git commit -m "fix: hide score interval and align sidebar branding"
git push -u origin fix/sidebar-branding
```

Buat Pull Request ke main dan merge untuk deployment Vercel. Setelah Ready, muat ulang situs dengan Ctrl + Shift + R.

## Pemeriksaan

Build Next.js/TypeScript berhasil. Render prioritas tidak lagi memuat label Interval skor dan filter tetap menghasilkan perusahaan dengan skor di atas 60. Browser QA menunjukkan 18 hasil prioritas pada fixture.

Posisi kiri logo dan ikon menu memiliki selisih 0 px pada desktop serta viewport 900/390 px. Logo sidebar ringkas memiliki selisih titik tengah 0 px pada lebar sidebar 80 px. Tidak ditemukan overflow halaman atau wordmark.

Tidak ada perubahan API atau database. Belum dilakukan push atau deployment.
