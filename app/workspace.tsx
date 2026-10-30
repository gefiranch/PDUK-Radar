'use client';
import {useEffect} from 'react';
export default function Workspace(){
 useEffect(()=>{const script=document.createElement('script');script.type='module';script.src='/ui/src/main.js';document.body.appendChild(script);return()=>{script.remove();};},[]);
 return <><a className="skip-link" href="#main">Lewati navigasi</a><div id="app"><div className="loading-screen"><span className="spinner"/><p>Memuat PDUK-Radar…</p></div></div><div id="toast" role="status" aria-live="polite"/><dialog id="modal"/></>;
}
