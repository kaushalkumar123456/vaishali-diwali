import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Gift, Moon, RotateCcw, Sparkles, Sun } from 'lucide-react'

const gifts = [
  {
    name: 'A little love',
    color: 'rose',
    message: 'A thousand hugs, one for every little thing that makes you my favourite person.'
  },
  {
    name: 'A wish for you',
    color: 'gold',
    message: 'May this new year bring you soft mornings, brave dreams, and joy in the little things.'
  },
  {
    name: 'Your surprise',
    color: 'violet',
    message: 'No matter how bright the diyas shine, you will always be my favourite light.'
  }
]

const crackers = [
  { name: 'Phuljhadi', note: 'A shower of golden sparks', emoji: '✨', kind: 'sparkler' },
  { name: 'Anar', note: 'A glowing fountain of light', emoji: '🎇', kind: 'anar' },
  { name: 'Chakri', note: 'A little wheel of colour', emoji: '🌀', kind: 'chakra' }
]

function GiftBox({ color, opened }) {
  return <span className={`gift-box gift-box--${color} ${opened ? 'is-open' : ''}`} aria-hidden="true">
    <span className="gift-box__lid" />
    <span className="gift-box__body" />
    <span className="gift-box__ribbon" />
    <span className="gift-box__bow" />
  </span>
}

export function PetalArtwork({ variant, label }) {
  const patternId = `rose-petals-${variant}`
  const lettersId = `petal-letters-${variant}`
  const heartId = `petal-heart-${variant}`
  const petalColors = variant === 1
    ? ['#a9082d', '#c3133d', '#d9234c', '#890522']
    : ['#bd0b39', '#e21c52', '#a40731', '#d10e42']

  return <svg
    className="petal-artwork"
    viewBox="0 0 720 400"
    role="img"
    aria-label={label}
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id={`paper-${variant}`} x2="0" y2="1">
        <stop stopColor="#fffdf9" />
        <stop offset="1" stopColor="#eee5dc" />
      </linearGradient>
      <pattern id={patternId} width={variant === 1 ? 34 : 27} height={variant === 1 ? 31 : 25} patternUnits="userSpaceOnUse" patternTransform={`rotate(${variant === 1 ? -9 : 13})`}>
        <rect width="100%" height="100%" fill={petalColors[0]} />
        <path d="M3 16C4 7 11 2 17 4c4 2 7 8 4 14-4 7-11 8-18-2Z" fill={petalColors[1]} />
        <path d="M17 29c-3-7 0-14 6-16 5-1 10 3 10 9-1 7-7 11-16 7Z" fill={petalColors[2]} />
        <path d="M6 13c2-4 5-6 8-7" fill="none" stroke="#ffb5c3" strokeOpacity=".38" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="23" cy="21" r="1.2" fill="#ffb5c3" fillOpacity=".45" />
      </pattern>
      <filter id={`petal-shadow-${variant}`} x="-15%" y="-15%" width="130%" height="140%">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#4a1822" floodOpacity=".24" />
      </filter>
      <clipPath id={lettersId}>
        <text x="29" y="319" fontFamily="Georgia, serif" fontSize="286" fontWeight="700" letterSpacing="-15">H</text>
        <text x="471" y="319" fontFamily="Georgia, serif" fontSize="286" fontWeight="700" letterSpacing="-15">K</text>
      </clipPath>
      <clipPath id={heartId}>
        <path d="M360 295c-14-12-75-58-75-101 0-40 50-54 75-16 25-38 75-24 75 16 0 43-61 89-75 101Z" />
      </clipPath>
    </defs>
    <rect width="720" height="400" fill={`url(#paper-${variant})`} />
    <rect width="720" height="400" fill="#d2bdac" opacity=".08" />
    <g filter={`url(#petal-shadow-${variant})`}>
      <rect x="14" y="15" width="692" height="370" fill={`url(#${patternId})`} clipPath={`url(#${lettersId})`} />
      <rect x="14" y="15" width="692" height="370" fill={`url(#${patternId})`} clipPath={`url(#${heartId})`} />
    </g>
    <path d="M360 286c-18-15-65-53-65-91 0-27 33-38 65 1 32-39 65-28 65-1 0 38-47 76-65 91Z" fill="none" stroke="#fff0e8" strokeOpacity=".34" strokeWidth="2" />
  </svg>
}

function PetalPhoto({ image, index }) {
  const [unavailable, setUnavailable] = useState(false)

  return <div className="petal-photo relative aspect-[1.81/1] overflow-hidden rounded-[1.15rem]">
    {unavailable
      ? <PetalArtwork variant={index + 1} label={image.alt} />
      : <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        onError={() => setUnavailable(true)}
        className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
      />}
    <figcaption className="petal-caption absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 pb-4 pt-12">
      <span className="font-display text-xl sm:text-2xl">{image.caption}</span>
      <span className="text-xl" aria-hidden="true">♥</span>
    </figcaption>
  </div>
}

export default function CelebrationPage({ onFirecracker }) {
  const [openedGifts, setOpenedGifts] = useState([])
  const [night, setNight] = useState(true)
  const reduceMotion = useReducedMotion()

  const openGift = name => {
    setOpenedGifts(current => current.includes(name) ? current : [...current, name])
  }

  return <main className={`celebration-page ${night ? 'celebration-page--night' : 'celebration-page--day'} relative z-10 min-h-screen overflow-hidden px-5 pb-24 pt-24 transition-colors duration-700`}>
    <div className="celebration-sky pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {night && <>
        <span className="celebration-moon" />
        {Array.from({ length: 42 }, (_, index) => <i
          key={index}
          className="celebration-star"
          style={{
            left: `${(index * 47.31 + 9) % 100}%`,
            top: `${(index * 31.79 + 5) % 75}%`,
            animationDelay: `${(index % 8) * -.43}s`,
            '--star-size': `${index % 9 === 0 ? 3 : 1.5}px`
          }}
        />)}
      </>}
    </div>

    <div className="relative mx-auto max-w-6xl">
      <header className="mb-14 flex items-center justify-between gap-3">
        <a href="#home" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/10 px-4 text-xs tracking-[.12em] backdrop-blur-md transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200">
          <ArrowLeft size={15} /> BACK TO DIWALI
        </a>
        <button
          type="button"
          onClick={() => setNight(value => !value)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/10 px-4 text-xs tracking-[.12em] backdrop-blur-md transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
          aria-label={night ? 'Switch to daylight' : 'Switch to moonlit night'}
          aria-pressed={!night}
        >
          {night ? <><Sun size={15} /> DAYLIGHT</> : <><Moon size={15} /> MOONLIGHT</>}
        </button>
      </header>

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto mb-20 max-w-3xl text-center"
      >
        <p className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.38em] text-amber-200/80">
          <Sparkles size={13} /> A little Diwali wonderland
        </p>
        <h1 className="celebration-title font-display text-5xl leading-tight sm:text-7xl">A night of little<br/><i>surprises</i></h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
          Tap a present to open it, then choose a spark to light up the sky for Honey.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-4 py-2 text-[10px] tracking-[.15em] text-white/60">
          {night ? <Moon size={13} /> : <Sun size={13} />} {night ? 'UNDER THE MOON & STARS' : 'A SUNLIT DIWALI'}
        </div>
      </motion.section>

      <section aria-labelledby="petal-heading" className="petal-gallery mb-24">
        <div className="mb-8 text-center">
          <p className="mb-2 text-[10px] uppercase tracking-[.35em] text-rose-200/80">A little keepsake for us</p>
          <h2 id="petal-heading" className="font-display text-4xl sm:text-5xl">Love, petal by petal</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/60">
            A heart, our initials, and a little reminder of how much you mean to me.
          </p>
        </div>
        <div className="mx-auto max-w-5xl">
          <motion.figure
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .2 }}
            transition={{ duration: .65 }}
            whileHover={reduceMotion ? undefined : { y: -5 }}
            className="petal-frame overflow-hidden rounded-[1.6rem] p-2"
          >
            <div className="petal-festive-trim" aria-label="Diwali and Dhanteras decorations">
              <span className="petal-festive-icons" aria-hidden="true">🪔 🌼 🪙</span>
              <span className="petal-festive-title">SHUBH DHANTERAS <i>✦</i> HAPPY DIWALI</span>
              <span className="petal-festive-icons" aria-hidden="true">🪙 🌼 🪔</span>
            </div>
            <PetalPhoto
              image={{ src: '/images/petal-initials.png', alt: 'Red rose petals arranged as H, a heart, and K', caption: 'Written in rose petals' }}
              index={0}
            />
          </motion.figure>
        </div>
      </section>

      <section aria-labelledby="gift-heading" className="mb-24">
        <div className="mb-8 text-center">
          <p className="mb-2 text-[10px] uppercase tracking-[.35em] text-rose-200/80">Wrapped up with love</p>
          <h2 id="gift-heading" className="font-display text-4xl sm:text-5xl">Three little gifts</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {gifts.map((gift, index) => {
            const opened = openedGifts.includes(gift.name)
            return <motion.button
              key={gift.name}
              type="button"
              onClick={() => openGift(gift.name)}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              whileTap={reduceMotion ? undefined : { scale: .98 }}
              className={`gift-card gift-card--${gift.color} group flex min-h-72 flex-col items-center justify-center rounded-3xl border p-7 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200`}
              aria-expanded={opened}
              aria-label={`${opened ? 'Opened' : 'Open'} gift: ${gift.name}`}
            >
              <span className="mb-5 text-[10px] tracking-[.3em] opacity-60">0{index + 1}</span>
              <GiftBox color={gift.color} opened={opened} />
              <span className="mt-7 font-display text-2xl">{opened ? gift.name : 'A gift for you'}</span>
              <span className="mt-2 text-[10px] uppercase tracking-[.22em] opacity-60">
                {opened ? 'OPENED WITH LOVE' : 'TAP TO UNWRAP'}
              </span>
              {opened && <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 max-w-xs text-sm leading-6 opacity-80"
              >{gift.message}</motion.span>}
            </motion.button>
          })}
        </div>
      </section>

      <section aria-labelledby="firecracker-heading" className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-[10px] uppercase tracking-[.35em] text-amber-200/80">Make a little magic</p>
          <h2 id="firecracker-heading" className="font-display text-4xl sm:text-5xl">Pick a spark</h2>
          <p className="mt-3 text-xs text-white/55">Each one makes its own burst. Tap again to light it up again.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {crackers.map(cracker => <button
            key={cracker.name}
            type="button"
            onClick={event => onFirecracker(event, cracker.kind)}
            className="firecracker-card group flex min-h-44 items-center gap-5 rounded-3xl border border-white/10 bg-white/[.045] p-6 text-left backdrop-blur-md transition hover:-translate-y-1 hover:border-amber-200/40 hover:bg-white/[.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 active:scale-[.98]"
          >
            <span className="firecracker-emoji grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-amber-100/10 text-4xl transition-transform group-hover:scale-110" aria-hidden="true">{cracker.emoji}</span>
            <span>
              <span className="block font-display text-2xl">{cracker.name}</span>
              <span className="mt-1 block text-xs leading-5 text-white/55">{cracker.note}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-[9px] tracking-[.2em] text-amber-200/75"><Sparkles size={12} /> LIGHT IT</span>
            </span>
          </button>)}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] leading-5 text-white/40">
          <RotateCcw size={12} /> A playful, screen-only celebration — no real fireworks or sound.
        </p>
      </section>

      <footer className="mt-20 text-center">
        <a href="#home" className="font-display text-xl italic text-amber-100/75 transition hover:text-amber-100">Made with love for Honey ♥</a>
      </footer>
    </div>
  </main>
}
