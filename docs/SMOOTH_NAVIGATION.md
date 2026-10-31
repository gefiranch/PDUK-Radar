# Navigasi langsung dan animasi PDUK-Radar

## Memasang

Ekstrak ZIP pembaruan ke root project, lalu timpa file dengan path yang sama. Jangan hanya menyalin main.js: file services/motion.js dan services/navigation.js juga wajib ikut agar import tidak gagal.

File aplikasi:

```text
public/ui/src/main.js
public/ui/src/services/motion.js
public/ui/src/services/navigation.js
public/ui/src/services/workspaceStore.js
public/ui/src/styles/themes.css
public/ui/src/components/ui.js
```

ui.js disertakan agar export logo brandMark tetap konsisten dengan main.js. Dokumen, fixture generator, dan tes juga disertakan. Tidak ada dependency atau perubahan database, environment variable, maupun SQL.

## Perubahan

- Perpindahan menu langsung menggambar halaman dari data yang telah dimuat. Pembaruan server berjalan setelahnya, tanpa menahan navigasi.
- Data pemeriksaan otomatis dianggap segar selama 15 detik dalam sesi yang sedang terbuka. Permintaan detail yang sama digabung jika masih berjalan. Tombol Perbarui data tetap meminta server secara langsung.
- Pemuatan awal tidak lagi mengambil daftar kasus dua kali. Pembaruan daftar dan detail berjalan paralel saat keduanya diperlukan.
- Respons navigasi lama tidak menggambar ulang halaman setelah pengguna memilih tujuan lain atau logout. Sinkronisasi tidak mengganti isian yang sedang diedit.
- Respons baca yang lebih lama tidak menimpa versi verifikasi yang lebih baru dan telah berhasil disimpan. Penulisan tetap menunggu konfirmasi server dan menggunakan expectedVersion.
- Halaman masuk dengan fade dan slide 380 ms; kartu ringkasan muncul berurutan dengan jeda maksimal 144 ms. Pencarian/filter pada halaman yang sama tidak mengulang animasi seluruh halaman.
- Tombol, kartu interaktif, baris tabel, ikon navigasi, sidebar besar/kecil, login, popup, serta menu pengguna memiliki gerakan singkat. Tidak ada penundaan buatan sebelum navigasi.
- Garis tipis di topbar memberi tanda saat sinkronisasi berlangsung. Jika gagal, halaman tetap dapat dilihat dan pesan kegagalan muncul.
- Pengaturan perangkat prefers-reduced-motion dihormati: animasi/transisi dekoratif dimatikan.

## Git

Dari main yang sudah memuat revisi logo/sidebar sebelumnya, buat branch sebelum menyalin file:

```bash
git switch -c feat/smooth-page-transitions
```

Setelah menyalin seluruh isi ZIP:

```bash
npm test
npm run build
git add public/ui/src/main.js public/ui/src/services/motion.js public/ui/src/services/navigation.js public/ui/src/services/workspaceStore.js public/ui/src/styles/themes.css public/ui/src/components/ui.js tests/navigation.test.js tests/workspace-store.test.js tools/prepare-theme-qa.mjs docs/SMOOTH_NAVIGATION.md
git commit -m "feat: add smooth transitions and instant page navigation"
git push -u origin feat/smooth-page-transitions
```

Buat PR dan merge ke main untuk deployment Vercel. Setelah deployment berstatus Ready, buka situs lalu lakukan Ctrl + Shift + R.

## Verifikasi

48 tes lulus, termasuk navigasi dengan API tertunda, respons antarhalaman yang datang tidak berurutan, logout saat ada permintaan aktif, perlindungan draft, deduplikasi permintaan, dan respons lama setelah hasil verifikasi disimpan. Build Next.js/TypeScript berhasil.

Browser QA menggunakan router dan komponen aplikasi aktual dengan API baca fixture yang diperlambat 1.200 ms. Dalam satu pemeriksaan, halaman tujuan sudah terlihat sekitar 125 ms setelah klik saat pembaruan API masih berlangsung; angka ini pengamatan lokal, bukan jaminan latensi produksi. Fade/slide halaman dan animasi popup dikonfirmasi di browser. Draft pemeriksaan tetap ada setelah sinkronisasi selesai. Sidebar mobile membuka/menutup dan navigasi berhasil pada lebar 390 px tanpa overflow horizontal.

Belum dilakukan push atau deployment. Kecepatan login dan koneksi database produksi tidak diukur dalam pengujian ini.
