import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowRight, Heart, Music2, Music, Sparkles, VolumeX, X } from 'lucide-react'
import Fireworks from './Fireworks.jsx'
import { createAmbientMusic } from './music.js'

const fadeUp = { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0, transition: { duration: .9, ease: [0.22,1,0.36,1] } } }

function Stars() {
  const stars = Array.from({ length: 75 }, (_,i)=>({left:`${(i*37.71)%100}%`,top:`${(i*61.37)%100}%`,delay:`${(i%9)*.37}s`,size:i%7===0?3:1.5}))
  return <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    {stars.map((s,i)=><i key={i} className="absolute rounded-full bg-[#fff0c5] animate-pulse" style={{left:s.left,top:s.top,width:s.size,height:s.size,animationDelay:s.delay,opacity:.45}} />)}
    <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#a34d8a]/10 blur-[130px]" />
    <div className="absolute bottom-0 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[#b66c35]/10 blur-[120px]" />
  </div>
}

function Diyas() {
  return <div className="flex items-end justify-center gap-8 sm:gap-16" aria-hidden="true">
    {[-1,0,1].map((n)=><motion.div key={n} animate={{rotate:[-3,3,-3],y:[0,-5,0]}} transition={{duration:3.5+n*.3,repeat:Infinity,ease:'easeInOut',delay:n*.45}} className="relative">
      <div className="absolute -top-9 left-1/2 h-12 w-7 -translate-x-1/2 rounded-[100%] bg-gradient-to-t from-orange-500 via-yellow-200 to-white blur-[1px] shadow-[0_0_28px_12px_rgba(255,174,67,.3)]" />
      <div className="relative h-7 w-16 rounded-b-[100%] rounded-t-[45%] border border-[#f8d58a]/70 bg-gradient-to-b from-[#ffe5a0] via-[#c77a35] to-[#6d2b36] shadow-[0_10px_35px_rgba(240,156,61,.28)]" />
      <div className="absolute -bottom-1 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-[#f6c779]/30 blur-sm" />
    </motion.div>)}
  </div>
}

function Envelope({ onOpen }) {
  const [opened,setOpened] = useState(false)
  return <div className="mx-auto mt-10 max-w-md">
    <motion.button onClick={()=>{setOpened(true);onOpen()}} whileHover={{y:-5,scale:1.02}} whileTap={{scale:.98}} className="group relative mx-auto block w-full rounded-2xl border border-[#eac987]/30 bg-gradient-to-br from-[#5c294b] to-[#27162f] p-8 text-center shadow-[0_25px_80px_rgba(0,0,0,.3)]">
      <motion.div animate={opened?{rotateX:180,opacity:0}:{rotateX:0,opacity:1}} transition={{duration:.7}} className="mx-auto mb-4 text-5xl">💌</motion.div>
      <span className="font-display text-2xl text-[#ffe4ad]">{opened?'A little piece of my heart':'A letter, sealed with love'}</span>
      <span className="mt-2 block text-xs tracking-[.22em] text-[#d9b9bd]">{opened?'OPENED JUST FOR YOU':'TAP TO OPEN YOUR SURPRISE'}</span>
      {!opened && <span className="absolute right-4 top-4 text-[#f7d38c]"><Sparkles size={17}/></span>}
    </motion.button>
  </div>
}

export default function App() {
  const [burst,setBurst] = useState(0)
  const [musicOn,setMusicOn] = useState(false)
  const [letterOpen,setLetterOpen] = useState(false)
  const [showSurprise,setShowSurprise] = useState(false)
  const musicRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(()=>()=>{musicRef.current?.close()},[])
  const toggleMusic = async () => {
    if (!musicRef.current) musicRef.current = createAmbientMusic()
    if (!musicRef.current) return
    if (musicOn) { musicRef.current.pause(); setMusicOn(false) }
    else { await musicRef.current.start(); setMusicOn(true) }
  }
  const celebrate = () => setBurst(v=>v+1)
  const reveal = () => { setLetterOpen(true); celebrate() }

  return <div className="grain relative min-h-screen overflow-hidden bg-[#10091f] text-[#fff4e5]">
    <Stars />
    <Fireworks burstSignal={burst} />
    <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(9,5,19,.45)_100%)]" />
    <button onClick={toggleMusic} className="fixed right-8 top-3 z-40 flex h-[46px] items-center gap-3 rounded-full border border-[#f4d59a]/30 bg-[#1b1027]/80 px-4 text-xs font-medium tracking-normal text-[#ffe7b6] backdrop-blur-xl transition hover:border-[#f4d59a]/60 hover:bg-[#21162b]" aria-label={musicOn?'Pause music':'Play music'}>
      {musicOn?<Music size={15}/>:<Music2 size={15}/>}<span className="hidden sm:inline">{musicOn?'MUSIC ON':'PLAY MUSIC'}</span>{musicOn?<span className="flex h-3 items-end gap-[2px]"><i className="h-2 w-[2px] animate-pulse bg-[#e9bf79]"/><i className="h-3 w-[2px] animate-pulse bg-[#e9bf79]"/><i className="h-1.5 w-[2px] animate-pulse bg-[#e9bf79]"/></span>:null}
    </button>

    <main className="relative z-10">
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pb-24 pt-28 text-center">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-7 flex items-center gap-3 text-[10px] uppercase tracking-[.38em] text-[#eac987] sm:text-xs"><span className="h-px w-8 bg-[#eac987]/60"/><Sparkles size={13}/> A little universe of light <span className="h-px w-8 bg-[#eac987]/60"/></motion.div>
        <motion.p initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.25,duration:1}} className="mb-2 font-display text-2xl italic text-[#f7d9c7] sm:text-3xl">For the one who makes my world brighter</motion.p>
        <motion.h1 initial={{opacity:0,scale:.88,filter:'blur(12px)'}} animate={{opacity:1,scale:1,filter:'blur(0px)'}} transition={{duration:1.5,ease:[.2,.8,.2,1],delay:.35}} className="gold-text text-shadow-gold font-display text-[clamp(4.2rem,13vw,10rem)] leading-[.82] tracking-[-.055em]">Happy<br/><span className="italic">Diwali</span></motion.h1><br/><span className="font-display text-2xl italic text-[#f7d9c7] sm:text-3xl">To my beautiful <span className="text-[#f5cb85]">Vaishali</span></span>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}} className="mt-7 font-display text-3xl tracking-[.2em] text-[#ffe6b2] sm:text-5xl">2026</motion.div>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.5,duration:1}} className="mt-7 max-w-xl text-sm leading-8 text-[#e9d7d9] sm:text-lg">To my beautiful <span className="text-[#f5cb85]">Vaishali</span> — my Honey, my favourite person, and one of life's brightest blessings.</motion.p>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.8}} className="mt-20"><Diyas/></motion.div>
        <motion.button onClick={()=>document.getElementById('letter')?.scrollIntoView({behavior:'smooth'})} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.2}} className="mt-16 flex items-center gap-3 text-[10px] tracking-[.3em] text-[#d8c0c2] transition hover:text-[#ffe3a5]">A MESSAGE FROM MY HEART <ArrowDown size={14} className="animate-bounce"/></motion.button>
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#e9bd75]/40 to-transparent"/>
      </section>

      <section id="letter" className="px-5 py-28 sm:py-36">
        <motion.div initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-[10px] uppercase tracking-[.4em] text-[#e8a8bd]">A note, just for you</p>
          <h2 className="gold-text font-display text-5xl sm:text-7xl">Dear Honey <span className="text-[#f18cae]">♥</span></h2>
          <div className="mx-auto my-8 h-px w-20 bg-gradient-to-r from-transparent via-[#eac987] to-transparent"/>
          <div className="space-y-6 font-display text-xl leading-[1.8] text-[#f1e2df] sm:text-2xl">
            <p>Vaishali, if I could gather every beautiful light in the universe, I would still choose the light you bring into my life.</p>
            <p>You make ordinary moments feel special. Your smile can soften a difficult day, and your presence makes life feel a little warmer. I hope you always know how precious you are to me.</p>
            <p>I wish you a life filled with peace, courage, laughter, and dreams that come true. I want you to always feel respected, understood, safe to be yourself, and loved without having to question it.</p>
            <p className="gold-text text-2xl italic sm:text-3xl">May our bond always be built on honesty, patience, loyalty, and trust — stronger and more beautiful with every passing day.</p>
            <p>Tonight, as a thousand diyas glow, I just want you to remember this: <span className="text-[#ffdda0]">you are one of my favourite reasons to smile.</span></p>
          </div>
          <p className="mt-10 font-display text-3xl italic text-[#e9b5c6]">With all my love, always.</p>
          <p className="mt-2 text-xs tracking-[.25em] text-[#d6b8b9]">— YOURS, WITH LOVE ❤️</p>
        </motion.div>
      </section>

      <section className="px-5 py-24">
        <motion.div initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={fadeUp} className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-[10px] uppercase tracking-[.4em] text-[#e8a8bd]">Little wishes for my favourite person</p>
          <h2 className="gold-text font-display text-5xl sm:text-7xl">May your light never fade</h2>
          <div className="mt-14 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['peace.png','🪷','Peace','May your heart always find calm, comfort, and a place where it can rest.'],
              ['happiness.png','✨','Happiness','May small joys surprise you and give you a thousand reasons to smile.'],
              ['dreams.png','🦋','Dreams','May you keep growing, shining, and reaching every beautiful dream.'],
              ['trust.png','🤍','Trust','May the bond we share grow through honesty, kindness, and understanding.']
            ].map(([image,icon,title,copy])=><motion.article key={title} whileHover={reduceMotion?{}:{y:-8}} transition={{duration:.3}} className="glass overflow-hidden rounded-2xl">
              <img src={`/images/${image}`} alt={`${title} placeholder illustration`} className="h-40 w-full object-cover" />
              <div className="p-6"><span className="text-3xl" aria-hidden="true">{icon}</span><h3 className="mt-5 font-display text-3xl text-[#f2d18f]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#dfced5]">{copy}</p></div>
            </motion.article>)}
          </div>
        </motion.div>
      </section>

      <section className="px-5 py-28">
        <motion.div initial="hidden" whileInView="show" viewport={{once:true,amount:.2}} variants={fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-[10px] uppercase tracking-[.4em] text-[#e8a8bd]">A little surprise is waiting</p>
          <h2 className="gold-text font-display text-5xl sm:text-7xl">Just for you, Honey</h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#e4d2d8]">I made this little corner of the universe to remind you how much you matter. There's a note waiting inside.</p>
          <Envelope onOpen={reveal}/>
          <AnimatePresence>
            {letterOpen && <motion.div initial={{opacity:0,y:25,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0}} className="glass relative isolate mt-6 overflow-hidden rounded-2xl p-7 text-center sm:p-10">
              <img src="/images/promise-watermark.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-contain opacity-[0.12]" />
              <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
                {[
                  ['left-5 top-6','text-[#ffe6a6]'],
                  ['right-7 top-8','text-[#f58da9]'],
                  ['left-10 top-1/2','text-[#d8b7ff]'],
                  ['right-10 top-1/2','text-[#ffe6a6]'],
                  ['left-8 bottom-7','text-[#f58da9]'],
                  ['right-6 bottom-6','text-[#d8b7ff]']
                ].map(([position,color],i)=><motion.span key={position} initial={{opacity:0,scale:.4}} animate={reduceMotion?{opacity:.8,scale:1}:{opacity:[0,.95,0],scale:[.4,1.25,.6],rotate:[0,18,-12]}} transition={reduceMotion?{duration:.2}:{duration:1.25,delay:i*.1,repeat:2,repeatDelay:.08}} className={`absolute ${position} ${color}`}>
                  <Sparkles size={i%2===0?20:15}/>
                </motion.span>)}
              </div>
              <p className="relative text-xs uppercase tracking-[.3em] text-[#e7b8c6]">A promise from my heart</p>
              <p className="relative mt-5 font-display text-2xl leading-relaxed text-[#ffebd4] sm:text-3xl">I cannot promise every day will be perfect. But I can promise to keep showing up with honesty, care, respect, and a heart that wants to understand you.</p>
              <p className="relative mt-6 text-2xl text-[#f3c779]">Always your Honey's favourite person. 💛</p>
            </motion.div>}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="relative px-5 pb-32 pt-20 text-center">
        <motion.div initial="hidden" whileInView="show" viewport={{once:true,amount:.3}} variants={fadeUp} className="mx-auto max-w-3xl">
          <div className="mb-5 text-4xl">🪔 ✨ 🪔</div>
          <p className="text-[10px] uppercase tracking-[.4em] text-[#e8a8bd]">One last thing</p>
          <h2 className="gold-text text-shadow-gold mt-5 font-display text-6xl leading-[.95] sm:text-8xl">You are my<br/><i>favourite light.</i></h2>
          <p className="mx-auto mt-8 max-w-xl font-display text-xl leading-relaxed text-[#f0dfe0] sm:text-2xl">Happy Diwali, my Honey. May this festival bring you all the love, peace, and happiness your beautiful heart deserves.</p>
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:.97}} onClick={()=>{celebrate();setShowSurprise(true)}} className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#f5d99e]/60 bg-gradient-to-r from-[#f4d89d] to-[#c88b51] px-7 py-4 text-xs font-semibold tracking-[.12em] text-[#28152a] shadow-[0_0_45px_rgba(238,183,104,.2)]">LIGHT UP THE SKY <Sparkles size={16}/></motion.button>
          <AnimatePresence>{showSurprise && <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="mt-7 font-display text-3xl italic text-[#ffdfaa]">For you, Vaishali. Today and always. ❤️</motion.p>}</AnimatePresence>
        </motion.div>
      </section>
    </main>
    <footer className="relative z-10 border-t border-[#f2d49b]/10 px-5 py-8 text-center text-[10px] tracking-[.25em] text-[#bda9bb]">
      <p>WISHING YOU A VERY HAPPY DIWALI · WITH LOVE, KAUSHAL</p>
      <p className="mt-3 text-[9px] tracking-[.2em]">THIS WEBSITE IS MADE WITH LOVE BY KAUSHAL</p>
    </footer>
  </div>
}
