import {AccessError} from '../auth/policy.ts';
import {caseChange,initialState,type CaseState} from './policy.ts';
type RecordRow={employer_id:string;payload:string;version:number};
type EventRow={payload:string;version:number};
export type Actor={id:string;name:string;role:string};
export function caseRepository(db:D1Database,source:Record<string,string>){
 function assertId(id:string){if(!Object.hasOwn(source,id))throw new AccessError(404,'Perusahaan tidak ditemukan.');}
 async function state(id:string){assertId(id);const r=await db.prepare('SELECT employer_id,payload,version FROM case_records WHERE employer_id=?').bind(id).first<RecordRow>();return r?{...JSON.parse(r.payload),version:r.version} as CaseState:initialState(source[id]);}
 async function list(){const {results}=await db.prepare('SELECT employer_id,payload,version FROM case_records WHERE version>0').all<RecordRow>();return Object.fromEntries(results.map(r=>[r.employer_id,{...JSON.parse(r.payload),version:r.version}]));}
 async function detail(id:string,before?:number){const current=await state(id);const cursor=before??current.version+1;const {results}=await db.prepare('SELECT payload,version FROM case_events WHERE employer_id=? AND version<? ORDER BY version DESC LIMIT 101').bind(id,cursor).all<EventRow>();const page=results.slice(0,100);return {...current,history:page.map(r=>JSON.parse(r.payload)).reverse(),historyCount:current.version,nextBefore:results.length>100?page.at(-1)!.version:null};}
 async function save(id:string,body:unknown,actor:Actor){
  if(!actor.id||!actor.name||!['admin','user'].includes(actor.role))throw new AccessError(403,'Aktor pemeriksaan tidak valid.');
  const current=await state(id),change=caseChange(body,current),eventId=crypto.randomUUID(),next={...change.next,actor:actor.name},event={...next,previousStatus:change.previousStatus,previousFollowUpStatus:change.previousFollowUpStatus,action:change.action,correctionReason:change.reason,actor:actor.name,actorId:actor.id,actorRole:actor.role};
  // D1 batch is atomic. The conditional event INSERT only runs for the winning CAS update.
  const results=await db.batch([
   db.prepare('INSERT INTO case_records(employer_id,payload,version,last_change_id,updated_at) VALUES(?,?,0,?,?) ON CONFLICT(employer_id) DO NOTHING').bind(id,JSON.stringify(current),'initial',next.updatedAt),
   db.prepare('UPDATE case_records SET payload=?,version=version+1,last_change_id=?,updated_at=? WHERE employer_id=? AND version=?').bind(JSON.stringify(next),eventId,next.updatedAt,id,current.version),
   db.prepare('INSERT INTO case_events(id,employer_id,version,actor_id,actor_name,actor_role,created_at,previous_status,new_status,reason,payload) SELECT ?,employer_id,version,?,?,?,?,?,?,?,? FROM case_records WHERE employer_id=? AND last_change_id=?').bind(eventId,actor.id,actor.name,actor.role,next.updatedAt,current.status,next.status,change.reason,JSON.stringify(event),id,eventId)
  ]);
  if(results[1].meta.changes!==1)throw new AccessError(409,'Kasus telah diperbarui petugas lain. Muat ulang data lalu tinjau kembali catatan Anda.');
  return detail(id);
 }
 return {list,detail,save};
}
