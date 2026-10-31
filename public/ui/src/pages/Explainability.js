import {demonstrationPanel} from '../components/demonstration.js';
import {esc,pct} from '../utils/formatters.js';
import {profile} from './EmployerDetail.js';
import {categoryPanel,topPanel,peerPanel,flagsPanel} from '../components/assessment.js';
import {cardHead,empty,link,icon} from '../components/ui.js';
export function Explainability(store,id){
 const r=store.getExplainability(id);if(!r)return `<section class="card selection-empty">${empty('Pilih perusahaan untuk melihat penjelasan','Temukan perusahaan melalui peringkat risiko untuk memahami skornya.','brain')}${link('Pilih perusahaan','/ranking','btn primary')}</section>`;
 const next={'Pending':'Mulai klarifikasi dengan tiga fokus pemeriksaan di atas.','Under Review':'Lanjutkan klarifikasi dan catat hasil pemeriksaan perusahaan.','Need More Data':'Lengkapi data yang diperlukan sebelum melanjutkan pemeriksaan.','Verified Compliant':'Hasil verifikasi sudah sesuai. Tinjau catatan pemeriksaan bila diperlukan.','Verified Non-Compliant':r.case_queue==='closed'?'Tindak lanjut sudah dituntaskan. Tinjau catatan penyelesaian di Ruang verifikasi.':'Hasil verifikasi memerlukan tindak lanjut. Tinjau rencana dan catat perkembangannya.'}[r.verification_status];
 return `<div class="page-heading"><div><h1>Penjelasan skor risiko</h1><p>Lihat indikator pembentuk skor dan fokus pemeriksaan perusahaan.</p></div>${link('Detail perusahaan','/detail/'+id,'btn')}</div>${profile(r)}
 ${topPanel(r)}${categoryPanel(r)}${demonstrationPanel(store,id)}
 <details class="card supporting-analysis"><summary><span>${icon('layers')}Data pendukung penilaian<small>Pembanding, peringatan, dan kelengkapan data</small></span>${icon('down')}</summary><div class="supporting-content"><div class="supporting-grid">${peerPanel(r)}${flagsPanel(r)}</div>${r.risk_explanation?`<section class="supporting-note">${cardHead('Penjelasan dari sumber')}<p>${esc(r.risk_explanation)}</p></section>`:''}<section class="supporting-note"><h3>Kelengkapan data penilaian · ${pct(r.data_completeness)}</h3><p>Persentase ini menunjukkan kelengkapan indikator untuk penilaian. Histori 24 bulan, persentil, kontribusi resmi, dan rincian peringatan belum tersedia pada sumber saat ini. Estimasi dari nilai yang dibulatkan tidak menggantikan skor sumber.</p></section></div></details>
 <section class="card analysis-next" data-case-banner="${esc(r.case_status)}"><div><h2>Langkah berikutnya</h2><p>${esc(next)}</p></div>${link('Buka verifikasi','/verification/'+id,'btn primary')}</section>`;
}
