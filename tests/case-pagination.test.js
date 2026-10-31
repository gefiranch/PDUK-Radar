import test from 'node:test';
import assert from 'node:assert/strict';
import {Miniflare} from 'miniflare';
import {readFileSync} from 'node:fs';
import {caseRepository} from '../lib/cases/repository.ts';
test('D1 history pagination retains every event and the current version',async()=>{
 const mf=new Miniflare({modules:true,script:'export default {fetch(){return new Response("ok")}}',d1Databases:['DB']});
 try{const db=await mf.getD1Database('DB');for(const sql of readFileSync(new URL('../drizzle/0002_case_records.sql',import.meta.url),'utf8').split('--> statement-breakpoint'))await db.prepare(sql).run();
 const payload=JSON.stringify({status:'Under Review',version:105});await db.prepare('INSERT INTO case_records VALUES(?,?,105,?,?)').bind('EMP-0348',payload,'fixture','2026-10-20').run();
 await db.batch(Array.from({length:105},(_,i)=>db.prepare('INSERT INTO case_events VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind('fixture-'+i,'EMP-0348',i+1,'qa','Petugas QA','user','2026-10-20','Under Review','Under Review','Fixture',JSON.stringify({status:'Under Review',version:i+1}))));
 const repo=caseRepository(db,{'EMP-0348':'Under Review'}),page=await repo.detail('EMP-0348');assert.equal(page.history.length,100);assert.equal(page.historyCount,105);assert.equal(page.nextBefore,6);assert.equal(page.history.at(-1).version,105);
 const older=await repo.detail('EMP-0348',page.nextBefore);assert.equal(older.history.length,5);assert.equal(older.nextBefore,null);assert.equal(older.history[0].version,1);
 }finally{await mf.dispose();}
});
