const running=new WeakMap();
export function stopPageMotion(root){const state=running.get(root);state?.observer?.disconnect();for(const animation of state?.animations||[])animation.cancel();running.delete(root);}
export function animatePage(root){
 stopPageMotion(root);
 if(!root||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 // Animate groups, with a short stagger for headline metrics. Never animate hundreds of table rows.
 const targets=Array.from(root.children).flatMap(element=>element.matches('.kpi-grid,.case-summary-grid,.admin-stats')?Array.from(element.children):[element]).slice(0,16);
 const state={animations:[],observer:null},height=globalThis.innerHeight||900;
 const enter=(element,index=0)=>{if(typeof element.animate!=='function'||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;state.animations.push(element.animate([
  {opacity:.55,transform:'translateY(8px)'},
  {opacity:1,transform:'translateY(0)'}
 ],{duration:300,delay:Math.min(index*18,90),easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));};
 if(typeof IntersectionObserver==='function')state.observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){enter(entry.target);state.observer.unobserve(entry.target);}},{threshold:.08});
 targets.forEach((element,index)=>{if(element.getBoundingClientRect().top<height+24)enter(element,index);else state.observer?.observe(element);});
 running.set(root,state);
}
