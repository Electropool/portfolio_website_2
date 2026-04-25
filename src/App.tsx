import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import ElectroPoolBackground from './components/ElectroPoolBackground'
import DelicateAsciiDots     from './components/DelicateAsciiDots'
import Cursor                from './components/Cursor'
import LoadingScreen         from './components/LoadingScreen'
import SideNav               from './components/SideNav'
import HudOverlay            from './components/HudOverlay'
import SinglePage            from './pages/SinglePage'
import ProjectDetailPage     from './pages/ProjectDetailPage'
import CertDetailPage        from './pages/CertDetailPage'
import AchievementDetailPage from './pages/AchievementDetailPage'
import type { Project }      from './data/projects'

export type Section = 'home' | 'personal' | 'projects' | 'certifications' | 'achievements' | 'contacts'

export const SECTIONS: Section[] = ['home','personal','projects','certifications','achievements','contacts']

export type DetailView = {
  type: 'project'
  project: Project
} | {
  type: 'cert'
  certIdx: number
} | {
  type: 'achievement'
  achIdx: number
}

export default function App() {
  const [loaded,      setLoaded]      = useState(false)
  const [musicPlaying,setMusicPlaying] = useState(false)
  const [sfxEnabled,   setSfxEnabled]   = useState(true)
  const [activeSection, setActiveSection] = useState<Section>('home')
  const [detail,      setDetail]      = useState<DetailView | null>(null)
  const [lastScrollPos, setLastScrollPos] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  // Silent visitor tracking (fires once, won't slow down the site)
  useEffect(() => {
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).catch(() => {})
  }, [])

  // Initialize Audio Context on first interaction
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }

    if (!audioRef.current) {
      const audio = new Audio('/assets/music.mp3')
      audio.loop = true
      audio.volume = 0
      audioRef.current = audio
    }
  }, [])

  const playSfx = useCallback((type: 'hover' | 'click' | 'startup' | 'transition' | 'success') => {
    if (!sfxEnabled) return
    initAudio()
    const ctx = audioCtxRef.current; if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime

    if (type === 'hover') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04)
      gain.gain.setValueAtTime(0.015, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
      osc.start(now); osc.stop(now + 0.04)
    } 
    else if (type === 'click') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.1)
      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
      osc.start(now); osc.stop(now + 0.1)
    }
    else if (type === 'transition') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(200, now)
      osc.frequency.linearRampToValueAtTime(800, now + 0.2)
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.02, now + 0.1)
      gain.gain.linearRampToValueAtTime(0, now + 0.2)
      osc.start(now); osc.stop(now + 0.2)
    }
    else if (type === 'startup') {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(40, now)
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.5)
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.05, now + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      osc.start(now); osc.stop(now + 0.5)
    }
  }, [sfxEnabled, initAudio])

  useEffect(() => {
    const start = () => {
      initAudio()
      const audio = audioRef.current; if (!audio) return
      
      if (audio.paused) {
        audio.play().then(() => {
          setMusicPlaying(true)
          let v = 0
          const fade = setInterval(() => { 
            v = Math.min(v + 0.02, 0.45)
            audio.volume = v
            if (v >= 0.45) clearInterval(fade) 
          }, 80)
        }).catch(() => {})
      }
      document.removeEventListener('click', start)
      document.removeEventListener('touchstart', start)
    }

    document.addEventListener('click', start)
    document.addEventListener('touchstart', start, { passive: true })

    return () => {
      document.removeEventListener('click', start)
      document.removeEventListener('touchstart', start)
    }
  }, [initAudio])

  const toggleMusic = useCallback(() => {
    initAudio()
    const a = audioRef.current; if (!a) return
    if (a.paused) {
      a.play().then(() => {
        setMusicPlaying(true)
        a.volume = 0.45
      }).catch(() => {})
    } else {
      a.pause()
      setMusicPlaying(false)
    }
  }, [initAudio])

  const scrollToSection = useCallback((sec: Section) => {
    playSfx('click')
    if (detail) { 
      setDetail(null)
      setTimeout(() => { document.getElementById(sec)?.scrollIntoView({ behavior: 'smooth' }) }, 100) 
    }
    else document.getElementById(sec)?.scrollIntoView({ behavior: 'smooth' })
  }, [detail, playSfx])

  const openDetail = useCallback((d: DetailView) => {
    setLastScrollPos(window.scrollY)
    playSfx('transition')
    setDetail(d)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [playSfx])

  const closeDetail = useCallback(() => {
    playSfx('transition')
    setDetail(null)
  }, [playSfx])

  const renderDetail = () => {
    if (!detail) return null
    if (detail.type === 'project') return <ProjectDetailPage key={detail.project.id} projectId={detail.project.id} onBack={closeDetail} onNavigateProject={p=>openDetail({type:'project',project:p})} playSfx={playSfx}/>
    if (detail.type === 'cert')    return <CertDetailPage    key={`cert-${detail.certIdx}`} certIdx={detail.certIdx}       onBack={closeDetail} onNavigateCert={i=>openDetail({type:'cert',certIdx:i})} playSfx={playSfx}/>
    if (detail.type === 'achievement') return <AchievementDetailPage key={`ach-${detail.achIdx}`} achIdx={detail.achIdx} onBack={closeDetail} onNavigateAch={i=>openDetail({type:'achievement',achIdx:i})} playSfx={playSfx}/>
    return null
  }

  const handleLoadingComplete = useCallback(() => {
    setLoaded(true)
    setTimeout(() => {
      playSfx('startup')
    }, 500)
  }, [playSfx])

  return (
    <>
      {!loaded && <LoadingScreen onComplete={handleLoadingComplete} playSfx={playSfx} />}
      <ElectroPoolBackground />
      <DelicateAsciiDots />

      <Cursor />
      {loaded && (
        <>
          <HudOverlay 
            musicPlaying={musicPlaying} 
            onToggleMusic={toggleMusic} 
            sfxEnabled={sfxEnabled} 
            onToggleSfx={() => { playSfx('click'); setSfxEnabled(!sfxEnabled) }} 
            playSfx={playSfx}
          />
          <SideNav 
            activeSection={activeSection} 
            onNavigate={scrollToSection} 
            playSfx={playSfx}
          />
          <main style={{ position: 'relative', zIndex: 10 }}>
            <AnimatePresence mode="wait">
              {detail ? (
                <div key="detail-view">
                  {renderDetail()}
                </div>
              ) : (
                <div key="main-view">
                  <SinglePage
                    activeSection={activeSection}
                    lastScrollPos={lastScrollPos}
                    onSectionChange={setActiveSection}
                    onOpenProject={p => openDetail({ type: 'project', project: p })}
                    onOpenCert={i => openDetail({ type: 'cert', certIdx: i })}
                    onOpenAchievement={i => openDetail({ type: 'achievement', achIdx: i })}
                    playSfx={playSfx}
                  />
                </div>
              )}
            </AnimatePresence>
          </main>
        </>
      )}
    </>
  )
}

