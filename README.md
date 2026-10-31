# PDUK-Radar

Employer Compliance Risk Intelligence System — Healthkathon 2026. Analisis 500 perusahaan sintetis, prioritas pemeriksaan, penjelasan skor, dan verifikasi terarah.

## Stack aktif

Next.js 16 + Node.js 22 + PostgreSQL Supabase melalui Drizzle. Hosting target: Vercel. Font Inter, light/dark mode, dan layout floating tetap dipertahankan. Tidak memerlukan Cloudflare atau Supabase Auth.

## Mulai

1. Jalankan `supabase/001_setup.sql` di Supabase SQL Editor.
2. Opsional jalankan `supabase/002_testing_accounts.sql` untuk akun testing.
3. Salin `.env.example` ke `.env.local` dan isi `DATABASE_URL`.
4. Jalankan `npm ci`, lalu `npm run dev`.

Panduan lengkap, akun awal, environment Vercel, dan query: [docs/VERCEL_SUPABASE.md](docs/VERCEL_SUPABASE.md).

## Fitur

- Login admin/user, sesi HttpOnly, hanya admin dapat menambah pengguna.
- Kelola pengguna: edit, aktivasi/nonaktif, dan reset password dengan pencabutan sesi.
- Dashboard, peringkat/filter/ekspor, detail perusahaan, dan penjelasan skor.
- Verifikasi bersama antarpetugas, riwayat append-only, koreksi, paginasi, dan konflik versi.
- Data analitik sumber tidak berubah saat status operasional diperbarui.

## Pemeriksaan

`npm test` menjalankan tes kebijakan, password, data/UI, serta PostgreSQL embedded PGlite.
`npm run build` menghasilkan output Next.js di `.next`.
SQL setup membuat database baru; data operasional D1 lama tidak otomatis diimpor.

Dokumentasi historis: [README sebelumnya](docs/LEGACY_CLOUDFLARE_README.md), [kamus data](docs/DATA_DICTIONARY.md), [revisi UI](docs/FLOATING_THEMES_PASSWORD.md). Instruksi D1/Worker di arsip tidak digunakan oleh versi Supabase.
