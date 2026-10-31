// Runs the built Worker in an isolated local D1 emulator. No hosted environment is modified.
import {Miniflare} from 'miniflare';
import {readFileSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
const mf=new Miniflare({modulesRoot:resolve('dist/server'),modules:['index.js',...readdirSync('dist/server',{recursive:true}).filter(p=>p.endsWith('.js')&&p!=='index.js')].map(path=>({type:'ESModule',path:resolve('dist/server',path)})),compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:['DB'],bindings:{PDUK_TEST_ADMIN_PASSWORD:'isolated-admin-fixture',PDUK_TEST_USER_PASSWORD:'isolated-user-fixture'}});
const origin='https://pduk.test';let checks=0;
try{
 const db=await mf.getD1Database('DB');for(const name of ['0000_jittery_nightshade','0001_warm_proteus','0002_case_records']){for(const sql of readFileSync('drizzle/'+name+'.sql','utf8').split('--> statement-breakpoint'))if(sql.trim())await db.prepare(sql).run();}
 const request=async(path,{cookie,body,method,expected=200,requestOrigin=origin}={})=>{const res=await mf.dispatchFetch(origin+path,{method:method||(body?'POST':'GET'),headers:{...(cookie?{Cookie:cookie}:{}),Origin:requestOrigin,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const data=await res.json();assert.equal(res.status,expected,`${path}: ${JSON.stringify(data)}`);checks++;return {res,data};};
 for(const path of ['/api/cases','/api/cases/EMP-0348','/api/data/employers.json','/api/demo'])await request(path,{expected:401});
 await request('/api/cases/EMP-0348',{method:'PATCH',body:{},expected:401});
 const login=async(email,password)=>{const {res,data}=await request('/api/auth/login',{body:{email,password}});assert.ok(res.headers.get('set-cookie').includes('HttpOnly'));assert.ok(res.headers.get('set-cookie').includes('SameSite=Lax'));return {cookie:res.headers.get('set-cookie').split(';')[0],user:data.user};};
 const admin=await login('admin@gmail.com','isolated-admin-fixture'),user=await login('user@gmail.com','isolated-user-fixture');assert.equal(admin.user.role,'admin');assert.equal(user.user.role,'user');
 await request('/api/users',{cookie:user.cookie,expected:403});await request('/api/users',{cookie:admin.cookie});
 await request('/api/users',{cookie:user.cookie,body:{name:'Blocked Fixture',email:'blocked@example.test',password:'fixture-password'},expected:403});
 const created=(await request('/api/users',{cookie:admin.cookie,body:{name:'Created QA User',email:'created@example.test',password:'created-fixture-password'},expected:201})).data.user;
 const createdSession=await login('created@example.test','created-fixture-password');assert.equal(createdSession.user.role,'user');
 await request('/api/cases',{cookie:createdSession.cookie});
 await request('/api/users/'+created.id,{cookie:admin.cookie,method:'PATCH',body:{status:'inactive'}});
 await request('/api/cases',{cookie:createdSession.cookie,expected:401});
 await request('/api/auth/login',{body:{email:'created@example.test',password:'created-fixture-password'},expected:403});
 await request('/api/users/'+created.id,{cookie:admin.cookie,method:'PATCH',body:{status:'active'}});
 const reactivated=await login('created@example.test','created-fixture-password');await request('/api/cases',{cookie:reactivated.cookie});
 await db.prepare('UPDATE app_sessions SET expires_at=0 WHERE user_id=?').bind(created.id).run();await request('/api/cases',{cookie:reactivated.cookie,expected:401});
 await request('/api/cases/EMP-0348',{method:'PATCH',cookie:user.cookie,body:{},requestOrigin:'https://evil.test',expected:403});
 await request('/api/cases/EMP-9999',{cookie:user.cookie,expected:404});
 const form=(status,expectedVersion,extra={})=>({action:'verification',status,expectedVersion,date:'2026-10-20',findingType:'Klarifikasi QA sintetis',note:'Simulasi hasil pemeriksaan.',nextAction:'Tinjau data tambahan.',...extra});
 const patch=async(id,body,cookie=user.cookie,expected=200)=>(await request('/api/cases/'+id,{cookie,method:'PATCH',body,expected})).data.record;
 await patch('EMP-0348',form('Verified Compliant',0,{note:''}),user.cookie,400);
 await patch('EMP-0348',{...form('Verified Compliant',0),risk_score:0},user.cookie,400);
 let r=await patch('EMP-0348',form('Verified Compliant',0));assert.equal(r.version,1);assert.equal(r.closureNote,'Simulasi hasil pemeriksaan.');
 await patch('EMP-0348',form('Under Review',0),admin.cookie,409);
 let seen=(await request('/api/cases/EMP-0348',{cookie:admin.cookie})).data.record;assert.equal(seen.status,'Verified Compliant');assert.equal(seen.history[0].actorId,user.user.id);
 await patch('EMP-0348',form('Under Review',1),admin.cookie,400);
 r=await patch('EMP-0348',form('Under Review',1,{correctionReason:'Simulasi buka kembali untuk dokumen tambahan.'}),admin.cookie);assert.equal(r.history.length,2);
 await patch('EMP-0221',form('Verified Non-Compliant',0));await patch('EMP-0221',{action:'follow_up',expectedVersion:1,followUpStatus:'Completed'},user.cookie,400);
 r=await patch('EMP-0221',{action:'follow_up',expectedVersion:1,followUpStatus:'Completed',closureNote:'Tindakan QA tuntas.'});assert.equal(r.followUpStatus,'Completed');
 await patch('EMP-0221',{action:'follow_up',expectedVersion:2,followUpStatus:'In Progress'},admin.cookie,400);
 r=await patch('EMP-0221',{action:'follow_up',expectedVersion:2,followUpStatus:'In Progress',reopenReason:'Simulasi koreksi baru.'},admin.cookie);assert.equal(r.history.length,3);
 const records=(await request('/api/cases',{cookie:user.cookie})).data.records;assert.equal(records['EMP-0348'].status,'Under Review');assert.equal(records['EMP-0221'].followUpStatus,'In Progress');
 seen=(await request('/api/cases/EMP-0221',{cookie:user.cookie})).data.record;assert.equal(seen.version,3); // A fresh HTTP request rehydrates D1, not a client cache.
 const snapshot=(await request('/api/data/employers.json',{cookie:user.cookie})).data.employers;assert.equal(snapshot.length,500);assert.equal(snapshot.find(r=>r.employer_id==='EMP-0348').risk_score,83.25);assert.equal(snapshot.find(r=>r.employer_id==='EMP-0221').risk_score,89.6);
 assert.deepEqual(Object.fromEntries(['Low','Medium','High','Critical'].map(l=>[l,snapshot.filter(r=>r.risk_level===l).length])),{Low:369,Medium:109,High:16,Critical:6});
 await request('/api/cases/EMP-0221?before=invalid',{cookie:user.cookie,expected:400});
 await request('/api/auth/logout',{cookie:user.cookie,body:{}});await request('/api/cases',{cookie:user.cookie,expected:401});
 console.log(JSON.stringify({passed:true,httpChecks:checks,coverage:['admin/user login','auth/roles/origin','validation/conflict','closure/reopening','cross-user D1 reads','fresh HTTP reads','immutable score/distribution','logout session revocation']},null,2));
}finally{await mf.dispose();}
