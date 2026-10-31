const browserStorage=()=>{try{return globalThis.localStorage;}catch{return null;}};
export const THEME_KEY='pduk-radar:theme';
export function resolveTheme(saved,prefersDark=false){return saved==='dark'||saved==='light'?saved:prefersDark?'dark':'light';}
export function initializeTheme({root=document.documentElement,storage=browserStorage(),prefersDark=globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches||false}={}){
 let saved;try{saved=storage?.getItem(THEME_KEY);}catch{}const theme=resolveTheme(saved,prefersDark);root.dataset.theme=theme;root.style.colorScheme=theme;return theme;
}
export function setTheme(theme,{root=document.documentElement,storage=browserStorage()}={}){
 if(!['light','dark'].includes(theme))throw Error('Tema tidak valid.');root.dataset.theme=theme;root.style.colorScheme=theme;try{storage?.setItem(THEME_KEY,theme);}catch{}return theme;
}
