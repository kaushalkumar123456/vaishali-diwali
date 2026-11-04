import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Heart, X } from 'lucide-react'

const memories = [
  { image: 'happiness.jpeg', caption: 'A smile that brightens everything' },
  { image: 'promise-watermark.png', caption: 'A little Diwali sparkle' },
  { image: 'peace.jpeg', caption: 'The beauty in the little things' },
  { image: 'dreams.jpeg', caption: 'Keep shining, always' },
  { image: 'trust.jpeg', caption: 'My favourite kind of lovely' }
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: .8, ease: [.22, 1, .36, 1] } }
}

export default function GalleryPage() {
  const [selectedMemory, setSelectedMemory] = useState(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!selectedMemory) return
    const closeOnEscape = event => {
      if (event.key === 'Escape') setSelectedMemory(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedMemory])

  return <main className="relative z-10 min-h-screen px-5 pb-24 pt-24 sm:pt-28">
    <div className="mx-auto max-w-6xl">
      <a href="#home" className="mb-12 inline-flex items-center gap-2 rounded-full border border-[#f4d59a]/25 bg-[#1b1027]/80 px-4 py-2.5 text-xs tracking-[.12em] text-[#ffe7b6] backdrop-blur-xl transition hover:border-[#f4d59a]/60 hover:bg-[#21162b]">
        <ArrowLeft size={15} /> BACK TO DIWALI
      </a>
      <motion.header initial="hidden" animate="show" variants={fadeUp} className="mb-12 text-center sm:mb-16">
        <p className="mb-4 text-[10px] uppercase tracking-[.4em] text-[#e8a8bd]">A sample album of little joys</p>
        <h1 className="gold-text font-display text-5xl sm:text-7xl">Our little memories</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#e4d2d8]">A place for the smiles, soft moments, and lovely memories worth keeping close.</p>
      </motion.header>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: .12 }} variants={fadeUp} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
        {memories.map((memory, index) => <motion.button
          key={memory.caption}
          type="button"
          onClick={() => setSelectedMemory(memory)}
          whileHover={reduceMotion ? {} : { y: -4 }}
          className="group relative isolate aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[#f4d59a]/20 bg-[#24152b] text-left shadow-[0_18px_50px_rgba(0,0,0,.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2cd88]"
          aria-label={`View memory: ${memory.caption}`}
        >
          <img src={`/images/${memory.image}`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-contain" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10091f]/90 via-[#10091f]/5 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
          <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[10px] tracking-[.2em] text-white/85 backdrop-blur-md">0{index + 1}</span>
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
            <span className="font-display text-lg text-[#fff0d3] sm:text-2xl">{memory.caption}</span>
            <Heart size={16} className="mb-1 shrink-0 text-[#ffd79a] transition group-hover:scale-125 group-hover:fill-[#ffd79a]" />
          </span>
        </motion.button>)}
      </motion.div>
      <p className="mt-8 text-center text-xs tracking-wide text-[#bda9bb]">Sample photos for now — this album is ready for your own memories.</p>
    </div>

    <AnimatePresence>
      {selectedMemory && <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedMemory(null)}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-[#090510]/90 p-5 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label={selectedMemory.caption}
      >
        <motion.div
          initial={{ scale: .94, y: 12 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: .96 }}
          onClick={event => event.stopPropagation()}
          className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-[#f4d59a]/30 bg-[#1a1021] shadow-2xl"
        >
          <img src={`/images/${selectedMemory.image}`} alt={selectedMemory.caption} className="max-h-[78vh] w-full object-contain" />
          <p className="px-5 py-4 text-center font-display text-xl text-[#ffe8bb]">{selectedMemory.caption}</p>
          <button type="button" onClick={() => setSelectedMemory(null)} aria-label="Close image" className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/50 p-2 text-white backdrop-blur-md transition hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f2cd88]">
            <X size={20} />
          </button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </main>
}
