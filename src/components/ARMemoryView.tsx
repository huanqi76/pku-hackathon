import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';

interface Props {
  key?: string;
  memoryId: 'ocean' | 'great_wall' | 'park_river';
  onBack: () => void;
  onExplorationComplete: (id: 'ocean' | 'great_wall' | 'park_river') => void;
}

const memoryDetails = {
  ocean: {
    title: '蔚蓝海岸线',
    location: 'COORD // PACIFIC_102',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    description: '海浪冲击着金黄的沙滩，阳光融在水波中。风里带着略显咸涩的温热气息，耳畔是潮水永无止息的呼吸。'
  },
  great_wall: {
    title: '长城斜阳照',
    location: 'COORD // BEIJING_709',
    image: 'https://images.unsplash.com/photo-1547983650-149fae24e648?q=80&w=1200',
    description: '青砖上的余温在指尖蔓延，层峦叠嶂的远山没入晚霞。游客的喧嚣已成过眼云烟，只有不朽的巨龙盘踞在星空之下。'
  },
  park_river: {
    title: '公园无名溪流',
    location: 'COORD // PARKSIDE_441',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200',
    description: '午后树影斑驳地洒在清澈的溪水上，金色的溪底碎石泛着光芒。那是平凡的礼赞，也是我们最怀念的细碎日常。'
  }
};

export function ARMemoryView({ memoryId, onBack, onExplorationComplete }: Props) {
  const detail = memoryDetails[memoryId];
  
  // AR translation coordinates (percentage shift)
  const [posX, setPosX] = useState(0); // -40 to 40
  const [posY, setPosY] = useState(0); // -40 to 40

  // Sector scanned check states
  const [scannedSectors, setScannedSectors] = useState({
    North: false,
    South: false,
    East: false,
    West: false,
  });

  const [syncProgress, setSyncProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Monitor positions to trigger sector completion
  useEffect(() => {
    setScannedSectors((prev) => {
      const next = { ...prev };
      if (posY <= -15) next.North = true;
      if (posY >= 15) next.South = true;
      if (posX >= 15) next.East = true;
      if (posX <= -15) next.West = true;
      return next;
    });
  }, [posX, posY]);

  // Handle continuous sync scale calculation
  useEffect(() => {
    const trueSectorsNum = Object.values(scannedSectors).filter(Boolean).length;
    // Calculate sync: 0 to 100 based on sectors & subtle offsets
    const baseProgress = Math.round((trueSectorsNum / 4) * 100);
    setSyncProgress(baseProgress);

    if (trueSectorsNum === 4 && !isDone) {
      setIsDone(true);
    }
  }, [scannedSectors, isDone]);

  // Handle Seconds Ticker when done
  useEffect(() => {
    if (!isDone) return;
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isDone]);

  // Declaratively trigger of parent callback when countdown reaches zero
  useEffect(() => {
    if (isDone && countdown === 0) {
      onExplorationComplete(memoryId);
    }
  }, [isDone, countdown, onExplorationComplete, memoryId]);

  // Keyboard binding controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDone) return;
      const stepSize = 8;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setPosY((prev) => Math.max(prev - stepSize, -50));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setPosY((prev) => Math.min(prev + stepSize, 50));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setPosX((prev) => Math.max(prev - stepSize, -50));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setPosX((prev) => Math.min(prev + stepSize, 50));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDone]);

  // Manual nudge helpers
  const move = (direction: 'N' | 'S' | 'E' | 'W') => {
    if (isDone) return;
    const stepSize = 12;
    if (direction === 'N') setPosY((prev) => Math.max(prev - stepSize, -50));
    if (direction === 'S') setPosY((prev) => Math.min(prev + stepSize, 50));
    if (direction === 'E') setPosX((prev) => Math.min(prev + stepSize, 50));
    if (direction === 'W') setPosX((prev) => Math.max(prev - stepSize, -50));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-between text-white z-40 select-none overflow-hidden"
    >
      {/* 1. Master AR Frame Viewport with panning translation */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            x: -posX * 3.5, // Panning mapping multiplier
            y: -posY * 3.5,
            scale: 1.25 + Math.abs(posX + posY) * 0.001,
          }}
          transition={{ type: 'spring', stiffness: 45, damping: 15 }}
          className="w-full h-full relative"
        >
          <img
            src={detail.image}
            alt={detail.title}
            className="w-full h-full object-cover select-none filter contrast-125 saturate-[1.1] brightness-[0.85]"
            draggable={false}
          />
        </motion.div>
        
        {/* Cold blue-green CRT holographic grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[#001407]/15 mix-blend-color-dodge pointer-events-none" />
        {/* Scan lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(52,211,153,0.06)_50%)] bg-[size:100%_4px] opacity-40 pointer-events-none" />
      </div>

      {/* 2. Top Visor Status Deck */}
      <div className="w-full max-w-6xl px-6 pt-6 z-10 flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-[10px] text-emerald-400 tracking-widest font-semibold">AR // MEMORY RETRIEVAL VISOR</span>
          </div>
          <h2 className="text-2xl font-display font-light text-white tracking-[0.2em]">{detail.title}</h2>
          <span className="font-mono text-[9px] text-neutral-400 tracking-wider bg-white/5 py-0.5 px-2 rounded w-fit border border-white/10 uppercase">
            {detail.location}
          </span>
        </div>

        {/* Sync panel indicator */}
        <div className="flex flex-col items-end gap-1.5 bg-neutral-950/80 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Cpu className={`w-4 h-4 text-emerald-400 ${!isDone && 'animate-spin'}`} />
            <span className="font-mono text-xs tracking-wider font-semibold">COGNITIVE LOCK: {syncProgress}%</span>
          </div>
          <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${syncProgress}%` }}
              className="h-full bg-emerald-500" 
            />
          </div>
        </div>
      </div>

      {/* 3. Immersive Reticle & Crosshairs */}
      <div className="absolute inset-x-20 inset-y-24 pointer-events-none z-10 border border-white/5 rounded-[48px] flex items-center justify-center">
        {/* Dynamic target tracking box */}
        <motion.div 
          animate={{
            scale: [1, 1.03, 1],
            borderColor: isDone ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.1)'
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-80 h-80 border border-white/10 rounded-full flex flex-col items-center justify-center relative"
        >
          {/* Internal crosshair lines */}
          <div className="w-12 h-[1px] bg-white/30 absolute" />
          <div className="h-12 w-[1px] bg-white/30 absolute" />
          
          {/* Compass layout around circle */}
          <div className={`absolute top-2 font-mono text-[9px] tracking-widest ${scannedSectors.North ? 'text-emerald-400' : 'text-neutral-500'}`}>北 N {scannedSectors.North && '✓'}</div>
          <div className={`absolute bottom-2 font-mono text-[9px] tracking-widest ${scannedSectors.South ? 'text-emerald-400' : 'text-neutral-500'}`}>南 S {scannedSectors.South && '✓'}</div>
          <div className={`absolute right-2 font-mono text-[9px] tracking-widest ${scannedSectors.East ? 'text-emerald-400' : 'text-neutral-500'}`}>东 E {scannedSectors.East && '✓'}</div>
          <div className={`absolute left-2 font-mono text-[9px] tracking-widest ${scannedSectors.West ? 'text-emerald-400' : 'text-neutral-500'}`}>西 W {scannedSectors.West && '✓'}</div>

          {/* Compass grid rings */}
          <div className="absolute inset-10 border border-dashed border-white/5 rounded-full" />
          <div className="absolute inset-20 border border-double border-white/5 rounded-full" />
        </motion.div>

        {/* Real-time telemetry overlay of panning */}
        <div className="absolute bottom-6 left-6 font-mono text-[9px] text-emerald-400/75 tracking-widest space-y-1">
          <div>PAN DISTANCE: {Math.sqrt(posX * posX + posY * posY).toFixed(1)}m</div>
          <div>BEARING RESOLUTION: {(posX * 3.6).toFixed(1)}°</div>
          <div>TRANSLATION_MATRIX [ X: {posX > 0 ? `+${posX}` : posX} , Y: {posY > 0 ? `+${posY}` : posY} ]</div>
        </div>

        {/* Interactive hints details */}
        {!isDone && (
          <div className="absolute bottom-6 right-6 font-mono text-[9px] text-neutral-400 text-right tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            键盘 WASD 或 箭头探索边缘以解析四个基站扇区
          </div>
        )}
      </div>

      {/* 4. Bottom Control HUD Panel */}
      <div className="w-full max-w-4xl px-6 pb-6 z-20 flex flex-col gap-5 items-center">
        
        {/* Dynamic Instruction Overlay or Locked Success State */}
        <AnimatePresence mode="wait">
          {isDone ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-950/90 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 text-emerald-400 shadow-2xl backdrop-blur-md"
            >
              <CheckCircle className="w-6 h-6 animate-pulse" />
              <div>
                <p className="font-mono text-xs font-bold tracking-widest uppercase">融合完整 // 正在自动回舱</p>
                <p className="text-[11px] text-emerald-400/80 uppercase font-mono tracking-wider">SECURE SYNC SUCCESSFUL. REDIRECTING IN {countdown}S...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-neutral-950/80 border border-white/10 rounded-2xl p-4 max-w-xl text-center backdrop-blur-md"
            >
              <p className="text-[11px] text-neutral-300 tracking-wide leading-relaxed font-light">
                “{detail.description}”
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual Joystick Controllers for Touch/Mouse users as well */}
        <div className="flex items-center gap-3">
          <div className="grid grid-cols-3 gap-1.5 w-32 h-20 items-center justify-center">
            <div />
            <button
              onClick={() => move('N')}
              disabled={isDone}
              className="p-1.5 rounded bg-white/5 border border-white/10 text-white hover:bg-emerald-500/10 hover:border-emerald-500/40 cursor-pointer flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div />

            {/* Middle row */}
            <button
              onClick={() => move('W')}
              disabled={isDone}
              className="p-1.5 rounded bg-white/5 border border-white/10 text-white hover:bg-emerald-500/10 hover:border-emerald-500/40 cursor-pointer flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onBack}
              className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-white/20 cursor-pointer flex items-center justify-center font-mono text-[7px] tracking-tighter"
            >
              EXIT
            </button>
            <button
              onClick={() => move('E')}
              disabled={isDone}
              className="p-1.5 rounded bg-white/5 border border-white/10 text-white hover:bg-emerald-500/10 hover:border-emerald-500/40 cursor-pointer flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <div />
            <button
              onClick={() => move('S')}
              disabled={isDone}
              className="p-1.5 rounded bg-white/5 border border-white/10 text-white hover:bg-emerald-500/10 hover:border-emerald-500/40 cursor-pointer flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <div />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
