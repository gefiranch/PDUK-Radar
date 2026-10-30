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
