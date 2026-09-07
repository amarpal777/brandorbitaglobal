'use client';

import { useEffect, useRef } from 'react';
import { motionPreference } from './motion-preference';

/** Native scrolling drives the stage; pointer effects never intercept input. */
export default function ExperienceMotion() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const smoke = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const preference = motionPreference;
    const desktop = matchMedia('(min-width: 901px) and (pointer: fine)');
    let cleanup = () => {};
    function setup() {
      cleanup();
      if (preference.matches) return;
      const stage = document.querySelector<HTMLElement>('.project-grid');
      const hero = document.querySelector<HTMLElement>('.hero-copy');
      const canvas = smoke.current;
      const cursor = ring.current;
      if (!stage || !canvas || !cursor) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      let cards = [...stage.querySelectorAll<HTMLElement>('.project')];
      let scrollFrame = 0, pointerFrame = 0;
      let mx = -100, my = -100, x = -100, y = -100, px = -100, py = -100, last = 0;
      let active = false;
      let particles: { x:number;y:number;life:number;vx:number;vy:number;size:number;rotation:number;spin:number;color:number }[] = [];
      // Cache two four-point star sprites; no per-frame shadow or path rendering.
      const sprites=['#f2cc7d','#79baff'].map(color=>{
        const sprite=document.createElement('canvas');sprite.width=64;sprite.height=64;
        const paint=sprite.getContext('2d')!;
        const glow=paint.createRadialGradient(32,32,0,32,32,30);
        glow.addColorStop(0,color+'70');glow.addColorStop(1,color+'00');
        paint.fillStyle=glow;paint.fillRect(0,0,64,64);
        paint.beginPath();
        for(let i=0;i<8;i++){const angle=i*Math.PI/4-Math.PI/2;const radius=i%2?5:25;const x=32+Math.cos(angle)*radius,y=32+Math.sin(angle)*radius;if(i===0)paint.moveTo(x,y);else paint.lineTo(x,y);}
        paint.closePath();paint.fillStyle=color;paint.fill();
        paint.beginPath();paint.arc(32,32,2,0,Math.PI*2);paint.fillStyle='#fff9e8';paint.fill();
        return sprite;
      });
      const resize=()=>{const ratio=Math.min(devicePixelRatio,1.25);canvas.width=innerWidth*ratio;canvas.height=innerHeight*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);scheduleScroll();};
      function updateScroll(){
        scrollFrame=0;
        const enabled=desktop.matches;
        stage!.classList.toggle('work-stack',enabled&&cards.length>1);
        const tops=cards.map(card=>card.getBoundingClientRect().top);
        cards.forEach((card,i)=>{
          const progress=enabled&&i<cards.length-1?Math.min(1,Math.max(0,(innerHeight-tops[i+1])/(innerHeight-140))):0;
          card.style.scale=String(1-progress*.065);
          card.style.setProperty('--stack-shade',String(progress*.48));
        });
        if(hero){const rect=hero.getBoundingClientRect();const progress=Math.min(1,Math.max(0,-rect.top/innerHeight));hero.style.translate=enabled?`0 ${progress*90}px`:'';hero.style.opacity=String(1-progress*.85);}
      }
      function scheduleScroll(){if(!scrollFrame&&!document.hidden)scrollFrame=requestAnimationFrame(updateScroll);}
      const mutation=new MutationObserver(()=>{cards=[...stage.querySelectorAll<HTMLElement>('.project')];scheduleScroll();});
      mutation.observe(stage,{childList:true});
      const draw=(time:number)=>{
        pointerFrame=0;
        if(document.hidden||!desktop.matches)return;
        const dt=Math.min((time-last)/1000||.016,.04);last=time;
        const smoothing=1-Math.exp(-10*dt);x+=(mx-x)*smoothing;y+=(my-y)*smoothing;
        cursor.style.transform=`translate3d(${x}px,${y}px,0)`;
        ctx.clearRect(0,0,innerWidth,innerHeight);
        const distance=Math.hypot(mx-px,my-py);
        if(active&&distance>9){
          const count=Math.min(4,Math.ceil(distance/18));
          for(let i=1;i<=count;i++)particles.push({x:px+(mx-px)*i/count,y:py+(my-py)*i/count,life:1,vx:(mx-px)*-.025,vy:-8,size:13+(particles.length%4)*5,rotation:particles.length*2.4,spin:particles.length%2? .7:-.7,color:particles.length%3===0?1:0});
          px=mx;py=my;if(particles.length>40)particles.splice(0,particles.length-40);
        }
        particles=particles.filter(p=>p.life>0);
        particles.forEach(p=>{p.life-=dt*.75;p.x+=p.vx*dt*12;p.y+=p.vy*dt;p.size=Math.max(2,p.size-dt*5);p.rotation+=p.spin*dt;ctx.save();ctx.globalAlpha=Math.max(0,p.life)*.9;ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.drawImage(sprites[p.color],-p.size/2,-p.size/2,p.size,p.size);ctx.restore();});
        if(particles.length||Math.hypot(mx-x,my-y)>.1)pointerFrame=requestAnimationFrame(draw);
      };
      const pointer=(e:PointerEvent)=>{
        if(!desktop.matches||e.pointerType!=='mouse')return;
        if(!active){x=e.clientX;y=e.clientY;px=x;py=y;}active=true;mx=e.clientX;my=e.clientY;
        cursor.classList.add('cursor-active');
        document.documentElement.classList.add('custom-cursor-ready');
        if(dot.current){dot.current.style.transform=`translate3d(${mx}px,${my}px,0)`;dot.current.classList.add('cursor-active');}
        const target=e.target instanceof Element?e.target:null;
        cursor.classList.toggle('cursor-link',!!target?.closest('a,button'));
        cursor.classList.toggle('cursor-project',!!target?.closest('.project-art'));
        if(!pointerFrame){last=0;pointerFrame=requestAnimationFrame(draw);}
      };
      const leave=()=>{active=false;cursor.classList.remove('cursor-active');dot.current?.classList.remove('cursor-active');document.documentElement.classList.remove('custom-cursor-ready');};
      const visibility=()=>{if(document.hidden){cancelAnimationFrame(pointerFrame);pointerFrame=0;cancelAnimationFrame(scrollFrame);scrollFrame=0;leave();}else scheduleScroll();};
      window.addEventListener('scroll',scheduleScroll,{passive:true});window.addEventListener('resize',resize);
      document.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',visibility);
      resize();scheduleScroll();
      cleanup=()=>{cancelAnimationFrame(scrollFrame);cancelAnimationFrame(pointerFrame);mutation.disconnect();window.removeEventListener('scroll',scheduleScroll);window.removeEventListener('resize',resize);document.removeEventListener('pointermove',pointer);document.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visibility);stage.classList.remove('work-stack');cards.forEach(card=>{card.style.scale='';card.style.removeProperty('--stack-shade');});if(hero){hero.style.translate='';hero.style.opacity='';}cursor.classList.remove('cursor-active');dot.current?.classList.remove('cursor-active');document.documentElement.classList.remove('custom-cursor-ready');ctx.clearRect(0,0,innerWidth,innerHeight);};
    }
    setup();desktop.addEventListener('change',setup);
    return()=>{cleanup();desktop.removeEventListener('change',setup);};
  },[]);
  return <><div className="launch-curtain" aria-hidden="true"><div className="launch-mark">BRAND <span>ORBITA</span><small>PREPARE FOR A NEW TRAJECTORY</small></div><div className="launch-line"/></div><canvas ref={smoke} className="cursor-atmosphere" aria-hidden="true"/><div ref={dot} className="cursor-core" aria-hidden="true"/><div ref={ring} className="experience-cursor" aria-hidden="true"><div><span>EXPLORE ↗</span></div></div></>;
}
