# Pengujian login email/kata sandi dan revisi rounded

Tanggal: 30 Oktober 2026 (Asia/Jakarta).

## Hasil

- 16 validasi dataset lulus; CSV asli dan seluruh nilai sumber dipertahankan.
- TypeScript `tsc --noEmit`, pemeriksaan sintaks JavaScript, dan build Worker lulus.
- 20 unit/regression test lulus: otorisasi, input, CSRF, hash kata sandi, token/cookie sesi, data, render 500 perusahaan, storage, dan isolasi catatan per akun.
- 28 pemeriksaan API dengan backend Worker, cookie sesi nyata, dan D1 lokal lulus. Identitas platform tidak disimulasikan. Lihat `accounts-api-tests.json`.
- Form admin benar-benar membuat akun melalui handler submit aplikasi. Akun baru kemudian berhasil login melalui form email/kata sandi aplikasi; navigasi admin tidak muncul. Lihat `password-ui-tests.json`.
- Tombol Keluar aplikasi mengembalikan form login dan mereset route ke overview.
- 12 kombinasi responsif lulus: login, admin, user × 390, 768, 1071, 1440 px. Tidak ada overflow horizontal body. Inter dipakai, ikon solid, logo grafis tidak ada, bagian lama yang ditandai tidak muncul. Radius card 18–20 px, input 13–14 px. Lihat `auth-responsive-tests.json`.

## Cakupan API

Sesi/data/daftar akun anonim ditolak; header identitas ChatGPT saja tidak membuka sesi; kata sandi salah ditolak; kedua akun testing yang diminta berhasil login; sesi bertahan pada request berikutnya; admin melihat akun dan membuat user dengan kata sandi; hash/token tidak dikirim melalui respons publik; duplikat, role admin, kata sandi kosong dan content-type salah ditolak; logout membatalkan sesi; user baru bisa masuk dan mendapat dataset tetapi tidak dapat list/create/update akun; nama file dataset memakai whitelist; nonaktivasi memblokir login, aktivasi memulihkan login; admin tidak bisa dinonaktifkan; percobaan gagal berulang dibatasi.

Mutasi lintas Origin diuji pada unit policy. Browser tidak memalsukan Origin; pemeriksaan browser memakai penolakan content-type non-JSON.

## Tampilan

Login berupa form email/kata sandi dengan teks produk dan dekorasi abstrak pada panel kiri. Tile lock/shield, penjelasan role, logo grafis, dan teks footer login yang ditandai telah dihapus. Sidebar memakai nama produk dalam teks; seluruh halaman analisis dan data sumber dipertahankan. Kartu, input, tombol, badge, navigasi, notice dan dialog diberi radius lebih besar.

Bukti aktual: `screenshots/login.jpg` dan `screenshots/admin-users-local-qa.jpg`. Screenshot admin menampilkan **database QA lokal**, termasuk akun fixture lama; bukan daftar akun produksi. Screenshot analisis lama lainnya merupakan riwayat sebelum revisi ini.

## Batas verifikasi

Pengujian login serta pembuatan akun dilakukan di preview lokal dengan Worker/D1 dan sesi aplikasi asli. Gerbang hosting Site tetap privat; login aplikasi tidak mengubah audience hosting. Browser cloud belum masuk melewati gerbang hosting produksi. Secret untuk dua akun testing dikonfigurasi di runtime produksi; akun diinisialisasi saat login pertama. Fixture QA, database lokal, dan file environment tidak dikirim sebagai aset publik.

Status verifikasi perusahaan tetap localStorage per akun, belum merupakan database audit perusahaan atau penyimpanan dokumen bukti.
