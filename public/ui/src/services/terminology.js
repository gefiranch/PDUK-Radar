export const TERMS={score:'Skor risiko analitik',median:'Nilai tengah peserta perusahaan sejenis',percentile:'Posisi jumlah peserta dibanding perusahaan sejenis',deviation:'Selisih peserta dibanding perusahaan sejenis',group:'Kelompok perusahaan pembanding',count:'Jumlah perusahaan pembanding',drivers:'Kategori penyumbang risiko terbesar',flags:'Peringatan berdasarkan aturan',completeness:'Kelengkapan data penilaian'};
export const CATEGORIES=[
 ['coverage_gap','Kesesuaian Pendaftaran Pekerja',.30,'Kesenjangan peserta terdaftar dengan jumlah pekerja pada sumber data.','Klarifikasi jumlah pekerja yang wajib didaftarkan dan peserta PPU aktif.'],
 ['peer_deviation','Perbandingan dengan Perusahaan Sejenis',.25,'Perbedaan jumlah peserta terhadap kelompok perusahaan pembanding.','Tinjau skala dan karakteristik perusahaan pembanding.'],
 ['stagnation_growth','Perkembangan Kepesertaan',.15,'Stagnasi dan perbedaan perkembangan aktivitas usaha dengan pertumbuhan peserta.','Klarifikasi stagnasi dan pertumbuhan kepesertaan.'],
 ['mutation','Perubahan Data Kepesertaan',.10,'Pola penambahan dan penonaktifan peserta.','Periksa dokumen dan waktu perubahan peserta.'],
 ['historical_compliance','Riwayat Kepatuhan',.10,'Indikator kepatuhan historis yang tersedia pada dataset.','Tinjau konteks riwayat kepatuhan dan kelengkapan dokumennya.'],
 ['anomaly_model','Pola Tidak Biasa dari Model AI',.10,'Sinyal anomali dari Isolation Forest; bukan probabilitas pelanggaran.','Bandingkan sinyal anomali dengan indikator lain sebelum pemeriksaan.']
];
// Labels are selected explicitly at the component boundary, never by rewriting rendered HTML.
export function naturalize(html){return html;}
