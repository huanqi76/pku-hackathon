import { useState } from 'react';
import { motion } from 'motion/react';
import { CapsuleState } from '../types';
import { Check, Lock } from 'lucide-react';

interface Props {
  key?: string;
  onSelect: (state: CapsuleState, memoryId: 'ocean' | 'great_wall' | 'park_river') => void;
  exploredMemories: string[];
}

export function OptionsView({ onSelect, exploredMemories }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const galaxyBg = '/src/assets/images/galaxy_background_1779617150828.png';

  const options = [
    { 
      id: 'ocean' as const, 
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200'
    },
    { 
      id: 'great_wall' as const, 
      image: 'https://images.unsplash.com/photo-1547983650-149fae24e648?q=80&w=1200'
    },
    { 
      id: 'park_river' as const, 
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden z-10 bg-neutral-950"
    >
      {/* 1. Immersive Spaceship Cabin Interior Backdrop (Still View) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        
        {/* VIEWPORT WINDOW TO THE GALAXY */}
        <div className="relative w-[90vw] h-[85vh] max-w-6xl max-h-[700px] rounded-[48px] overflow-hidden border-8 border-neutral-800 bg-black shadow-[0_0_100px_rgba(0,0,0,0.8)] flex items-center justify-center">
          {/* Still Galaxy background visible outside */}
          <img
            src={galaxyBg}
            alt="Outer Space Galaxy View"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          {/* Glass reflection filter */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-white/5 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#000000_90%)] pointer-events-none" />
          
          {/* Reticle grid marks on the viewport glass */}
          <div className="absolute inset-x-12 top-1/2 h-[1px] bg-white/5 pointer-events-none" />
          <div className="absolute left-1/2 inset-y-12 w-[1px] bg-white/5 pointer-events-none" />
          <div className="absolute inset-24 border border-white/5 rounded-full pointer-events-none" />
        </div>

        {/* CABIN INTERIOR WALLS & STRUCTURE (Pristine, dark, matte steel panel framing) */}
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
          {/* Top panel girder */}
          <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-neutral-950 to-transparent border-b border-white/5 opacity-90 flex items-center justify-between px-10">
            <div className="font-mono text-[9px] text-neutral-400 tracking-[0.3em] uppercase">
              OBSERVATION VIEWPORT // STATE: LOCKED
            </div>
            <div className="font-mono text-[9px] text-neutral-500 tracking-widest hidden sm:block">
              EP-883 SENSORY TERMINAL
            </div>
          </div>

          {/* Left panel girder */}
          <div className="absolute left-0 inset-y-0 w-12 md:w-20 bg-gradient-to-r from-neutral-950 via-neutral-900 to-transparent border-r border-white/5" />
          
          {/* Right panel girder */}
          <div className="absolute right-0 inset-y-0 w-12 md:w-20 bg-gradient-to-l from-neutral-950 via-neutral-900 to-transparent border-l border-white/5" />
          
          {/* Bottom command console dashboard girder */}
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-neutral-950 to-transparent border-t border-white/5 opacity-90 flex items-center justify-between px-10">
            <div className="font-mono text-[9px] text-neutral-500 tracking-wider">
              COORD ID: L-03 // DECIMALS RE-ALIGNED
            </div>
            <div className="font-mono text-[9px] text-emerald-400/60 tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              STATION COMM: ACTIVE
            </div>
          </div>
        </div>
      </div>

      {/* 2. Three Memory Preview Cards in a Beautiful Grid Format */}
      <div className="relative z-20 w-full max-w-4xl flex flex-col items-center gap-8">
        
        {/* Subtle navigation guidance note at top */}
        <div className="text-center">
          <p className="font-mono text-[10px] text-neutral-400/80 tracking-[0.4em] uppercase">
            {exploredMemories.length < 3 
              ? `已融合 ${exploredMemories.length} / 3 组感官记忆`
              : '系统就绪，开始时空倒流'}
          </p>
        </div>

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4 items-center justify-center">
          {options.map((opt) => {
            const isCompleted = exploredMemories.includes(opt.id);
            const isHovered = hoveredId === opt.id && !isCompleted;
            
            return (
              <motion.div
                key={opt.id}
                onMouseEnter={() => setHoveredId(opt.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  if (!isCompleted) {
                    onSelect('ar_view', opt.id);
                  }
                }}
                className={`relative aspect-[3/4] w-full max-w-[260px] mx-auto rounded-[32px] overflow-hidden transition-all duration-300 cursor-pointer select-none border group bg-neutral-900 ${
                  isCompleted
                    ? 'border-emerald-500/30 opacity-65 cursor-not-allowed shadow-[0_5px_15px_rgba(0,0,0,0.4)]'
                    : isHovered
                    ? 'border-emerald-400 shadow-[0_0_50px_rgba(52,211,153,0.35),inset_0_1px_3px_rgba(255,255,255,0.3)] scale-[1.04]'
                    : 'border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)]'
                }`}
              >
                {/* Visual Glass Content preview - NO TEXT / NO BUTTONS AT ALL */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={opt.image}
                    alt=""
                    className={`w-full h-full object-cover transition-all duration-[1.2s] ease-out ${
                      isCompleted 
                        ? 'grayscale brightness-50 opacity-45 saturate-50' 
                        : isHovered 
                        ? 'scale-105 contrast-110 saturate-[1.15]' 
                        : 'scale-100 grayscale brightness-75 opacity-70'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {/* Glass reflective filter */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Subtle technical overlay scanlines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] opacity-25" />
                </div>

                {/* Laser scanline sweeping down on hover */}
                {isHovered && (
                  <motion.div
                    animate={{ y: ['-10%', '110%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-x-0 h-[2px] bg-emerald-400 shadow-[0_0_10px_#34d399] z-20 pointer-events-none"
                  />
                )}

                {/* Status Indicator Overlays on Center when Completed or Locked */}
                {isCompleted ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/20 backdrop-blur-[2px] z-10">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-2">
                      <Check className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="font-mono text-[9px] text-emerald-400 tracking-[0.25em] uppercase bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30">
                      SECURED // SYNCED
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="font-mono text-[9px] text-white tracking-[0.3em] uppercase bg-black/70 px-3 py-1.5 rounded-lg border border-white/15">
                      INITIALIZE AR ➔
                    </span>
                  </div>
                )}

                {/* Technical Bracket on corners to reinforce spatial container feel */}
                <div className={`absolute top-4 left-4 w-4 h-4 border-t border-l pointer-events-none ${isCompleted ? 'border-emerald-500/40' : 'border-white/20'}`} />
                <div className={`absolute top-4 right-4 w-4 h-4 border-t border-r pointer-events-none ${isCompleted ? 'border-emerald-500/40' : 'border-white/20'}`} />
                <div className={`absolute bottom-4 left-4 w-4 h-4 border-b border-l pointer-events-none ${isCompleted ? 'border-emerald-500/40' : 'border-white/20'}`} />
                <div className={`absolute bottom-4 right-4 w-4 h-4 border-b border-r pointer-events-none ${isCompleted ? 'border-emerald-500/40' : 'border-white/20'}`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
