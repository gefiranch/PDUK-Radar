# Data dictionary singkat — PDUK-Radar v1.0.0

Nilai persen direpresentasikan sebagai rasio desimal (`0.40` = 40%), kecuali kontribusi skor (`points`, skala 0–100) dan `peer_percentile` (0–100).

| Field | Tipe | Penggunaan dan aturan |
|---|---|---|
| `employer_id` | string | ID sintetis unik `EMP-0001..EMP-0500` |
| `sector` | enum string | 6 sektor proposal |
| `region` | enum string | 5 wilayah proposal |
| `company_scale` | enum string | Mikro/Kecil/Menengah/Besar |
| `active_participant` | integer ≥0 | Peserta PPU aktif pada 2025-12 |
| `actual_workers` | integer ≥0 / null | Jumlah pekerja terverifikasi *simulasi*; null jika tidak tersedia |
| `coverage_ratio` | number / null | `active_participant / actual_workers`, null jika pekerja tidak diketahui |
| `coverage_gap` | number / null | `max(0,1-coverage_ratio)`, dibulatkan 2 desimal |
| `peer_median` | number | Median peserta aktif di peer group, mengecualikan dirinya |
| `peer_count` | integer ≥12 | Jumlah pembanding yang dipakai |
| `peer_group_level` | enum string | `sector_region_scale`, `sector_scale`, `scale` |
| `peer_percentile` | integer 0..100 | Persentil dengan konvensi proporsi peer di bawah nilai perusahaan |
| `peer_deviation` | number | `(peer_median-active_participant)/peer_median`; boleh negatif |
| `stagnation_months` | integer 0..23 | Jumlah **transisi bulan beruntun** dari bulan terakhir tanpa perubahan peserta |
| `company_growth_12m` | number | Pertumbuhan aktivitas perusahaan *sintetis* 12 bulan (bukan pendapatan aktual) |
| `participant_growth_12m` | number | `(active_des_2025-active_des_2024)/active_des_2024` |
| `growth_mismatch` | number | `max(0,company_growth_12m-participant_growth_12m)` |
| `mutation_rate` | number | Maksimum rasio `(new+inactive)/active_bulan_sebelumnya` dalam 12 bulan terakhir |
| `mutation_score` | number 0..1 | `clip(mutation_rate/.7,0,1)` |
| `historical_compliance_score` | number 0..1 / null | Simulasi faktor historis; 1 lebih berisiko, null jika tidak ada data |
| `anomaly_score_norm` | number 0..1 | Output Isolation Forest yang dinormalisasi; bukan probabilitas pelanggaran |
| `feature_scores` | object | 6 nilai `coverage_gap, peer_deviation, stagnation_growth, mutation, historical_compliance, anomaly_model` dalam 0..1/null |
| `score_contributions` | object | Kontribusi masing-masing dari 6 fitur dalam **poin skor**, jumlahnya = `risk_score` |
| `risk_score` | number 0..100 | Formula berbobot, setelah bobot dinormalisasi saat fitur null |
| `risk_level` | enum string | Low/Medium/High/Critical dengan batas tanpa celah |
| `data_completeness` | number 0..1 | Jumlah bobot fitur tersedia, **bukan confidence probabilistik** |
| `data_quality` | enum string | `complete` atau `partial` |
| `data_warnings` | string[] | Penjelasan data yang hilang dan fallback peer |
| `rule_flags` | object[] | Kode, nilai, ambang, dan alasan; **tidak menambah skor** |
| `risk_drivers` | object[] | 3 komponen dengan kontribusi terbesar |
| `risk_explanation` | string | Narasi analitis dan disclaimer non-vonis |
| `verification_status` | enum string | Pending/Under Review/Need More Data/Verified Compliant/Verified Non-Compliant |
| `verification` | object | Status, catatan, tindakan, lampiran bukti simulasi, histori perubahan |
| `history.active` | integer[24] | Jumlah aktif per bulan; elemen terakhir sama dengan `active_participant` |
| `history.new` | integer[24] | Peserta ditambahkan per bulan, elemen pertama nol |
| `history.inactive` | integer[24] | Peserta dinonaktifkan per bulan, elemen pertama nol |
| `months` | string[24] | Label periode bersama untuk seluruh perusahaan di `details.json` |

**Persamaan arus data:** `active[t] = active[t-1] + new[t] - inactive[t]` untuk t = 1..23. `history` memakai array angka untuk mengurangi ukuran payload dibanding 12.000 objek tanggal yang berulang.

**Status data:** `verified_compliant` dan `verified_non_compliant` hanya **hasil simulasi pada demo**, tidak boleh dibaca sebagai status hukum/perusahaan sebenarnya.

## Ketersediaan aktual dan pemisahan revisi komprehensif

Tabel di atas mendeskripsikan kontrak field, **bukan klaim bahwa seluruh field tersedia**. Pada snapshot yang dipakai, `details.months=[]`, `details.employers={}`. `history`, `peer_percentile`, `feature_scores`, `score_contributions`, `rule_flags`, `risk_explanation`, evidence dan catatan awal tidak disertakan. Indikator penilaian tersedia dari CSV, termasuk 131 jumlah pekerja yang null. Jangan mengisi field tidak tersedia dengan nol atau data demo.

- Enam kategori/bobot awal ditentukan satu kali di `services/terminology.js`; label UI dipilih eksplisit, bukan regex pengganti HTML.
- Rekonstruksi `stagnation_growth = .6 × min(stagnation_months/18,1) + .4 × min(growth_mismatch/.5,1)`. Nilai yang hilang dikeluarkan dari denominator bobot. `peer_deviation` di-clamp ke 0..1 untuk rekonstruksi; nilai mentah CSV dipertahankan.
- `score_contributions` hanya dipakai jika sumber benar-benar menyediakannya. Estimasi dari indikator dibulatkan dihitung terpisah dan bukan nilai resmi. Selisih tidak dialokasikan ulang.
- `data/source-provenance.json` memuat hash CSV LF yang dilacak Git dan hash CRLF unggahan asli. Ketiga snapshot masih menyimpan provenance CRLF asli; validator memeriksa kedua encoding dan seluruh nilai.

## State dan audit D1

| Field | Makna |
| --- | --- |
| `case_records.employer_id` | ID yang harus ada dalam indeks 500 perusahaan |
| `payload` | JSON state pemeriksaan; tidak memuat edit skor sumber |
| `version` | Integer naik satu per perubahan; `expectedVersion` wajib saat PATCH |
| `last_change_id` | UUID perubahan untuk memasangkan update atomik dengan audit |
| `updated_at` | Waktu UTC server |
| `case_events` | Append-only, unik per `(employer_id,version)`; SQL menolak UPDATE/DELETE |
| `actor_id/name/role` | Dari sesi aktif pada server, bukan request body |
| `previous_status/new_status/reason` | Transisi dan alasan koreksi/pembukaan kembali |
| `case_events.payload` | Snapshot peristiwa, termasuk progres lama/baru, tanggal, catatan dan tindakan |

`status` memakai enum verifikasi asli. `followUpStatus` memakai `Pending`, `In Progress`, `Completed`; hanya berlaku untuk Tidak Sesuai. `closureNote` wajib saat Completed, sedangkan hasil Sesuai memakai catatan pemeriksaan sebagai alasan penutupan. `date` YYYY-MM-DD valid dan tidak lebih dari tanggal hari ini Asia/Jakarta. Note/closure maksimal 2.000 karakter, finding/action 500, correction/reopen reason 1.000. String kontrol ditolak; HTML diperlakukan sebagai teks dan di-escape saat render.

GET detail mengembalikan `history` kronologis untuk 100 event terbaru, `historyCount`, dan `nextBefore`. Riwayat lebih lama diambil dengan cursor versi. Case status/queue diturunkan oleh `caseForStatus`; tidak mengubah `risk_score/risk_level`.

## Lampiran demonstrasi

`data/demo/demo_details_500.json`, `demo_verifications_500.json`, dan `demo_scenarios.json` adalah tambahan sintetis opt-in, terpisah dari sumber dan D1. `synthetic=true`, `demo_mode_required=true`, serta marker alokasi dipertahankan. Semua ID dan anchor bulan terakhir sudah diuji cocok dengan indeks; kecocokan bukan bukti observasi.

`demo_peer_percentile`, `demo_rule_flags`, `demo_score_contributions`, `demo_risk_explanation` tidak menggantikan nama field sumber. `demo_xai_status=ILLUSTRATIVE_ALLOCATION_NOT_MODEL_OUTPUT` berarti alokasi latihan, bukan kontribusi model ataupun hasil metode rekonstruksi. Evidence tambahan berstatus belum tersedia; UI tidak mengklaim dokumen telah diunggah. Histori demo selalu dilabeli sintetis. Catatan latihan memakai browser key terpisah, tidak diimpor ke D1.
