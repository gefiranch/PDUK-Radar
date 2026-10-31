// Ignored local visual fixture: actual component renderers, no authentication or API mutations.
// Use only with the development preview; these HTML files are excluded from source/build output.
import {readFileSync,writeFileSync,rmSync} from 'node:fs';

if(process.argv.includes('--clean')){for(const file of ['public/qa-theme-page.html','public/qa-theme-responsive.html','public/qa-motion.html'])rmSync(file,{force:true});process.exit(0);}
const input=['employers','dashboard','details'].map(n=>JSON.parse(readFileSync('data/snapshots/'+n+'.json','utf8')));
const source=readFileSync('public/ui/src/main.js','utf8');
const navItems=source.match(/const navItems=(.*);/)[1];
const shell=source.match(/function shell\(\)\{(.*)\}\nfunction render/)[1];
const passwordReset=source.match(/function openPasswordReset\(u\)\{(.*)\}\nmodal.addEventListener/)[1];
const script=`
import {accountProfile,logoutMessage} from '/ui/src/components/account.js';
import {initializeSidebar,toggleSidebar,syncSidebarToggle} from '/ui/src/services/sidebar.js';
import {methodPanel,categoryExplanation} from '/ui/src/components/assessment.js';
import {brandMark,icon,solidIcon,button} from '/ui/src/components/ui.js';
import {esc} from '/ui/src/utils/formatters.js';
import {createStore} from '/ui/src/services/dataService.js';
import {initializeTheme} from '/ui/src/services/theme.js';
import {Dashboard} from '/ui/src/pages/Dashboard.js';
import {EmployerRanking} from '/ui/src/pages/EmployerRanking.js';
import {EmployerDetail} from '/ui/src/pages/EmployerDetail.js';
import {Explainability} from '/ui/src/pages/Explainability.js';
import {VerificationWorkspace} from '/ui/src/pages/VerificationWorkspace.js';
import {UserManagement} from '/ui/src/pages/UserManagement.js';
import {Login} from '/ui/src/pages/Login.js';
const params=new URLSearchParams(location.search);initializeTheme();initializeSidebar();
const data=${JSON.stringify(input)},store=createStore(...data,{storage:null}),app=document.querySelector('#app'),modal=document.querySelector('#modal');
const currentUser={id:'visual-admin',name:'Admin Visual QA',role:'admin'},users=[{...currentUser,email:'admin@example.test',role:'admin',status:'active'}, {id:'visual-user',name:'User Visual QA',email:'user@example.test',role:'user',status:'active'}];
function shell(){${shell}}
function closeUserMenus(){}
function openModal(title,body,footer=''){modal.innerHTML='<div class="modal-head"><h2>'+title+'</h2><button class="icon-btn" data-action="close-modal" aria-label="Tutup dialog">'+icon('close')+'</button></div><div class="modal-body">'+body+'</div><div class="modal-footer">'+footer+'</div>';modal.showModal();}
function openPasswordReset(u){${passwordReset}}
const pages={overview:()=>Dashboard(store),ranking:()=>EmployerRanking(store,{}),detail:()=>EmployerDetail(store,'EMP-0348'),explain:()=>Explainability(store,'EMP-0348'),verification:()=>VerificationWorkspace(store,params.get('id')||'EMP-0348','',params.get('queue')||'active'),users:()=>UserManagement({users,loaded:true})};
const page=params.get('page')||'overview';if(page==='login'){document.body.classList.add('auth-view');app.innerHTML=Login();}else{shell();document.querySelector('#breadcrumb-current').textContent=page;document.querySelector('#main').innerHTML=(pages[page]||pages.overview)();document.querySelector('#navigation').innerHTML=[...${navItems},['users','users','Kelola pengguna']].map(([key,ico,label])=>'<a href="?page='+key+'" aria-label="'+label+'" data-tooltip="'+label+'" class="nav-item '+(page===key?'active':'')+'">'+icon(ico)+'<span>'+label+'</span></a>').join('');}
for(const target of [app,modal]){target.addEventListener('submit',e=>e.preventDefault());target.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;if(a==='toggle-sidebar')toggleSidebar();if(a==='toggle-nav')document.body.classList.toggle('nav-open');if(a==='close-nav')document.body.classList.remove('nav-open');if(a==='reset-user-password')openPasswordReset(users.find(u=>u.id===b.dataset.id));if(a==='score-method')openModal('Metode penjelasan skor',methodPanel(store.getExplainability(b.dataset.id)));if(a==='category-info'){const info=categoryExplanation(store.getExplainability(b.dataset.id),b.dataset.category);openModal(info.title,info.body);}if(a==='queue-mode')location.search='?page=verification&theme='+document.documentElement.dataset.theme+'&queue='+b.dataset.mode;if(a==='close-modal')modal.close();});}
`;
writeFileSync('public/qa-theme-page.html','<!doctype html><html lang="id"><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="utf-8"><title>PDUK-Radar Visual QA (no API)</title><link rel="stylesheet" href="/ui/src/styles/app.css"><link rel="stylesheet" href="/ui/src/styles/themes.css"><body><div id="app"></div><dialog id="modal"></dialog><div style="position:fixed;bottom:4px;right:8px;font:9px Inter;color:#858598;z-index:999;pointer-events:none">Visual QA fixture · no API/session</div><script type="module">'+script+'</script></body></html>');
writeFileSync('public/qa-theme-responsive.html',`<!doctype html><html><meta charset="utf8"><title>PDUK-Radar Responsive Visual QA</title><style>body{margin:0;background:#555}iframe{border:0;display:block;max-width:none;margin:0 auto;height:1200px}header{font:12px Arial;color:#eee;padding:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}a{color:white}</style><header><span>Visual QA fixture:</span><a href="?width=390">390px</a><a href="?width=768">768px</a><a href="?width=1024">1024px</a><a href="?width=1440">1440px</a></header><iframe title="Actual PDUK components · visual fixture"></iframe><script>const p=new URLSearchParams(location.search),w=[390,768,1024,1440].includes(+p.get('width'))?+p.get('width'):390;document.querySelector('iframe').width=w;document.querySelector('iframe').src=p.get('motion')==='1'?'/qa-motion.html':'/qa-theme-page.html?page='+encodeURIComponent(p.get('page')||'overview')+'&theme='+encodeURIComponent(p.get('theme')||'dark');</script></html>`);
console.log('Created ignored public/qa-theme-{page,responsive}.html (visual fixtures, no auth/API).');

// Exercise the actual router, sync coordinator, and animations against read-only fixture data.
// Only API/bootstrap are replaced; no login credentials or server writes are involved.
const apiStart=source.indexOf('async function api('),apiEnd=source.indexOf('async function loadUsers()',apiStart);
const mockApi=`let fixtureLogoutCalls=0;
async function api(path,options={}){
 if(path==='/api/auth/logout'&&options.method==='POST'){document.documentElement.dataset.fixtureLogoutCalls=String(++fixtureLogoutCalls);if(new URLSearchParams(location.search).get('logoutError')==='1')throw Error('Fixture: logout gagal.');return {ok:true};}
 if(options.method&&options.method!=='GET')throw Error('Visual fixture: changes are disabled.');
 if(path==='/api/session')return {user:currentUser};
 if(path.startsWith('/api/data/'))return fixtureData[['employers.json','dashboard.json','details.json'].indexOf(path.split('/').at(-1))];
 await new Promise(resolve=>setTimeout(resolve,1200));
 if(path==='/api/users')return {users:[{...currentUser,email:'admin@example.test',status:'active'},{id:'visual-user',name:'User Visual QA',email:'user@example.test',role:'user',status:'active',hasSignedIn:false}]};
 if(path==='/api/cases')return {records:{'EMP-0348':fixtureRecord}};
 if(path.startsWith('/api/cases/'))return {record:fixtureRecord};
 throw Error('Unknown visual fixture route.');
}
`;
let motionSource=source.slice(0,apiStart)+mockApi+source.slice(apiEnd);
const bootstrap=motionSource.lastIndexOf("document.body.classList.add('auth-view');\ntry{const res=");
if(apiStart<0||apiEnd<0||bootstrap<0)throw Error('Could not isolate the actual app API/bootstrap for the fixture.');
motionSource=motionSource.slice(0,bootstrap)+`currentUser={id:'visual-admin',name:'Admin Visual QA',role:'admin'};selected='EMP-0348';await startWorkspace(false);`;
motionSource=motionSource.replaceAll("from './","from '/ui/src/");
writeFileSync('public/qa-motion.html','<!doctype html><html lang="id"><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="utf-8"><title>PDUK Motion QA</title><link rel="stylesheet" href="/ui/src/styles/app.css"><link rel="stylesheet" href="/ui/src/styles/themes.css"><body><a class="skip-link" href="#main">Lewati navigasi</a><div id="app"></div><div id="toast" role="status" aria-live="polite"></div><dialog id="modal"></dialog><script type="module">const fixtureData='+JSON.stringify(input)+',fixtureRecord={status:"Under Review",version:1,note:"Catatan fixture visual",history:[],followUpStatus:"Pending"};\n'+motionSource+'</script></body></html>');
console.log('Created ignored public/qa-motion.html (actual router, read-only API fixture, 1200 ms latency).');
