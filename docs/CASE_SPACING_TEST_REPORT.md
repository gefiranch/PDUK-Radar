# Status kasus, ikon panah, dan jarak form

Tanggal: 30 Oktober 2026 (Asia/Jakarta).

## Perubahan

Panel kiri login kembali berupa teks sederhana tanpa ilustrasi besar atau tag dekoratif. Panah navigasi, chevron, kembali, unduh, tautan eksternal, logout, dan refresh memakai bentuk fill yang lebih tipis dan ukuran 9–14 px. Ikon lainnya tetap solid; font Inter dipertahankan.

Jarak label/field 8 px, gap form 18–21 px, field minimal 44 px (login 49 px), tombol submit minimal 44 px. Error kosong tidak mengambil ruang. Form admin dua kolom hanya ketika kartu melebar pada viewport 621–1000 px; pada sidebar/kartu sempit ia satu kolom. Footer/tombol membungkus pada mobile. Pencarian pengguna/antrean mempertahankan draft form.

Status kasus berasal dari fungsi terpusat dan dibaca oleh store, dashboard, ranking, detail, explainability, serta workspace. Kasus sesuai keluar dari antrean aktif; kasus tidak sesuai masuk ke tindak lanjut. Semua tetap ada pada dataset dan riwayat. Koreksi hasil final membutuhkan alasan. Skor, kategori risiko, formula, dan file JSON sumber tidak berubah.

## Hasil pengujian

- 27 unit/regression test: kebijakan akun, password/token/cookie, fungsi data/store, 500 halaman perusahaan, status kasus, koreksi, refresh, reset, kompatibilitas format lokal lama, dan isolasi akun.
- 16 audit data: CSV asli, seluruh nilai sumber, 500 ID, risk counts, null, histogram/sektor dan top 10 dipertahankan.
- TypeScript dan pemeriksaan sintaks JavaScript lulus; Worker build lulus.
- 119 pemeriksaan browser melalui aplikasi aktual lulus (`case-browser-tests.json`). Setiap skenario dicek pada ranking, detail, explainability, dashboard dan workspace sebelum/sesudah refresh. Memakai API/D1 lokal dan cookie sesi asli; tanpa mock identitas.
- Skenario: EMP-0221 Critical menjadi Sesuai; EMP-0016 High menjadi Tidak Sesuai; EMP-0278 Medium menjadi Need More Data; EMP-0001 Pending menjadi Under Review; EMP-0221 dikoreksi dari Sesuai menjadi Tidak Sesuai dengan alasan. Histori kedua hasil, petugas simulasi, waktu WIB, antrean aktif/tindak lanjut/Semua kasus, serta Reset Demo diperiksa.
- 28 kombinasi responsif lulus: 7 halaman × 390, 768, 1071, 1440 px. Tidak ada overflow body atau tombol form keluar batas. Panah maksimal 14 px; field minimal 44 px; error kosong tersembunyi (`spacing-responsive-tests.json`).
- Pencarian pengguna dan antrean tidak menghapus draft (2 pemeriksaan UI). Filter kasus selesai, tindak lanjut dan prioritas aktif dijalankan melalui dropdown asli.
- Form tambah pengguna berhasil membuat akun dan akun tersebut berhasil login tanpa menu admin (3 pemeriksaan pada `spacing-account-ui-tests.json`).

## Bukti dan batas pengujian

`screenshots/login.jpg` menunjukkan login sederhana. `screenshots/case-compliant-local-qa.jpg` menunjukkan skor historis Critical 89,60 bersama hasil Terverifikasi Sesuai dan kasus Selesai — Sesuai; ini contoh simulasi yang disimpan melalui form aktual dalam preview lokal dengan akun testing admin. Screenshot lama lain merupakan riwayat.

Seluruh catatan verifikasi tetap localStorage per akun/browser, bukan audit pemeriksaan produksi. Database serta fixture QA lokal tidak dipublikasikan. Hosting Site tetap privat; browser cloud belum melewati gerbang hosting produksi. Build/deployment diverifikasi melalui alur Sites. Tidak ada pipeline penilaian ulang atau penyimpanan dokumen bukti baru.
