# Penerapan, migrasi, dan serah terima GitHub

Tidak ada deployment, migrasi remote, push main atau merge yang dilakukan pada revisi ini. Baseline main `eacaab94b127c29090654eb96208ac6dc2ea12d0`. Integrasi GitHub menolak create branch dengan 403 `Resource not accessible by integration`. Hak akses metadata repository tidak menjamin scope write integrasi tersedia. Tidak ada PR URL yang berhasil dibuat.

## Terapkan patch dan buat PR

Arsip source berisi file lengkap yang sudah direvisi. Patch mbox berisi commit terkelompok dan dapat diterapkan ke checkout baseline; jangan menyalin node_modules, state database, secret, atau dist.

```bash
git fetch origin
git switch -c feat/pduk-radar-full-revision eacaab94b127c29090654eb96208ac6dc2ea12d0
git am /path/to/PDUK-Radar-revision.patch
npm ci
npm test
npm run lint
npx tsc --noEmit
python tools/validate_data.py
npm run build
npm run test:worker
git push -u origin feat/pduk-radar-full-revision
gh pr create --base main --head feat/pduk-radar-full-revision --title "feat: comprehensive PDUK Radar revision for Healthkathon 2026" --body-file docs/PULL_REQUEST.md
```

Jika main berubah, rebase branch dan selesaikan konflik secara ditinjau sebelum mengulang checks. Gunakan kredensial GitHub pemilik yang memiliki write access; file ini tidak menyertakan token. Jangan merge otomatis. Selesaikan browser QA yang masih terbuka sebelum menyatakan PR siap merge.

## Migrasi staging sebelum deployment

1. Tinjau dan backup database staging/produksi sesuai prosedur pemilik; konfirmasi migrasi 0000/0001 sudah ada.
2. Terapkan **hanya migrasi baru `drizzle/0002_case_records.sql`** pada database yang sudah punya 0000/0001. File lama tidak berubah. Metadata snapshot/journal 0002 juga disertakan untuk generasi berikutnya. Trigger append-only dibuat lewat SQL migrasi, tidak lewat Drizzle schema generation.
3. Untuk database lokal baru, jalankan 0000 → 0001 → 0002 sesuai README. Untuk remote, gunakan konfigurasi Wrangler yang terhubung database sebenarnya; ID placeholder pada build lokal bukan ID database produksi. Jangan menjalankan perintah remote terhadap binding placeholder.
4. Deploy kode Worker setelah migrasi berhasil. Kode baru membutuhkan kedua tabel; jika belum dimigrasi, API gagal dan UI tidak beralih diam-diam ke localStorage.
5. Login admin/user staging dan jalankan checklist browser pada TEST_REPORT. Periksa aktor, konflik 409, refresh dan sesi akun lain. Baru ajukan persetujuan deployment produksi secara terpisah.

Tidak ada secret baru. Binding `DB`, cookie/session, secret inisialisasi akun testing dan project ID tetap memakai konfigurasi yang ada. Jangan memasukkan `.dev.vars` atau database lokal ke Git. Password akun testing diambil dari secret runtime; tidak menimpa hash akun yang sudah diinisialisasi.

## Kompatibilitas dan rollback

Migrasi bersifat aditif dan tidak mengubah CSV, akun, sesi, atau skor. UI mode utama mengabaikan localStorage lama; tidak ada migrasi otomatis. Catatan lama hanya ada pada browser asal dan harus ditinjau manual sebelum dipindah dengan persetujuan. Tidak ada fitur impor dalam revisi ini.

Rollback aplikasi ke versi lama dapat dilakukan tanpa DROP tabel baru, tetapi aplikasi lama hanya melihat catatan lokal dan tidak menampilkan state D1 baru. Pertahankan tabel/audit serta backup, lalu kembali ke kode baru untuk memulihkan tampilan state tersebut. Tidak ada rollback destruktif otomatis; jangan menghapus audit untuk mengatasi konflik.

Hak akses kasus saat ini: seluruh admin dan user aktif dapat memperbarui seluruh 500 perusahaan sintetis. Ini sesuai alur akademik saat ini; tidak menyediakan assignment per petugas atau jaminan kesiapan data pribadi produksi. Pengunggahan bukti, pipeline penilaian ulang dan integrasi pemerintah belum tersedia.
