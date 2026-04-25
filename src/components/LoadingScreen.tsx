import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
  playSfx: (type: any) => void
}

const statusMessages = [
  'INITIALIZING ELECTROPOOL',
  'LOADING SHADERS',
  'CALIBRATING CAM_01',
  'SIGNAL TRACING...',
  'MOUNTING COMPONENTS',
  'ESTABLISHING SECURE LINK',
  'BOOT COMPLETE',
]

export default function LoadingScreen({ onComplete, playSfx }: LoadingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const [statusIdx, setStatusIdx] = useState(0)
  const [done, setDone]           = useState(false)

  // Animated scan-line canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    // vertical data columns (Matrix-style but purple)
    const cols = Math.floor(canvas.width / 22)
    const drops: number[] = Array(cols).fill(0).map(() => Math.random() * -50)

    const draw = () => {
      ctx.fillStyle = 'rgba(5,5,8,0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(124,58,237,0.25)'
      ctx.font = '13px Share Tech Mono, monospace'

      drops.forEach((y, i) => {
        const char = String.fromCharCode(0x30A0 + Math.random() * 96)
        ctx.fillText(char, i * 22, y * 20)
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += 0.4
      })

      // horizontal sweep
      const sweep = (Date.now() / 1000) % 1
      const grad = ctx.createLinearGradient(0, sweep * canvas.height - 60, 0, sweep * canvas.height + 60)
      grad.addColorStop(0, 'rgba(168,85,247,0)')
      grad.addColorStop(0.5, 'rgba(168,85,247,0.06)')
      grad.addColorStop(1, 'rgba(168,85,247,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, sweep * canvas.height - 60, canvas.width, 120)

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  // Progress ticker
  useEffect(() => {
    let current = 0
    const tick = () => {
      const increment = Math.random() * 14 + 4
      const nextProgress = Math.min(current + increment, 100)
      const nextStatusIdx = Math.floor((nextProgress / 100) * (statusMessages.length - 1))

      setProgress(Math.floor(nextProgress))
      current = nextProgress

      setStatusIdx(prev => {
        if (prev !== nextStatusIdx) playSfx('hover')
        return nextStatusIdx
      })

      if (current < 100) setTimeout(tick, Math.random() * 220 + 80)
      else setTimeout(() => setDone(true), 500)
    }
    const id = setTimeout(tick, 400)
    return () => clearTimeout(id)
  }, [playSfx])


  useEffect(() => {
    if (done) {
      const id = setTimeout(onComplete, 700)
      return () => clearTimeout(id)
    }
  }, [done, onComplete])

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: 99999, background: '#030206' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}/>

          {/* Corner HUD frames */}
          {['tl','tr','bl','br'].map(c => <div key={c} className={`hud-corner ${c}`} style={{ position:'fixed', zIndex:2 }}/>)}

          {/* top-left HUD info */}
          <div className="fixed top-12 left-4" style={{ zIndex:3, fontFamily:'var(--font-mono)', fontSize:'0.58rem', color:'var(--text-dim)', letterSpacing:'0.15em', lineHeight:1.8 }}>
            <div>X:0 Y:0</div>
            <div style={{ color:'var(--purple-light)' }}>FREQ: 12.4 Hz</div>
          </div>

          {/* top-right satellite dish */}
          <div className="fixed top-12 right-4" style={{ zIndex:3, textAlign:'right', fontFamily:'var(--font-mono)', fontSize:'0.58rem', color:'var(--text-dim)', letterSpacing:'0.12em', lineHeight:2 }}>
            <div style={{ color:'var(--purple-light)' }}>SAT_LINK SEARCHING...</div>
            <div style={{ border:'1px solid var(--border-bright)', padding:'2px 8px', color:'var(--accent)', fontSize:'0.55rem', letterSpacing:'0.2em' }}>ENCRYPTED</div>
          </div>

          {/* center content */}
          <div className="relative flex flex-col items-center gap-5" style={{ zIndex:3 }}>
            {/* logo */}
            <motion.div
              animate={{ textShadow: ['0 0 30px rgba(168,85,247,0.4)', '0 0 60px rgba(168,85,247,0.7)', '0 0 30px rgba(168,85,247,0.4)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'var(--accent)',
              }}
            >
              AK
            </motion.div>

            {/* status text */}
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', letterSpacing:'0.25em', color:'var(--purple-light)', minHeight:20 }}>
              {statusMessages[statusIdx]}
              <span className="blink">_</span>
            </div>

            {/* bordered status box — like the reference */}
            <div style={{
              border: '1px solid var(--border-bright)',
              padding: '6px 40px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              color: 'var(--text)',
            }}>
              SIGNAL TRACING...
            </div>

            {/* large percentage */}
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3.5rem, 10vw, 6rem)',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              {String(progress).padStart(2,'0')}%
            </div>

            {/* progress bar */}
            <div style={{ width: 'min(340px, 75vw)', height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                style={{ height:'100%', background:'linear-gradient(90deg, var(--purple), var(--accent))', borderRadius:1, boxShadow:'0 0 12px var(--purple-glow)' }}
              />
            </div>
          </div>

          {/* bottom-left line decoration */}
          <div className="fixed bottom-8 left-4" style={{ zIndex:3 }}>
            <div style={{ width:1, height:80, background:'linear-gradient(to bottom, var(--accent), transparent)' }}/>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
