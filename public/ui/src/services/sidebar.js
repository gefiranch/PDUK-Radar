export const SIDEBAR_KEY='pduk-radar:sidebar-collapsed';
const storage=()=>{try{return globalThis.localStorage;}catch{return null;}};
export function initializeSidebar({root=document.documentElement,persistence=storage()}={}){
 let collapsed=false;try{collapsed=persistence?.getItem(SIDEBAR_KEY)==='true';}catch{}
 root.dataset.sidebar=collapsed?'collapsed':'expanded';return collapsed;
}
export function setSidebarCollapsed(collapsed,{root=document.documentElement,persistence=storage()}={}){
 root.dataset.sidebar=collapsed?'collapsed':'expanded';
 try{persistence?.setItem(SIDEBAR_KEY,String(collapsed));}catch{}
 syncSidebarToggle(root);return collapsed;
}
export function syncSidebarToggle(root=document.documentElement){
 const collapsed=root.dataset.sidebar==='collapsed';
 for(const button of root.querySelectorAll('[data-action="toggle-sidebar"]')){
  button.setAttribute('aria-expanded',String(!collapsed));
  button.setAttribute('aria-label',collapsed?'Perbesar sidebar':'Perkecil sidebar');
 }
}
export function toggleSidebar(){return setSidebarCollapsed(document.documentElement.dataset.sidebar!=='collapsed');}
