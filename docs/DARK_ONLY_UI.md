# Dark mode dan tombol utama putih

Revisi ini memakai dark mode sebagai satu-satunya tampilan. Pilihan light mode lama di browser tidak lagi digunakan. HTML awal dan CSS sudah memakai warna gelap sebelum JavaScript berjalan.

Baris atas login berisi Employer Risk Intelligence dan tombol Tema dihapus. Tombol Tema pada workspace juga dihapus. Tombol utama menjadi putih dengan teks gelap; hover, focus, border, dan popup mengikuti palet netral. Warna risiko/verifikasi tetap menunjukkan status. Seri grafik pertumbuhan peserta memakai putih dan aktivitas usaha memakai biru agar mudah dibedakan.

Tidak ada perubahan API, database, environment variable, atau dependency.

## Pemasangan

Gunakan paket update `PDUK-Radar-Dark-Only-UI.zip`. Setelah PR #10 digabung, perbarui main dan buat branch sebelum menyalin file:

```bash
git switch main
git pull origin main
git switch -c feat/dark-only-monochrome
```

Ekstrak seluruh isi ZIP ke root project, sejajar package.json, dan timpa file sesuai foldernya. Paket memuat frontend lengkap beserta revisi sebelumnya. Konfigurasi database dan file environment tidak disertakan.

Kemudian jalankan:

```bash
npm test
npm run build
git add app/layout.tsx public/ui tests/password-reset-theme.test.js tools/prepare-theme-qa.mjs docs/DARK_ONLY_UI.md
git commit -m "feat: use dark-only UI with white primary actions"
git push -u origin feat/dark-only-monochrome
```

Buat Pull Request ke main, lalu merge setelah pemeriksaan berhasil. Setelah deployment Ready, muat ulang dengan Ctrl + Shift + R.

## Verifikasi

50 pengujian berhasil, termasuk perubahan perilaku tema dan pemeriksaan reset password yang sudah ada. Build Next.js/TypeScript berhasil. Browser QA pada tujuh halaman dan dua ukuran layar (390/1440 px) menunjukkan dark mode tetap aktif, tanpa kontrol Tema atau baris atas login, dan tanpa overflow halaman atau kontrol form keluar dari layar. Dashboard dan login diperiksa secara visual. Pengujian visual memakai fixture lokal; database produksi tidak diubah.

Belum dilakukan push atau deployment.
