import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadWorkspaceStore} from '../public/ui/src/services/workspaceStore.js';
import {EmployerDetail} from '../public/ui/src/pages/EmployerDetail.js';
import {Explainability} from '../public/ui/src/pages/Explainability.js';
import {naturalize} from '../public/ui/src/services/terminology.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const index=read('data/snapshots/employers.json'),dashboard=read('data/snapshots/dashboard.json'),details=read('data/snapshots/details.json');
const files={'employers.json':index,'dashboard.json':dashboard,'details.json':details};
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
test('navigation reuses fresh lists, deduplicates detail requests, and fetches stale list/detail in parallel',async()=>{
 let clock=1000;const calls=[],pending=[];
 const record={status:'Under Review',version:1,note:'Original',history:[]};
 const api=async path=>{calls.push(path);if(path.startsWith('/api/data/'))return files[path.split('/').at(-1)];if(calls.filter(p=>p==='/api/cases').length===1&&path==='/api/cases')return {records:{'EMP-0348':record}};const job=deferred();pending.push({path,...job});return job.promise;};
 const store=await loadWorkspaceStore(api,{now:()=>clock});
 assert.equal(await store.refresh(undefined,{maxAge:15000}),false);assert.equal(calls.filter(p=>p==='/api/cases').length,1);
 const first=store.refresh('EMP-0348',{maxAge:15000}),second=store.refresh('EMP-0348',{maxAge:15000});
 assert.equal(pending.length,1);pending[0].resolve({record});await Promise.all([first,second]);
 assert.equal(await store.refresh('EMP-0348',{maxAge:15000}),false);
 clock+=15001;const fresh=store.refresh('EMP-0348',{maxAge:15000});assert.equal(pending.length,3);assert.deepEqual(pending.slice(1).map(p=>p.path),['/api/cases','/api/cases/EMP-0348']);
 pending[1].resolve({records:{'EMP-0348':record}});pending[2].resolve({record});assert.equal(await fresh,false);
});
test('an older background response cannot undo a successfully saved verification',async()=>{
 const stale=deferred(),record={status:'Under Review',version:1,note:'Original',history:[]};let loaded=false;
 const api=async(path,options)=>{if(path.startsWith('/api/data/'))return files[path.split('/').at(-1)];if(options)return {record:{...record,status:'Verified Compliant',version:2,note:'Saved',history:[]}};if(path==='/api/cases'&&!loaded){loaded=true;return {records:{'EMP-0348':record}};}return stale.promise;};
 const store=await loadWorkspaceStore(api),refresh=store.refresh();
 await store.saveVerification('EMP-0348',{status:'Verified Compliant',expectedVersion:1});
 stale.resolve({records:{'EMP-0348':record}});await refresh;
 assert.equal(store.getVerification('EMP-0348').version,2);assert.equal(store.getVerification('EMP-0348').note,'Saved');assert.equal(store.getEmployer('EMP-0348').case_queue,'closed');
});
test('remote store never reads old local notes, waits for ACK, shares effective state and rejects offline writes',async()=>{
 globalThis.localStorage={getItem(){throw Error('Must not read legacy notes');}};
 let record={status:'Under Review',version:1,note:'Server only',history:[]},fail=false,calls=[];
 const api=async(path,options)=>{calls.push(path);if(path.startsWith('/api/data/'))return files[path.split('/').at(-1)];if(options){if(fail)throw Error('Offline');record={...record,...JSON.parse(options.body),version:record.version+1,history:[]};return {record};}if(path==='/api/cases')return {records:{'EMP-0348':record}};return {record};};
 const store=await loadWorkspaceStore(api);assert.equal(store.persistence,'server');assert.equal(store.getVerification('EMP-0348').note,'Server only');
 await store.saveVerification('EMP-0348',{status:'Verified Compliant',expectedVersion:1,note:'Ditutup'});assert.equal(store.getEmployer('EMP-0348').case_queue,'closed');assert.equal(store.getEmployer('EMP-0348').risk_score,83.25);
 assert.equal(store.getRanking({worklist:'closed'}).allRows.some(r=>r.employer_id==='EMP-0348'),true);
 fail=true;await assert.rejects(()=>store.saveVerification('EMP-0348',{status:'Pending',expectedVersion:2}));assert.equal(store.getEmployer('EMP-0348').verification_status,'Verified Compliant');
 await store.refresh('EMP-0348');assert.equal(store.getVerification('EMP-0348').version,2);assert.ok(calls.includes('/api/cases/EMP-0348'));
 delete globalThis.localStorage;
});
test('all enrichment IDs and anchors validate; demo allocations cannot become official contributions',async()=>{
 const enrichment=read('data/demo/demo_details_500.json'),verifications=read('data/demo/demo_verifications_500.json'),scenarios=read('data/demo/demo_scenarios.json');
 assert.equal(enrichment.synthetic,true);assert.equal(enrichment.demo_mode_required,true);
 assert.deepEqual(Object.keys(enrichment.employers).sort(),index.employers.map(r=>r.employer_id).sort());
 for(const r of index.employers){const d=enrichment.employers[r.employer_id];assert.equal(d.synthetic,true);for(const k of ['active','new','inactive']){assert.equal(d.history[k].length,24);assert.ok(d.history[k].every(n=>Number.isFinite(n)&&n>=0));}assert.equal(d.history.active.at(-1),r.active_participant);assert.equal(d.demo_xai_status,'ILLUSTRATIVE_ALLOCATION_NOT_MODEL_OUTPUT');assert.equal(Object.hasOwn(d,'score_contributions'),false);}
 globalThis.localStorage={getItem(){return null;},setItem(){},removeItem(){}};
 const store=await loadWorkspaceStore(async path=>path==='/api/demo'?{details:enrichment,verifications,scenarios}:files[path.split('/').at(-1)],{namespace:'demo-test',demonstration:true});
 assert.equal(store.getExplainability('EMP-0348').score_contributions,null);assert.equal(store.getExplainability('EMP-0348').peer_percentile,undefined);assert.equal(store.getTrends('EMP-0348').synthetic,true);
 assert.match(Explainability(store,'EMP-0348'),/Alokasi ilustratif/);assert.equal(store.getEmployer('EMP-0348').risk_score,83.25);
 const html=EmployerDetail(store,'EMP-0348');assert.equal((html.match(/class="detail-section"/g)||[]).length,7);assert.match(html,/Rasio pendaftaran/);assert.match(html,/bukan hasil observasi/);assert.equal(naturalize('<p>Coverage Gap &lt;x&gt;</p>'),'<p>Coverage Gap &lt;x&gt;</p>');
 delete globalThis.localStorage;
});
