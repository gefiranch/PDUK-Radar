import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {eq} from 'drizzle-orm';
import {databaseFixture} from './postgres-fixture.js';
import {users,sessions,accountAudit} from '../db/schema.ts';
import {atomic} from '../db/index.ts';
import {hashPassword,verifyPassword} from '../lib/auth/password.ts';

test('Supabase setup and seed rerun safely; initial accounts authenticate',async()=>{
 const f=await databaseFixture();try{
  const setup=readFileSync(new URL('../supabase/001_setup.sql',import.meta.url),'utf8');
  const seed=readFileSync(new URL('../supabase/002_testing_accounts.sql',import.meta.url),'utf8');
  await f.pg.exec(setup);await f.pg.exec(seed);await f.pg.exec(seed);
  const rows=await f.db.select().from(users);assert.equal(rows.length,2);
  for(const u of rows){assert.ok(await verifyPassword(u.role==='admin'?'admin123':'user123',u.passwordHash));assert.ok(!await verifyPassword('wrong-password',u.passwordHash));}
  const hash=await hashPassword('changed-admin-password');await f.db.update(users).set({passwordHash:hash}).where(eq(users.id,'initial-admin'));
  await f.pg.exec(seed);assert.equal((await f.db.select().from(users).where(eq(users.id,'initial-admin')))[0].passwordHash,hash);
 }finally{await f.close();}
});
test('password reset transactions revoke all target sessions and retain other sessions',async()=>{
 const f=await databaseFixture();try{
  await f.pg.exec(readFileSync(new URL('../supabase/002_testing_accounts.sql',import.meta.url),'utf8'));
  const now=Date.now();await f.db.insert(sessions).values([{tokenHash:'target-session',userId:'initial-user',createdAt:now,expiresAt:now+28800000},{tokenHash:'admin-session',userId:'initial-admin',createdAt:now,expiresAt:now+28800000}]);
  const hash=await hashPassword('replacement-password');
  await atomic(f.db,tx=>[tx.update(users).set({passwordHash:hash}).where(eq(users.id,'initial-user')),tx.delete(sessions).where(eq(sessions.userId,'initial-user')),tx.insert(accountAudit).values({id:'reset-audit',actorId:'initial-admin',targetId:'initial-user',action:'password_reset',createdAt:new Date().toISOString()})]);
  const [u]=await f.db.select().from(users).where(eq(users.id,'initial-user'));assert.ok(await verifyPassword('replacement-password',u.passwordHash));assert.ok(!await verifyPassword('user123',u.passwordHash));
  const remaining=await f.db.select().from(sessions);assert.equal(remaining.length,1);assert.equal(remaining[0].userId,'initial-admin');assert.equal(remaining[0].createdAt,now);
  await assert.rejects(()=>atomic(f.db,tx=>[tx.update(users).set({name:'should-rollback'}).where(eq(users.id,'initial-user')),tx.insert(accountAudit).values({id:'reset-audit',actorId:'x',targetId:'x',action:'duplicate',createdAt:'now'})]));
  assert.notEqual((await f.db.select().from(users).where(eq(users.id,'initial-user')))[0].name,'should-rollback');
 }finally{await f.close();}
});
test('anonymous and Supabase authenticated browser roles cannot read private application tables',async()=>{
 const f=await databaseFixture();try{
  const flags=await f.pg.query("SELECT relname,relrowsecurity FROM pg_class WHERE relname IN ('app_users','account_audit','app_sessions','login_attempts','case_records','case_events')");assert.equal(flags.rows.length,6);assert.ok(flags.rows.every(r=>r.relrowsecurity));
  for(const role of ['anon','authenticated']){
   await f.pg.exec('SET ROLE '+role);
   await assert.rejects(()=>f.pg.query('SELECT * FROM public.app_users'),/permission denied/);
   await assert.rejects(()=>f.pg.query('SELECT * FROM public.app_sessions'),/permission denied/);
   await f.pg.exec('RESET ROLE');
  }
 }finally{await f.close();}
});
