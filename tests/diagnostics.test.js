import test from 'node:test';
import assert from 'node:assert/strict';
import {diagnosticSummary} from '../lib/auth/diagnostics.ts';
test('nested driver causes produce useful labels without credentials, queries or parameters',()=>{
 const secret='never-log-this-secret';const error={message:'Failed query '+secret,params:[secret],cause:{code:'28P01',message:secret,query:secret}};
 const result=diagnosticSummary(error,'postgresql://postgres.project:'+secret+'@example.pooler.supabase.com:6543/postgres');
 assert.equal(result.code,'28P01');assert.equal(result.connection,'supabase-pooler');assert.ok(!JSON.stringify(result).includes(secret));
 const circular={code:'42P01'};circular.cause=circular;assert.equal(diagnosticSummary(circular,'postgres://localhost/db').code,'42P01');
 assert.equal(diagnosticSummary({code:secret,message:secret},'postgres://localhost/db').code,'UNKNOWN');
 assert.equal(diagnosticSummary(null,'').code,'DATABASE_URL_MISSING');
 assert.equal(diagnosticSummary(null,'invalid').code,'ERR_INVALID_URL');
});
