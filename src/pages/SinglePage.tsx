import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Footer from '../components/Footer'
import FloatingStickers from '../components/FloatingStickers'
import QRCodeWidget from '../components/QRCodeWidget'
import RainingLetters, { ScrambledTitle } from '../components/RainingLetters'
import ParallaxProjects from '../components/ParallaxProjects'
import type { Section } from '../App'
import type { Project } from '../data/projects'
import { PROJECTS } from '../data/projects'
import { CERTS } from '../data/certs'
import { ACHIEVEMENTS } from '../data/achievements'

/* ── util ── */
const mono: React.CSSProperties = { fontFamily:'var(--font-mono)' }
const ui:   React.CSSProperties = { fontFamily:'var(--font-ui)' }

const glassBox: React.CSSProperties = {
  background:'rgba(255,255,255,0.04)',
  border:'1px solid rgba(255,255,255,0.1)',
  backdropFilter:'blur(12px)',
  WebkitBackdropFilter:'blur(12px)',
  borderRadius:10,
}

function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-40px'}} transition={{duration:0.5}} style={{marginBottom:32}}>
      <div style={{...mono,fontSize:'0.56rem',letterSpacing:'0.28em',color:'rgba(255,255,255,0.4)',marginBottom:6}}>{tag}</div>
      <h2 style={{...mono,fontSize:'clamp(1.6rem,4.5vw,2.8rem)',fontWeight:700,letterSpacing:'0.05em',color:'var(--text)',position:'relative',display:'inline-block'}}>
        {title}
        <span style={{position:'absolute',bottom:-4,left:0,width:40,height:1,background:'rgba(255,255,255,0.4)'}}/>
      </h2>
    </motion.div>
  )
}

function SectionWrapper({ children, id }: { children: React.ReactNode; id?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3])

  return (
    <div ref={containerRef} id={id} className="section-anchor" style={{ position: 'relative', minHeight: '100vh' }}>
      <motion.div style={{ 
        scale, 
        opacity, 
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {children}
      </motion.div>
    </div>
  )
}

/* ────────────────────────────────────────────── HERO ── */
function HeroSection({ playSfx }: { playSfx: (type: any) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start','end start'] })
  const photoScale   = useTransform(scrollYProgress, [0,1], [1, 0.88])
  const photoOpacity = useTransform(scrollYProgress, [0,0.6], [1, 0])
  const textY        = useTransform(scrollYProgress, [0,1], ['0%','-18%'])

  return (
    <div style={{ position:'relative', minHeight:'100vh', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', paddingTop:38 }}>

      {/* Background photo — B&W blurred left */}
      <motion.div style={{ position:'absolute', inset:0, zIndex:0, scale: photoScale, opacity: photoOpacity }}>
        <div style={{ position:'absolute', left:0, top:0, width:'55%', height:'100%', overflow:'hidden' }}>
          <img src="/assets/photo_new.png" alt=""
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top',
              filter:'grayscale(1) brightness(0.28) blur(1.5px)',
              maskImage:'linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 100%)',
              WebkitMaskImage:'linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 100%)',
            }}/>
        </div>
        {/* Vignette */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, transparent 30%, rgba(8,8,8,0.92) 100%)', pointerEvents:'none' }}/>
      </motion.div>

      {/* Floating stickers */}
      <FloatingStickers/>

      {/* HUD coords */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
        style={{position:'absolute',left:24,top:56,zIndex:5}} className="hidden md:block">
        <div style={{...mono,fontSize:'0.52rem',color:'rgba(255,255,255,0.3)',letterSpacing:'0.12em',lineHeight:1.9}}>
          <div>LAT: 22.5726° N</div>
          <div>LON: 88.3639° E</div>
          <div style={{color:'rgba(255,255,255,0.18)'}}>KOLKATA_GRID</div>
        </div>
      </motion.div>

      {/* Main hero content */}
      <motion.div style={{ y: textY, position:'relative', zIndex:4, textAlign:'center', padding:'0 20px', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        
        <RainingLetters>
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
            style={{display:'inline-block',...mono,fontSize:'0.56rem',letterSpacing:'0.28em',color:'rgba(255,255,255,0.3)',border:'1px solid rgba(255,255,255,0.12)',padding:'4px 16px',borderRadius:20,marginBottom:32,background:'rgba(255,255,255,0.04)'}}>
            PERSONAL PORTFOLIO
          </motion.div>

          <ScrambledTitle />

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.9}} style={{marginTop:32}}>
            <div style={{...mono,fontSize:'clamp(0.62rem,2vw,0.78rem)',letterSpacing:'0.28em',color:'rgba(255,255,255,0.55)',marginBottom:4}}>
              ELECTRONICS & TELECOMMUNICATION ENGINEER
            </div>
            <div style={{...ui,fontSize:'clamp(0.78rem,2.2vw,0.95rem)',color:'rgba(255,255,255,0.3)',maxWidth:520,margin:'0 auto',lineHeight:1.6}}>
              Motivated student skilled in embedded and analog circuit design. Built smart solar trackers and automation projects. Strong in troubleshooting and practical problem-solving.
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:1.1}}
            style={{marginTop:36,display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10}}>
            {[
              {label:'VIEW PROJECTS', href:'projects'},
              {label:'ABOUT ME',      href:'personal'},
              {label:'CONTACT',       href:'contacts'},
            ].map((btn,i)=>(
              <button key={btn.label}
                onMouseEnter={() => playSfx('hover')}
                onClick={()=>{ playSfx('click'); document.getElementById(btn.href)?.scrollIntoView({behavior:'smooth'})}}
                className="glass-btn"
                style={{ fontSize:'clamp(0.56rem,1.6vw,0.68rem)', letterSpacing:'0.16em',
                  padding:'9px 22px', borderRadius:6,
                  background: i===0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                  border:`1px solid ${i===0?'rgba(255,255,255,0.35)':'rgba(255,255,255,0.14)'}`,
                  color: i===0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                }}>
                {btn.label}
              </button>
            ))}
          </motion.div>
        </RainingLetters>
      </motion.div>

      {/* Scroll hint */}
      <motion.div animate={{y:[0,-5,0],opacity:[0.25,0.6,0.25]}} transition={{duration:2.5,repeat:Infinity}}
        style={{position:'absolute',bottom:34,left:'50%',transform:'translateX(-50%)',zIndex:5,...mono,fontSize:'0.48rem',letterSpacing:'0.24em',color:'rgba(255,255,255,0.3)'}}>
        SCROLL TO EXPLORE ↓
      </motion.div>
    </div>
  )
}

/* ────────────────────────────────────────────── PERSONAL ── */
const infoFields = [
  { label:'NAME',              value:'Arpan Kar' },
  { label:'EMAIL',             value:'arpankar077@gmail.com' },
  { label:'LOCATION',          value:'Kolkata, West Bengal (Indian)' },
  { label:'RELIGION',          value:'Sanatani' },
  { label:'BLOOD GROUP',       value:'A+' },
  { label:'PHYSICAL',          value:'~175cm / ~55kg (Semi-mild myopia)' },
  { label:'EDUCATION',         value:'10th Science & Humanities (2022) | Diploma in Electronics & Telecommunication Engg. (2026)' },
  { label:'FINAL GOAL',        value:'To serve my nation directly as an engineer in defense or national communication fields by innovating.' },
]
const hardSkills  = ['Embedded Electronics','Beginner level IoT','Communication Engg.','Solar Engg.','Analog Electronics','Project Management','PCB Designing','Audio/Acoustics Engg.','Research & Developing new stuffs']
const languages   = ['C / C++','Embedded C','Assembly','Python','HTML / CSS']
const spokenLangs = ['Bengali [Native]', 'English [Fluent]', 'Hindi [Can understand and Speak]']
const softSkills  = ['Self Motivated','Creative','Can relate to new interested case studies','Ambitious','Patriotic','AI dependent [Partially]','Communication Skills','Presentation']
const tools       = ['Eagle CAD','KiCAD','Arduino IDE','Wokwi','Spyder','Notepad++','Ltspice','Falstad','Fusion 360','4nec2','MS Office','keiluVision5','Termius','ChatGPT/Claude/Gemini','SciLab','VS Code','Antigravity']

function PersonalSection({ playSfx }: { playSfx: (type: any) => void }) {
  const Tag = ({ text }: { text: string }) => (
    <span 
      onMouseEnter={() => playSfx('hover')}
      style={{...mono,fontSize:'clamp(0.54rem,1.8vw,0.66rem)',letterSpacing:'0.08em',padding:'5px 12px',border:'1px solid rgba(255,255,255,0.14)',borderRadius:4,color:'rgba(255,255,255,0.65)',background:'rgba(255,255,255,0.03)'}}
    >{text}</span>
  )

  return (
    <div style={{maxWidth:1100,margin:'0 auto'}}>
      <SectionHeader tag="// PERSONAL INFORMATION" title="SUBJECT PROFILE"/>

      <div style={{display:'grid',gridTemplateColumns:'clamp(220px,30%,300px) 1fr',gap:'clamp(24px,4vw,48px)',alignItems:'start'}} className="personal-grid">
        {/* Photo */}
        <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.55}}>
          <div style={{position:'relative',borderRadius:8,overflow:'hidden',border:'1px solid rgba(255,255,255,0.1)'}}>
            <img src="/assets/photo_personal.jpg" alt="Arpan Kar"
              style={{width:'100%',height:'auto',display:'block',filter:'grayscale(0.15) contrast(1.05)'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 60%,rgba(8,8,8,0.7) 100%)',pointerEvents:'none'}}/>
            {(['tl','tr','bl','br'] as const).map(c=><div key={c} className={`hud-corner ${c}`} style={{position:'absolute'}}/>)}
            <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'8px 10px',...mono,fontSize:'0.46rem',letterSpacing:'0.18em',color:'rgba(255,255,255,0.4)'}}>SUBJECT_ID: AK_2026</div>
          </div>
        </motion.div>

        {/* Info */}
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* Fields */}
          <motion.div {...{initial:{opacity:0,y:16},whileInView:{opacity:1,y:0},viewport:{once:true},transition:{duration:0.5,delay:0.1}}} style={{...glassBox,padding:'clamp(14px,2.5vw,20px)'}}>
            <div style={{...mono,fontSize:'0.5rem',letterSpacing:'0.2em',color:'rgba(255,255,255,0.35)',marginBottom:14}}>// BASIC INFO</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {infoFields.map(f=>(
                <div key={f.label} style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <span style={{...mono,fontSize:'clamp(0.46rem,1.3vw,0.54rem)',letterSpacing:'0.14em',color:'rgba(255,255,255,0.35)',minWidth:130,flexShrink:0}}>{f.label}</span>
                  <span style={{...mono,fontSize:'clamp(0.52rem,1.5vw,0.62rem)',color:'rgba(255,255,255,0.75)'}}>{f.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          {[
            {label:'HARD SKILLS',     items:hardSkills},
            {label:'PROG. LANGUAGES', items:languages},
            {label:'SPOKEN LANGS',    items:spokenLangs},
            {label:'STRENGTHS',       items:softSkills},
            {label:'TOOLS',           items:tools},
          ].map((g,gi)=>(
            <motion.div key={g.label} {...{initial:{opacity:0,y:16},whileInView:{opacity:1,y:0},viewport:{once:true},transition:{duration:0.5,delay:gi*0.07+0.15}}} style={{...glassBox,padding:'clamp(12px,2vw,18px)'}}>
              <div style={{...mono,fontSize:'0.48rem',letterSpacing:'0.2em',color:'rgba(255,255,255,0.3)',marginBottom:10}}>{g.label}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {g.items.map(t=><Tag key={t} text={t}/>)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:620px){.personal-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}


/* ────────────────────────────────────────────── PROJECTS ── */
function ProjectsSection({ onOpen, playSfx }: { onOpen: (p: Project) => void; playSfx: (type: any) => void }) {
  const getYtId = (url: string) => { const m = url.match(/(?:youtu\.be\/|v=|shorts\/)([A-Za-z0-9_-]{11})/); return m?m[1]:null }
  const years = [...new Set(PROJECTS.map(p=>p.year))].sort()

  return (
    <section id="projects" className="section-anchor" style={{padding:'100px clamp(12px,4vw,28px) 80px',maxWidth:1180,margin:'0 auto'}}>
      <SectionHeader tag="// PROJECT BOARD" title="BUILD ARCHIVE"/>
      <p style={{...ui,fontSize:'0.85rem',color:'rgba(255,255,255,0.35)',marginTop:-20,marginBottom:28,maxWidth:480}}>
        Hover to reveal · Tap to explore full details
      </p>

      {years.map(year=>{
        const yp = PROJECTS.filter(p=>p.year===year)
        return (
          <div key={year}>
            <div style={{display:'flex',alignItems:'center',gap:12,margin:'28px 0 12px'}}>
              <div style={{...mono,fontSize:'0.54rem',letterSpacing:'0.26em',color:'rgba(255,255,255,0.45)',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.14)',padding:'3px 14px',borderRadius:3,flexShrink:0}}>{year}</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,rgba(255,255,255,0.2),transparent)'}}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,290px),1fr))',gap:'clamp(10px,2vw,14px)'}}>
              {yp.map((proj,i)=>{
                const hasYT = proj.media.some(m=>m.type==='youtube')
                const hasLI = proj.media.some(m=>m.type==='linkedin')
                return (
                  <motion.div key={proj.id}
                    initial={{opacity:0,y:22,scale:0.97}}
                    whileInView={{opacity:1,y:0,scale:1}}
                    viewport={{once:true,margin:'-20px'}}
                    transition={{delay:i*0.045,duration:0.42,ease:[0.22,1,0.36,1]}}
                    onClick={()=>{ onOpen(proj) }}
                    onMouseEnter={() => playSfx('hover')}
                    className="spotlight-block"
                    onMouseMove={e=>{
                      const r=(e.currentTarget as HTMLElement).getBoundingClientRect()
                      const mx=((e.clientX-r.left)/r.width*100).toFixed(1)
                      const my=((e.clientY-r.top)/r.height*100).toFixed(1);
                      (e.currentTarget as HTMLElement).style.setProperty('--mx',`${mx}%`);
                      (e.currentTarget as HTMLElement).style.setProperty('--my',`${my}%`)
                    }}
                    whileHover={{scale:1.02,y:-2}}
                    style={{cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,overflow:'hidden',background:'rgba(10,10,10,0.85)',boxShadow:'0 2px 16px rgba(0,0,0,0.4)'}}>
                    {/* Image */}
                    <div style={{position:'relative',width:'100%',aspectRatio:'16/9',overflow:'hidden',background:'#000'}}>
                      <motion.img src={proj.coverImg} alt={proj.name} loading="lazy"
                        style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
                        initial={{filter:'grayscale(1) brightness(0.3) blur(2px)'}}
                        whileHover={{filter:'grayscale(0.1) brightness(0.75) blur(0px)'}}
                        transition={{duration:0.5}}/>
                      <div style={{position:'absolute',inset:0,backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.05) 3px,rgba(0,0,0,0.05) 4px)',pointerEvents:'none'}}/>
                      <div style={{position:'absolute',top:8,left:10,...mono,fontSize:'0.54rem',letterSpacing:'0.16em',color:'rgba(255,255,255,0.5)',background:'rgba(8,8,8,0.65)',padding:'3px 8px',borderRadius:3}}>{proj.num}</div>
                      {proj.glitchLabel && <div style={{position:'absolute',top:8,right:10,...mono,fontSize:'0.5rem',letterSpacing:'0.1em',color:'rgba(255,255,255,0.8)',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.3)',padding:'3px 8px',borderRadius:3}}>★</div>}
                      {(hasYT||hasLI)&&<div style={{position:'absolute',bottom:7,right:8,display:'flex',gap:4}}>
                        {hasYT&&<div style={{...mono,fontSize:'0.46rem',background:'rgba(8,8,8,0.8)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:3,padding:'2px 6px',color:'rgba(255,255,255,0.65)'}}>▶ YT</div>}
                        {hasLI&&<div style={{...mono,fontSize:'0.46rem',background:'rgba(8,8,8,0.8)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:3,padding:'2px 6px',color:'rgba(255,255,255,0.65)'}}>IN</div>}
                      </div>}
                    </div>
                    {/* Footer */}
                    <div style={{padding:'10px 14px',background:'rgba(6,6,6,0.9)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                      <div style={{display:'flex',gap:4,flexWrap:'wrap',flex:1,minWidth:0}}>
                        {proj.tags.slice(0,2).map(t=><span key={t} style={{...mono,fontSize:'0.48rem',letterSpacing:'0.06em',padding:'3px 8px',border:'1px solid rgba(255,255,255,0.15)',borderRadius:3,color:'rgba(255,255,255,0.6)',background:'rgba(255,255,255,0.05)'}}>{t}</span>)}
                      </div>
                      <span style={{...mono,fontSize:'0.54rem',letterSpacing:'0.1em',color:'rgba(255,255,255,0.5)',flexShrink:0}}>OPEN ›</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )
      })}
    </section>
  )
}

/* ────────────────────────────────────────────── CERTS ── */
function CertsSection({ onOpen, playSfx }: { onOpen: (i: number) => void; playSfx: (type: any) => void }) {
  return (
    <section id="certifications" className="section-anchor" style={{padding:'100px clamp(12px,4vw,28px) 80px',maxWidth:1100,margin:'0 auto'}}>
      <SectionHeader tag="// CERTIFICATIONS" title="CREDENTIALS"/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,260px),1fr))',gap:'clamp(10px,2vw,14px)'}}>
        {CERTS.map((cert,i)=>(
          <motion.div key={cert.id}
            initial={{opacity:0,y:24,scale:0.97}}
            whileInView={{opacity:1,y:0,scale:1}}
            viewport={{once:true,margin:'-20px'}}
            transition={{delay:i*0.06,duration:0.44}}
            onClick={()=>{ onOpen(i) }}
            onMouseEnter={() => playSfx('hover')}
            className="spotlight-block"
            onMouseMove={e=>{const r=(e.currentTarget as HTMLElement).getBoundingClientRect();(e.currentTarget as HTMLElement).style.setProperty('--mx',`${((e.clientX-r.left)/r.width*100).toFixed(1)}%`);(e.currentTarget as HTMLElement).style.setProperty('--my',`${((e.clientY-r.top)/r.height*100).toFixed(1)}%`)}}
            whileHover={{scale:1.02,y:-2}}
            style={{cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,overflow:'hidden',background:'rgba(10,10,10,0.85)'}}>
            <div style={{position:'relative',width:'100%',aspectRatio:'4/3',overflow:'hidden',background:'#111'}}>
              <motion.img src={cert.img} alt={cert.title} loading="lazy"
                style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
                initial={{filter:'grayscale(1) brightness(0.35) blur(1px)'}}
                whileHover={{filter:'grayscale(0.2) brightness(0.72) blur(0px)'}}
                transition={{duration:0.45}}/>
            </div>
            <div style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{...mono,fontSize:'clamp(0.5rem,1.4vw,0.58rem)',letterSpacing:'0.1em',color:'rgba(255,255,255,0.72)',marginBottom:3,lineHeight:1.4}}>{cert.title}</div>
              <div style={{...mono,fontSize:'0.44rem',letterSpacing:'0.08em',color:'rgba(255,255,255,0.32)'}}>{cert.org} · {cert.date}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────── ACHIEVEMENTS ── */
function AchievementsSection({ onOpen, playSfx }: { onOpen: (i: number) => void; playSfx: (type: any) => void }) {
  return (
    <section id="achievements" className="section-anchor" style={{padding:'100px clamp(12px,4vw,28px) 80px',maxWidth:1100,margin:'0 auto'}}>
      <SectionHeader tag="// ACHIEVEMENTS" title="MILESTONES"/>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        {ACHIEVEMENTS.map((ach,i)=>(
          <motion.div key={ach.id}
            initial={{opacity:0,y:24}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true,margin:'-20px'}}
            transition={{delay:i*0.1,duration:0.48}}
            onClick={()=>{ onOpen(i) }}
            onMouseEnter={() => playSfx('hover')}
            className="spotlight-block ach-card"
            onMouseMove={e=>{const r=(e.currentTarget as HTMLElement).getBoundingClientRect();(e.currentTarget as HTMLElement).style.setProperty('--mx',`${((e.clientX-r.left)/r.width*100).toFixed(1)}%`);(e.currentTarget as HTMLElement).style.setProperty('--my',`${((e.clientY-r.top)/r.height*100).toFixed(1)}%`)}}
            whileHover={{scale:1.008}}
            style={{cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,overflow:'hidden',background:'rgba(10,10,10,0.85)',display:'flex',gap:0}}>
            {/* Thumb */}
            <div style={{flexShrink:0,width:'clamp(100px,22%,200px)',position:'relative',overflow:'hidden'}}>
              {ach.media[0]?.type==='image' && (
                <motion.img src={ach.media[0].src} alt="" loading="lazy"
                  style={{width:'100%',height:'100%',objectFit:'cover',display:'block',minHeight:110}}
                  initial={{filter:'grayscale(1) brightness(0.32)'}}
                  whileHover={{filter:'grayscale(0.2) brightness(0.7)'}}
                  transition={{duration:0.4}}/>
              )}
              {ach.media[0]?.type==='youtube' && (
                <div style={{width:'100%',height:'100%',minHeight:110,background:'rgba(20,20,20,0.9)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:'1.4rem',opacity:0.5}}>▶</span>
                </div>
              )}
            </div>
            {/* Info */}
            <div style={{flex:1,padding:'clamp(12px,2vw,18px)',display:'flex',flexDirection:'column',justifyContent:'center',gap:6}}>
              <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                <span style={{...mono,fontSize:'clamp(0.44rem,1.2vw,0.52rem)',letterSpacing:'0.12em',color:'rgba(255,255,255,0.4)',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',padding:'2px 8px',borderRadius:3}}>{ach.badge}</span>
                <span style={{...mono,fontSize:'0.46rem',color:'rgba(255,255,255,0.28)',letterSpacing:'0.1em'}}>{ach.date}</span>
              </div>
              <div style={{...mono,fontSize:'clamp(0.7rem,2vw,0.9rem)',color:'rgba(255,255,255,0.82)',fontWeight:600,letterSpacing:'0.04em'}}>{ach.title}</div>
              <div style={{...ui,fontSize:'clamp(0.72rem,1.8vw,0.82rem)',color:'rgba(255,255,255,0.38)',lineHeight:1.6}}>{ach.desc.slice(0,120)}{ach.desc.length>120?'...':''}</div>
              <div style={{...mono,fontSize:'0.44rem',letterSpacing:'0.14em',color:'rgba(255,255,255,0.28)',marginTop:2}}>TAP TO EXPLORE →</div>
            </div>
          </motion.div>
        ))}
      </div>
      <style>{`@media(max-width:480px){.ach-card{flex-direction:column!important}}`}</style>
    </section>
  )
}

/* ────────────────────────────────────────────── CONTACTS ── */
function ContactsSection({ playSfx }: { playSfx: (type: any) => void }) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.preventDefault()
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  const profLinks = [
    {label:'LinkedIn',  href:'https://www.linkedin.com/in/arpan-kar-1806a628b/', icon:'💼'},
    {label:'GitHub',    href:'https://github.com/Electropool', icon:'⬡'},
    {label:'Email',     href:'mailto:arpankar077@gmail.com', icon:'✉'},
    {label:'Microsoft', href:'mailto:arpankar077@gmail.com', icon:'✉'},
  ]

  const nonProfLinks = [
    {label:'Facebook',  href:'https://www.facebook.com/arpan.kar.1426', icon:'◈'},
    {label:'Instagram', href:'https://www.instagram.com/_.cbuzz._.keds._/', icon:'◈'},
    {label:'Telegram',  href:'@ArpanDeadpool', isUsername: true, icon:'💬'},
    {label:'YouTube',   href:'https://www.youtube.com/channel/UC_XfXc34-z9PmDG0GQtUmQg', icon:'▶'},
    {label:'Discord',   href:'@electropool', isUsername: true, icon:'💬'},
    {label:'Reddit',    href:'https://www.reddit.com/user/Good_Sheepherder38/', icon:'◈'},
    {label:'Apple Music', href:'@a_kar', isUsername: true, icon:'🎵'},
    {label:'Spotify',   href:'https://open.spotify.com/user/31z5evi3np3tk5bex6gzpl4hzuvi', icon:'🎵'},
    {label:'Guns.lol',  href:'https://guns.lol/electropool', icon:'◈'},
    {label:'Steam',     href:'https://steamcommunity.com/profiles/76561199570018140', icon:'🎮'},
    {label:'Epic Games', href:'Electropool007', isUsername: true, icon:'🎮'},
    {label:'Xbox',      href:'deadpool50540', isUsername: true, icon:'🎮'},
  ]

  const renderLinks = (linksArr: any[], offset: number) => (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,220px),1fr))',gap:10}}>
      {linksArr.map((l,i)=>{
        const isCopied = copied === l.href
        return (
          <motion.a key={l.label} 
            href={l.isUsername ? '#' : l.href} 
            target={l.isUsername ? undefined : "_blank"} 
            rel="noopener noreferrer"
            initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i+offset)*0.06}}
            onMouseEnter={() => playSfx('hover')}
            onClick={(e) => {
              playSfx('click')
              if (l.isUsername) handleCopy(e, l.href)
            }}
            whileHover={{scale:1.02,backgroundColor:'rgba(255,255,255,0.08)'}}
            style={{...glassBox,padding:'18px 20px',display:'flex',alignItems:'center',gap:14,textDecoration:'none',cursor:'pointer',transition:'background .2s'}}>
            <span style={{fontSize:'1.3rem',filter:'grayscale(1)',opacity:0.6}}>{l.icon}</span>
            <div>
              <div style={{...mono,fontSize:'0.64rem',letterSpacing:'0.14em',color:'rgba(255,255,255,0.75)'}}>{l.label}</div>
              <div style={{...mono,fontSize:'0.44rem',letterSpacing:'0.08em',color:isCopied?'#10b981':'rgba(255,255,255,0.28)',marginTop:2}}>
                {l.isUsername ? (isCopied ? 'COPIED!' : l.href) : 'OPEN →'}
              </div>
            </div>
          </motion.a>
        )
      })}
    </div>
  )

  return (
    <section id="contacts" className="section-anchor" style={{padding:'100px clamp(12px,4vw,28px) 80px',maxWidth:800,margin:'0 auto'}}>
      <SectionHeader tag="// CONTACTS & SOCIALS" title="GET IN TOUCH"/>
      
      <div style={{...mono,fontSize:'0.54rem',letterSpacing:'0.2em',color:'rgba(255,255,255,0.4)',marginBottom:16,marginTop:10}}>// PROFESSIONAL</div>
      {renderLinks(profLinks, 0)}

      <div style={{...mono,fontSize:'0.54rem',letterSpacing:'0.2em',color:'rgba(255,255,255,0.4)',marginBottom:16,marginTop:40}}>// SOCIAL & GAMING</div>
      {renderLinks(nonProfLinks, profLinks.length)}

      <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.4}}
        style={{...glassBox,padding:'clamp(16px,3vw,24px)',marginTop:20}}>
        <div style={{...mono,fontSize:'0.5rem',letterSpacing:'0.2em',color:'rgba(255,255,255,0.3)',marginBottom:12}}>// DIRECT MESSAGE</div>
        <div style={{...ui,fontSize:'clamp(0.82rem,2vw,0.95rem)',color:'rgba(255,255,255,0.5)',lineHeight:1.7,marginBottom:14}}>
          For project collaborations, academic inquiries, or just want to connect — feel free to reach out directly.
        </div>
        <a href="mailto:arpankar077@gmail.com"
          onMouseEnter={() => playSfx('hover')}
          onClick={() => playSfx('click')}
          className="glass-btn"
          style={{display:'inline-block',fontSize:'0.62rem',letterSpacing:'0.16em',padding:'9px 22px',borderRadius:6,textDecoration:'none',color:'rgba(255,255,255,0.8)'}}>
          arpankar077@gmail.com
        </a>
      </motion.div>

      <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.5}}
        style={{...glassBox,padding:'clamp(16px,3vw,24px)',marginTop:20, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{...mono,fontSize:'0.5rem',letterSpacing:'0.2em',color:'rgba(255,255,255,0.3)',marginBottom:16}}>// QUICK SHARE</div>
        <QRCodeWidget />
      </motion.div>
    </section>
  )
}

/* ────────────────────────────────────────────── MAIN PAGE ── */
interface Props {
  activeSection: Section
  lastScrollPos: number
  onSectionChange: (s: Section) => void
  onOpenProject:    (p: Project) => void
  onOpenCert:       (i: number) => void
  onOpenAchievement:(i: number) => void
  playSfx:          (type: any) => void
}

export default function SinglePage({ activeSection, lastScrollPos, onSectionChange, onOpenProject, onOpenCert, onOpenAchievement, playSfx }: Props) {
  const sectionsRef = useRef<HTMLDivElement>(null)

  // Restore scroll position on mount (e.g. after closing a detail view)
  useEffect(() => {
    if (lastScrollPos > 0) {
      window.scrollTo({ top: lastScrollPos, behavior: 'instant' })
    }
  }, [])



  // IntersectionObserver to track which section is visible
  useEffect(() => {
    const ids: Section[] = ['home','personal','projects','certifications','achievements','contacts']
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) onSectionChange(entry.target.id as Section)
      })
    }, { threshold: 0.25 })
    ids.forEach(id => { const el = document.getElementById(id); if(el) obs.observe(el) })
    return () => obs.disconnect()
  }, [onSectionChange])

  return (
    <div ref={sectionsRef} style={{paddingBottom:24}}>
      <SectionWrapper id="home">
        <HeroSection playSfx={playSfx}/>
      </SectionWrapper>
      
      <SectionWrapper id="personal">
        <PersonalSection playSfx={playSfx}/>
      </SectionWrapper>

      <div style={{height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)',margin:'0 clamp(12px,4vw,40px)'}}/>
      <ProjectsSection onOpen={onOpenProject} playSfx={playSfx}/>
      <div style={{height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)',margin:'0 clamp(12px,4vw,40px)'}}/>
      <CertsSection onOpen={onOpenCert} playSfx={playSfx}/>
      <div style={{height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)',margin:'0 clamp(12px,4vw,40px)'}}/>
      <AchievementsSection onOpen={onOpenAchievement} playSfx={playSfx}/>
      <div style={{height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)',margin:'0 clamp(12px,4vw,40px)'}}/>
      <ContactsSection playSfx={playSfx}/>
      <Footer/>
    </div>
  )
}

