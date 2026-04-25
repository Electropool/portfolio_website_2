import { useState, useEffect } from 'react'

interface Props { 
  musicPlaying: boolean; 
  onToggleMusic: () => void;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
  playSfx: (type: any) => void;
}

export default function HudOverlay({ musicPlaying, onToggleMusic, sfxEnabled, onToggleSfx, playSfx }: Props) {
  const [time, setTime] = useState('')
  const [mousePos, setMousePos] = useState({x:0,y:0})

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setTime(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`)
    }
    tick(); const id = setInterval(tick,1000); return ()=>clearInterval(id)
  },[])

  useEffect(() => {
    const f = (e:MouseEvent)=>setMousePos({x:e.clientX,y:e.clientY})
    window.addEventListener('mousemove',f); return ()=>window.removeEventListener('mousemove',f)
  },[])

  const mono: React.CSSProperties = { fontFamily:'var(--font-mono)', fontSize:'0.52rem', letterSpacing:'0.14em', color:'rgba(255,255,255,0.35)' }

  return (
    <>
      {/* TOP BAR */}
      <div style={{position:'fixed',top:0,left:0,right:0,height:38,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 14px',background:'rgba(8,8,8,0.72)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{display:'flex', gap:6}}>
            <button 
              onClick={onToggleMusic} 
              onMouseEnter={() => playSfx('hover')}
              className="glass-btn" 
              style={{fontSize:'0.52rem',letterSpacing:'0.14em',padding:'3px 10px',borderRadius:4, minWidth:54}}
            >
              {musicPlaying ? '♪ ON' : '♪ OFF'}
            </button>
            <button 
              onClick={onToggleSfx} 
              onMouseEnter={() => playSfx('hover')}
              className="glass-btn" 
              style={{fontSize:'0.52rem',letterSpacing:'0.14em',padding:'3px 10px',borderRadius:4, minWidth:54}}
            >
              {sfxEnabled ? 'SFX ON' : 'SFX OFF'}
            </button>
          </div>
          <span style={{...mono}} className="hidden sm:block">CAM_01 [REC]</span>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <span style={{...mono}} className="hidden md:block">{mousePos.x}:{mousePos.y}</span>
          <span style={{fontFamily:'var(--font-mono)',fontSize:'0.6rem',letterSpacing:'0.1em',color:'rgba(255,255,255,0.55)'}}>{time}</span>
        </div>
      </div>

      {/* LEFT LABEL */}
      <div style={{position:'fixed',left:0,top:'50%',transform:'translateY(-50%)',zIndex:900,writingMode:'vertical-rl',rotate:'180deg',fontFamily:'var(--font-mono)',fontSize:'0.46rem',letterSpacing:'0.2em',color:'rgba(255,255,255,0.18)',padding:'12px 6px',borderRight:'1px solid rgba(255,255,255,0.07)',background:'rgba(8,8,8,0.4)'}} className="hidden xl:block">
        ELECTROPOOL // ARPAN KAR
      </div>

      {/* BOTTOM BAR */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,height:24,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 14px',background:'rgba(8,8,8,0.55)',backdropFilter:'blur(8px)',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span className="live-dot"/>
          <span style={{...mono}}>LIVE FEED</span>
        </div>
        <span style={{...mono}}>SYS_STABLE // ELECTROPOOL v3.0</span>
        <span style={{...mono}}>ISO 800</span>
      </div>
    </>
  )
}
