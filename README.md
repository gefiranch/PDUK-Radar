# PDUK-Radar

Employer Compliance Risk Intelligence System — Healthkathon 2026. Prototipe akademik dengan 500 perusahaan sintetis; bukan sistem resmi BPJS Kesehatan dan tidak terhubung dengan data pemerintah.

Frontend JavaScript dengan Inter, kartu, sidebar, tabel, grafik, dan warna risiko memakai shell React/Vinext, Cloudflare Workers, serta D1. Revisi mempertahankan arsitektur dan identitas visual sebelumnya.

Lihat [laporan revisi dan audit](docs/REVISION_DOSEN.md), [hasil uji](docs/TEST_REPORT.md), [kamus data](docs/DATA_DICTIONARY.md), [panduan demonstrasi](docs/DEMO_GUIDE.md), dan [penerapan/PR](docs/DEPLOYMENT_REVIEW.md). Laporan JSON dan screenshot lama di `docs/` adalah bukti historis, bukan hasil pengujian revisi ini.

## Fitur dan alur

- Dashboard: total 500, distribusi 369 rendah/109 sedang/16 tinggi/6 kritis, prioritas aktif, menunggu pemeriksaan, perlu data, tindak lanjut, kasus selesai. Kartu mengarah ke filter yang sesuai.
- Peringkat: pencarian ID, filter sebelum pagination 12 baris, sorting, dan ekspor CSV status efektif.
- Detail: tujuh bagian dengan navigasi — profil, pekerja/rasio pendaftaran, pembanding, perkembangan, penjelasan skor, verifikasi, tindak lanjut/penyelesaian.
- Penjelasan skor: enam kategori, indikator, bobot awal/efektif, estimasi atau kontribusi sumber bila tersedia; metode dan arti indikator pada popup informasi. Tiga fokus merupakan prioritas klarifikasi, bukan bukti pelanggaran.
- Verifikasi: form terhubung API, konfirmasi penyimpanan server, riwayat petugas, alasan koreksi dan konflik versi. Sidebar Kasus Selesai mendukung `#/completed/EMP-0348`.
- ID perusahaan dipertahankan antara Detail, Penjelasan Skor, dan Verifikasi. Skor analitik tidak berubah ketika kasus ditutup.

## Akun dan hak akses

| Peran | Hak akses |
| --- | --- |
| Admin aktif | Membaca dan memperbarui seluruh kasus sintetis; mengelola akun user |
| User aktif | Membaca dan memperbarui seluruh kasus sintetis; tanpa pengelolaan akun |
| Tanpa sesi / nonaktif | Tidak dapat membaca data perusahaan, demo, atau kasus |

Akun dibuat oleh admin; tidak ada pendaftaran mandiri. Kelola pengguna menyediakan tambah user dan menu titik tiga untuk popup edit serta konfirmasi aktivasi/nonaktivasi. API memeriksa ulang role; form tidak dapat membuat admin.

Password PBKDF2-SHA256 bersalt, token sesi acak disimpan sebagai hash, cookie HttpOnly/SameSite=Lax/Secure pada HTTPS, masa berlaku 8 jam. Nonaktivasi/logout mencabut sesi. Login dibatasi 8 kegagalan/15 menit per email/IP. Tidak ada password runtime dalam repository. Akun testing hanya diinisialisasi jika secret terkait tersedia dan belum memiliki hash.

## Status dan penyimpanan

| Hasil verifikasi | Daftar operasional |
| --- | --- |
| Pending / Under Review / Need More Data | Aktif |
| Verified Compliant | Selesai; catatan pemeriksaan menjadi catatan penutupan |
| Verified Non-Compliant + Pending / In Progress | Tindak lanjut |
| Verified Non-Compliant + Completed | Selesai; catatan penyelesaian wajib |

Perubahan hasil final memerlukan alasan koreksi. Membuka kembali tindak lanjut tuntas memerlukan alasan. Riwayat lama tetap tersimpan; tidak ada endpoint penghapusan kasus. Status sumber yang sudah final dapat belum memiliki catatan: UI menyatakan keterbatasannya, bukan membuat catatan palsu.

Mode utama membaca/menulis D1 melalui API terlindungi:

- `GET /api/cases`: state efektif yang pernah diperbarui; sisanya mengikuti status snapshot.
- `GET /api/cases/:id[?before=version]`: state dan 100 peristiwa terbaru; cursor untuk riwayat sebelumnya.
- `PATCH /api/cases/:id`: `action=verification|follow_up`, `expectedVersion` dan field formulir yang diizinkan.

Aktor dan waktu berasal dari server. Pemeriksaan versi, update state, dan penambahan audit dilakukan dalam batch D1 atomik. Konflik mengembalikan 409; UI mempertahankan draft dan meminta pengguna memuat ulang. Tidak ada fallback penyimpanan lokal bila server gagal. Data dimuat saat masuk, navigasi, fokus jendela jika tidak ada draft, atau **Perbarui data**. Ini sinkronisasi berbasis pembacaan ulang, bukan push real time. Tidak ada impor otomatis catatan localStorage lama atau penulisan ke CSV.

## Data dan metode

CSV dan tiga JSON snapshot tetap identik dengan baseline. File `data/source-provenance.json` menjelaskan perbedaan newline: Git main menyimpan CSV LF, sedangkan hash unggahan dalam snapshot berasal dari CRLF. Validator memeriksa kedua hash dan setiap nilai CSV; tidak mengubah data untuk meloloskan pemeriksaan.

`Skor = 100 × Σ(bobot efektif × nilai indikator)`; bobot awal 30%, 25%, 15%, 10%, 10%, 10%. Bobot dinormalisasi pada indikator yang tersedia. Tidak ada SHAP/LIME, probabilitas pelanggaran, atau klaim kausalitas. EMP-0348 tetap 83,25; rekonstruksi dari angka CSV yang dibulatkan 83,19, selisih 0,060 di atas toleransi 0,051. Kontribusi tidak dipaksa cocok.

Sumber tidak menyediakan seri bulanan, persentil, kontribusi resmi, rincian peringatan, atau dokumen bukti. Lampiran JSON baru berada di `data/demo/`, terpisah dan terlindungi `GET /api/demo`. Aktifkan melalui Tentang → Mode demonstrasi → konfirmasi. Banner selalu menunjukkan mode ini; refresh penuh kembali ke mode utama. Catatan latihan disimpan di key browser terpisah `pduk-radar:demo:v2:<user_id>`, tidak dikirim ke D1. Histori/posisi/peringatan/alokasi tambahan selalu disebut sintetis; `demo_score_contributions` tidak dipetakan ke `score_contributions` atau dipakai merekonsiliasi skor. Tombol skenario hanya mengisi draft untuk ditinjau, tidak menyimpan otomatis.

## Menjalankan dan menguji

Node.js >=22.13.0:

```bash
npm ci
npm test
npm run lint
npx tsc --noEmit
python tools/validate_data.py
npm run build
npm run test:worker
```

`test:worker` menguji Worker hasil build dengan D1 terisolasi, akun fixture, dan permintaan HTTP nyata ke handler; tidak menyentuh database hosting. Build harus dijalankan terlebih dahulu.

Salin `.env.example` ke `.dev.vars` yang diabaikan Git dan isi secret testing jika dibutuhkan. Untuk database lokal **baru**, setelah build:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_jittery_nightshade.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_warm_proteus.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_case_records.sql
npm run dev
```

Jika 0000/0001 sudah diterapkan, jalankan hanya 0002. Jangan mengulang atau mengubah migrasi lama. `npm start` menjalankan Worker hasil build secara lokal. Ikuti konfigurasi lingkungan masing-masing; identitas project dan binding `DB` dipertahankan. Tidak ada secret baru untuk fitur kasus.

## Batas verifikasi revisi ini

D1, login/role, validasi, audit, konflik, serta pembacaan silang akun diuji secara lokal. Sinkronisasi hosting produksi belum diuji atau dideploy. Pengujian visual browser dan viewport 390/768/1024/1440 belum terverifikasi karena akses preview browser terhambat; lakukan checklist pada laporan sebelum merge/deploy. PR remote belum dapat dibuat: integrasi GitHub menolak create branch (403). Source ZIP dan patch commit disediakan sebagai alternatif; `main` dan produksi tidak diubah.
