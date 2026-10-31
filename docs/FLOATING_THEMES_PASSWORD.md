# Floating UI, light/dark, dan ganti password admin

31 Oktober 2026 (Asia/Jakarta). Dasar revisi: `origin/main` `b8758d1711954cf2aca6b04eafdea613800305a4`, yang sudah berisi PR #1/revisi sebelumnya. Branch lokal baru: `feat/admin-password-floating-themes`.

## Hasil

- Lapisan tampilan `public/ui/src/styles/themes.css` mempertahankan komponen dan konten PDUK-Radar. Sidebar/topbar mengambang, kartu bersih, sudut membulat, border tipis, Inter, aksen violet, dan dark charcoal. Login dibingkai dengan panel aurora sederhana sesuai referensi. Tidak ditambahkan konten finansial, OAuth, logo, kartu atau grafik fiktif dari referensi.
- Tema tersedia di login dan topbar; tersimpan dalam `pduk-radar:theme`. Nilai tersimpan mengalahkan preferensi sistem; pilihan tetap bekerja bila penyimpanan browser diblokir, tetapi tidak persisten dalam kondisi itu. Perubahan tema disinkron melalui storage event antartab. Tidak diperlukan konfigurasi server.
- Kelola pengguna: menu titik tiga user menyediakan **Ganti kata sandi**. Baris admin menyediakan tombol tersendiri, termasuk untuk akun sendiri. Popup berisi password baru, konfirmasi, serta tombol lihat/sembunyikan. Pesan sukses hanya tampil setelah ACK API; kegagalan tetap terlihat dalam popup. Password dibersihkan dari form ketika popup ditutup.
- `PATCH /api/users/:id`, `action=reset-password`, `password`, `confirmPassword`: hanya admin aktif, same-origin JSON, validasi 6–128 karakter dan konfirmasi; field ekstra ditolak. Hash PBKDF2 yang sudah digunakan tetap dipakai. Update hash, pencabutan seluruh sesi target, dan audit `password_reset` dilakukan dalam batch database. Audit/response tidak memuat password. Reset akun sendiri juga menghapus cookie dan kembali ke login. Password lama tidak diterima setelah reset; inisialisasi testing tidak menimpa password baru.
- Role/status/email tidak ikut berubah, user nonaktif tetap nonaktif, edit/aktivasi admin tetap terlindungi seperti sebelumnya. Tidak ada password plaintext atau secret runtime baru. Tidak memerlukan migrasi tambahan; prasyarat verifikasi kasus tetap 0002 dari revisi sebelumnya.

## Pengujian aktual

| Pengujian | Hasil |
| --- | --- |
| `npm test` | 39 lulus, 0 gagal. Tambahan validasi reset, fallback/persistensi tema, rendering aksi user/admin |
| `npm run test:worker` setelah build | 54 pemeriksaan HTTP lulus pada Worker + D1 emulator terisolasi. Termasuk reset user, password lama ditolak/baru diterima, pencabutan sesi, penolakan user/anonymous/cross-origin/mismatch/field tambahan, hash/audit, dan reset admin sendiri/cookie/login ulang |
| `npm run lint` | Lulus, 0 error/warning ESLint |
| `npx tsc --noEmit` | Lulus |
| `python tools/validate_data.py` | 17 pemeriksaan lulus; CSV, snapshot, skor dan distribusi tetap |
| `npm run build` | Lulus; fixture visual tidak ikut aset build |
| Browser aplikasi aktual | Login light/dark, pilihan tema setelah reload, dan tombol lihat/sembunyikan password diuji tanpa mengisi kredensial |
| Browser komponen visual | 48 kombinasi: 390/768/1024/1440 px × light/dark × dashboard/users/detail/explain/verification/login. Tidak ada overflow dokumen; pemindaian kontras teks terhadap background solid tidak menemukan rasio di bawah 4,5 (teks normal) / 3 (besar) setelah perbaikan |

Pemindaian kontras bukan sertifikasi aksesibilitas menyeluruh; background gradient, teks tersembunyi dan kontrol disabled tidak dihitung. Lihat `floating-responsive-results.json` untuk hasil per kombinasi.

## Bukti visual dan batas pengujian

- `screenshots/floating/login-light.jpg` dan `login-dark.jpg`: login aplikasi aktual pada preview lokal.
- `screenshots/floating/dashboard-dark-fixture.jpg` dan `password-modal-fixture.jpg`: fixture visual yang merender komponen dan fungsi popup dari source asli. Header memakai akun sintetis “Admin Visual QA”; **tidak memiliki sesi atau API aktif**. Screenshot tersebut membuktikan tampilan, bukan proses login/reset di browser end-to-end.
- Pengujian simpan password dilaksanakan lewat HTTP pada Worker/D1 terisolasi. Tidak ada password akun hosting yang diganti. Browser tidak digunakan untuk memasukkan kredensial atau mengubah password nyata.
- Console yang diamati memuat pesan error ekstensi browser; ini tidak dipakai sebagai klaim keberhasilan console aplikasi menyeluruh.
- Database/hosting produksi tidak diubah. Uji manual authenticated UI end-to-end dan deployment tetap menjadi langkah staging pemilik. Source ini tidak otomatis dipush, di-merge atau dipublish.

Untuk menjalankan fixture: `node tools/prepare-theme-qa.mjs`, lalu buka `/qa-theme-responsive.html?width=390&page=overview&theme=dark` pada preview development. Jalankan `node tools/prepare-theme-qa.mjs --clean` sebelum build. Guard build menolak fixture publik yang belum dibersihkan. HTML fixture diabaikan Git dan tidak disertakan pada ZIP/patch/source build.

## File utama dan penerapan

API reset: `lib/auth/password-reset.ts`, `app/api/users/[id]/route.ts`. UI: `main.js`, `UserManagement.js`, `Login.js`, `theme.js`, `themes.css`, shared icons, layout stylesheet. Tests: `password-reset-theme.test.js`, perluasan `test-worker-api.mjs`; fixture generator di tools. README dan Tentang diperbarui untuk menjelaskan fitur password.

Source lengkap dapat disalin ke checkout repository. Alternatif patch mbox diterapkan dari commit dasar di atas. Commit dan push pada branch baru, jangan langsung main:

```bash
git switch -c feat/admin-password-floating-themes
git add .
git commit -m "feat: add admin password reset and floating light dark themes"
git push -u origin feat/admin-password-floating-themes
```

Jika memakai patch, `git am PDUK-Radar-Floating-Themes.patch` sudah membuat commit; tidak perlu commit ulang. ZIP tidak menyertakan node_modules, dist, database lokal, .dev.vars, atau token. Gunakan secret testing dan binding DB milik lingkunganmu yang sudah ada.
