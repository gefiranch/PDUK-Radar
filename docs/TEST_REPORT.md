# Hasil uji revisi komprehensif

Baseline: `eacaab94b127c29090654eb96208ac6dc2ea12d0`. Hasil lama pada file JSON/screenshot lain adalah historis dan tidak mewakili revisi ini.

| Pemeriksaan | Status dan bukti |
| --- | --- |
| `npm test` | 36 lulus, 0 gagal; termasuk render 500 perusahaan, D1 atomik/konflik, 105 event/pagination, remote store ACK/error, isolasi demo |
| `npm run lint` | Lulus, 0 error/0 warning ESLint |
| `npx tsc --noEmit` | Lulus |
| `python tools/validate_data.py` | 17 pemeriksaan lulus; dua SHA newline diverifikasi eksplisit, semua nilai/distribusi tetap |
| `npm run build` | Worker/Vinext build lulus, route kasus/demo tersedia |
| `npm run test:worker` | 40 pemeriksaan HTTP lulus: login admin/user, API auth/role/origin, akun baru, nonaktif/aktif/expired session, validasi, konflik, penutupan/reopen, pembacaan silang user, sumber immutable |
| Migrasi | 0000/0001/0002 diterapkan pada D1 emulator terisolasi; 0000/0001 asli tidak diubah |
| Source/dataset | CSV dan ketiga JSON snapshot identik dengan baseline; distribusi 369/109/16/6 |
| Browser produksi sebelum edit | Login aktual diamati dan screenshot tersimpan; workspace membutuhkan sesi |
| Browser revisi, refresh UI, keyboard, console, responsive 390/768/1024/1440 | BELUM TERVERIFIKASI — akses preview browser terhambat; tidak ada screenshot after baru |
| D1 hosting produksi / cross-device hosting | BELUM DIJALANKAN — tidak ada deployment atau migrasi remote |
| Push/PR GitHub | TERBLOKIR — create branch 403 integrasi, alternatif patch/ZIP tersedia |

`full-revision-tests.json` berisi ringkasan mesin hasil terakhir. Fixture API memakai akun sintetis hanya dalam database ephemeral; tidak memerlukan secret hosting. Uji gagal awal (wrapper shell permission, hash newline, konfigurasi Miniflare dynamic modules) telah diperbaiki sebelum run akhir. Kegagalan akses browser dan write GitHub tetap terbuka, tidak disamarkan sebagai lulus.

## Checklist manual sebelum merge

1. Masuk sebagai admin dan user pada staging yang sudah dimigrasi 0002. Pastikan nav Kelola pengguna hanya untuk admin; tambah user, edit popup, nonaktif/aktif dan login user baru.
2. Buka dashboard → prioritas/peringkat; cari EMP-0348. Pastikan filter, sorting, pagination dan ekspor sesuai hasil.
3. Buka Detail → tujuh section → Penjelasan Skor → popup metode/kategori → Verifikasi; ID tetap EMP-0348. Nilai 83,25/83,19 dibedakan dan tidak dipaksa cocok.
4. Simpan Sesuai dengan catatan. Pastikan sukses hanya setelah server; cek Dashboard/Peringkat/Detail/Kasus Selesai, refresh dan akun lain. Skor tetap Critical.
5. Buka kembali dengan alasan; pastikan history dan aktor tercatat. Uji EMP-0221 Tidak Sesuai → Tuntas + catatan → buka kembali + alasan.
6. Dua tab mengedit versi sama; satu sukses, lainnya 409, draft tidak hilang. Perbarui data harus meminta konfirmasi bila ada draft.
7. Aktifkan demo hanya lewat Tentang/konfirmasi; cek banner, histori sintetis dan alokasi bukan output model. Simpan latihan, keluar demo; state D1 tidak berubah.
8. Pada 390, 768, 1024, 1440 px: periksa overflow, tabel dalam scroll container, dropdown/input/search/padding, sidebar mobile, keyboard/fokus/dialog dan kontras. Ambil screenshot after dan periksa console sebelum menyatakan browser QA lulus.
