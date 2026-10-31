import test from 'node:test';
import assert from 'node:assert/strict';
import {databaseFixture} from './postgres-fixture.js';
import {caseRepository} from '../lib/cases/repository.ts';
test('PostgreSQL history pagination retains every event and the current version',async()=>{
 const fixture=await databaseFixture();
 try{const {db,pg}=fixture;
 const payload=JSON.stringify({status:'Under Review',version:105});await pg.query('INSERT INTO case_records VALUES($1,$2,105,$3,$4)',['EMP-0348',payload,'fixture','2026-10-20']);
 for(let i=0;i<105;i++)await pg.query('INSERT INTO case_events VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',['fixture-'+i,'EMP-0348',i+1,'qa','Petugas QA','user','2026-10-20','Under Review','Under Review','Fixture',JSON.stringify({status:'Under Review',version:i+1})]);
 const repo=caseRepository(db,{'EMP-0348':'Under Review'}),page=await repo.detail('EMP-0348');assert.equal(page.history.length,100);assert.equal(page.historyCount,105);assert.equal(page.nextBefore,6);assert.equal(page.history.at(-1).version,105);
 const older=await repo.detail('EMP-0348',page.nextBefore);assert.equal(older.history.length,5);assert.equal(older.nextBefore,null);assert.equal(older.history[0].version,1);
 }finally{await fixture.close();}
});
