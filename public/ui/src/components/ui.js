import {caseForStatus} from '../services/caseStatus.js';
import {esc,num,riskNames} from '../utils/formatters.js';
export const badge=r=>`<span class="risk-badge ${esc(r.toLowerCase())}"><i></i>${esc(riskNames[r])}<span class="sr-only"> (${esc(r)})</span></span>`;
export const statusBadge=s=>{const c=caseForStatus(s),labels={'Pending':'Belum diperiksa','Under Review':'Diperiksa','Need More Data':'Perlu data','Verified Compliant':'Sesuai','Verified Non-Compliant':'Tidak sesuai'};return `<span class="status-badge ${c.tone}" data-verification-status="${esc(s)}" title="${esc(c.label)}">${icon(s==='Under Review'?'search':c.icon)}<span>${esc(labels[s]||c.label)}</span></span>`;};
export const infoButton=(label,action,attrs='')=>`<button type="button" class="info-button" data-action="${action}" aria-label="${esc(label)}" title="${esc(label)}" aria-haspopup="dialog" aria-controls="modal" ${attrs}>${icon('info')}</button>`;
export const button=(label,action,cls='',attrs='')=>`<button type="button" class="btn ${cls}" data-action="${action}" ${attrs}>${label}</button>`;
export const link=(label,href,cls='btn',attrs='')=>`<a class="${cls}" href="#${href}" ${attrs}>${label}</a>`;
export const cardHead=(title,sub='',right='')=>`<div class="card-head"><div><h2>${title}</h2>${sub?`<p>${sub}</p>`:''}</div>${right}</div>`;
export const notice=(text,type='info')=>`<div class="notice ${type}">${icon(type==='warn'?'alert':'info')}<div>${text}</div></div>`;
export const empty=(title,sub,ico='chart')=>`<div class="empty"><span class="empty-icon">${icon(ico)}</span><h3>${title}</h3><p>${sub}</p></div>`;
export const metric=(label,value,sub='')=>`<div class="metric"><span>${label}</span><strong>${value}</strong>${sub?`<small>${sub}</small>`:''}</div>`;
export const scoreBar=r=>`<div class="score-cell"><strong>${num(r.risk_score,2)}</strong><span class="mini-track"><i class="${r.risk_level.toLowerCase()}" style="width:${r.risk_score}%"></i></span></div>`;
const shapes={
 more:'M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM12 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM12 18a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z',
 edit:'m16 2 6 6-13 13-7 1 1-7L16 2ZM4.5 16l-.5 4 4-.5L19 8.5 15.5 5 4.5 16Z',
 grid:'M4 3h6v7H3V4a1 1 0 0 1 1-1ZM14 3h6a1 1 0 0 1 1 1v6h-7V3ZM3 14h7v7H4a1 1 0 0 1-1-1v-6ZM14 14h7v6a1 1 0 0 1-1 1h-6v-7Z',
 list:'M3 3h3v4H3V3ZM9 3h12v4H9V3ZM3 10h3v4H3v-4ZM9 10h9v4H9v-4ZM3 17h3v4H3v-4ZM9 17h6v4H9v-4Z',
 building:'M5 2h14a1 1 0 0 1 1 1v18h2v1H2v-1h2V3a1 1 0 0 1 1-1ZM7 5v3h3V5H7ZM14 5v3h3V5h-3ZM7 11v3h3v-3H7ZM14 11v3h3v-3h-3ZM10 17v5h4v-5h-4Z',
 brain:'M11 4C9 1 4 2 4 6c-3 1-4 6-1 8-1 4 2 6 4 5 0 3 4 4 4 0V4ZM13 4c2-3 7-2 7 2 3 1 4 6 1 8 1 4-2 6-4 5 0 3-4 4-4 0V4Z',
 checklist:'M9 2h6v2h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4V2ZM8 6h8V4H8v2ZM6 13l4 4 8-8-1.5-1.5-6.5 6.5-2.5-2.5L6 13Z',
 arrow:'M4 11.25h13.94l-4.47-4.47 1.06-1.06L20.81 12l-6.28 6.28-1.06-1.06 4.47-4.47H4v-1.5Z',
 down:'m5.47 8.47 1.06-1.06L12 12.88l5.47-5.47 1.06 1.06L12 15 5.47 8.47Z',left:'m14.47 5.47 1.06 1.06L10.06 12l5.47 5.47-1.06 1.06L7.94 12l6.53-6.53Z',right:'m9.53 5.47 6.53 6.53-6.53 6.53-1.06-1.06L13.94 12 8.47 6.53l1.06-1.06Z',
 search:'M10 2a8 8 0 1 1 4.9 14.3L21 22l2-2-5.7-6.1A8 8 0 0 0 10 2ZM10 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z',
 info:'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20ZM11 6v2h2V6h-2ZM11 10v8h2v-8h-2Z',
 calendar:'M6 2h3v3h6V2h3v3h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2V2ZM5 10v3h3v-3H5ZM10.5 10v3h3v-3h-3ZM16 10v3h3v-3h-3ZM5 16v3h3v-3H5ZM10.5 16v3h3v-3h-3Z',
 download:'M11.25 3h1.5v10.94l3.47-3.47 1.06 1.06L12 17.81l-5.28-5.28 1.06-1.06 3.47 3.47V3ZM4 17h1.5v3h13v-3H20v4.5H4V17Z',
 filter:'M2 3h20v4l-8 8v6l-4 2v-8L2 7V3Z',
 refresh:'M20.5 3H19v3.3A9 9 0 1 0 21 12h-1.5a7.5 7.5 0 1 1-2.2-5.3H14v1.5h6.5V3Z',
 shield:'M12 1 22 5v7c0 6-10 11-10 11S2 18 2 12V5l10-4ZM6 12l4 4 8-8-2-2-6 6-2-2-2 2Z',
 alert:'M12 1 24 22H0L12 1ZM10.5 7v8h3V7h-3ZM10.5 17v3h3v-3h-3Z',
 check:'m2 12 6 6L22 4l-3-3L8 12 5 9l-3 3Z',
 clock:'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20ZM10.5 6v7l5 3 1.5-2.5-3.5-2V6h-3Z',
 close:'m4 2 8 8 8-8 2 2-8 8 8 8-2 2-8-8-8 8-2-2 8-8-8-8 2-2Z',
 menu:'M2 4h20v4H2V4ZM2 10h20v4H2v-4ZM2 16h20v4H2v-4Z',
 chart:'M2 2h3v17h18v3H2V2ZM8 10h3v6H8v-6ZM13 6h3v10h-3V6ZM18 2h3v14h-3V2Z',
 layers:'m12 1 12 6-12 6L0 7l12-6ZM2 10l10 5 10-5 2 3-12 6L0 13l2-3ZM2 16l10 5 10-5 2 3-12 6L0 19l2-3Z',
 file:'M5 2h9l5 5v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1ZM13 3v5h5l-5-5ZM7 12v2h9v-2H7ZM7 16v2h7v-2H7Z',
 save:'M3 2h15l4 4v16H2V2h1ZM6 3v6h11V3H6ZM6 14v7h12v-7H6Z',
 external:'M14 3h7v7h-1.5V5.56l-9.47 9.47-1.06-1.06 9.47-9.47H14V3ZM3 6h7v1.5H4.5v12h12V14H18v7H3V6Z',
 help:'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20ZM8 8h3c0-1 2-1 2 0s-3 2-3 5h3c0-1 3-2 3-5 0-5-8-5-8 0ZM10 16v3h3v-3h-3Z',
 user:'M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10ZM3 22v-3c0-8 18-8 18 0v3H3Z',
 users:'M9 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM18 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM1 21v-4c0-8 16-8 16 0v4H1ZM18 12c3 0 5 2 5 5v4h-4v-4c0-2-.4-3.5-1-5Z',
 userplus:'M8 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM1 22v-4c0-8 14-8 14 0v4H1ZM18 6h3v4h4v3h-4v4h-3v-4h-4v-3h4V6Z',
 lock:'M6 9V7a6 6 0 0 1 12 0v2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2ZM9 9h6V7a3 3 0 0 0-6 0v2ZM10 14v5h4v-5h-4Z',
 mail:'M2 4h20v16H2V4ZM4 6l8 6 8-6H4ZM4 9v3l8 6 8-6V9l-8 6-8-6Z',
 logout:'M3 3h9v1.5H4.5v15H12V21H3V3ZM16.53 6.47 22.06 12l-5.53 5.53-1.06-1.06 3.72-3.72H9v-1.5h10.19l-3.72-3.72 1.06-1.06Z'
};
const lineShapes={search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',right:'<path d="m9 5 7 7-7 7"/>',left:'<path d="m15 5-7 7 7 7"/>',down:'<path d="m5 9 7 7 7-7"/>'};
export const solidIcon=(name,cl='')=>lineShapes[name]?`<svg class="icon icon-line icon-${name} ${cl}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${lineShapes[name]}</svg>`:`<svg class="icon icon-solid icon-${name} ${cl}" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="${shapes[name]||shapes.grid}"/></svg>`;
export const icon=solidIcon;
