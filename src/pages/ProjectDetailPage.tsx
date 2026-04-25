import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, Play, ExternalLink } from 'lucide-react'
import { PROJECTS, getYtId } from '../data/projects'
import type { Project } from '../data/projects'

interface Props {
  projectId: string
  onBack: () => void
  onNavigateProject: (p: Project) => void
  playSfx: (type: any) => void
}

const slideVariants = {
  enter: (d: number) => ({ x: d >= 0 ? '55%' : '-55%', opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: number) => ({ x: d >= 0 ? '-55%' : '55%', opacity: 0, scale: 0.97 }),
}

export default function ProjectDetailPage({ projectId, onBack, onNavigateProject, playSfx }: Props) {
  const project = PROJECTS.find(p => p.id === projectId)
  const projectIndex = PROJECTS.findIndex(p => p.id === projectId)
  const [mediaIdx, setMediaIdx] = useState(0)
  const [dir, setDir] = useState(0)

  useEffect(() => {
    setMediaIdx(0)
    setDir(0)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [projectId])

  const total = project?.media.length ?? 0

  const prev = useCallback(() => {
    playSfx('hover')
    setDir(-1)
    setMediaIdx(i => (i - 1 + total) % total)
  }, [total, playSfx])

  const next = useCallback(() => {
    playSfx('hover')
    setDir(1)
    setMediaIdx(i => (i + 1) % total)
  }, [total, playSfx])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [prev, next, onBack])

  if (!project) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',paddingTop:60}}>
        <div style={{fontFamily:'var(--font-mono)',color:'rgba(255,255,255,0.5)',fontSize:'0.8rem',letterSpacing:'0.2em'}}>PROJECT NOT FOUND</div>
      </div>
    )
  }

  const cur = project.media[mediaIdx]
  const ytId = cur?.type === 'youtube' ? getYtId(cur.src) : null
  const prevProject = projectIndex > 0 ? PROJECTS[projectIndex - 1] : null
  const nextProject = projectIndex < PROJECTS.length - 1 ? PROJECTS[projectIndex + 1] : null

  const btnBase: React.CSSProperties = {
    background:'rgba(3,2,8,0.85)',
    border:'1px solid rgba(255,255,255,0.28)',
    borderRadius:5, padding:'8px 9px',
    color:'var(--text-dim)', cursor:'pointer',
    zIndex:10, transition:'border-color .2s, color .2s'
  }

  return (
    <div
      style={{minHeight:'100vh', paddingTop:58, paddingBottom:32, position: 'relative'}}
    >
      <div style={{maxWidth:1100, margin:'0 auto', padding:'14px clamp(12px,4vw,28px) 48px'}}>

        {/* ── Top bar ── */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:8}}>
          <button onClick={() => { playSfx('click'); onBack() }}
            style={{display:'flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.28)',borderRadius:5,padding:'7px 16px',color:'var(--text-dim)',cursor:'pointer',fontFamily:'var(--font-mono)',fontSize:'clamp(0.46rem,1.5vw,0.58rem)',letterSpacing:'0.14em',transition:'all .2s'}}
            onMouseEnter={e=>{ playSfx('hover'); (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.7)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.7)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.28)';(e.currentTarget as HTMLElement).style.color='var(--text-dim)'}}>
            <ArrowLeft size={14}/> BACK TO PROJECTS
          </button>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.42rem,1.3vw,0.52rem)',letterSpacing:'0.18em',color:'rgba(255,255,255,0.38)'}}>
            {projectIndex + 1} / {PROJECTS.length}
          </div>
        </div>

        {/* ── Title ── */}
        <div style={{marginBottom:18}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.44rem,1.4vw,0.56rem)',letterSpacing:'0.22em',color:'rgba(255,255,255,0.55)',marginBottom:5}}>
            // PROJECT {project.num} · {project.year}
          </div>
          <h1 style={{fontFamily:'var(--font-mono)',fontSize:'clamp(1.2rem,4.5vw,2.3rem)',fontWeight:700,letterSpacing:'0.04em',color:'var(--text)',lineHeight:1.15,marginBottom:project.glitchLabel?8:0}}>
            {project.name}
          </h1>
          {project.glitchLabel && (
            <span style={{display:'inline-block',marginTop:6,fontFamily:'var(--font-mono)',fontSize:'clamp(0.44rem,1.3vw,0.54rem)',letterSpacing:'0.16em',padding:'3px 12px',border:'1px solid rgba(255,255,255,0.5)',borderRadius:3,color:'rgba(255,255,255,0.7)',background:'rgba(255,255,255,0.08)'}}>★ {project.glitchLabel}</span>
          )}
        </div>

        {/* ── Two-column layout ── */}
        <div className="proj-detail-grid">

          {/* LEFT — media */}
          <div>
            {/* Main viewer */}
            <div style={{position:'relative',width:'100%',aspectRatio:'16/9',background:'#000',borderRadius:10,overflow:'hidden',border:'1px solid rgba(255,255,255,0.2)',boxShadow:'0 8px 48px rgba(0,0,0,0.65)'}}>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={`${project.id}-${mediaIdx}`}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{duration:0.32, ease:[0.22,1,0.36,1]}}
                  style={{position:'absolute',inset:0,width:'100%',height:'100%'}}
                >
                  {cur?.type === 'image' && (
                    <img src={cur.src} alt="" style={{width:'100%',height:'100%',objectFit:'contain',background:'#050508'}}/>
                  )}
                  {cur?.type === 'youtube' && ytId && (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                      style={{width:'100%',height:'100%',border:'none'}}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen title={project.name}
                    />
                  )}
                  {cur?.type === 'linkedin' && (
                    <div onClick={()=>window.open(cur.src,'_blank')}
                      style={{width:'100%',height:'100%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#06040e,#090618)'}}>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,padding:24}}>
                        <div style={{width:72,height:72,borderRadius:'50%',background:'rgba(255,255,255,0.1)',border:'2px solid rgba(255,255,255,0.5)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 40px rgba(255,255,255,0.2)'}}>
                          <Play size={26} color="rgba(255,255,255,0.7)" fill="rgba(255,255,255,0.7)"/>
                        </div>
                        <div style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.48rem,1.5vw,0.58rem)',letterSpacing:'0.18em',color:'rgba(255,255,255,0.85)',display:'flex',alignItems:'center',gap:6}}>
                          OPEN LINKEDIN POST <ExternalLink size={11}/>
                        </div>
                        <div style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.38rem,1.1vw,0.46rem)',color:'rgba(255,255,255,0.35)'}}>tap to view video</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {total > 1 && (
                <>
                  <button onClick={prev} style={{...btnBase,position:'absolute',left:8,top:'50%',transform:'translateY(-50%)'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.7)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.7)'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.28)';(e.currentTarget as HTMLElement).style.color='var(--text-dim)'}}>
                    <ChevronLeft size={16}/>
                  </button>
                  <button onClick={next} style={{...btnBase,position:'absolute',right:8,top:'50%',transform:'translateY(-50%)'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.7)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.7)'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.28)';(e.currentTarget as HTMLElement).style.color='var(--text-dim)'}}>
                    <ChevronRight size={16}/>
                  </button>
                  <div style={{position:'absolute',bottom:8,right:12,fontFamily:'var(--font-mono)',fontSize:'0.42rem',letterSpacing:'0.12em',color:'rgba(255,255,255,0.5)',background:'rgba(3,2,8,0.75)',padding:'2px 8px',borderRadius:3}}>
                    {mediaIdx+1} / {total}
                  </div>
                </>
              )}
            </div>

            {/* Thumb strip */}
            {total > 1 && (
              <div className="thumb-strip" style={{display:'flex',gap:6,marginTop:8,overflowX:'auto',paddingBottom:4}}>
                {project.media.map((m, i) => {
                  const tid = m.type === 'youtube' ? getYtId(m.src) : null
                  const active = i === mediaIdx
                  return (
                    <button key={i}
                      onClick={()=>{setDir(i>mediaIdx?1:-1); setMediaIdx(i)}}
                      style={{flexShrink:0,width:68,height:46,border:active?'2px solid rgba(255,255,255,0.7)':'1px solid rgba(255,255,255,0.18)',borderRadius:5,overflow:'hidden',cursor:'pointer',background:'#000',position:'relative',transition:'border-color .2s,box-shadow .2s',boxShadow:active?'0 0 14px rgba(255,255,255,0.4)':'none',padding:0}}>
                      {m.type==='image'&&<img src={m.src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter:active?'none':'grayscale(0.85) brightness(0.36)',transition:'filter .2s'}} loading="lazy"/>}
                      {m.type==='youtube'&&tid&&<>
                        <img src={`https://img.youtube.com/vi/${tid}/mqdefault.jpg`} alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter:active?'none':'grayscale(0.85) brightness(0.36)',transition:'filter .2s'}} loading="lazy"/>
                        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><Play size={12} color="rgba(255,255,255,0.7)" fill="rgba(255,255,255,0.7)"/></div>
                      </>}
                      {m.type==='linkedin'&&(
                        <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#07011a',flexDirection:'column',gap:2}}>
                          <Play size={11} color="rgba(255,255,255,0.7)" fill="rgba(255,255,255,0.7)"/>
                          <span style={{fontFamily:'var(--font-mono)',fontSize:'0.3rem',color:'rgba(255,255,255,0.55)'}}>IN</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Mobile swipe hint */}
            {total > 1 && (
              <div className="mobile-swipe-hint" style={{display:'none',fontFamily:'var(--font-mono)',fontSize:'0.38rem',letterSpacing:'0.1em',color:'rgba(255,255,255,0.2)',textAlign:'center',marginTop:5}}>
                ← SWIPE TO BROWSE MEDIA →
              </div>
            )}
          </div>

          {/* RIGHT — info panel */}
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{background:'rgba(8,6,14,0.72)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,padding:'clamp(12px,2.5vw,18px)'}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.42rem,1.3vw,0.5rem)',letterSpacing:'0.2em',color:'rgba(255,255,255,0.5)',marginBottom:8}}>// ABOUT THIS BUILD</div>
              <p style={{fontFamily:'var(--font-ui)',fontSize:'clamp(0.82rem,2vw,0.92rem)',color:'var(--text-dim)',lineHeight:1.82}}>{project.shortDesc}</p>
            </div>

            <div style={{background:'rgba(8,6,14,0.72)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,padding:'clamp(12px,2.5vw,18px)'}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.42rem,1.3vw,0.5rem)',letterSpacing:'0.2em',color:'rgba(255,255,255,0.5)',marginBottom:8}}>// SKILLS & TOOLS</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {project.tags.map(t=>(
                  <span key={t} style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.42rem,1.2vw,0.5rem)',letterSpacing:'0.08em',padding:'4px 10px',border:'1px solid rgba(255,255,255,0.2)',borderRadius:3,color:'var(--text-dim)',background:'rgba(255,255,255,0.05)'}}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.46rem,1.4vw,0.56rem)',letterSpacing:'0.18em',padding:'5px 14px',border:'1px solid rgba(255,255,255,0.3)',borderRadius:4,color:'rgba(255,255,255,0.7)',background:'rgba(255,255,255,0.07)'}}>
                YEAR: {project.year}
              </div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'clamp(0.46rem,1.4vw,0.56rem)',letterSpacing:'0.14em',padding:'5px 14px',border:'1px solid rgba(255,255,255,0.12)',borderRadius:4,color:'var(--text-dim)',background:'rgba(255,255,255,0.03)'}}>
                {project.media.length} MEDIA ITEMS
              </div>
            </div>
          </div>
        </div>

        {/* ── Prev / Next project ── */}
        <div style={{display:'flex',gap:10,marginTop:28,flexWrap:'wrap'}}>
          {prevProject ? (
            <button onClick={()=>onNavigateProject(prevProject)}
              style={{flex:1,minWidth:'clamp(130px,40%,250px)',background:'rgba(8,6,14,0.75)',border:'1px solid rgba(255,255,255,0.16)',borderRadius:7,padding:'clamp(10px,2vw,14px) clamp(12px,2.5vw,18px)',cursor:'pointer',textAlign:'left',transition:'border-color .25s,background .25s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.5)';(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.06)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.16)';(e.currentTarget as HTMLElement).style.background='rgba(8,6,14,0.75)'}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'0.4rem',letterSpacing:'0.14em',color:'rgba(255,255,255,0.42)',marginBottom:4}}>← PREV PROJECT</div>
              <div style={{fontFamily:'var(--font-ui)',fontSize:'clamp(0.75rem,2vw,0.9rem)',color:'var(--text)',fontWeight:600,lineHeight:1.3}}>{prevProject.name}</div>
            </button>
          ) : <div style={{flex:1}}/>}

          {nextProject ? (
            <button onClick={()=>onNavigateProject(nextProject)}
              style={{flex:1,minWidth:'clamp(130px,40%,250px)',background:'rgba(8,6,14,0.75)',border:'1px solid rgba(255,255,255,0.16)',borderRadius:7,padding:'clamp(10px,2vw,14px) clamp(12px,2.5vw,18px)',cursor:'pointer',textAlign:'right',transition:'border-color .25s,background .25s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.5)';(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.06)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.16)';(e.currentTarget as HTMLElement).style.background='rgba(8,6,14,0.75)'}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'0.4rem',letterSpacing:'0.14em',color:'rgba(255,255,255,0.42)',marginBottom:4}}>NEXT PROJECT →</div>
              <div style={{fontFamily:'var(--font-ui)',fontSize:'clamp(0.75rem,2vw,0.9rem)',color:'var(--text)',fontWeight:600,lineHeight:1.3}}>{nextProject.name}</div>
            </button>
          ) : <div style={{flex:1}}/>}
        </div>

      </div>
    </div>
  )
}
