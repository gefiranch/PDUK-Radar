import {createStore} from './dataService.js';
export async function loadWorkspaceStore(api,{actor,namespace,demonstration=false,now=Date.now}={}){
 const [index,dashboard,details,caseData]=await Promise.all(['employers.json','dashboard.json','details.json'].map(name=>api('/api/data/'+name)).concat(api(demonstration?'/api/demo':'/api/cases')));
 if(demonstration){
  const key='pduk-radar:demo:v2:'+namespace;
  let initial=Object.fromEntries(Object.entries(caseData.verifications.employers).map(([id,v])=>[id,{...v,history:v.history||[],status:v.status||v.verification_status}]));
  const storage={getItem(){return localStorage.getItem(key)||JSON.stringify(initial);},setItem(_k,value){localStorage.setItem(key,value);initial={};},removeItem(){localStorage.removeItem(key);initial={};}};
  const store=createStore(index,dashboard,details,{storage,storageNamespace:'demo:'+namespace,actor});
  return {...store,mode:'demo',persistence:'local',getTrends(id){const d=caseData.details.employers[id];return {months:caseData.details.months,history:d?.history||null,synthetic:true};},getDemonstration(id){return caseData.details.employers[id]||null;},scenarios:caseData.scenarios.scenarios};
 }
 let records=Object.fromEntries(Object.entries(caseData.records).map(([id,record])=>[id,{...record,history:[],historyCount:record.version}]));
 const adapter={getItem:()=>JSON.stringify(records),setItem(){throw Error('Gunakan API kasus.');}};
 const store=createStore(index,dashboard,details,{storage:adapter,actor});
 let listLoadedAt=now(),listPending=null,revision=0;
 const detailLoadedAt=new Map(),detailPending=new Map();
 function merge(id,record,detail=false){
  const old=records[id];
  if(old&&Number(old.version)>Number(record.version))return;
  const next=detail?{...record,history:record.history||[],historyCount:record.historyCount??record.version}:{...(old?.version===record.version?old:{}),...record,history:old?.version===record.version?old.history||[]:[],historyCount:record.version};
  if(JSON.stringify(old)!==JSON.stringify(next)){records[id]=next;revision++;}
 }
 function refreshList(){
  if(!listPending)listPending=(async()=>{try{const fresh=await api('/api/cases');for(const [id,record] of Object.entries(fresh.records))merge(id,record);listLoadedAt=now();}finally{listPending=null;}})();
  return listPending;
 }
 function refreshDetail(id){
  if(!detailPending.has(id))detailPending.set(id,(async()=>{try{const {record}=await api('/api/cases/'+encodeURIComponent(id));merge(id,record,true);detailLoadedAt.set(id,now());}finally{detailPending.delete(id);}})());
  return detailPending.get(id);
 }
 const accept=(id,record)=>{records={...records,[id]:record};revision++;store.reload();detailLoadedAt.set(id,now());return store.getVerification(id);};
 return {...store,mode:'source',persistence:'server',get localEditCount(){return 0;},
  async refresh(id,{maxAge=0}={}){const before=revision,jobs=[];if(now()-listLoadedAt>=maxAge)jobs.push(refreshList());if(id&&(!detailLoadedAt.has(id)||now()-detailLoadedAt.get(id)>=maxAge))jobs.push(refreshDetail(id));await Promise.all(jobs);if(revision!==before){store.reload();return true;}return false;},
  async loadHistory(id,before){const {record}=await api('/api/cases/'+encodeURIComponent(id)+'?before='+before);const old=records[id];if(old?.version!==record.version)throw Error('Kasus diperbarui. Muat ulang untuk melihat riwayat terbaru.');accept(id,{...old,history:[...record.history,...old.history],nextBefore:record.nextBefore});},
  async saveVerification(id,payload){const {record}=await api('/api/cases/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({...payload,action:'verification',expectedVersion:Number(payload.expectedVersion)})});return accept(id,record);},
  async saveFollowUp(id,payload){const {record}=await api('/api/cases/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({...payload,action:'follow_up',expectedVersion:Number(payload.expectedVersion)})});return accept(id,record);}
 };
}
