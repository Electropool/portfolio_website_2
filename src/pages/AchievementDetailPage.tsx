import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { ACHIEVEMENTS } from '../data/achievements'

interface Props { achIdx: number; onBack: () => void; onNavigateAch: (i: number) => void; playSfx: (type: any) => void }

function getYtId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

const slideV = {
  enter: (d: number) => ({x: d>=0?'55%':'-55%', opacity:0, scale:0.97}),
  center: {x:0, opacity:1, scale:1},
  exit:  (d: number) => ({x: d>=0?'-55%':'55%', opacity:0, scale:0.97}),
}

export default function AchievementDetailPage({ achIdx, onBack, onNavigateAch, playSfx }: Props) {
  const ach = ACHIEVEMENTS[achIdx]
  const [mediaIdx, setMediaIdx] = useState(0)
  const [dir, setDir] = useState(0)

  useEffect(() => { setMediaIdx(0); window.scrollTo({top:0,behavior:'instant'}) }, [achIdx])
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if(e.key==='Escape') onBack()
      if(e.key==='ArrowLeft')  { setDir(-1); setMediaIdx(i=>(i-1+ach.media.length)%ach.media.length) }
      if(e.key==='ArrowRight') { setDir(1);  setMediaIdx(i=>(i+1)%ach.media.length) }
    }
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h)
  }, [onBack, ach])

  if (!ach) return null
  const cur = ach.media[mediaIdx]
  const ytId = cur?.type==='youtube' ? getYtId(cur.src) : null
  const prev = achIdx > 0 ? ACHIEVEMENTS[achIdx-1] : null
  const next = achIdx < ACHIEVEMENTS.length-1 ? ACHIEVEMENTS[achIdx+1] : null
  const total = ach.media.length

  const navBtn: React.CSSProperties = {background:'rgba(8,8,8,0.85)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:5,padding:'8px 9px',color:'rgba(255,255,255,0.55)',cursor:'pointer',zIndex:10,transition:'border-color .2s,color .2s'}

  return (
    <div style={{minHeight:'100vh',paddingTop:56,paddingBottom:32, position: 'relative'}}>
      <div style={{maxWidth:1060,margin:'0 auto',padding:'14px clamp(12px,4vw,28px) 48px'}}>
        {/* Top nav */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18,flexWrap:'wrap',gap:8}}>
          <button onClick={() => { playSfx('click'); onBack() }} onMouseEnter={() => playSfx('hover')} className="glass-btn" style={{display:'flex',alignItems:'center',gap:8,fontSize:'clamp(0.46rem,1.5vw,0.56rem)',letterSpacing:'0.14em',padding:'7px 16px',borderRadius:5}}>
            <ArrowLeft size={14}/> BACK TO ACHIEVEMENTS
          </button>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'0.5rem',letterSpacing:'0.16em',color:'rgba(255,255,255,0.3)'}}>{achIdx+1} / {ACHIEVEMENTS.length}</div>
        </div>

        {/* Title */}
        <div style={{marginBottom:16}}>
          <span style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.44rem,1.2vw,0.52rem)',letterSpacing:'0.14em',padding:'3px 10px',border:'1px solid rgba(255,255,255,0.2)',borderRadius:3,color:'rgba(255,255,255,0.6)',background:'rgba(255,255,255,0.05)'}}>{ach.badge}</span>
          <h1 style={{fontFamily:'var(--font-mono)',fontSize:'clamp(1.1rem,3.5vw,2rem)',fontWeight:700,letterSpacing:'0.04em',color:'rgba(255,255,255,0.9)',marginTop:10,lineHeight:1.15}}>{ach.title}</h1>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'0.52rem',letterSpacing:'0.12em',color:'rgba(255,255,255,0.35)',marginTop:4}}>{ach.event} · {ach.date}</div>
        </div>

        {/* Two-col */}
        <div className="proj-detail-grid">
          {/* Media */}
          <div>
            <div style={{position:'relative',width:'100%',aspectRatio:'16/9',background:'#000',borderRadius:10,overflow:'hidden',border:'1px solid rgba(255,255,255,0.12)',boxShadow:'0 8px 48px rgba(0,0,0,0.65)'}}>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div key={`${achIdx}-${mediaIdx}`} custom={dir} variants={slideV} initial="enter" animate="center" exit="exit"
                  transition={{duration:0.32,ease:[0.22,1,0.36,1]}} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
                  {cur?.type==='image' && <img src={cur.src} alt="" style={{width:'100%',height:'100%',objectFit:'contain',background:'#080808'}}/>}
                  {cur?.type==='youtube' && ytId && (
                    <iframe src={`https://www.youtube.com/embed/${ytId}?rel=0`} style={{width:'100%',height:'100%',border:'none'}}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={ach.title}/>
                  )}
                </motion.div>
              </AnimatePresence>
              {total>1&&<>
                <button onClick={()=>{setDir(-1);setMediaIdx(i=>(i-1+total)%total)}} style={{...navBtn,position:'absolute',left:8,top:'50%',transform:'translateY(-50%)'}}>
                  <ChevronLeft size={16}/></button>
                <button onClick={()=>{setDir(1);setMediaIdx(i=>(i+1)%total)}} style={{...navBtn,position:'absolute',right:8,top:'50%',transform:'translateY(-50%)'}}>
                  <ChevronRight size={16}/></button>
                <div style={{position:'absolute',bottom:8,right:12,fontFamily:'var(--font-mono)',fontSize:'0.42rem',color:'rgba(255,255,255,0.45)',background:'rgba(3,3,3,0.75)',padding:'2px 8px',borderRadius:3}}>{mediaIdx+1}/{total}</div>
              </>}
            </div>
            {total>1&&(
              <div className="thumb-strip" style={{display:'flex',gap:6,marginTop:8,overflowX:'auto',paddingBottom:4}}>
                {ach.media.map((m,i)=>{
                  const tid=m.type==='youtube'?getYtId(m.src):null
                  const active=i===mediaIdx
                  return (
                    <button key={i} onClick={()=>{setDir(i>mediaIdx?1:-1);setMediaIdx(i)}}
                      style={{flexShrink:0,width:64,height:44,border:active?'2px solid rgba(255,255,255,0.65)':'1px solid rgba(255,255,255,0.14)',borderRadius:4,overflow:'hidden',cursor:'pointer',background:'#000',position:'relative',padding:0,transition:'border-color .2s',boxShadow:active?'0 0 10px rgba(255,255,255,0.18)':'none'}}>
                      {m.type==='image'&&<img src={m.src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter:active?'none':'grayscale(1) brightness(0.35)',transition:'filter .2s'}} loading="lazy"/>}
                      {m.type==='youtube'&&tid&&<>
                        <img src={`https://img.youtube.com/vi/${tid}/mqdefault.jpg`} alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter:active?'none':'grayscale(1) brightness(0.35)',transition:'filter .2s'}} loading="lazy"/>
                        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'0.8rem',opacity:0.7}}>▶</span></div>
                      </>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'clamp(12px,2.5vw,18px)'}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'0.48rem',letterSpacing:'0.2em',color:'rgba(255,255,255,0.35)',marginBottom:8}}>// ABOUT</div>
              <p style={{fontFamily:'var(--font-ui)',fontSize:'clamp(0.82rem,2vw,0.92rem)',color:'rgba(255,255,255,0.55)',lineHeight:1.82}}>{ach.desc}</p>
            </div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <span style={{fontFamily:'var(--font-mono)',fontSize:'0.5rem',letterSpacing:'0.16em',padding:'5px 14px',border:'1px solid rgba(255,255,255,0.18)',borderRadius:4,color:'rgba(255,255,255,0.6)',background:'rgba(255,255,255,0.05)'}}>{ach.date}</span>
              <span style={{fontFamily:'var(--font-mono)',fontSize:'0.5rem',letterSpacing:'0.16em',padding:'5px 14px',border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,color:'rgba(255,255,255,0.38)',background:'rgba(255,255,255,0.03)'}}>{ach.badge}</span>
            </div>
          </div>
        </div>

        {/* Prev/Next ach */}
        <div style={{display:'flex',gap:10,marginTop:28,flexWrap:'wrap'}}>
          {prev?<button onClick={()=>onNavigateAch(achIdx-1)} className="glass-btn" style={{flex:1,minWidth:130,textAlign:'left',padding:'clamp(10px,2vw,14px) clamp(12px,2.5vw,18px)',borderRadius:7,fontSize:'inherit'}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'0.4rem',letterSpacing:'0.14em',color:'rgba(255,255,255,0.3)',marginBottom:4}}>← PREV</div>
            <div style={{fontFamily:'var(--font-ui)',fontSize:'clamp(0.75rem,2vw,0.88rem)',color:'rgba(255,255,255,0.7)',fontWeight:600,lineHeight:1.3}}>{prev.title}</div>
          </button>:<div style={{flex:1}}/>}
          {next?<button onClick={()=>onNavigateAch(achIdx+1)} className="glass-btn" style={{flex:1,minWidth:130,textAlign:'right',padding:'clamp(10px,2vw,14px) clamp(12px,2.5vw,18px)',borderRadius:7,fontSize:'inherit'}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'0.4rem',letterSpacing:'0.14em',color:'rgba(255,255,255,0.3)',marginBottom:4}}>NEXT →</div>
            <div style={{fontFamily:'var(--font-ui)',fontSize:'clamp(0.75rem,2vw,0.88rem)',color:'rgba(255,255,255,0.7)',fontWeight:600,lineHeight:1.3}}>{next.title}</div>
          </button>:<div style={{flex:1}}/>}
        </div>
      </div>
    </div>
  )
}
