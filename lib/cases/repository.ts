import {and,desc,eq,gt,lt,sql} from 'drizzle-orm';
import type {Database} from '../../db/index.ts';
import {caseRecords,caseEvents} from '../../db/schema.ts';
import {AccessError} from '../auth/policy.ts';
import {caseChange,initialState,type CaseState} from './policy.ts';
export type Actor={id:string;name:string;role:string};
export function caseRepository(db:Database,source:Record<string,string>){
 function assertId(id:string){if(!Object.hasOwn(source,id))throw new AccessError(404,'Perusahaan tidak ditemukan.');}
 async function state(id:string){assertId(id);const [r]=await db.select().from(caseRecords).where(eq(caseRecords.employerId,id));return r?{...(r.payload as CaseState),version:r.version}:initialState(source[id]);}
 async function list(){const rows=await db.select().from(caseRecords).where(gt(caseRecords.version,0));return Object.fromEntries(rows.map(r=>[r.employerId,{...(r.payload as CaseState),version:r.version}]));}
 async function detail(id:string,before?:number){const current=await state(id);const rows=await db.select().from(caseEvents).where(and(eq(caseEvents.employerId,id),lt(caseEvents.version,before??current.version+1))).orderBy(desc(caseEvents.version)).limit(101);const page=rows.slice(0,100);return {...current,history:page.map(r=>r.payload).reverse(),historyCount:current.version,nextBefore:rows.length>100?page.at(-1)!.version:null};}
 async function save(id:string,body:unknown,actor:Actor){
  if(!actor.id||!actor.name||!['admin','user'].includes(actor.role))throw new AccessError(403,'Aktor pemeriksaan tidak valid.');
  const current=await state(id),change=caseChange(body,current),eventId=crypto.randomUUID(),next={...change.next,actor:actor.name},event={...next,previousStatus:change.previousStatus,previousFollowUpStatus:change.previousFollowUpStatus,action:change.action,correctionReason:change.reason,actor:actor.name,actorId:actor.id,actorRole:actor.role};
  await db.transaction(async tx=>{
   await tx.insert(caseRecords).values({employerId:id,payload:current,version:0,lastChangeId:'initial',updatedAt:next.updatedAt!}).onConflictDoNothing();
   const won=await tx.update(caseRecords).set({payload:next,version:sql`${caseRecords.version}+1`,lastChangeId:eventId,updatedAt:next.updatedAt!}).where(and(eq(caseRecords.employerId,id),eq(caseRecords.version,current.version))).returning({version:caseRecords.version});
   if(!won.length)throw new AccessError(409,'Kasus telah diperbarui petugas lain. Muat ulang data lalu tinjau kembali catatan Anda.');
   await tx.insert(caseEvents).values({id:eventId,employerId:id,version:won[0].version,actorId:actor.id,actorName:actor.name,actorRole:actor.role as 'admin'|'user',createdAt:next.updatedAt!,previousStatus:current.status,newStatus:next.status,reason:change.reason,payload:event});
  });
  return detail(id);
 }
 return {list,detail,save};
}
