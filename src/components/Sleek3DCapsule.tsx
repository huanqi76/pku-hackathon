import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  key?: string;
  step: 'capsule_entry' | 'capsule_prompt' | 'opened';
  onEntryComplete: () => void;
  onOpen: () => void;
}

export function Sleek3DCapsule({ step, onEntryComplete, onOpen }: Props) {
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (step === 'capsule_entry') {
      const timer = setTimeout(() => {
        onEntryComplete();
      }, 2500); // Fly-in takes 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [step, onEntryComplete]);

  // Framer Motion entry variant
  const entryVariants = {
    hidden: {
      x: '-120vw',
      y: '30vh',
      rotate: -70,
      scale: 0.2,
      rotateY: -90,
      filter: 'blur(10px)',
    },
    visible: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 80,
        duration: 2.2,
      }
    }
  };

  const handleCapsuleClick = () => {
    if (step === 'capsule_prompt') {
      onOpen();
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8 z-30 pointer-events-none">
      
      {/* 3D Scene Wrapper with Perspective */}
      <div 
        className="relative flex flex-col items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          variants={entryVariants}
          initial="hidden"
          animate={step === 'opened' ? undefined : 'visible'}
          className="relative pointer-events-auto cursor-pointer select-none group"
          onClick={handleCapsuleClick}
        >
          {/* Animated Glow rings in background (only when prompted to click) */}
          {step === 'capsule_prompt' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                className="absolute w-72 h-72 border border-white/20 rounded-full blur-[2px]"
              />
              <motion.div
                animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
                transition={{ duration: 3, delay: 1, repeat: Infinity, ease: 'easeOut' }}
                className="absolute w-72 h-72 border border-white/30 rounded-full blur-[1px]"
              />
            </div>
          )}

          {/* Floating/Hover Animation container when prompted */}
          <motion.div
            animate={
              step === 'capsule_prompt'
                ? {
                    y: [0, -18, 0],
                    rotateZ: [0, 3, -1, 0],
                    rotateY: [0, 10, -10, 0],
                  }
                : {}
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative flex flex-col items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Split Top Half */}
            <motion.div
              animate={
                step === 'opened'
                  ? { y: -300, rotateX: -45, rotateY: 30, opacity: 0, scale: 0.8 }
                  : {}
              }
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="relative w-36 h-32 flex flex-col justify-end translate-y-[2px]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Top dome cap shell */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-neutral-50 to-neutral-200 rounded-t-[70px] shadow-[inset_0_15px_30px_rgba(255,255,255,0.9),0_10px_35px_rgba(0,0,0,0.3)] border-t border-x border-neutral-300 overflow-hidden flex flex-col items-center">
                {/* Shiny highlight glare reflection */}
                <div className="absolute top-2 left-6 w-8 h-12 bg-white/65 rounded-full blur-[2px] rotate-12" />
                
                {/* Glass Viewport Window with inside warm golden light */}
                <div className="w-14 h-10 rounded-full border border-neutral-400 bg-neutral-900 absolute bottom-4 flex items-center justify-center shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.95)_0%,rgba(120,53,4,0.3)_100%)] animate-pulse" />
                  <div className="absolute top-1 left-2 w-4 h-2 bg-white/40 rounded-full blur-[1px]" />
                </div>
              </div>
            </motion.div>

            {/* Middle Laser Joint Ring */}
            <motion.div
              animate={step === 'opened' ? { opacity: 0, scale: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="w-40 h-3 bg-neutral-800 border-y border-neutral-700 relative z-20 flex items-center justify-around overflow-hidden shadow-md"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-ping" />
              <div className="w-1 h-1 rounded-full bg-cyan-400/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]" />
              <div className="w-1 h-1 rounded-full bg-cyan-400/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse" />
            </motion.div>

            {/* Split Bottom Half */}
            <motion.div
              animate={
                step === 'opened'
                  ? { y: 300, rotateX: 45, rotateY: -30, opacity: 0, scale: 0.8 }
                  : {}
              }
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="relative w-36 h-36 flex flex-col justify-start -translate-y-[2px]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Bottom Cone Shell */}
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-neutral-300 via-neutral-100 to-neutral-50 rounded-b-[45px] shadow-[inset_0_-15px_30px_rgba(0,0,0,0.1),0_-5px_20px_rgba(0,0,0,0.15)] border-b border-x border-neutral-300 flex flex-col items-center justify-between p-4 overflow-hidden">
                {/* Shiny gloss stripe side */}
                <div className="absolute top-0 right-6 w-6 h-full bg-white/20 blur-[1px] rotate-5 pointer-events-none" />
                
                {/* Decal label printed */}
                <div className="flex flex-col items-center mt-3 select-none">
                  <div className="text-[10px] font-mono font-medium tracking-[0.2em] text-neutral-500 uppercase">E.T.C. - 883</div>
                  <div className="text-[12px] font-mono tracking-[0.3em] font-semibold text-neutral-800">时空胶囊</div>
                </div>

                {/* Engine nozzle at the bottom */}
                <div className="w-16 h-4 bg-neutral-800 rounded-b-md border border-neutral-700 flex justify-between px-2 items-center">
                  <div className="w-2.5 h-1 px-0.5 bg-neutral-900 border border-neutral-700 rounded-b-sm" />
                  <div className="w-2.5 h-1 px-0.5 bg-neutral-900 border border-neutral-700 rounded-b-sm" />
                </div>
              </div>

              {/* Ion Thruster Flame Glow at Base */}
              <motion.div
                animate={{
                  opacity: step === 'capsule_prompt' ? [0.6, 1, 0.6] : 1,
                  scale: step === 'capsule_prompt' ? [0.95, 1.05, 0.95] : 1,
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-14 h-8 bg-cyan-400/30 rounded-full blur-md z-10 pointer-events-none flex items-center justify-center"
              >
                <div className="w-6 h-4 bg-cyan-300 rounded-full blur-[2px]" />
              </motion.div>
            </motion.div>

          </motion.div>
        </motion.div>

        {/* Outer click guide prompt text */}
        {step === 'capsule_prompt' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="absolute top-full mt-10 whitespace-nowrap text-white/50 tracking-[0.4em] font-display text-[11px] uppercase flex items-center gap-2 group-hover:text-white transition-colors duration-300 pointer-events-auto cursor-pointer"
            onClick={handleCapsuleClick}
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>触碰开启：时空胶囊</span>
          </motion.div>
        )}
      </div>

    </div>
  );
}
