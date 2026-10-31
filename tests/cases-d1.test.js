import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Miniflare} from 'miniflare';
import {caseRepository} from '../lib/cases/repository.ts';
import {caseChange,initialState,readCaseBody} from '../lib/cases/policy.ts';
const admin={id:'admin-test',name:'Admin QA',role:'admin'},user={id:'user-test',name:'User QA',role:'user'};
const form=(status,version=0,extra={})=>({action:'verification',expectedVersion:version,status,date:'2026-10-20',findingType:'Klarifikasi sintetis',note:'Hasil simulasi pemeriksaan.',nextAction:'Tinjau ulang data.',...extra});
test('D1 atomic audit, concurrency, cross-user closure/reopen and immutable source',async()=>{
 const mf=new Miniflare({modules:true,script:'export default {fetch(){return new Response("ok")}}',d1Databases:['DB']});
 try{const db=await mf.getD1Database('DB');for(const sql of readFileSync(new URL('../drizzle/0002_case_records.sql',import.meta.url),'utf8').split('--> statement-breakpoint'))await db.prepare(sql).run();
 const source={'EMP-0348':'Under Review','EMP-0221':'Pending'},repo=caseRepository(db,source);
 assert.equal((await repo.detail('EMP-0348')).version,0);
 const attempts=await Promise.allSettled([repo.save('EMP-0348',form('Verified Compliant'),admin),repo.save('EMP-0348',form('Need More Data'),user)]);
 assert.equal(attempts.filter(x=>x.status==='fulfilled').length,1);assert.equal(attempts.find(x=>x.status==='rejected').reason.status,409);
 let r=await repo.detail('EMP-0348');assert.equal(r.version,1);assert.equal(r.history.length,1);
 await assert.rejects(()=>repo.save('EMP-0348',form('Under Review',1),user),/wajib/);
 r=await repo.save('EMP-0348',form('Under Review',1,{correctionReason:'Klarifikasi baru, buka kembali.'}),user);assert.equal(r.history[1].actorId,user.id);assert.equal(r.history[1].previousStatus,'Verified Compliant');
 r=await repo.save('EMP-0221',form('Verified Non-Compliant'),user);
 await assert.rejects(()=>repo.save('EMP-0221',{action:'follow_up',expectedVersion:1,followUpStatus:'Completed'},user),/wajib/);
 r=await repo.save('EMP-0221',{action:'follow_up',expectedVersion:1,followUpStatus:'Completed',closureNote:'Simulasi tindak lanjut tuntas.'},user);
 assert.equal(r.followUpStatus,'Completed');assert.equal(r.history.length,2);
 await assert.rejects(()=>repo.save('EMP-0221',{action:'follow_up',expectedVersion:2,followUpStatus:'In Progress'},admin),/wajib/);
 r=await repo.save('EMP-0221',{action:'follow_up',expectedVersion:2,followUpStatus:'In Progress',reopenReason:'Dokumen tambahan harus diklarifikasi.'},admin);
 assert.equal(r.history.length,3);assert.equal(r.history[1].closureNote,'Simulasi tindak lanjut tuntas.');
 assert.equal((await caseRepository(db,source).list())['EMP-0221'].version,3);assert.deepEqual(source,{'EMP-0348':'Under Review','EMP-0221':'Pending'});
 await assert.rejects(()=>db.prepare('DELETE FROM case_events').run(),/append-only/);
 await assert.rejects(()=>repo.detail('EMP-9999'),e=>e.status===404);
 }finally{await mf.dispose();}
});
test('case validation rejects invalid dates, payload fields, role spoofing and unsafe transitions',async()=>{
 const current=initialState('Pending');
 for(const patch of [{status:'Fake'},{date:'2026-02-30'},{date:'2099-01-01'},{note:' '},{note:'x'.repeat(2001)},{actor:'spoof'},{risk_score:0},{expectedVersion:-1},{date:'2026-1-1'}])assert.throws(()=>caseChange({...form('Under Review'),...patch},current));
 assert.throws(()=>caseChange({action:'follow_up',expectedVersion:0,followUpStatus:'Completed',closureNote:'Done'},current));
 assert.throws(()=>caseChange(form('Under Review',1),current),e=>e.status===409);
 assert.equal(caseChange(form('Under Review',0,{note:'<img src=x onerror=alert(1)>'}),current).next.note,'<img src=x onerror=alert(1)>'); // data only; UI escapes it
 await assert.rejects(()=>readCaseBody(new Request('https://local/api',{method:'POST',body:'x'.repeat(16001)})),e=>e.status===413);
 await assert.rejects(()=>readCaseBody(new Request('https://local/api',{method:'POST',body:'{'})),e=>e.status===400);
});
