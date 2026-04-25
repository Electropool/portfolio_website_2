import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface StackedMediaViewerProps {
  images: string[]
  title: string
  subtitle?: string
  onClose: () => void
}

export default function StackedMediaViewer({ images, title, subtitle, onClose }: StackedMediaViewerProps) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  // Stack offsets for the "behind" cards
  const stackOffsets = [
    { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 10 },
    { x: 10, y: -8, rotate: 2.5, scale: 0.95, zIndex: 9 },
    { x: -8, y: -14, rotate: -1.8, scale: 0.9, zIndex: 8 },
  ]

  return (
    <AnimatePresence>
      <motion.div
        key="stacked"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ zIndex: 99000 }}
        onClick={onClose}
      >
        {/* Blur overlay */}
        <div className="absolute inset-0" style={{
          background: 'rgba(5,5,8,0.9)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.77, 0, 0.175, 1] }}
          className="relative flex flex-col items-center gap-6"
          style={{ zIndex: 2 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Title */}
          <div className="text-center">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.25em', color: 'var(--purple-light)', marginBottom: 4 }}>
              // ACHIEVEMENT
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', letterSpacing: '0.12em', color: 'var(--accent)' }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: 4 }}>
                {subtitle}
              </div>
            )}
          </div>

          {/* Stack of images */}
          <div className="relative" style={{ width: 'min(420px, 85vw)', height: 'min(300px, 55vw)' }}>
            {/* Behind cards (decorative) */}
            {images.slice(1, 3).map((img, si) => {
              const off = stackOffsets[si + 1]
              return (
                <div
                  key={img}
                  className="absolute inset-0 rounded"
                  style={{
                    transform: `translate(${off.x}px, ${off.y}px) rotate(${off.rotate}deg) scale(${off.scale})`,
                    zIndex: off.zIndex,
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    background: '#000',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
                </div>
              )
            })}

            {/* Main (front) card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.04, rotate: 1 }}
                transition={{ duration: 0.35, ease: [0.77, 0, 0.175, 1] }}
                className="absolute inset-0 rounded"
                style={{
                  zIndex: stackOffsets[0].zIndex,
                  border: '1px solid var(--border-bright)',
                  overflow: 'hidden',
                  background: '#000',
                  boxShadow: '0 0 40px rgba(124,58,237,0.25)',
                }}
              >
                <img
                  src={images[current]}
                  alt={title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* HUD corners */}
                {(['tl','tr','bl','br'] as const).map(c => (
                  <div key={c} className={`hud-corner ${c}`} style={{ position: 'absolute' }} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              style={{
                background: 'rgba(10,8,18,0.8)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '8px 12px',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                transition: 'all .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? 20 : 7,
                    height: 7,
                    borderRadius: 4,
                    background: i === current ? 'var(--accent)' : 'var(--border-bright)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all .3s',
                    boxShadow: i === current ? '0 0 8px var(--purple-glow)' : 'none',
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              style={{
                background: 'rgba(10,8,18,0.8)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '8px 12px',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                transition: 'all .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(148,128,179,0.4)', letterSpacing: '0.15em' }}>
            {current + 1} OF {images.length} — CLICK OUTSIDE TO CLOSE
          </div>
        </motion.div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          style={{
            zIndex: 3,
            background: 'rgba(10,8,18,0.8)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            padding: 8,
            color: 'var(--text-dim)',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
