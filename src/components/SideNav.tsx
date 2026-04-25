import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Section } from '../App'

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id:'home',           label:'Home',          icon:'⌂' },
  { id:'personal',       label:'Personal Info', icon:'◉' },
  { id:'projects',       label:'Projects',      icon:'⬡' },
  { id:'certifications', label:'Certs',         icon:'✦' },
  { id:'achievements',   label:'Achievements',  icon:'★' },
  { id:'contacts',       label:'Contacts',      icon:'✉' },
]

interface Props { activeSection: Section; onNavigate: (s: Section) => void; playSfx: (type: any) => void }

export default function SideNav({ activeSection, onNavigate, playSfx }: Props) {
  const [hoveredId, setHoveredId] = useState<Section | null>(null)

  const handleMouseEnter = (id: Section) => {
    setHoveredId(id)
    playSfx('hover')
  }

  return (
    <>
      {/* DESKTOP: left-side dock */}
      <div className="hidden lg:flex" style={{
        position:'fixed', left:16, top:'50%', transform:'translateY(-50%)', zIndex:950,
        flexDirection:'column', alignItems:'center', gap:6,
        padding:'10px 6px',
        background:'rgba(255,255,255,0.04)',
        backdropFilter:'blur(20px)',
        WebkitBackdropFilter:'blur(20px)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:16,
      }}>
        {NAV_ITEMS.map(item => {
          const isActive = activeSection === item.id
          const isHov    = hoveredId === item.id
          return (
            <div key={item.id} style={{position:'relative',display:'flex',alignItems:'center'}}
              onMouseEnter={()=>handleMouseEnter(item.id)}
              onMouseLeave={()=>setHoveredId(null)}>
              {/* Tooltip */}
              <AnimatePresence>
                {isHov && (
                  <motion.div
                    initial={{opacity:0,x:-6,scale:0.92}}
                    animate={{opacity:1,x:0,scale:1}}
                    exit={{opacity:0,x:-4,scale:0.94}}
                    transition={{duration:0.18,ease:'easeOut'}}
                    style={{
                      position:'absolute', right:'calc(100% + 10px)',
                      background:'rgba(15,15,15,0.92)',
                      border:'1px solid rgba(255,255,255,0.18)',
                      backdropFilter:'blur(14px)',
                      borderRadius:6, padding:'4px 10px',
                      fontFamily:'var(--font-mono)', fontSize:'0.52rem',
                      letterSpacing:'0.12em', color:'rgba(255,255,255,0.85)',
                      whiteSpace:'nowrap', pointerEvents:'none',
                    }}>
                    {item.label}
                    <div style={{position:'absolute',right:-5,top:'50%',transform:'translateY(-50%)',width:0,height:0,borderTop:'4px solid transparent',borderBottom:'4px solid transparent',borderLeft:'5px solid rgba(255,255,255,0.18)'}}/>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Button */}
              <motion.button
                onClick={()=>{ onNavigate(item.id) }}
                animate={{ scale: isHov ? 1.38 : isActive ? 1.1 : 1 }}
                transition={{ type:'spring', stiffness:380, damping:22 }}
                style={{
                  width: 36, height: 36,
                  borderRadius: 10,
                  border: `1px solid ${isActive ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)'}`,
                  background: isActive
                    ? 'rgba(255,255,255,0.14)'
                    : isHov
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(255,255,255,0.04)',
                  backdropFilter:'blur(12px)',
                  cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize: '1rem',
                  boxShadow: isActive ? '0 0 12px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
                  transition:'background .2s, border-color .2s, box-shadow .2s',
                  position:'relative', zIndex:1,
                }}
              >
                <span style={{fontSize:'0.88rem',filter:isActive?'none':'grayscale(1) opacity(0.5)',transition:'filter .2s'}}>{item.icon}</span>
              </motion.button>
            </div>
          )
        })}
      </div>

      {/* MOBILE: bottom dock */}
      <div className="flex lg:hidden" style={{
        position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:950,
        flexDirection:'row', alignItems:'center', gap:4,
        padding:'8px 10px',
        background:'rgba(255,255,255,0.05)',
        backdropFilter:'blur(20px)',
        WebkitBackdropFilter:'blur(20px)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:16,
      }}>
        {NAV_ITEMS.map(item => {
          const isActive = activeSection === item.id
          return (
            <motion.button key={item.id}
              onClick={()=>{ onNavigate(item.id) }}
              onMouseEnter={() => playSfx('hover')}
              whileTap={{scale:0.9}}
              style={{
                width:38, height:38, borderRadius:10,
                border:`1px solid ${isActive?'rgba(255,255,255,0.4)':'rgba(255,255,255,0.1)'}`,
                background: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)',
                backdropFilter:'blur(8px)',
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'1rem',
              }}>
              <span style={{fontSize:'0.85rem',filter:isActive?'none':'grayscale(1) opacity(0.45)'}}>{item.icon}</span>
            </motion.button>
          )
        })}
      </div>

    </>
  )
}
