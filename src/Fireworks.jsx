import { useEffect, useRef } from 'react'

export default function Fireworks({ burstSignal = 0, burstPoint = null, displayOnTop = false }) {
  const ref = useRef(null)
  const burstRef = useRef(null)
  const pointRef = useRef(burstPoint)
  useEffect(() => { burstRef.current = burstSignal }, [burstSignal])
  useEffect(() => { pointRef.current = burstPoint }, [burstPoint])
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, raf, lastAuto = 0, seenSignal = 0
    const particles = []
    const activeEffects = []
    const palette = ['#ffe6a6','#f7bd65','#f58da9','#d8b7ff','#fff5d9','#ff9f77']
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight; canvas.width = w*dpr; canvas.height = h*dpr; canvas.style.width = w+'px'; canvas.style.height = h+'px'; ctx.setTransform(dpr,0,0,dpr,0,0) }
    const launch = (x = Math.random()*w, y = h*(.18+Math.random()*.32), kind = 'aerial') => {
      if (kind === 'sparkler' || kind === 'anar' || kind === 'chakra') {
        activeEffects.push({ kind, x, y, startedAt: performance.now(), duration: 2600, rotation: Math.random() * Math.PI * 2 })
        if (activeEffects.length > 8) activeEffects.shift()
        return
      }
      const color = palette[Math.floor(Math.random()*palette.length)]
      const count = 68 + Math.floor(Math.random()*28)
      for (let i=0;i<count;i++) {
        const angle = Math.PI*2*i/count
        const speed = 1.1+Math.random()*3.2
        particles.push({
          x, y,
          vx:Math.cos(angle)*speed,
          vy:Math.sin(angle)*speed,
          life:65+Math.random()*38,
          max:105,
          size:1.2+Math.random()*2,
          color
        })
      }
    }
    const emitSpark = ({ x, y }) => {
      const angle = Math.random() * Math.PI * 2
      const speed = .8 + Math.random() * 4
      const color = ['#fff8d8', '#ffe58c', '#ffc64b', '#ff9e38'][Math.floor(Math.random() * 4)]
      const life = 16 + Math.random() * 28
      particles.push({
        x: x + (Math.random() - .5) * 5,
        y: y + (Math.random() - .5) * 5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - .45,
        life,
        max: life,
        size: .8 + Math.random() * 1.8,
        color
      })
    }
    const emitFountainSpark = effect => {
      const baseY = Math.min(effect.y + 72, h - 28)
      const angle = -Math.PI + Math.random() * Math.PI
      const speed = 2.2 + Math.random() * 5.2
      const life = 48 + Math.random() * 38
      particles.push({
        x: effect.x + (Math.random() - .5) * 12,
        y: baseY,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed) - 1.2,
        life,
        max: life,
        size: 1.2 + Math.random() * 2.3,
        color: ['#fff8d8', '#ffe58c', '#ffc64b', '#ff9e38'][Math.floor(Math.random() * 4)]
      })
    }
    const emitChakriSpark = (effect, angle) => {
      const radius = 68 + Math.random() * 20
      const speed = 1 + Math.random() * 3.2
      const life = 22 + Math.random() * 24
      particles.push({
        x: effect.x + Math.cos(angle) * radius,
        y: effect.y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * speed + (Math.random() - .5) * 1.5,
        vy: Math.sin(angle) * speed + (Math.random() - .5) * 1.5,
        life,
        max: life,
        size: 1 + Math.random() * 2,
        color: ['#fff8d8', '#ffe58c', '#ffc64b', '#ff7d9a', '#c5a5ff'][Math.floor(Math.random() * 5)]
      })
    }
    const frame = (t) => {
      ctx.clearRect(0,0,w,h)
      if (t-lastAuto>1350) {
        const firstX=w*(.12+Math.random()*.76)
        const firstY=h*(.12+Math.random()*.35)
        launch(firstX,firstY)
        if (Math.random() > .2) {
          let secondX=w*(.12+Math.random()*.76)
          if (Math.abs(secondX-firstX) < w*.2) secondX=(secondX+w*.38)%w
          launch(secondX,h*(.12+Math.random()*.35))
        }
        lastAuto=t
      }
      if (burstRef.current !== seenSignal) {
        seenSignal=burstRef.current
        const point=pointRef.current
        if (point) launch(point.x,point.y,point.kind)
        else { launch(w*.25,h*.32); launch(w*.72,h*.28); launch(w*.5,h*.48) }
      }
      for (let i=activeEffects.length-1;i>=0;i--) {
        const effect=activeEffects[i]
        const elapsed=t-effect.startedAt
        if (elapsed >= effect.duration) {
          activeEffects.splice(i,1)
          continue
        }
        const flicker=.65+Math.random()*.35
        ctx.save()
        ctx.lineCap='round'
        if (effect.kind === 'sparkler') {
          for (let j=0;j<5;j++) emitSpark(effect)
          ctx.shadowBlur=18
          ctx.shadowColor='#ffbd48'
          ctx.strokeStyle='#c8c0af'
          ctx.lineWidth=3
          ctx.beginPath()
          ctx.moveTo(effect.x,effect.y)
          ctx.lineTo(effect.x+12,effect.y+58)
          ctx.stroke()
          ctx.strokeStyle='#fff0be'
          ctx.lineWidth=1
          ctx.beginPath()
          ctx.moveTo(effect.x+1,effect.y+4)
          ctx.lineTo(effect.x+12,effect.y+56)
          ctx.stroke()
          ctx.globalAlpha=flicker
          ctx.fillStyle='#fff8ce'
          ctx.shadowBlur=30
          ctx.beginPath()
          ctx.arc(effect.x,effect.y,4+Math.random()*2,0,Math.PI*2)
          ctx.fill()
        } else if (effect.kind === 'anar') {
          const baseY=Math.min(effect.y+72,h-28)
          for (let j=0;j<8;j++) emitFountainSpark(effect)
          ctx.globalAlpha=.35+flicker*.3
          ctx.shadowColor='#ffbd48'
          ctx.shadowBlur=32
          const fountain=ctx.createRadialGradient(effect.x,baseY,4,effect.x,baseY-95,145)
          fountain.addColorStop(0,'#fff6d8')
          fountain.addColorStop(.28,'#ffc64b99')
          fountain.addColorStop(1,'#ff9e3800')
          ctx.fillStyle=fountain
          ctx.beginPath()
          ctx.moveTo(effect.x-115,baseY)
          ctx.quadraticCurveTo(effect.x-35,baseY-210,effect.x,baseY-225)
          ctx.quadraticCurveTo(effect.x+35,baseY-210,effect.x+115,baseY)
          ctx.closePath()
          ctx.fill()
          ctx.globalAlpha=1
          ctx.fillStyle='#b87342'
          ctx.shadowBlur=12
          ctx.shadowColor='#ffbd48'
          ctx.beginPath()
          ctx.moveTo(effect.x-25,baseY)
          ctx.lineTo(effect.x-17,baseY-22)
          ctx.lineTo(effect.x+17,baseY-22)
          ctx.lineTo(effect.x+25,baseY)
          ctx.closePath()
          ctx.fill()
          ctx.strokeStyle='#ffd777'
          ctx.lineWidth=2
          ctx.stroke()
          ctx.fillStyle='#fff2bd'
          ctx.beginPath()
          ctx.ellipse(effect.x,baseY-22,17,5,0,0,Math.PI*2)
          ctx.fill()
        } else if (effect.kind === 'chakra') {
          const angle=elapsed*.018+effect.rotation
          const radius=82+Math.sin(elapsed*.025)*8
          for(let j=0;j<8;j++) emitChakriSpark(effect,angle+j*Math.PI/4)
          ctx.translate(effect.x,effect.y)
          ctx.rotate(angle)
          ctx.shadowBlur=24
          ctx.shadowColor='#ffb84d'
          ctx.strokeStyle='#ffc64b'
          ctx.lineWidth=4
          ctx.beginPath()
          ctx.arc(0,0,radius,0,Math.PI*2)
          ctx.stroke()
          ctx.strokeStyle='#fff0be'
          ctx.lineWidth=2
          ctx.beginPath()
          ctx.arc(0,0,radius*.76,0,Math.PI*2)
          ctx.stroke()
          ctx.lineWidth=3
          for(let spoke=0;spoke<8;spoke++) {
            ctx.rotate(Math.PI/4)
            ctx.beginPath()
            ctx.moveTo(radius*.55,0)
            ctx.lineTo(radius,0)
            ctx.stroke()
          }
          ctx.fillStyle='#fff8ce'
          ctx.beginPath()
          ctx.arc(0,0,8+Math.random()*3,0,Math.PI*2)
          ctx.fill()
        }
        ctx.restore()
      }
      for (let i=particles.length-1;i>=0;i--) {
        const p=particles[i]; const oldX=p.x, oldY=p.y; p.x+=p.vx; p.y+=p.vy; p.vx*=.985; p.vy=p.vy*.985+.018; p.life--
        ctx.globalAlpha=Math.max(0,p.life/p.max); ctx.fillStyle=p.color; ctx.shadowBlur=12; ctx.shadowColor=p.color
        ctx.beginPath(); ctx.moveTo(oldX,oldY); ctx.lineTo(p.x,p.y); ctx.lineWidth=p.size; ctx.strokeStyle=p.color; ctx.stroke()
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill()
        if(p.life<=0) particles.splice(i,1)
      }
      ctx.globalAlpha=1; ctx.shadowBlur=0; raf=requestAnimationFrame(frame)
    }
    resize(); window.addEventListener('resize',resize); raf=requestAnimationFrame(frame)
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',resize) }
  }, [])
  return <canvas ref={ref} className={`pointer-events-none fixed inset-0 ${displayOnTop ? 'z-[25]' : 'z-[1]'} opacity-80`} aria-hidden="true" />
}
