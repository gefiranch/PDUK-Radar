# PDUK-Radar — Website Data Package v1.0.0

**Status:** siap untuk *prototype website statis*. Seluruh data adalah **SINTETIS**. Ini adalah kontrak data rancangan untuk prototype PDUK-Radar, **bukan standar resmi, ekspor, API, atau data aktual BPJS Kesehatan**.

## 1. Apa yang dibuat

- 500 pemberi kerja anonim `EMP-0001` s.d. `EMP-0500`.
- 24 periode, Januari 2024 sampai Desember 2025; **12.000 observasi perusahaan-bulan**.
- 6 sektor, 5 wilayah, 4 kelas skala usaha.
- 375 label skenario normal dan 125 label anomali sintetis untuk pengujian **(hanya disimpan di `qa/`)**.
- Indikator: coverage gap (jika denominator ada), peer deviation, stagnasi, mismatch pertumbuhan, mutasi, riwayat kepatuhan, dan Isolation Forest.
- Skor, kategori, kontribusi komponen, flag aturan, kualitas data, penjelasan, dan status verifikasi.
- Dashboard summary, risk ranking, employer detail, explainability, verification workspace.

## 2. Berkas yang harus diletakkan di website

| File | Dipakai oleh | Keterangan |
|---|---|---|
| `public/dashboard.json` | Dashboard Overview | KPI, distribusi skor, risiko per sektor, top 10, status High/Critical, konfigurasi skor |
| `public/employers.json` | Employer Risk Ranking | 500 baris indeks ringan; untuk sorting, search, filter, dan pagination |
| `public/details.json` | Employer Detail, Explainability, Verification | Lookup berdasarkan `EMP-xxxx`; 24 bulan histori tersimpan sebagai tiga array angka |
| `public/pduk-radar-client.js` | Semua halaman | Adapter JavaScript agar field dapat diakses melalui fungsi sederhana |

`*.json.gz` merupakan versi gzip yang lebih hemat transfer; **gunakan `*.json` biasa** jika server tidak dikonfigurasi untuk `Content-Encoding: gzip`. File `.gz` tidak otomatis bisa di-fetch sebagai JSON tanpa pengaturan server yang benar.

## 3. Pemetaan halaman website

| Halaman | Fungsi adapter | Data yang dibaca |
|---|---|---|
| Overview | `getDashboard()` | `summary.risk_counts`, `histogram`, `sector_risk`, `top_risk_employers`, `verification_high_critical` |
| Ranking | `getRanking({ q, sector, region, riskLevel, verificationStatus, page })` | `employers[]` yang telah diurutkan menurun berdasarkan skor |
| Employer Detail | `getEmployer('EMP-0001')`, `getTrends(id)` | Identitas anonim, kondisi, peer, histori 24 bulan |
| Explainability | `getExplainability(id)` | Nilai komponen, kontribusi (poin), flag dan narasi |
| Verification Workspace | `saveVerification(id, {...})` | Status dan catatan **lokal di browser untuk demo**, bukan database atau audit produksi |

## 4. Rumus scoring final (versi demo)

- Bobot: C=30%, P=25%, S=15%, M=10%, H=10%, A=10%.
- Setiap komponen yang tersedia dinormalisasi ke **0–1**.
- Formula jika semua komponen tersedia: `risk_score = 100*(.30*C+.25*P+.15*S+.10*M+.10*H+.10*A)`.
- Jika terdapat komponen `null`, bobot dihitung ulang hanya atas komponen yang **tersedia**: `risk_score = 100*Σ(w_i*x_i)/Σ(w_i untuk x_i tersedia)`.
- `score_contributions` memakai bobot yang telah disesuaikan sehingga **jumlahnya = risk_score** setelah pembulatan dua desimal.
- `data_completeness` = **jumlah bobot komponen tersedia**, bukan probabilitas kepatuhan atau confidence model. Nilai 0.60 berarti 60% bobot fitur tersedia.
- **Rule-based menghasilkan `rule_flags` saja**, tidak menambah poin skor agar tidak terjadi *double counting*.
- Jika `actual_workers` tidak tersedia, maka `coverage_gap=null`, bukan 0.
- `stagnation_growth = .60*min(stagnation_months/18,1) + .40*min(growth_mismatch/.50,1)`.
- `mutation_score = min(mutation_rate/.70,1)`, di mana `mutation_rate` = rasio maksimum `(new+inactive)/active_bulan_sebelumnya` dalam 12 bulan terakhir.
- `peer_deviation_score = clip((peer_median-active_participant)/peer_median, 0,1)`.
- Skor model adalah persentil relatif hasil Isolation Forest yang dinormalisasi menggunakan p5 dan p95 dari **sampel referensi sintetis terpisah**. Tidak ada label hasil verifikasi yang digunakan untuk melatih model.

Kategori level risiko (tanpa celah desimal): `Low` R≤30; `Medium` 30<R≤60; `High` 60<R≤80; `Critical` R>80.

**Threshold 33 hanya dipakai untuk evaluasi kelas sintetis; ini berbeda dari ambang prioritas High/Critical (>60).** Jangan menamai threshold 33 sebagai cutoff operasional atau angka "optimal" untuk BPJS.

## 5. Aturan peer group dan missing data

Setiap perusahaan dibandingkan dengan anggota **selain dirinya sendiri**. Minimum peer group adalah 12 perusahaan. Urutan prioritas: `sector + region + company_scale` → `sector + company_scale` → `company_scale` saja. Nilai `peer_group_level`, `peer_count`, dan `data_warnings` memperlihatkan fallback secara transparan. Semua perbandingan menggunakan peserta aktif pada snapshot Desember 2025.

`actual_workers` dalam data ini adalah **simulasi jumlah pekerja terverifikasi**. Pada sistem riil, angka semacam ini memerlukan definisi eligible PPU, tanggal berlaku, sumber serta status verifikasi. Headcount mentah **tidak boleh dipakai otomatis sebagai bukti PDUK**.

## 6. Integrasi JavaScript

Simpan ketiga JSON dan `pduk-radar-client.js` pada folder `public`. Jalankan website menggunakan web server lokal (jangan membuka HTML dengan `file://` karena `fetch` dapat dibatasi peramban).

```js
import { loadPdukRadar } from './public/pduk-radar-client.js';

const store = await loadPdukRadar('./public');

// Dashboard
const overview = store.getDashboard();
console.log(overview.total_employers, overview.risk_counts);

// Ranking, 12 data per halaman
const ranking = store.getRanking({ riskLevel: 'High', page: 1, pageSize: 12 });
console.table(ranking.rows);

// Detail, grafik, dan alasan skor
const detail = store.getEmployer('EMP-0001');
const trends = store.getTrends('EMP-0001');
const explain = store.getExplainability('EMP-0001');

// Demo verifikasi (localStorage, bukan ke server)
store.saveVerification('EMP-0001', {
  status: 'Under Review',
  findingType: 'Klarifikasi data peserta',
  note: 'Periksa dokumen pekerja dan mutasi.',
  nextAction: 'Minta data pelengkap',
});
```

Data dan metadata dapat digunakan oleh HTML/CSS/JavaScript tanpa framework sebagaimana rancangan prototype di proposal. Adapter juga dapat dipakai dalam React/Vue dengan sedikit penyesuaian.

## 7. Berkas internal / jangan disajikan ke browser

- `qa/evaluation_INTERNAL_ONLY.json`: label anomali sintetis dan evaluasi. **JANGAN** menyalin ke folder publik. Label ini khusus sanity check; bukan verifikasi pelanggaran riil.
- `data/employers_500.csv`: tabel analitik untuk audit dan pengembangan.
- `data/monthly_history_12000.csv`: histori lengkap untuk inspeksi atau impor backend.
- `tools/generate_data.py`: generator deterministik.
- `tools/validate_data.py`: cek konsistensi data, formula, dan seluruh agregat.
- `schemas/`: JSON Schema untuk memvalidasi struktur data.

## 8. Batasan dan standar teknis

- JSON UTF-8, kontrak `schema_version=1.0.0`, `dataset_id` konsisten, numerik asli (bukan string), missing value ditulis `null`, ID stabil, tanggal `YYYY-MM` atau `YYYY-MM-DD`, semua status/kategori dari enum yang jelas.
- Data profil perusahaan **hanya ID fiktif** dan atribut sintetis, tanpa nama perusahaan sebenarnya, NIK, nomor peserta, email, nomor telepon, atau informasi sensitif.
- Paket ini memenuhi **kontrak data internal yang didokumentasikan**, bukan sertifikasi standar eksternal.
- Data lengkap dan logika historis dibuat untuk *prototype*, bukan sampling representatif populasi BPJS. Presisi, recall, dan yield dari `qa/` tidak dapat digeneralisasikan sebagai performa di produksi.
- Jika terhubung ke data riil, wajib ada otorisasi, kontrol akses, log audit, tata kelola label, perlindungan data pribadi, rekonsiliasi sumber, dan uji lapangan.
- Nilai dashboard pada paket ini **dihitung ulang** dari dataset baru, sehingga dapat berbeda dengan angka screenshot proposal lama. **Jangan mencampur data baru dengan screenshot, skor, atau confusion matrix dari proposal versi lama.**

## 9. Regenerasi, validasi, dan menjalankan demo

```bash
python tools/generate_data.py
python tools/validate_data.py
python -m http.server 8000
# buka http://localhost:8000/public/demo.html
```

Python 3, `numpy`, `scikit-learn` dibutuhkan **hanya untuk regenerasi**. Untuk konsumsi website, cukup browser dan hosting statis.
