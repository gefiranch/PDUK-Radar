import {PGlite} from '@electric-sql/pglite';
import {drizzle} from 'drizzle-orm/pglite';
import {readFileSync} from 'node:fs';
import * as schema from '../db/schema.ts';
export async function databaseFixture(){
 const pg=new PGlite();
 await pg.exec('CREATE ROLE anon; CREATE ROLE authenticated;');
 await pg.exec(readFileSync(new URL('../supabase/001_setup.sql',import.meta.url),'utf8'));
 return {pg,db:drizzle(pg,{schema}),close:()=>pg.close()};
}
