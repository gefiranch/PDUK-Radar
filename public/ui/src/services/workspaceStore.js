import {createStore} from './dataService.js';
export async function loadWorkspaceStore(api,{actor,namespace,demonstration=false}={}){
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
 const accept=(id,record)=>{records={...records,[id]:record};store.reload();return store.getVerification(id);};
 return {...store,mode:'source',persistence:'server',get localEditCount(){return 0;},
  async refresh(id){const fresh=await api('/api/cases');records=Object.fromEntries(Object.entries(fresh.records).map(([key,value])=>[key,{...value,history:records[key]?.version===value.version?records[key].history||[]:[],historyCount:value.version}]));if(id){const data=await api('/api/cases/'+encodeURIComponent(id));records[id]=data.record;}store.reload();},
  async loadHistory(id,before){const {record}=await api('/api/cases/'+encodeURIComponent(id)+'?before='+before);const old=records[id];if(old?.version!==record.version)throw Error('Kasus diperbarui. Muat ulang untuk melihat riwayat terbaru.');accept(id,{...old,history:[...record.history,...old.history],nextBefore:record.nextBefore});},
  async saveVerification(id,payload){const {record}=await api('/api/cases/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({...payload,action:'verification',expectedVersion:Number(payload.expectedVersion)})});return accept(id,record);},
  async saveFollowUp(id,payload){const {record}=await api('/api/cases/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({...payload,action:'follow_up',expectedVersion:Number(payload.expectedVersion)})});return accept(id,record);}
 };
}
