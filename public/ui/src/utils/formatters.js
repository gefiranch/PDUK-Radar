import {CATEGORIES} from '../services/terminology.js';
import {VERIFICATION_STATES} from '../services/caseStatus.js';
export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const num=(n,d=0)=>n==null?'Data tidak tersedia':Number(n).toLocaleString('id-ID',{maximumFractionDigits:d,minimumFractionDigits:d});
export const pct=(n,d=0)=>n==null?'Data tidak tersedia':`${num(n*100,d)}%`;
export const shortDate=v=>v?new Date(v.length===10?v+'T12:00:00+07:00':v).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Jakarta'}):'Belum ada pembaruan';
export const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export const riskColors={Low:'#16864F',Medium:'#C68B0A',High:'#D4601F',Critical:'#C52E41'};
export const riskNames={Low:'Rendah',Medium:'Sedang',High:'Tinggi',Critical:'Kritis'};
export const statusNames=Object.fromEntries(Object.entries(VERIFICATION_STATES).map(([s,v])=>[s,v.label]));
export const dateTime=v=>v?new Date(v).toLocaleString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jakarta'})+' WIB':'Waktu tidak tersedia';
export const peerNames={sector_region_scale:'Sektor, wilayah & skala',sector_scale:'Sektor & skala',scale:'Skala perusahaan'};
export const components=CATEGORIES.map(([key,label,weight])=>[key,label,weight]);
export function csvText(rows){if(!rows.length)return '';const keys=['employer_id','sector','region','company_scale','active_participant','actual_workers','risk_score','risk_level','data_completeness','data_quality','verification_status'];const quote=x=>'"'+String(x??'').replace(/^[=+@\-]/,"'$&").replace(/"/g,'""')+'"';return '\uFEFF'+[keys.join(','),...rows.map(r=>keys.map(k=>quote(r[k])).join(','))].join('\r\n');}
export function downloadCSV(rows){const url=URL.createObjectURL(new Blob([csvText(rows)],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='PDUK-Radar-hasil-filter.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
