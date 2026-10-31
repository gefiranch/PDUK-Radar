# Verifikasi migrasi Vercel / Supabase

31 Oktober 2026, branch `feat/vercel-supabase`.

- `npm test`: 42 tes, 42 lulus; tidak ada tes dilewati.
- `npm run build`: Next.js 16.3.4 berhasil, termasuk TypeScript dan seluruh route API.
- `.next/routes-manifest.json`: dihasilkan oleh build Next.js.
- Tes database menggunakan PostgreSQL embedded PGlite, bukan database hosting.
- SQL setup/seed dijalankan ulang tanpa menimpa password; password awal diverifikasi dengan implementasi aplikasi.
- Transaksi reset password, pencabutan sesi target, rollback ketika audit gagal, dan bigint timestamp teruji.
- RLS aktif pada enam tabel; akses role `anon`/`authenticated` ditolak.
- CAS/konflik versi kasus, riwayat append-only, dan paginasi 105 event teruji.
- Data snapshot/migrasi SQLite historis tidak diubah.

Tidak tersedia kredensial Supabase/Vercel milik pengguna. Tidak dilakukan migrasi remote, deployment, atau uji login hosted. Tidak ada perubahan UI di revisi ini; uji browser visual baru tidak dijalankan.
