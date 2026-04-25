import { useRef } from "react"
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from "lucide-react"
import { Project } from "../data/projects"

interface ParallaxProjectsProps {
  projects: Project[]
  onOpenProject: (p: Project) => void
  playSfx: (type: any) => void
}

function ProjectCard({ project, index, onOpenProject, playSfx }: { project: Project, index: number, onOpenProject: (p: Project) => void, playSfx: (type: any) => void }) {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "center start"]
  });

  const opacityContent = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const clipProgress = useTransform(scrollYProgress, [0, 0.7], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const translateContent = useTransform(scrollYProgress, [0, 1], [-50, 0]);

  const isReverse = index % 2 !== 0;

  return (
    <div 
        ref={ref} 
        className={`min-h-screen flex flex-col md:flex-row items-center justify-center md:gap-20 lg:gap-40 gap-12 py-20 ${isReverse ? 'md:flex-row-reverse' : ''}`}
    >
        {/* Text Content */}
        <motion.div 
          style={{ y: translateContent }}
          className="flex-1 max-w-xl text-center md:text-left flex flex-col items-center md:items-start"
        >
            <div className="text-[var(--accent)] font-mono text-sm tracking-widest mb-4">{project.num} {project.year}</div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">{project.name}</div>
            
            <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
              {project.tags.slice(0,3).map(tag => (
                <span key={tag} className="text-[10px] tracking-widest font-mono border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-full text-[rgba(255,255,255,0.6)]">
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>

            <motion.p 
                style={{ y: translateContent }} 
                className="text-[rgba(255,255,255,0.6)] text-lg leading-relaxed mb-10"
            >
                {project.shortDesc}
            </motion.p>

            <button
              onMouseEnter={() => playSfx('hover')}
              onClick={() => { playSfx('click'); onOpenProject(project); }}
              className="glass-btn px-8 py-3 rounded text-xs tracking-[0.2em] uppercase"
            >
              VIEW DETAILS
            </button>
        </motion.div>

        {/* Image Content */}
        <motion.div 
            style={{ 
                opacity: opacityContent,
                clipPath: clipProgress,
            }}
            className="flex-1 w-full max-w-lg cursor-pointer spotlight-block rounded-xl overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.1)]"
            onClick={() => { playSfx('click'); onOpenProject(project); }}
            onMouseEnter={() => playSfx('hover')}
            whileHover={{ scale: 1.02 }}
        >
            <img 
                src={project.coverImg} 
                className="w-full aspect-[4/3] object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                alt={project.name}
            />
        </motion.div>
    </div>
  )
}

export default function ParallaxProjects({ projects, onOpenProject, playSfx }: ParallaxProjectsProps) {
  return (
    <div className="w-full relative z-10 font-ui text-white">
      <div className='min-h-[50vh] w-full flex flex-col items-center justify-center pt-20'>
        <h2 className='text-4xl md:text-6xl max-w-2xl text-center font-mono tracking-widest text-[rgba(255,255,255,0.4)]'>
          // PROJECTS
        </h2>
        <p className='mt-10 flex items-center gap-2 text-sm text-[rgba(255,255,255,0.3)] tracking-widest font-mono'>
          SCROLL TO EXPLORE <ArrowDown size={15} />
        </p>
      </div>

      <div className="flex flex-col md:px-10 px-4 pb-40">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            onOpenProject={onOpenProject} 
            playSfx={playSfx} 
          />
        ))}
      </div>
    </div>
  );
}
