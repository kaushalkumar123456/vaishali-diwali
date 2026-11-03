const CUSTOM_MUSIC_SRC = '/music.mp3'

function createSynthMusic() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  const ctx = new AudioCtx()
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23]
  let timer
  let step = 0
  const playNote = (freq, when, duration = 2.8, volume = 0.075) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, when)
    filter.type = 'lowpass'
    filter.frequency.value = 1500
    gain.gain.setValueAtTime(0, when)
    gain.gain.linearRampToValueAtTime(volume, when + .35)
    gain.gain.exponentialRampToValueAtTime(.0001, when + duration)
    osc.connect(filter); filter.connect(gain); gain.connect(master)
    osc.start(when); osc.stop(when + duration + .05)
  }
  const schedule = () => {
    const now = ctx.currentTime + .08
    const f = notes[step % notes.length]
    playNote(f, now, 3.2, .045)
    if (step % 2 === 0) playNote(f * 2, now + .18, 2.1, .012)
    if (step % 4 === 0) playNote(130.81, now, 4.2, .018)
    step++
  }

  return {
    async start() {
      await ctx.resume()
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setTargetAtTime(.58, ctx.currentTime, .8)
      if (!timer) { schedule(); timer = window.setInterval(schedule, 1900) }
    },
    pause() {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setTargetAtTime(0, ctx.currentTime, .25)
    },
    async close() {
      if (timer) window.clearInterval(timer)
      await ctx.close()
    }
  }
}

export function createAmbientMusic(customSrc = CUSTOM_MUSIC_SRC) {
  const synth = createSynthMusic()
  const audio = typeof Audio !== 'undefined' ? new Audio(customSrc) : null

  if (audio) {
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.55
  }

  return {
    async start() {
      if (!audio) {
        if (synth) await synth.start()
        return
      }

      try {
        audio.src = customSrc
        audio.load()
        await audio.play()
        if (synth) synth.pause()
      } catch (error) {
        if (synth) await synth.start()
      }
    },
    pause() {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
      if (synth) synth.pause()
    },
    async close() {
      if (audio) {
        audio.pause()
        audio.src = ''
      }
      if (synth) await synth.close()
    }
  }
}
