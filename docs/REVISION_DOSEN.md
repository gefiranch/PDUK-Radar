# Revisi enam masukan dosen — PDUK-Radar

30 Oktober 2026, Asia/Jakarta.

## Audit website aktual

Audit dimulai melalui URL publik Explainability EMP-0348 sebelum mengubah kode. Login dilanjutkan oleh pemilik melalui Cloud Browser. Dashboard, peringkat/pencarian, Detail EMP-0348, Explainability, form verifikasi, navigasi/sidebar, dan modal sumber data diperiksa. Halaman aktual memakai CSV snapshot: 500 perusahaan, skor EMP-0348 83,25, peserta 8, pekerja simulasi 37, kesenjangan 78%, nilai tengah pembanding 35,5, 20 pembanding, dasar sektor/skala, stagnasi 23 bulan. Status awal Under Review. Tidak ada seri bulanan, persentil, kontribusi resmi, rincian flag, atau catatan awal pada data server. Audit menemukan tautan langsung hilang saat login; ini diperbaiki.

## Enam revisi

| Masukan | Implementasi |
| --- | --- |
| Konteks ketenagakerjaan | Tahap khusus pendaftaran pekerja PPU dalam JKN, identitas anonim, peserta, pekerja, kesenjangan, periode dan kelengkapan; selisih bukan bukti pelanggaran. |
| Metode XAI | Transparent Additive Explanation / Intrinsic Explainability, bobot awal/efektif, indikator, kontribusi sumber bila tersedia atau estimasi indikatif, pemeriksaan toleransi 0,051 poin. Tidak mengklaim SHAP, probabilitas, atau kausalitas. |
| Bahasa alami | Kamus istilah terpusat dan label kategori konsisten. Perbandingan 8 peserta versus nilai tengah 35,5 dari 20 perusahaan; fallback sektor/skala dijelaskan. Persentil yang hilang tidak diganti nol. |
| Kategori penilaian | Enam kartu berisi deskripsi, nilai, bobot, estimasi/kontribusi, bantuan Apa artinya dan fokus verifikasi. Tiga kategori terbesar ditampilkan terpisah dari peringatan aturan. |
| Kasus Selesai | Sidebar dan tab Kasus Selesai. Sesuai ditutup; Tidak Sesuai tetap tindak lanjut. Progres Pending/In Progress/Completed. Catatan wajib saat Completed; pembukaan kembali wajib alasan; histori dipertahankan. |
| Detail runtut | Tujuh tahap: konteks, pembanding, histori, XAI/kategori, fokus, verifikasi, tindak lanjut. Tombol navigasi tahap dan tautan antarmodul mempertahankan ID. |

Status penanganan tampil terpisah sebagai kolom teks pada ranking dan pada tahap penyelesaian, tanpa menggandakan badge verifikasi. Seluruh state efektif memakai adapter yang sama dan key localStorage v1 yang sudah ada. JSON sumber dan skor tidak diubah.

## Hasil pengujian

- 31 unit/regression test lulus, mencakup render 500 perusahaan, persistensi, status, koreksi, follow-up, kompatibilitas penyimpanan lama, serta toleransi XAI.
- 124 pemeriksaan browser pada aplikasi preview asli lulus. Lima skenario lintas halaman dan refresh, catatan penutupan wajib, penyelesaian, daftar selesai, pembukaan kembali, histori, dan Reset Demo diuji.
- 16 pemeriksaan responsif lulus: Detail/XAI/Verifikasi/Kasus Selesai pada 390, 768, 1071 dan 1440 px; tanpa overflow, NaN/undefined atau judul teknis peer yang tidak dijelaskan.
- EMP-0348 menampilkan enam kategori; tautan langsung tetap EMP-0348 setelah refresh dan setelah login. Form tambah/login ikut lolos uji. Navigasi langsung aplikasi utama XAI → Verifikasi → Detail → XAI mempertahankan EMP-0348.
- TypeScript, validasi dataset, sintaks modul, dan Worker build lulus. Fixture QA dan database lokal dikecualikan dari deployment.
- Before: screenshots/dosen-before.jpg dari website publik sebelum revisi. After: screenshots/dosen-after.jpg dari preview revisi yang diuji. Dataset sumber tetap sama; catatan QA lokal bukan akun/kasus produksi.

## Keterbatasan yang tidak disamarkan

Sumber proyek hanya CSV snapshot dan JSON turunannya. Histori 24 bulan tersedia untuk **0 dari 500** perusahaan; field persentil, kontribusi resmi dan rincian peringatan juga belum disertakan. Pencarian berkas pelengkap yang disebut di instruksi tidak menemukan nama file yang cocok. Komponen grafik asli tetap dipertahankan dan dapat membaca seri lengkap ketika sumbernya tersedia.

Rekonstruksi EMP-0348 dari nilai CSV yang dibulatkan menghasilkan 83,19, berbeda 0,060 poin dari skor sumber 83,25. Selisih ini **melebihi** batas 0,051; UI menampilkan peringatan dan tidak menyesuaikan angka agar seolah cocok. Kontribusi 12,30 pada contoh tidak dapat direkonstruksi persis dari indikator perkembangan yang tersedia (hasil 12,24). Empat flag dan persentil 0 dalam contoh belum dapat divalidasi. Jangan menyebut enam estimasi sebagai kontribusi resmi. Tidak ada seri/evidence palsu, SHAP, integrasi pemerintah, atau penilaian ulang risiko baru.

Verifikasi/tindak lanjut disimpan lokal per akun/browser, bukan basis data pemeriksaan produksi. Unggah bukti belum tersedia. Hosting tetap publik; workspace tetap memerlukan login aplikasi.

## Cara demonstrasi kepada dosen

1. Masuk dan buka EMP-0348 dari peringkat. Tunjukkan tujuh tahap serta pembanding 8 versus 35,5 dari 20 perusahaan.
2. Buka Penjelasan Skor Risiko (XAI), enam kategori dan tiga prioritas. Jelaskan formula, batas sumber, dan selisih 83,19 versus 83,25 dengan jujur.
3. Pada kasus Critical aktif, simpan Sesuai dengan catatan. Tunjukkan skor tetap dan kasus masuk Kasus Selesai.
4. Pada kasus lain, simpan Tidak Sesuai. Tunjukkan bahwa kasus masih perlu tindak lanjut. Isi catatan penyelesaian lalu pilih Tuntas.
5. Refresh, lihat daftar Kasus Selesai dan histori. Buka kembali dengan alasan. Reset Demo mengembalikan data awal akun tersebut.

Pakai catatan simulasi, bukan data pribadi pekerja.
