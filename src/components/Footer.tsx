import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

import RobotWhobee from './RobotWhobee'

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVisible(true) }, { threshold:0.05 })
    obs.observe(el); return ()=>obs.disconnect()
  }, [])

  return (
    <footer ref={ref} className={`footer-reveal ${visible?'visible':''}`}
      style={{ position:'relative', zIndex:10, width:'100%', marginBottom:24, overflow:'hidden' }}>

      {/* Robot — desktop only */}
      <div className="hidden md:block" style={{ position:'relative', height:350, marginBottom:-60, marginTop: -40 }}>
        {/* Blur fade at bottom of robot area */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:120, background:'linear-gradient(to top, rgba(8,8,8,1) 0%, transparent 100%)', zIndex:2, pointerEvents:'none' }}/>
        
        <div style={{ position:'absolute', bottom:-20, left:'50%', transform:'translateX(-50%)', zIndex:1, width: '100%', maxWidth: 800, height: '100%' }}>
          <motion.div
            initial={{opacity:0, scale: 0.8}} 
            animate={visible?{opacity:1, scale: 1}:{opacity:0, scale: 0.8}}
            transition={{duration:0.8, delay:0.2, ease: [0.22, 1, 0.36, 1]}}
            style={{ width: '100%', height: '100%' }}
          >
            <RobotWhobee />
          </motion.div>
        </div>
      </div>

      {/* Minimal footer content */}
      <div style={{ background:'rgba(8,8,8,0.95)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(255,255,255,0.07)', padding:'18px 24px 20px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          {/* Brand */}
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.2em', color:'rgba(255,255,255,0.55)' }}>
            ARPAN KAR <span style={{color:'rgba(255,255,255,0.2)'}}>·</span> .ELECTROPOOL
          </div>
          {/* Links */}
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {[
              {label:'Home',     href:'#home'},
              {label:'About',    href:'#personal'},
              {label:'Projects', href:'#projects'},
              {label:'LinkedIn', href:'https://www.linkedin.com/in/arpan-kar-1806a628b/', ext:true},
            ].map(l=>(
              <a key={l.label} href={l.href} target={l.ext?'_blank':undefined} rel={l.ext?'noopener noreferrer':undefined}
                style={{ fontFamily:'var(--font-mono)', fontSize:'0.52rem', letterSpacing:'0.12em', color:'rgba(255,255,255,0.3)', textDecoration:'none', transition:'color .2s' }}
                onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,0.75)')}
                onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.3)')}>
                {l.label}
              </a>
            ))}
          </div>
          {/* Copyright */}
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.48rem', letterSpacing:'0.12em', color:'rgba(255,255,255,0.18)' }}>
            © {new Date().getFullYear()} ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </footer>
  )
}
