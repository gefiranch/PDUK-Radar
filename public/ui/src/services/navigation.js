// Route changes render first. Slow or superseded requests must never replace a newer screen or a draft.
export function createNavigation({render,refresh,canSync,onBusy=()=>{},onError=()=>{}}){
 let revision=0;
 async function sync(){
  const ticket=++revision;
  if(!canSync()){onBusy(false);return;}
  onBusy(true);
  try{const changed=await refresh();if(ticket===revision&&canSync()&&changed)render({animate:false});}
  catch(error){if(ticket===revision&&canSync())onError(error);}
  finally{if(ticket===revision)onBusy(false);}
 }
 return {navigate(){render({animate:true});return sync();},sync,reset(){revision++;onBusy(false);}};
}
