'use client';

import { useEffect, useRef } from 'react';
import { motionPreference } from './motion-preference';

/** One frame-scheduled pointer listener; CSS owns continuous compositor motion. */
export default function MotionEffects() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const reduced = motionPreference;
    let dispose = () => {};
    const setup = () => {
      dispose();
      if (reduced.matches) return;
      const hero = document.querySelector<HTMLElement>('.hero');
      const art = document.querySelector<HTMLElement>('.hero-art');
      const surface = canvas.current;
      if (!hero || !art || !surface) return;
      const ctx = surface.getContext('2d');
      if (!ctx) return;
      const fine = matchMedia('(pointer: fine)').matches;
      const moving = [...document.querySelectorAll<HTMLElement>('.hero,.service-visual,.social-blue,.contact,.discipline-strip')];
      const observer = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('motion-visible', e.isIntersecting)), {rootMargin:'60px'});
      moving.forEach(el => observer.observe(el));
      let width = 1, height = 1, frame = 0, last = 0, visible = true;
      let targetX = 0, targetY = 0, x = 0, y = 0;
      const stars = Array.from({length:fine ? 65 : 28}, (_, i) => ({x:((i*137.508)%997)/997,y:((i*73.37)%991)/991,z:.25+(i%7)/9}));
      const resize = new ResizeObserver(() => {
        width = hero.clientWidth; height = hero.clientHeight;
        const ratio = Math.min(devicePixelRatio, 1.5);
        surface.width = width * ratio; surface.height = height * ratio;
        ctx.setTransform(ratio,0,0,ratio,0,0);
      });
      resize.observe(hero);
      const heroObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; restart(); });
      heroObserver.observe(hero);
      function draw(now:number) {
        frame = 0;
        if (!visible || document.hidden) return;
        const dt = Math.min((now-last)/1000 || .016,.04); last=now;
        const ease=1-Math.exp(-5*dt); x+=(targetX-x)*ease; y+=(targetY-y)*ease;
        art!.style.translate = `${x*18}px ${y*12}px`;
        art!.style.rotate = `${x*2}deg`;
        ctx!.clearRect(0,0,width,height);
        for (const star of stars) {
          star.y -= dt * .012 * star.z;
          if (star.y < 0) star.y = 1;
          const sx=star.x*width+x*star.z*18, sy=star.y*height+y*star.z*12;
          ctx!.globalAlpha = .25+star.z*.5;
          ctx!.fillStyle = star.z>.8?'#e4c888':'#89b8ff';
          ctx!.beginPath(); ctx!.arc(sx,sy,star.z*1.3,0,Math.PI*2);ctx!.fill();
        }
        frame=requestAnimationFrame(draw);
      }
      function restart(){cancelAnimationFrame(frame);frame=0;last=0;if(visible&&!document.hidden)frame=requestAnimationFrame(draw);}
      const pointer=(e:PointerEvent)=>{if(!fine)return;const r=hero.getBoundingClientRect();targetX=(e.clientX-r.left)/r.width*2-1;targetY=(e.clientY-r.top)/r.height*2-1;};
      const leave=()=>{targetX=0;targetY=0;};
      hero.addEventListener('pointermove',pointer,{passive:true});hero.addEventListener('pointerleave',leave);
      const visibility=()=>{document.documentElement.classList.toggle('motion-hidden',document.hidden);restart();};
      document.addEventListener('visibilitychange',visibility);
      restart();
      dispose=()=>{cancelAnimationFrame(frame);observer.disconnect();heroObserver.disconnect();resize.disconnect();hero.removeEventListener('pointermove',pointer);hero.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visibility);art.style.translate='';art.style.rotate='';ctx.clearRect(0,0,width,height);moving.forEach(el=>el.classList.remove('motion-visible'));document.documentElement.classList.remove('motion-hidden');};
    };
    setup();reduced.addEventListener('change',setup);
    return ()=>{dispose();reduced.removeEventListener('change',setup);};
  },[]);
  return <canvas ref={canvas} className="cosmic-particles" aria-hidden="true"/>;
}

export function OrbitTrails(){return <div className="orbit-trails" aria-hidden="true"><div className="trail-plane trail-plane-gold"><div className="trail-rotor"><i/><b/></div></div><div className="trail-plane trail-plane-blue"><div className="trail-rotor"><i/><b/></div></div><div className="trail-plane trail-plane-fine"><div className="trail-rotor"><i/></div></div></div>;}
