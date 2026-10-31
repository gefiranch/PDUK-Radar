const running=new WeakMap();
export function stopPageMotion(root){for(const animation of running.get(root)||[])animation.cancel();running.delete(root);}
export function animatePage(root){
 stopPageMotion(root);
 if(!root||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 // Animate groups, with a short stagger for headline metrics. Never animate hundreds of table rows.
 const targets=Array.from(root.children).flatMap(element=>element.matches('.kpi-grid,.case-summary-grid,.admin-stats')?Array.from(element.children):[element]).slice(0,16);
 const animations=targets.filter(element=>typeof element.animate==='function').map((element,index)=>element.animate([
  {opacity:.3,transform:'translateY(12px)'},
  {opacity:1,transform:'translateY(0)'}
 ],{duration:380,delay:Math.min(index*24,144),easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
 running.set(root,animations);
}
