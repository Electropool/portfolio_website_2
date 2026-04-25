import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { CERTS } from '../data/certs'

interface Props { certIdx: number; onBack: () => void; onNavigateCert: (i: number) => void; playSfx: (type: any) => void }

export default function CertDetailPage({ certIdx, onBack, onNavigateCert, playSfx }: Props) {
  const cert = CERTS[certIdx]

  useEffect(() => { window.scrollTo({top:0,behavior:'instant'}) }, [certIdx])
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if(e.key==='Escape') onBack() }
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h)
  }, [onBack])

  if (!cert) return null
  const prev = certIdx > 0 ? CERTS[certIdx-1] : null
  const next = certIdx < CERTS.length-1 ? CERTS[certIdx+1] : null

  const btnStyle: React.CSSProperties = {background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:5,padding:'8px 9px',color:'rgba(255,255,255,0.55)',cursor:'pointer',transition:'all .2s'}

  return (
    <div
      style={{minHeight:'100vh',paddingTop:56,paddingBottom:32, position: 'relative'}}>
      <div style={{maxWidth:860,margin:'0 auto',padding:'14px clamp(12px,4vw,28px) 48px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:8}}>
          <button onClick={() => { playSfx('click'); onBack() }} onMouseEnter={() => playSfx('hover')} className="glass-btn" style={{display:'flex',alignItems:'center',gap:8,fontSize:'clamp(0.46rem,1.5vw,0.56rem)',letterSpacing:'0.14em',padding:'7px 16px',borderRadius:5}}>
            <ArrowLeft size={14}/> BACK TO CERTIFICATIONS
          </button>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'0.5rem',letterSpacing:'0.16em',color:'rgba(255,255,255,0.3)'}}>{certIdx+1} / {CERTS.length}</div>
        </div>

        {/* Cert image — full */}
        <motion.div initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} transition={{duration:0.4,delay:0.1}}
          style={{borderRadius:10,overflow:'hidden',border:'1px solid rgba(255,255,255,0.12)',boxShadow:'0 12px 56px rgba(0,0,0,0.7)',marginBottom:20}}>
          <img src={cert.img} alt={cert.title} style={{width:'100%',display:'block',objectFit:'contain',background:'#0d0d0d'}}/>
        </motion.div>

        {/* Info */}
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'clamp(14px,3vw,22px)'}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'0.5rem',letterSpacing:'0.2em',color:'rgba(255,255,255,0.3)',marginBottom:8}}>// CERTIFICATE DETAILS</div>
          <h1 style={{fontFamily:'var(--font-mono)',fontSize:'clamp(1rem,3vw,1.4rem)',fontWeight:700,letterSpacing:'0.04em',color:'rgba(255,255,255,0.88)',marginBottom:10,lineHeight:1.3}}>{cert.title}</h1>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.44rem,1.3vw,0.52rem)',letterSpacing:'0.12em',padding:'4px 12px',border:'1px solid rgba(255,255,255,0.2)',borderRadius:3,color:'rgba(255,255,255,0.65)'}}>{cert.org}</span>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.44rem,1.3vw,0.52rem)',letterSpacing:'0.12em',padding:'4px 12px',border:'1px solid rgba(255,255,255,0.12)',borderRadius:3,color:'rgba(255,255,255,0.4)'}}>{cert.date}</span>
            {cert.credential && <span style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.4rem,1.2vw,0.48rem)',letterSpacing:'0.1em',padding:'4px 12px',border:'1px solid rgba(255,255,255,0.08)',borderRadius:3,color:'rgba(255,255,255,0.3)'}}>{cert.credential}</span>}
          </div>
        </div>

        {/* Prev/Next */}
        <div style={{display:'flex',gap:10,marginTop:20,flexWrap:'wrap'}}>
          {prev ? <button onClick={() => { playSfx('click'); onNavigateCert(certIdx-1) }} style={{flex:1,minWidth:130,...btnStyle,textAlign:'left',padding:'12px 16px'}}
            onMouseEnter={e=>{ playSfx('hover'); (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.4)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.15)'}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'0.4rem',letterSpacing:'0.14em',color:'rgba(255,255,255,0.3)',marginBottom:4}}>← PREV</div>
            <div style={{fontFamily:'var(--font-ui)',fontSize:'clamp(0.72rem,2vw,0.85rem)',color:'rgba(255,255,255,0.72)',fontWeight:600,lineHeight:1.3}}>{prev.title}</div>
          </button> : <div style={{flex:1}}/>}
          {next ? <button onClick={() => { playSfx('click'); onNavigateCert(certIdx+1) }} style={{flex:1,minWidth:130,...btnStyle,textAlign:'right',padding:'12px 16px'}}
            onMouseEnter={e=>{ playSfx('hover'); (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.4)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.15)'}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'0.4rem',letterSpacing:'0.14em',color:'rgba(255,255,255,0.3)',marginBottom:4}}>NEXT →</div>
            <div style={{fontFamily:'var(--font-ui)',fontSize:'clamp(0.72rem,2vw,0.85rem)',color:'rgba(255,255,255,0.72)',fontWeight:600,lineHeight:1.3}}>{next.title}</div>
          </button> : <div style={{flex:1}}/>}
        </div>
      </div>
    </div>
  )
}
