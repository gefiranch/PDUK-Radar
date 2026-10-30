# PDUK-Radar

Revisi dosen terbaru: [ringkasan, audit, hasil uji, batas data dan panduan demo](docs/REVISION_DOSEN.md).

Employer Compliance Risk Intelligence System — Healthkathon 2026.

Frontend HTML/CSS/JavaScript dengan font Inter, ikon solid dengan panah kecil dan tipis, dan backend Vinext di Cloudflare Workers. Lima halaman analisis tetap tersedia; halaman login email/kata sandi serta pengelolaan pengguna terhubung ke database D1. Komponen memakai sudut membulat yang konsisten; identitas produk berupa teks tanpa logo grafis.

## Login dan peran

| Peran | Hak akses |
| --- | --- |
| Admin | Semua fitur analisis; menambahkan dan mengedit nama/email user; melihat daftar akun; menonaktifkan dan mengaktifkan kembali user |
| User | Dashboard, peringkat, detail, explainability, dan verifikasi; tanpa akses pengelolaan akun |

- Login aplikasi menggunakan email dan kata sandi. Tidak ada pendaftaran mandiri atau pilihan peran saat login.
- Admin membuat user dengan nama, email, dan kata sandi awal. Akun tersebut langsung bisa dipakai masuk.
- Akun testing `admin@gmail.com` dan `user@gmail.com` diinisialisasi saat login pertama bila secret runtime terkait diatur. Nilai kata sandi mengikuti konfigurasi testing yang diminta pemilik, bukan bundle frontend.
- Kata sandi disimpan sebagai hash PBKDF2-SHA256 bersalt. Token sesi acak disimpan sebagai hash; cookie HttpOnly, SameSite=Lax, Secure pada HTTPS, berlaku 8 jam.
- Login dibatasi setelah 8 percobaan gagal dalam 15 menit per email/IP. Pesan kredensial salah tidak mengungkap apakah email terdaftar.
- Form admin hanya membuat role `user`; role diperiksa ulang oleh API. Admin tidak dapat dinonaktifkan melalui endpoint status.
- Nonaktivasi mencabut seluruh sesi akun. User nonaktif tidak bisa masuk; setelah diaktifkan kembali ia harus login ulang.
- Tindakan login, pembuatan, aktivasi, dan nonaktivasi dicatat pada tabel audit akun. Logout mencabut token sesi saat ini.
- Akun lama tanpa kata sandi dipertahankan. Admin dapat menginisialisasi kata sandi akun user lama melalui form Tambahkan pengguna dengan email yang sama. Peran admin lama tidak diubah oleh form ini.

**Akses hosting dan peran aplikasi adalah dua lapisan berbeda.** Site kini publik sesuai permintaan pemilik: siapa pun dengan URL dapat membuka form login aplikasi tanpa gerbang ChatGPT. Dataset dan fitur workspace tetap memerlukan akun aplikasi aktif; endpoint Kelola pengguna memerlukan role admin. Membuat akun aplikasi tidak mengirim email dan tidak memberi akses editor ke source Site.

## Fitur

- 5 halaman analisis dari 500 perusahaan snapshot CSV.
- Filter, pencarian, sorting, pagination 12 baris, dan ekspor hasil filter.
- Navigasi konsisten ke perusahaan terpilih.
- Login, logout, dan dua peran yang diperiksa di API.
- Halaman Kelola pengguna khusus admin, pencarian akun, form tambah, serta menu titik tiga pada setiap user. Edit membuka popup nama/email; Nonaktifkan dan Aktifkan meminta konfirmasi.
- JSON dataset disajikan hanya melalui API yang memeriksa keanggotaan aktif; tidak diletakkan pada aset publik.
- Verifikasi simulasi tetap disimpan lokal dan dipisahkan per ID akun.

## Verifikasi dan antrean

Risk Level/Score tetap menunjukkan analisis snapshot sumber. Verification Status menyimpan hasil pemeriksaan simulasi. Case Status diturunkan oleh satu fungsi pada `public/ui/src/services/caseStatus.js`:

| Enum verifikasi sumber | Label verifikasi | Status kasus | Daftar kerja |
| --- | --- | --- | --- |
| Pending | Belum Diperiksa | Menunggu Pemeriksaan | Aktif |
| Under Review | Sedang Diperiksa | Dalam Proses | Aktif |
| Need More Data | Perlu Data Tambahan | Menunggu Kelengkapan Data | Aktif |
| Verified Compliant | Terverifikasi Sesuai | Selesai — Sesuai | Semua kasus/riwayat; keluar dari antrean aktif |
| Verified Non-Compliant | Terverifikasi Tidak Sesuai | Perlu Tindak Lanjut | Tindak lanjut; tidak otomatis selesai |

- Dashboard menampilkan lima jumlah verifikasi untuk seluruh 500 perusahaan serta ringkasan kasus. Prioritas aktif hanya mencakup skor >60 yang belum final. Distribusi risiko dan total sumber tetap.
- Ranking dan setiap item perusahaan hanya menampilkan satu status verifikasi, terpisah dari risiko. Badge/kolom status kasus tambahan dihapus. Logika kasus tetap mengatur antrean aktif, tindak lanjut, dan selesai. CSV kembali memuat satu kolom verification_status.
- Ruang verifikasi memiliki antrean aktif, tindak lanjut, dan Semua kasus; pencarian dapat menjangkau perusahaan di luar 100 item awal.
- Detail menyediakan hasil terakhir, catatan, tanggal, rekomendasi, dan riwayat. Explainability memberi konteks pemeriksaan tanpa mengganti indikator atau kontribusi sumber.
- Save memvalidasi status, tanggal, jenis temuan, catatan, dan tindakan; merekam waktu serta nama akun dengan penanda simulasi. Memperbarui hasil final memerlukan alasan koreksi; riwayat sebelumnya dipertahankan.
- Format penyimpanan lokal v1 tetap dapat dibaca; field kasus selalu diturunkan dari status efektif, bukan ditulis ke JSON sumber. Refresh/tab lain pada akun yang sama membaca status efektif yang sama. Reset mengembalikan status asli dan menghapus hanya edit lokal akun itu.
- Reassessment ditandai belum tersedia; tidak ada penurunan atau rekalkulasi skor tanpa data baru/pipeline.
- Pencarian antrean/pengguna mempertahankan draft form. Tombol, label, field, pesan error, dan footer memakai jarak konsisten; panah berukuran 9–14 px dengan bentuk lebih tipis.

## Edit dan status pengguna

Admin menggunakan menu titik tiga pada baris user. Edit membuka popup nama dan email; role serta kata sandi tidak dapat diubah melalui endpoint ini. Email dinormalisasi dan harus unik. Jika email berubah, sesi akun dicabut dan pengguna masuk kembali memakai email baru dengan kata sandi yang sama. Edit nama saja tidak mencabut sesi. Akun admin tetap terlindungi dari tindakan ini.

Nonaktifkan menampilkan nama/email akun dan konfirmasi Batal/Nonaktifkan. Permintaan baru dikirim setelah konfirmasi. Akun nonaktif ditolak saat login dan sesi aktifnya dicabut. Menu berubah menjadi Aktifkan untuk memulihkan akses melalui konfirmasi. Tindakan edit dan status dicatat pada audit akun.

## Teknologi dan struktur

```text
app/                         halaman server/client dan API Vinext
  api/auth/login/            pemeriksaan kata sandi dan pembuatan sesi
  api/auth/logout/           pencabutan sesi
  api/session/               sesi dan akun aktif
  api/users/                 daftar dan pembuatan user (admin)
  api/users/[id]/             aktivasi/nonaktivasi (admin)
  api/data/[file]/            tiga JSON dataset terlindungi
public/ui/                   sumber SPA, CSS, komponen, dan font Inter
lib/auth/                    kebijakan akses, hash kata sandi, token, akun testing
worker/                      runtime Worker dan integrasi Sites
db/schema.ts                 akun, sesi, percobaan login, audit
drizzle/                     migrasi schema-only yang terlacak
data/employers_500.csv        CSV unggahan asli
data/snapshots/               JSON turunan CSV, dibundel server-side
tests/                       unit test serta fixture QA lokal
tools/                       konversi dan audit data
docs/                        laporan, panduan demo, screenshot
```

## Menjalankan dan membangun

Node.js >=22.13.0 dibutuhkan. Gunakan lockfile yang disertakan:

```bash
npm ci
npm run build
```

Untuk development, salin `.env.example` menjadi `.dev.vars` dan isi dua secret kata sandi akun testing. Untuk database lokal yang **baru**, jalankan kedua migrasi dari root proyek:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_jittery_nightshade.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_warm_proteus.sql
npm run dev
```

Untuk melihat Worker hasil build secara lokal:

```bash
npm start
```

Database lokal dan produksi terpisah. Jangan mengulang migrasi yang sudah diterapkan atau mengubah SQL migrasi yang sudah diterapkan. Setelah mengubah schema, buat migrasi baru dengan `npm run db:generate`, build, dan terapkan migrasi baru.

Akun testing hanya diinisialisasi jika belum memiliki hash kata sandi; konfigurasi secret tidak menimpa kata sandi yang sudah ada. File `.dev.vars` tidak dilacak Git. Server tidak menerima header identitas ChatGPT sebagai pengganti cookie sesi aplikasi.

## Sumber dan ketelitian data

- `data/employers_500.csv` merupakan salinan CSV asli, byte tidak diubah.
- JSON di `data/snapshots/` adalah konversi aplikasi ini, **bukan file JSON asli paket yang tidak dilampirkan**.
- `schema_version: 1.0.0` merujuk versi dataset yang didokumentasikan. Kesesuaian JSON hasil konversi dengan schema paket asli tidak diklaim karena schema tidak tersedia.
- Metadata `source_format: csv_snapshot`, nama sumber, hash SHA-256 dan keterbatasan dicantumkan pada hasil konversi.
- Agregat dashboard dihitung dari 500 baris yang sama.
- Risk Score, Risk Level, dan status verifikasi awal dipertahankan persis dari CSV.
- Jumlah: Low 369, Medium 109, High 16, Critical 6. High + Critical = 22.
- 131 perusahaan tidak memiliki `actual_workers`, `coverage_ratio` dan `coverage_gap`; 80 tidak memiliki faktor historis. Nilai kosong dikonversi menjadi `null`.
- `peer_percentile` tidak tersedia. Tidak dihitung ulang dari data snapshot yang sudah dibulatkan.
- Rasio 0.40 ditampilkan 40%; peer percentile jika tersedia memakai skala 0–100.
- Setiap bucket histogram mencakup nilai minimum, mengecualikan maksimum; bucket terakhir mencakup 100. Warna interval bukan pengganti kategori batas risiko.

### Yang belum dapat ditampilkan

1. Histori peserta aktif, baru, dan nonaktif 24 bulan / 12.000 observasi. UI menunjukkan empty state; tidak ada interpolasi atau seri palsu.
2. Kontribusi skor resmi, feature_scores asli, rule_flags, dan risk_explanation asli.
3. Catatan, tanggal, petugas, riwayat, dan bukti verifikasi **awal**. Status awal tetap ditampilkan dari CSV; riwayat hanya diisi oleh tindakan demo pengguna.
4. Validasi terhadap schema dan adapter paket asli.

Komponen chart tren dan mutasi serta tampilan kontribusi/flags telah ditulis dan terhubung ke field detail bila data tersedia. Akurasi terhadap paket lengkap tetap memerlukan file sumber asli dan pemetaan/validasi kontraknya. Itu belum diuji dengan paket asli.

### Explainability pada mode snapshot

Kontribusi poin tidak direkonstruksi karena input CSV telah dibulatkan. Grafik enam komponen yang terlihat pada mode ini berlabel **bobot metodologi**, bukan kontribusi perusahaan.

Panel indikator ternormalisasi menampilkan:

- coverage gap, mutation score, historical score, anomaly score dari CSV;
- peer deviation dibatasi ke 0–1;
- stagnation/growth = `0.60 × min(stagnation_months/18,1) + 0.40 × min(growth_mismatch/0.50,1)` sesuai README asli.

Nilai ini indikatif dan dipisahkan dari poin kontribusi. Indikator utama diurutkan berdasarkan nilai tersedia × bobot resmi; urutan bukan klaim kontribusi poin tepat. Rule flags tidak diciptakan dan tidak ditambahkan ke skor.

Bobot resmi: C 30%, P 25%, S 15%, M 10%, H 10%, A 10%. Bobot komponen tersedia dinormalisasi ulang pada perhitungan **sumber**. Website tidak menghitung ulang skor final, tidak menjalankan Isolation Forest, dan tidak memakai threshold evaluasi sintetis 33 sebagai cutoff operasional.


## Mengganti snapshot CSV

Ganti `data/employers_500.csv` dengan kontrak kolom yang sama, lalu:

```bash
python tools/prepare_data.py
python tools/validate_data.py
npm test
npm run build
```

Script menulis tiga JSON ke `data/snapshots/`; tidak menghasilkan perusahaan atau histori baru. API membundel snapshot server-side, sehingga perubahan data membutuhkan build dan deployment baru. Baseline validator sengaja memeriksa 500 perusahaan dan distribusi revisi ini. Perubahan dataset yang sah perlu disertai revisi expected counts secara terbuka.

Paket JSON lengkap belum dilampirkan. Saat tersedia, prioritaskan file asli, sesuaikan selector dengan wadah aslinya, validasi 500 ID, 24 bulan, arus peserta, kontribusi skor dan agregat; jangan menyalin label QA internal ke browser. Adapter berada di `public/ui/src/services/dataService.js`. Bentuk detail yang didukung: `{months:[], employers:{"EMP-xxxx":{history:{active:[],new:[],inactive:[]}, ...}}}`; alias lookup `details` dan `by_id` juga dikenali. Kesesuaian terhadap schema asli yang belum tersedia tidak diklaim.

## Penyimpanan

**D1:** `app_users` menyimpan akun, hash kata sandi, role dan status; `app_sessions` menyimpan hash token dan masa berlaku; `login_attempts` membatasi percobaan; `account_audit` menyimpan tindakan akun. Kolom identitas lama dipertahankan untuk migrasi tanpa kehilangan akun, tetapi tidak dipakai sebagai autentikasi aplikasi. Semua endpoint akun memeriksa sesi aktif dan role di server. Mutasi mensyaratkan Origin yang sama dan JSON, menolak role ilegal, email ganda dan input tidak valid.

**localStorage:** hasil verifikasi perusahaan masih merupakan simulasi lokal, dengan key `pduk-radar:verification:v1:<dataset_id>:<user_id>`. Dua akun pada browser yang sama tidak berbagi perubahan. Refresh mempertahankan hasil; browser/perangkat lain tidak mendapat catatan tersebut. Reset hanya menghapus key akun tersebut setelah konfirmasi. Status sumber dan skor tidak diubah.

Riwayat verifikasi lokal bukan audit produksi. Belum ada penyimpanan dokumen bukti, perubahan skor/model, atau database hasil verifikasi perusahaan. Jangan memasukkan data pribadi nyata ke catatan demo.

## Pengujian

```bash
npm test
python tools/validate_data.py
node node_modules/typescript/bin/tsc --noEmit
```

Laporan terbaru: `docs/USER_MENU_TEST_REPORT.md` dan `docs/user-menu-browser-tests.json`. Laporan verifikasi/spacing sebelumnya ada pada `docs/CASE_SPACING_TEST_REPORT.md`. Laporan autentikasi sebelumnya tetap tersedia pada `docs/AUTH_ROLES_TEST_REPORT.md`. Pengujian data dan fungsi sebelumnya tetap tersedia sebagai riwayat. Fixture `tests/qa-password.html` dan `tests/qa-cases.html` hanya untuk QA lokal dengan kredensial testing, API asli, cookie asli, dan D1 lokal. Salin fixture yang diperlukan ke `public/qa-*.html` saat QA lalu hapus sebelum build/publikasi. Tidak ada fixture header identitas pada pengujian ini; fixture lama telah dihapus.

## Deployment

Aplikasi kini membutuhkan **Cloudflare Worker dan D1**, bukan static hosting murni. `.openai/hosting.json` mempertahankan project_id yang sama, deklarasi `d1: "DB"`, dan tanpa `static`. Pipeline Sites membangun Worker dan menerapkan migrasi D1 sebelum publikasi.

Secret produksi `PDUK_TEST_ADMIN_PASSWORD` dan `PDUK_TEST_USER_PASSWORD` diatur melalui environment variables Sites, bukan source code atau bundle browser. `.dev.vars`, `.wrangler/`, `.sites-runtime/`, dependencies, dan `dist/` tidak dilacak Git. Jangan menyajikan folder `data/`, `tests/`, atau file QA sebagai aset publik.

## Demo singkat

1. Masuk melalui form menggunakan akun testing admin yang dikonfigurasi.
2. Buka Kelola pengguna, isi nama, email, dan kata sandi awal, lalu Tambahkan pengguna.
3. Keluar, kemudian masuk melalui form dengan akun yang baru dibuat.
4. Menu Kelola pengguna tidak tersedia untuk user; API administrasi juga menolaknya.
5. Buka dashboard, pilih perusahaan, tinjau indikator, lalu catat verifikasi simulasi.
6. Admin dapat menonaktifkan user; sesi dicabut dan login ditolak. Aktifkan kembali untuk memulihkan akses dengan login ulang.

Panduan empat skenario risiko dari CSV ada di `docs/DEMO_GUIDE.md`.

## Batasan

Data perusahaan seluruhnya sintetis. PDUK-Radar adalah prototype akademik, bukan produk resmi BPJS Kesehatan. Skor bukan bukti pelanggaran dan status verifikasi simulasi bukan keputusan hukum. Histori dan kontribusi resmi yang tidak dilampirkan tetap ditandai tidak tersedia. Tidak ada API BPJS, logo resmi, atau data pribadi pekerja.
