# Panduan demo PDUK-Radar — 5–7 menit

Mulai dari Ringkasan dashboard. Tegaskan: data sintetis, snapshot CSV Desember 2025; skor bukan bukti pelanggaran.

## 1. Overview (1 menit)

Tunjukkan 500 perusahaan, 6 Critical dan 16 High. Klik kategori atau sektor untuk membuka hasil filter. Jelaskan bahwa 22 adalah prioritas pemeriksaan, bukan jumlah pelanggar. Progres awal High/Critical: 13 Under Review, 5 Need More Data, 4 Verified Non-Compliant (simulasi).

## 2. Skenario A — Low Risk (45 detik)

Cari **EMP-0001**. Skor 5,90; peserta 45, pekerja simulasi 47, Coverage Gap 4%. Periksa peer dan indikator yang relatif rendah. Low bukan sertifikasi kepatuhan.

## 3. Skenario B — Medium Risk (45 detik)

Cari **EMP-0013**. Skor 59,2; sektor Jasa Keuangan, wilayah Jawa Barat. Lihat beberapa indikator yang perlu ditinjau dan kualitas datanya. ID ini sama dengan kasus Medium pada dialog panduan demo aplikasi.

## 4. Skenario C — Critical (1–2 menit)

Buka **EMP-0221**, skor 89,60, Jasa Keuangan, Kalimantan Timur, skala Besar. Snapshot: peserta 72, pekerja simulasi 739, Coverage Gap 90%, median peer 560, peer count 27, stagnasi 17 bulan.

Buka Explainability. Tunjukkan bahwa bobot metodologi dan indikator 0–1 dipisahkan dari kontribusi poin resmi yang belum dilampirkan. Jelaskan fallback peer sektor + skala. Baca tiga fokus klarifikasi. Pada grafik histori, tunjukkan keterangan data belum tersedia; jangan mengklaim 12.000 observasi sudah dimuat.

## 5. Skenario D — Klarifikasi simulasi (1–2 menit)

Dari EMP-0221, klik Mulai Verifikasi. Isi contoh berikut:

- Status: Verified Compliant.
- Tanggal: tanggal demo.
- Jenis: Klarifikasi simulasi jumlah pekerja.
- Catatan: Dalam skenario demo, petugas memperoleh penjelasan konteks. Ini input pengguna untuk menguji alur, bukan bukti kasus atau hasil pemeriksaan nyata.
- Tindak lanjut: Tinjau sumber dan tanggal data sebelum keputusan operasional.

Simpan, refresh, lalu tunjukkan riwayat dan status yang tetap tersimpan. Buka Ranking dan Dashboard: Verified Compliant bertambah 1 dan Under Review berkurang 1 untuk High/Critical. Skor EMP-0221 tetap 89,60.

Jangan menyebut EMP-0221 false positive faktual: data tidak menyediakan bukti itu. Demonstrasi ini menunjukkan bagaimana klarifikasi manusia dapat dicatat.

## 6. Tutup dan reset (30 detik)

Kembali ke Ruang Verifikasi → Reset perubahan demo → Ya, reset demo. Status kembali ke CSV. Tunjukkan informasi sumber data serta batas prototype. Verifikasi disimpan hanya di browser, bukan server.

Ekspor CSV bila diperlukan: set filter pada Ranking, lalu klik Ekspor hasil CSV. Seluruh hasil filter diekspor sebelum pagination, bukan hanya 12 baris yang terlihat.
