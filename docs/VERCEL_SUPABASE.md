# PDUK-Radar — Vercel + Supabase

Backend aktif sekarang: Next.js Node.js + Drizzle + PostgreSQL Supabase.
Tidak memerlukan Cloudflare, D1, Vinext, Supabase Auth, atau API key frontend.
Login, role admin/user, sesi HttpOnly, reset password, audit, dan status verifikasi tetap memakai API aplikasi.
Data analisis 500 perusahaan tetap berasal dari snapshot yang sama; data operasional disimpan di Supabase.

## 1. Siapkan Supabase

1. Buat project Supabase dan simpan password database-nya.
2. Buka **SQL Editor → New query**.
3. Tempel seluruh isi `supabase/001_setup.sql`, lalu **Run**.
4. Untuk akun testing yang diminta, jalankan seluruh `supabase/002_testing_accounts.sql`.

SQL kedua membuat akun berikut (opsional):

| Email | Password awal | Role |
| --- | --- | --- |
| admin@gmail.com | admin123 | admin |
| user@gmail.com | user123 | user |

Ubah password lewat Kelola pengguna setelah login. Seed menggunakan hash bersalt, bukan password plaintext di tabel.
SQL dapat dijalankan ulang tanpa menghapus akun, menimpa password, atau menghapus riwayat.
Akun terlihat di **Table Editor → app_users**, bukan di menu **Authentication → Users**.
Supabase digunakan sebagai PostgreSQL; autentikasi tetap ditangani server aplikasi.

Alternatif akun awal tanpa password testing: isi password pilihan sendiri di `.env.local` dan jalankan `npm run db:seed`.
`PDUK_TEST_ADMIN_PASSWORD` wajib minimal 6 karakter; `PDUK_TEST_USER_PASSWORD` opsional.
Script seed tidak dijalankan otomatis saat login atau build, dan tidak menimpa hash akun yang sudah ada.

## 2. Ambil connection string

Di Supabase, klik **Connect**, pilih **Transaction pooler**, lalu salin URI PostgreSQL.
Gunakan alamat/region/project reference yang ditampilkan akunmu, bukan nilai contoh.
Ganti placeholder password dengan password database yang sudah di-URL-encode jika mengandung karakter khusus.
Jangan gunakan anon key, publishable key, atau service-role key sebagai `DATABASE_URL`.

Contoh format saja:

```dotenv
DATABASE_URL="postgresql://postgres.PROJECT_REF:ENCODED_DB_PASSWORD@POOLER_HOST:6543/postgres"
```

Koneksi menggunakan TLS, prepared statements dimatikan, dan pool dibatasi per instance.
Database hanya diakses server. Jangan memberi nama variable `NEXT_PUBLIC_DATABASE_URL`.
RLS diaktifkan pada keenam tabel; akses tabel dari role browser `anon` dan `authenticated` dicabut.
Gunakan URI database role `postgres` dari menu Connect; API aplikasi melakukan pemeriksaan sesi/role.

## 3. Jalankan lokal

```bash
npm ci
cp .env.example .env.local
# Isi DATABASE_URL di .env.local menggunakan editor.
npm run dev
```

Buka URL yang ditampilkan Next.js. Untuk Windows PowerShell gunakan `Copy-Item .env.example .env.local`.
`.env.local` tidak boleh masuk Git. Akun yang baru ditambahkan admin langsung bisa login.
Reset password mencabut seluruh sesi target; reset password sendiri mengharuskan login ulang.

## 4. Deploy Vercel

- Framework Preset: **Next.js**.
- Install Command: `npm ci` (atau default).
- Build Command: `npm run build`.
- Output Directory: `.next` (atau default Next.js).
- Node.js: **22.x**.
- Environment Variables: tambahkan **DATABASE_URL** untuk Production dan Preview yang digunakan.
- Simpan pengaturan, kemudian deploy/redeploy setelah kode terbaru di-push.

`vercel.json` menyertakan pengaturan build/output. `next build` benar-benar menghasilkan `.next/routes-manifest.json`.
Build tidak membutuhkan koneksi database; login/API membutuhkan SQL dan environment variable yang benar.
Gunakan database/project terpisah untuk preview jika tidak ingin pengujian mengubah data produksi.

## 5. Git

```bash
git switch -c feat/vercel-supabase
git add .
git commit -m "feat: migrate backend to Supabase and Next.js for Vercel"
git push -u origin feat/vercel-supabase
```

Jika branch sudah ada, gunakan `git switch feat/vercel-supabase`. Merge ke main lewat pull request setelah review.
Source yang diekspor sudah berisi seluruh perubahan; jika memakai patch gunakan `git am` pada base yang sesuai.

## 6. Data lama dan verifikasi

SQL ini menyiapkan database Supabase baru; tidak otomatis menyalin pengguna, sesi, atau riwayat dari D1 lama.
Jika ada catatan operasional penting di hosting lama, ekspor/impor datanya secara terpisah sebelum beralih.
Jangan menjalankan file `drizzle/000*.sql` pada Supabase: itu arsip migrasi SQLite lama.
Pengembangan schema berikutnya memakai `drizzle.config.ts` dialect PostgreSQL; SQL setup yang perlu dijalankan tersedia di `supabase/`.

Pemeriksaan lokal: build Next.js, tes kebijakan/password/UI, dan tes PostgreSQL embedded (PGlite) untuk schema, transaksi, CAS, audit, paginasi, seed, serta RLS.
PGlite bukan layanan Supabase hosted. Koneksi ke akun Supabase/Vercel milikmu dan login end-to-end hosted harus dicek setelah DATABASE_URL dan SQL dipasang.
Tidak ada deployment atau perubahan database hosted yang dijalankan oleh revisi kode ini.

Referensi: https://supabase.com/docs/guides/database/drizzle dan https://nextjs.org/docs/app/getting-started/deploying
