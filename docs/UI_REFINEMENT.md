# Penyederhanaan UI dan alur pemeriksaan

Revisi 30 Oktober 2026: dashboard menempatkan tombol prioritas di kanan dan menghapus label Snapshot CSV. Detail Perusahaan berfokus pada kepesertaan, pembanding, perkembangan, dan hasil verifikasi. Navigasi tujuh tahap dihapus. Penjelasan Skor menampilkan tiga fokus terlebih dahulu, lalu enam kategori, data pendukung yang dapat dibuka, dan tindakan berikutnya. Form tindak lanjut berada di Ruang verifikasi. Bobot awal dan metode tetap tersedia melalui ikon informasi.

Jarak antarelemen, ukuran kontrol, tipografi, dan kontras diseragamkan. Ikon pencarian menggunakan garis; panah menggunakan garis 1,9. Tautan penjelasan skor tidak memakai panah. Data, skor, autentikasi, dan penyimpanan status tetap mengikuti implementasi yang sudah ada.

Validasi:

- 31 pengujian unit/regresi, termasuk render 500 perusahaan dan sinkronisasi status.
- 28 pemeriksaan visual/responsif: tujuh tampilan pada lebar 390, 768, 1071, dan 1440 px. Lima halaman utama menggunakan aplikasi asli; login dan kelola pengguna menggunakan komponen asli dengan data uji tampilan tanpa perubahan akun.
- Badan halaman tetap dalam viewport; tabel/daftar yang lebar menggunakan pembungkus gulir. Tidak ada tombol terpotong, tag status dua baris, atau NaN/undefined pada konten terlihat.
- Alur prioritas aktif ke Detail, Penjelasan Skor, Verifikasi, dan kembali mempertahankan EMP-0348 serta skor 83,25. Popup metode, bantuan kategori, dan rincian pendukung diperiksa.
- TypeScript dan build Worker diperiksa. Fixture visual sementara tidak disertakan dalam publikasi.

Batas data yang dijelaskan pada revisi sebelumnya tetap berlaku. Penyederhanaan ini tidak menambah histori, kontribusi resmi, atau bukti yang belum tersedia.
