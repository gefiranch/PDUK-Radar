# Tema netral PDUK-Radar

Paket ini mengubah tampilan ke hitam, abu-abu, dan putih dengan aksen hijau pada aksi utama. Tema gelap dan terang, grafik, form, sidebar, popup, dan halaman login memakai palet yang sama. Warna status risiko tetap dibedakan. Tidak ada perubahan database, API, atau dependency.

## Pemasangan

Ekstrak seluruh isi `PDUK-Radar-Neutral-UI.zip` ke root project, sejajar dengan `package.json`. Timpa file dengan path yang sama. Paket mencakup frontend lengkap agar pembaruan sidebar, favicon, grafik, dan transisi sebelumnya ikut tersedia. File environment tidak disertakan; pertahankan konfigurasi lokal dan Vercel yang sudah bekerja.

File yang berubah khusus pada revisi tone ini:

```text
public/ui/src/styles/themes.css
public/ui/assets/brand-mark.svg
public/ui/assets/favicon.svg
app/layout.tsx
```

Logo menjadi monokrom dan favicon menggunakan versi cache `v=3`. Radius dibuat lebih tenang, border tipis, bayangan dikurangi, dan navigasi aktif menggunakan latar abu-abu. Tombol utama serta highlight interaksi menggunakan hijau. Grafik pertumbuhan membedakan peserta dengan hitam/putih dan aktivitas usaha dengan hijau.

## Command Git

Dari folder project, buat branch sebelum menyalin file:

```bash
git switch -c feat/neutral-dashboard-tone
```

Jika branch sudah ada, gunakan `git switch feat/neutral-dashboard-tone`.

Setelah menyalin seluruh isi paket:

```bash
npm run build
git status --short
git add public/ui app/layout.tsx tests tools/prepare-theme-qa.mjs docs/NEUTRAL_THEME.md
git commit -m "feat: apply neutral dashboard theme with green accents"
git push -u origin feat/neutral-dashboard-tone
```

Buat Pull Request ke `main` lalu merge agar Vercel menerapkan pembaruan. Setelah deployment berstatus Ready, tekan Ctrl + Shift + R. Tidak perlu query SQL atau perubahan environment variable.

## Verifikasi

- Build produksi Next.js dan TypeScript berhasil.
- Pemeriksaan browser pada tujuh halaman, dua tema, dan dua ukuran layar (390/1440 px), total 28 kombinasi, tidak menemukan overflow halaman atau kontrol form keluar dari layar.
- Dashboard, login, dan penjelasan skor diperiksa secara visual. Tidak ada error aplikasi pada console halaman yang diperiksa.
- Pengujian memakai fixture lokal tanpa koneksi database produksi; login Supabase produksi tidak diuji ulang untuk revisi visual ini.

Belum dilakukan push atau deployment.
