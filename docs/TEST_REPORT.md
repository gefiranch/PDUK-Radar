> Laporan historis versi statis. Untuk versi login/admin terbaru, lihat AUTH_ROLES_TEST_REPORT.md.

# Hasil pengujian PDUK-Radar

Tanggal pengujian: 29 Oktober 2026 (Asia/Jakarta).

## Hasil

| Area | Hasil | Bukti |
| --- | --- | --- |
| Data dan agregat | 16 pemeriksaan lulus | data-validation.json |
| Logika, storage, filter dan render | 10 pengujian lulus | function-tests.tap |
| Sintaks | Semua modul JavaScript lulus node --check | Pemeriksaan akhir executor |
| Render detail / explain / verification | Masing-masing 500 ID dirender; tidak ada undefined / NaN | store.test.js |
| Browser Chrome | Kelima halaman dibuka dan data ID tetap konsisten | Pengujian UI aktual |
| Responsive layout | 15 kombinasi: 5 halaman × 390, 768, 1440 px; scrollWidth body tidak melebihi clientWidth | responsive-tests.json |
| Ekspor CSV aktual | Filter Perdagangan + Critical: 4 baris benar pada berkas download | Pemeriksaan CSV hasil browser |
| Verifikasi | Simpan → refresh → riwayat tetap ada → ranking dan dashboard berubah | Pengujian UI aktual EMP-0038 |
| Reset | Status kembali Need More Data; catatan lokal hilang | Pengujian UI aktual EMP-0038 |
| Navigasi ponsel / keyboard | Menu dibuka dengan Enter, pindah ranking, halaman 2 menunjukkan 13–24 dari 500 | Pengujian keyboard pada iframe 390 px |
| Console | Tidak ditemukan error aplikasi; pesan ekstensi browser di luar origin aplikasi dikecualikan | Log Chrome |

## Detail pengujian otomatis

1. 500 data; pagination 12, halaman akhir 8; urutan stabil.
2. Filter sektor, wilayah, skala, risiko, status, kualitas, search, interval skor; empat sorting sebelum pagination.
3. Empty search, 6 Critical, 22 High/Critical.
4. Verifikasi mengubah status efektif dan agregat; bertahan pada instance store baru; riwayat bertambah; reset tidak mengubah skor.
5. ID, status, tanggal, panjang dan field wajib yang invalid ditolak.
6. Kegagalan localStorage tidak mengubah status efektif; pesan error tersedia.
7. Null tetap null; histori, flags dan kontribusi tidak dibuat.
8. Semua 500 detail, explainability, dan workspace dapat dirender tanpa undefined / NaN.
9. CSV berisi seluruh hasil filter dan status efektif terbaru.
10. Data lokal korup ditangani dengan peringatan, status sumber tetap utuh.

## Uji browser aktual

- Gabungan filter Perdagangan + Critical menghasilkan EMP-0038, EMP-0227, EMP-0348, EMP-0048, total 4.
- Berkas CSV hasil unduhan dibaca kembali: 4 baris dengan sektor dan kategori yang cocok.
- Dari EMP-0038, detail → explainability → verification mempertahankan ID yang sama.
- Status awal EMP-0038 Need More Data diubah ke Verified Compliant dengan catatan uji.
- Refresh mempertahankan status, catatan dan 1 entri riwayat.
- Dashboard High/Critical berubah: Need More Data 5 → 4; Verified Compliant 0 → 1.
- Klik status dashboard menghasilkan satu baris ranking EMP-0038 dengan status baru.
- Reset mengembalikan Need More Data dan 0 riwayat lokal. Perubahan uji sudah dibersihkan sebelum serah terima.

## Uji responsif

Pengujian dilakukan di Chrome remote menggunakan iframe dengan viewport CSS 390, 768, dan 1440 px. Lebar body bersih dapat berkurang 15 px karena scrollbar. Ini pengujian browser, bukan pengujian perangkat fisik atau emulasi touch.

Seluruh halaman tidak menghasilkan overflow horizontal pada body. Overflow tabel dibatasi dalam kontainer .table-scroll: pada 390 px, ranking 1.470 px tetap berada dalam kontainer 339 px yang dapat digulir. Menu ponsel dan pagination juga diuji dengan keyboard.

Sempat ada timeout sementara saat otomasi frame sebelum konten siap. Pengujian dilanjutkan menggunakan locator judul yang menunggu halaman siap. Hasil yang tersimpan berasal dari seluruh 15 halaman yang sudah selesai dimuat.

## Screenshot

- screenshots/dashboard-desktop.jpg: dashboard aktual pada viewport browser yang tersedia.
- screenshots/dashboard-mobile-390.jpg: viewport CSS 390 px, dipotong pada batas konten ponsel.
- screenshots/verification-workspace.jpg: form verifikasi aktual EMP-0038 setelah reset.

Tidak ada gambar mockup atau gambar generatif yang diklaim sebagai screenshot.

## Batas verifikasi

- Paket JSON asli, histori 24 bulan, peer percentile, kontribusi resmi, rule flags, risk explanation asli, schema, dan original adapter tidak tersedia.
- Karena itu, 12.000 observasi, jumlah kontribusi resmi, serta arus peserta bulanan tidak dapat divalidasi. Aplikasi menampilkan keterbatasan ini secara eksplisit.
- Komponen chart untuk data detail lengkap belum diuji terhadap file paket asli yang tidak dilampirkan.
- Tidak ada pengujian backend, autentikasi, audit produksi, unggahan bukti, perangkat fisik, atau lintas semua vendor browser karena fitur itu di luar implementasi statis ini.
- Public/ menggunakan data hasil konversi CSV; ini tidak diklaim lolos schema resmi paket yang belum tersedia.


## Revisi tampilan — font dan sidebar

Sesuai anotasi pengguna: badge DEMO dan bar atas dihapus, lima ikon navigasi menjadi solid, dan font Rubik lokal diterapkan. Tombol Sumber data dipindah ke sidebar dan dialognya diuji kembali.

Kelima halaman dicek pada 390, 768, 1071, dan 1440 px: 20 kombinasi tanpa overflow body. Font CSS Rubik terdeteksi; badge dan bar yang diminta dihapus tidak ditemukan; lima ikon solid tersedia. Bukti: ui-revision-checks.json. Tidak ada error aplikasi pada log browser. Screenshot desktop diperbarui; screenshot mobile dan workspace terdahulu tetap menjadi bukti versi awal.

Perubahan ini bersifat presentasi; logika data, scoring, filtering, dan penyimpanan verifikasi tidak berubah. Pengujian logika sebelumnya tidak diulang.


## Revisi font — Inter

Font Rubik diganti ke Inter variable sesuai pilihan pengguna. File Inter dan lisensi OFL diambil dari repositori Google Fonts lalu disubset ke karakter Latin untuk disajikan secara lokal. Bobot 100–900 tetap tersedia. Perubahan hanya menyentuh font, preload dan dokumentasi; logika aplikasi tetap memakai hasil uji sebelumnya.

Pemeriksaan browser Inter: computed font-family Inter, tidak ada overflow pada viewport tersedia (1348 px), dan tidak ada error aplikasi pada console. Screenshot dashboard-desktop.jpg memakai font Inter terbaru.
