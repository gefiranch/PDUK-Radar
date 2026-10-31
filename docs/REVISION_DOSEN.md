# Revisi komprehensif PDUK-Radar — audit dan implementasi

Baseline GitHub `main`: `eacaab94b127c29090654eb96208ac6dc2ea12d0`. Branch lokal: `feat/pduk-radar-full-revision`. Audit dilakukan sebelum edit; laporan ini menggantikan klaim implementasi pada laporan dosen versi sebelumnya.

## Audit awal

Halaman publik Explainability EMP-0348 dibuka di browser aktual dan berhenti pada login, sehingga workspace produksi tidak dapat diaudit dalam sesi ini. Screenshot `screenshots/full-revision-before-public-login.jpg` benar-benar berasal dari halaman publik sebelum revisi. Area workspace diaudit melalui source main, komponen, API, schema, migrasi, serta dokumentasi.

Ditemukan perbedaan dokumentasi dan kode: Kasus Selesai memiliki route tetapi tidak ada navigasi/breadcrumb; Detail hanya beberapa bagian, belum tujuh bagian yang didokumentasikan; catatan verifikasi/follow-up masih localStorage. Natural language memakai penggantian global HTML. Ditemukan juga nama kolom schema login_attempts yang salah (`kegit inity`, sementara migrasi menggunakan `key`), serta hash CSV yang membandingkan bytes LF Git dengan provenance unggahan CRLF. Prioritas: keutuhan data, persistensi, transisi, kemudian UI dan alur.

## Perubahan nyata

| Area | Hasil |
| --- | --- |
| Backend | D1 state kasus dan audit append-only, migrasi baru 0002; endpoint GET/PATCH autentikasi aktif; actor server, validasi field/tanggal/teks/transisi dan body 16 KB; optimistic concurrency atomik |
| Form | Await ACK sebelum sukses, error tetap terlihat, draft dipertahankan pada konflik, versi pada form; Perbarui data mengganti Reset lokal di mode utama |
| Detail | Tujuh bagian dan navigasi, rasio pendaftaran, periode/kualitas, pembanding alami, histori hanya bila tersedia, kategori/rincian dilipat, hasil pemeriksaan serta penutupan terpisah tanpa menyalin seluruh halaman |
| Penjelasan | Enam kategori, bobot awal dan efektif terlihat, metode/arti indikator popup, tiga fokus klarifikasi; estimasi 83,19 tidak diubah agar cocok dengan 83,25 |
| Kasus Selesai | Sidebar, breadcrumb, active menu, route/deep link dan tab; penutupan/pembukaan kembali beralasan, history, pencarian dan pengecualian antrean aktif |
| Dashboard | Tambah kartu menunggu pemeriksaan dan perlu data; semua ringkasan memakai state efektif; distribusi risiko sumber tetap |
| Bahasa | Kamus kategori/istilah tetap terpusat, rendering tidak lagi melewati regex pengganti HTML |
| Demo | Tiga lampiran tersimpan server-side dengan opt-in/konfirmasi dan banner; histori sintetis dan alokasi ilustratif dipisahkan; skenario mengisi draft saja; tidak menulis D1 |
| Visual | Inter/teal/rounded dipertahankan, navigasi section, gap/wrapping form, padding dropdown, keterbacaan catatan, focus visible, layout mobile/refinement CSS |
| Tooling | Perbaikan wrapper build agar tidak bergantung executable bit shell yang hilang di main; lint bersih; metadata migrasi baru lengkap |

Skor/level risiko, CSV, dan ketiga snapshot tidak diubah. Tidak ada SHAP/LIME, bukti, flag atau kontribusi resmi rekaan. Persentil sumber yang tidak tersedia tetap tidak tersedia. Seluruh aktor pada mode utama berasal dari sesi; aktor simulasi hanya untuk mode demo.

## Bukti pengujian dan alur EMP-0348

Lihat `TEST_REPORT.md` dan `full-revision-tests.json` untuk hasil aktual. Worker hasil build diuji dalam emulator lokal D1 terisolasi. EMP-0348 disimpan Sesuai dengan catatan, dibaca akun admin berbeda, ditolak saat versi lama digunakan, lalu dibuka kembali dengan alasan. EMP-0221 disimpan Tidak Sesuai, diselesaikan dengan catatan, lalu dibuka kembali dengan alasan. Skor 83,25/89,60 dan distribusi 500 perusahaan tetap sama. Store diuji agar hasil tersinkron di ranking/dashboard/detail dan tidak berubah saat API gagal.

Pengujian render seluruh 500 perusahaan, pagination, filter/sort/CSV, normalisasi, history 105 peristiwa, dan isolasi demo dilaksanakan. Tidak ada klaim bahwa refresh UI/browser telah lulus: yang terbukti adalah rehidrasi D1 lewat permintaan HTTP baru dan instance store baru.

## Keterbatasan, bukti visual, dan GitHub

- Browser preview mula-mula gagal tersambung. Setelah server preview diperbaiki, upaya mengikat tab error ditolak kebijakan protokol browser. Tidak dilakukan workaround. Pengujian klik UI, screenshot sesudah revisi, kontras terukur, keyboard, console, dan viewport 390/768/1024/1440 belum dapat diverifikasi. Screenshot lama di folder screenshots adalah historis, bukan bukti revisi baru.
- Lampiran histori 24 bulan adalah simulasi, bukan observasi. Semua 500 ID dan anchor peserta bulan terakhir cocok dengan snapshot; itu tidak membuktikan bahwa riwayatnya nyata. Evidence lapangan dan integrasi pemerintah tetap tidak tersedia.
- D1 hanya diuji lokal; produksi belum dimigrasi/dideploy. Tidak ada push real time, unggah bukti, atau reassessment pipeline.
- Integrasi GitHub mengembalikan 403 `Resource not accessible by integration` saat membuat branch. Karena itu tidak ada URL PR yang berhasil dibuat. Branch/commit lokal, ZIP lengkap, patch commit dan body PR tersedia untuk diterapkan oleh pemilik; tidak ada merge/main/produksi yang diubah.

Tinjau UI manual dan jalankan migrasi staging sebelum merge. Hak akses saat ini: semua admin/user aktif boleh memperbarui seluruh kasus sintetis. Assignment petugas per kasus belum dimodelkan; jangan menganggap ini kontrol akses untuk data pribadi produksi.
