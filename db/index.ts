import postgres from 'postgres';
import {drizzle} from 'drizzle-orm/postgres-js';
import * as schema from './schema.ts';
let client: ReturnType<typeof postgres> | undefined;
export function getSql(){
 if(!client){
  const url=process.env.DATABASE_URL;
  if(!url)throw new Error('DATABASE_URL belum diatur. Gunakan URI Supabase pooler.');
  client=postgres(url,{prepare:false,max:3,idle_timeout:20,connect_timeout:10,ssl:process.env.PDUK_DATABASE_LOCAL==='1'?false:'require'});
 }
 return client;
}
export function getDb(){return drizzle(getSql(),{schema});}
export type Database=ReturnType<typeof getDb>;
export type Transaction=Parameters<Parameters<Database['transaction']>[0]>[0];
export async function atomic(db:Database,queries:(tx:Transaction)=>PromiseLike<unknown>[]){
 return db.transaction(async tx=>{for(const query of queries(tx))await query;});
}
