import { useEffect, useRef } from 'react'

export default function Fireworks({ burstSignal = 0 }) {
  const ref = useRef(null)
  const burstRef = useRef(null)
  useEffect(() => { burstRef.current = burstSignal }, [burstSignal])
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, raf, lastAuto = 0, seenSignal = 0
    const particles = []
    const palette = ['#ffe6a6','#f7bd65','#f58da9','#d8b7ff','#fff5d9','#ff9f77']
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight; canvas.width = w*dpr; canvas.height = h*dpr; canvas.style.width = w+'px'; canvas.style.height = h+'px'; ctx.setTransform(dpr,0,0,dpr,0,0) }
    const launch = (x = Math.random()*w, y = h*(.18+Math.random()*.32)) => {
      const color = palette[Math.floor(Math.random()*palette.length)]
      const count = 48 + Math.floor(Math.random()*22)
      for (let i=0;i<count;i++) { const a = Math.PI*2*i/count, speed = 1.1+Math.random()*3.2; particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:55+Math.random()*30,max:85,size:1+Math.random()*1.7,color}) }
    }
    const frame = (t) => {
      ctx.clearRect(0,0,w,h)
      if (t-lastAuto>2600) { launch(w*(.15+Math.random()*.7),h*(.15+Math.random()*.35)); lastAuto=t }
      if (burstRef.current !== seenSignal) { seenSignal=burstRef.current; launch(w*.25,h*.32); launch(w*.72,h*.28); launch(w*.5,h*.48) }
      for (let i=particles.length-1;i>=0;i--) {
        const p=particles[i]; p.x+=p.vx; p.y+=p.vy; p.vx*=.985; p.vy=p.vy*.985+.018; p.life--
        ctx.globalAlpha=Math.max(0,p.life/p.max); ctx.fillStyle=p.color; ctx.shadowBlur=12; ctx.shadowColor=p.color
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill()
        if(p.life<=0) particles.splice(i,1)
      }
      ctx.globalAlpha=1; ctx.shadowBlur=0; raf=requestAnimationFrame(frame)
    }
    resize(); window.addEventListener('resize',resize); raf=requestAnimationFrame(frame)
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',resize) }
  }, [])
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[1] opacity-80" aria-hidden="true" />
}
