'use client';
import { useEffect, useSyncExternalStore } from 'react';

function reduced() {
  try { const choice=localStorage.getItem('orbita-motion'); if(choice==='full')return false;if(choice==='reduced')return true; } catch {}
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function subscribe(callback:()=>void) {
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change',callback);window.addEventListener('orbita-motion',callback);window.addEventListener('storage',callback);
  return()=>{media.removeEventListener('change',callback);window.removeEventListener('orbita-motion',callback);window.removeEventListener('storage',callback);};
}
export const motionPreference = {
  get matches(){return reduced();},
  addEventListener(_event:string,callback:()=>void){window.addEventListener('orbita-motion',callback);matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',callback);},
  removeEventListener(_event:string,callback:()=>void){window.removeEventListener('orbita-motion',callback);matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change',callback);}
};
export function useMotionPreference(){return useSyncExternalStore(subscribe,reduced,()=>false);}
export default function MotionSwitch(){
  const isReduced=useMotionPreference();
  useEffect(()=>{document.documentElement.dataset.motion=isReduced?'reduced':'full';},[isReduced]);
  return <button className="motion-switch" aria-pressed={!isReduced} onClick={()=>{try{localStorage.setItem('orbita-motion',isReduced?'full':'reduced');}catch{}window.dispatchEvent(new Event('orbita-motion'));}}>{isReduced?'◌ Enable full motion':'◎ Full motion on'}<span>{isReduced?'Animations are reduced':'Click to reduce'}</span></button>;
}
