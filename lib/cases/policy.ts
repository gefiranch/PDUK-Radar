import {AccessError} from '../auth/policy.ts';
export const STATUSES=['Pending','Under Review','Need More Data','Verified Compliant','Verified Non-Compliant'];
export type CaseState={status:string;date:string;findingType:string;note:string;nextAction:string;followUpStatus:string;closureNote:string;updatedAt?:string;actor?:string;version:number};
export const initialState=(status:string):CaseState=>({status,date:'',findingType:'',note:'',nextAction:'',followUpStatus:'Pending',closureNote:'',version:0});
const final=(s:string)=>s==='Verified Compliant'||s==='Verified Non-Compliant';
function text(body:Record<string,unknown>,key:string,max:number,required=false){const v=body[key]??'';if(typeof v!=='string'||v.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v))throw new AccessError(400,`${key}: teks tidak valid atau terlalu panjang.`);if(required&&!v.trim())throw new AccessError(400,`${key}: wajib diisi.`);return v.trim();}
export function caseChange(body:unknown,current:CaseState,now=new Date()){
 if(!body||typeof body!=='object'||Array.isArray(body))throw new AccessError(400,'Format perubahan tidak valid.');
 const b=body as Record<string,unknown>,allowed=b.action==='verification'?['action','expectedVersion','status','date','findingType','note','nextAction','correctionReason']:b.action==='follow_up'?['action','expectedVersion','followUpStatus','closureNote','reopenReason']:[];
 if(!allowed.length||Object.keys(b).some(k=>!allowed.includes(k)))throw new AccessError(400,'Aksi atau field tidak diizinkan. Skor sumber tidak dapat diedit.');
 if(!Number.isSafeInteger(b.expectedVersion)||Number(b.expectedVersion)<0)throw new AccessError(400,'Versi kasus wajib diisi.');
 if(b.expectedVersion!==current.version)throw new AccessError(409,'Kasus telah diperbarui petugas lain. Muat ulang data lalu tinjau kembali catatan Anda.');
 let next={...current},reason='';
 if(b.action==='verification'){
  if(!STATUSES.includes(String(b.status)))throw new AccessError(400,'Status verifikasi tidak valid.');
  const date=text(b,'date',10,true),timestamp=Date.parse(date+'T00:00:00Z'),today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(timestamp)||new Date(timestamp).toISOString().slice(0,10)!==date||date>today)throw new AccessError(400,'Tanggal verifikasi tidak valid atau di masa depan.');
  reason=text(b,'correctionReason',1000,final(current.status));
  next={...next,status:String(b.status),date,findingType:text(b,'findingType',500,true),note:text(b,'note',2000,true),nextAction:text(b,'nextAction',500,true)};
  // A new verification decision reopens a completed follow-up; previous closure is retained in audit.
  if(next.status!==current.status||current.followUpStatus==='Completed')next.followUpStatus='Pending';
  next.closureNote=next.status==='Verified Compliant'?next.note:'';
 }else{
  if(current.status!=='Verified Non-Compliant')throw new AccessError(400,'Tindak lanjut hanya untuk hasil Tidak Sesuai.');
  if(!['Pending','In Progress','Completed'].includes(String(b.followUpStatus)))throw new AccessError(400,'Progres tindak lanjut tidak valid.');
  const reopening=current.followUpStatus==='Completed'&&b.followUpStatus!=='Completed';
  reason=text(b,'reopenReason',1000,reopening);
  next={...next,followUpStatus:String(b.followUpStatus),closureNote:text(b,'closureNote',2000,b.followUpStatus==='Completed')};
 }
 next={...next,version:current.version+1,updatedAt:now.toISOString()};
 return {next,reason,action:String(b.action),previousStatus:current.status,previousFollowUpStatus:current.followUpStatus};
}
export async function readCaseBody(request:Request){
 const reader=request.body?.getReader();if(!reader)throw new AccessError(400,'JSON tidak valid.');
 const parts:Uint8Array[]=[];let length=0;
 while(true){const {value,done}=await reader.read();if(done)break;length+=value.byteLength;if(length>16000){await reader.cancel();throw new AccessError(413,'Formulir terlalu besar.');}parts.push(value);}
 const bytes=new Uint8Array(length);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.byteLength;}
 try{return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw new AccessError(400,'JSON tidak valid.');}
}
