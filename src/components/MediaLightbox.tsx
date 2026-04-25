import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export interface MediaItem {
  src: string
  title: string
  subtitle?: string
}

interface MediaLightboxProps {
  items: MediaItem[]
  startIndex: number
  onClose: () => void
}

export default function MediaLightbox({ items, startIndex, onClose }: MediaLightboxProps) {
  const [idx, setIdx] = useState(startIndex)

  const prev = useCallback(() => setIdx(i => (i - 1 + items.length) % items.length), [items.length])
  const next = useCallback(() => setIdx(i => (i + 1) % items.length), [items.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  const item = items[idx]

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 99000 }}
        onClick={onClose}
      >
        {/* Blurred overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(5,5,8,0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        />

        {/* Content card */}
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: -10 }}
          transition={{ duration: 0.3, ease: [0.77, 0, 0.175, 1] }}
          className="relative flex flex-col items-center"
          style={{ zIndex: 2, maxWidth: '90vw', maxHeight: '90vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* HUD corners */}
          {(['tl','tr','bl','br'] as const).map(c => (
            <div key={c} className={`hud-corner ${c}`} style={{ position:'absolute', zIndex:3 }} />
          ))}

          {/* Image */}
          <div style={{
            maxWidth: '80vw',
            maxHeight: '70vh',
            overflow: 'hidden',
            borderRadius: 4,
            border: '1px solid var(--border-bright)',
            background: '#000',
          }}>
            <img
              src={item.src}
              alt={item.title}
              style={{
                display: 'block',
                maxWidth: '80vw',
                maxHeight: '70vh',
                objectFit: 'contain',
                filter: 'contrast(1.05)',
              }}
            />
          </div>

          {/* Caption */}
          <div className="mt-4 text-center" style={{ maxWidth: '70vw' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              color: 'var(--accent)',
              marginBottom: 4,
            }}>
              {item.title}
            </div>
            {item.subtitle && (
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.82rem',
                color: 'var(--text-dim)',
              }}>
                {item.subtitle}
              </div>
            )}
            {items.length > 1 && (
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                color: 'rgba(148,128,179,0.5)',
                marginTop: 6,
                letterSpacing: '0.15em',
              }}>
                {idx + 1} / {items.length}
              </div>
            )}
          </div>
        </motion.div>

        {/* Nav arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{
                zIndex: 3,
                background: 'rgba(10,8,18,0.8)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '10px 8px',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                transition: 'all .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{
                zIndex: 3,
                background: 'rgba(10,8,18,0.8)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '10px 8px',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                transition: 'all .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Close button */}
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
            transition: 'all .2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
