import { useEffect, useRef, useState } from 'react'

interface Sticker {
  id: number
  src: string
  x: number; y: number
  vx: number; vy: number
  size: number
  opacity: number
  phase: 'in' | 'move' | 'out'
  life: number
  maxLife: number
}

const STICKER_SRCS = [
  '/assets/stickers/bulbasaur-pokemon.gif',
  '/assets/stickers/bee-pixel.webp',
  '/assets/stickers/mario-dance.webp',
  '/assets/stickers/minecraft-steve.webp',
  '/assets/stickers/minecraft-sword.webp',
  '/assets/stickers/creeper-minecraft.webp',
  '/assets/stickers/pixel-rabbit-rabbit.webp',
  '/assets/stickers/16bit-80s.webp',
  '/assets/stickers/party-fox.webp',
  '/assets/stickers/hmmm-villiage.webp',
  '/assets/stickers/sunnykins-sunny-bongo.gif',
  '/assets/stickers/sigh-bits.webp',
]

let nextId = 0

export default function FloatingStickers() {
  const [stickers, setStickers] = useState<Sticker[]>([])
  const frameRef = useRef<number>(0)
  const lastSpawnRef = useRef<number>(0)
  const nextSpawnDelayRef = useRef<number>(1000)

  useEffect(() => {
    let running = true

    const spawn = (): Sticker => {
      // Spawn from edge
      const edge = Math.floor(Math.random() * 4)
      let x = 0, y = 0, vx = 0, vy = 0
      const speed = 0.18 + Math.random() * 0.22
      const angle = (Math.random() - 0.5) * 0.6 // slight angle variation
      if (edge === 0) { x = Math.random() * 100; y = -10; vx = (Math.random()-0.5)*speed*0.8; vy = speed }
      else if (edge === 1) { x = 110; y = Math.random() * 100; vx = -speed; vy = (Math.random()-0.5)*speed*0.8 }
      else if (edge === 2) { x = Math.random() * 100; y = 110; vx = (Math.random()-0.5)*speed*0.8; vy = -speed }
      else { x = -10; y = Math.random() * 100; vx = speed; vy = (Math.random()-0.5)*speed*0.8 }
      // Apply slight angle
      const cos = Math.cos(angle), sin = Math.sin(angle)
      const nvx = vx * cos - vy * sin, nvy = vx * sin + vy * cos
      const maxLife = 180 + Math.random() * 180
      return {
        id: nextId++,
        src: STICKER_SRCS[Math.floor(Math.random() * STICKER_SRCS.length)],
        x, y, vx: nvx, vy: nvy,
        size: 38 + Math.random() * 26,
        opacity: 0,
        phase: 'in',
        life: 0,
        maxLife,
      }
    }

    const tick = (timestamp: number) => {
      if (!running) return
      // Spawn new sticker every 2.8s, max 4 at once
      setStickers(prev => {
        let next = prev
          .map(s => {
            const life = s.life + 1
            const fadeIn = 30, fadeOut = 30
            let opacity = s.opacity
            let phase = s.phase
            if (life < fadeIn) { opacity = life / fadeIn; phase = 'in' }
            else if (life > s.maxLife - fadeOut) { opacity = (s.maxLife - life) / fadeOut; phase = 'out' }
            else { opacity = Math.min(0.55, opacity + 0.04); phase = 'move' }
            return { ...s, x: s.x + s.vx, y: s.y + s.vy, life, opacity, phase }
          })
          .filter(s => s.life < s.maxLife && s.opacity > 0)

        if (timestamp - lastSpawnRef.current > nextSpawnDelayRef.current && next.length < 4) {
          const count = Math.random() > 0.7 ? 2 : 1
          const newStickers = Array.from({ length: count }, () => spawn())
          next = [...next, ...newStickers]
          lastSpawnRef.current = timestamp
          nextSpawnDelayRef.current = 1500 + Math.random() * 3000
        }
        return next
      })
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => { running = false; cancelAnimationFrame(frameRef.current) }
  }, [])

  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:2 }}>
      {stickers.map(s => (
        <img key={s.id} src={s.src} alt=""
          style={{
            position:'absolute',
            left:`${s.x}%`, top:`${s.y}%`,
            width:s.size, height:s.size,
            objectFit:'contain',
            opacity: s.opacity * 0.55,
            filter:'grayscale(1) brightness(0.7) contrast(1.1)',
            transform:'translate(-50%,-50%)',
            pointerEvents:'none',
            imageRendering:'pixelated',
          }}
        />
      ))}
    </div>
  )
}
