import Spline from '@splinetool/react-spline';

export default function RobotWhobee() {
  return (
    <div className="w-full h-full relative group overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20">
         <div className="px-3 py-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-[10px] text-white/40 tracking-[0.2em] font-mono">
           INTERACTIVE_3D_ROBOT
         </div>
      </div>
      
      {/* Clipping container for Spline to hide the bottom watermark */}
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        <div style={{ width: '100%', height: 'calc(100% + 40px)', position: 'absolute', top: 0, left: 0 }}>
          <Spline 
            scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode" 
          />
        </div>
      </div>
    </div>
  );
}
