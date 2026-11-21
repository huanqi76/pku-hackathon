import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  key?: string;
  onComplete: () => void;
}

export function TimeTravelAnimation({ onComplete }: Props) {
  const [timelineYear, setTimelineYear] = useState(2138);
  const [statusText, setStatusText] = useState('初始化时空引擎 ...');
  const [phase, setPhase] = useState<'fade-in' | 'warping' | 'arrival'>('fade-in');

  const galaxyBg = '/src/assets/images/galaxy-background.png';

  // Rapidly decrement year from 2138 to 2026
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('warping');
      setStatusText('空间跳跃启动：折叠星系象限');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Time Warp Decelerator Year Ticker
  useEffect(() => {
    if (phase !== 'warping') return;

    let currentYear = 2138;
    const interval = setInterval(() => {
      // Exponential speed deceleration towards 2026
      const diff = currentYear - 2026;
      if (diff <= 0) {
        clearInterval(interval);
        setTimelineYear(2026);
        setPhase('arrival');
        setStatusText('时空折叠完成：接入家园时间轴 2026');
        return;
      }

      // Faster steps at beginning, slower at the end
      const decrease = Math.max(1, Math.round(diff * 0.15));
      currentYear -= decrease;
      setTimelineYear(currentYear);
    }, 55);

    return () => clearInterval(interval);
  }, [phase]);

  // Terminal telemetry cycles
  useEffect(() => {
    if (phase !== 'warping') return;

    const phrases = [
      '正在检索地核电磁场共振特性...',
      '正在解压深海微光神经脉冲数据...',
      '时间维度解耦中：YEAR_DELTA -112...',
      '重力拟真：9.81m/s² (重置成功)',
      '正在映射地球文明情感记忆元数据...',
    ];

    let currentIdx = 0;
    const msgInterval = setInterval(() => {
      if (currentIdx < phrases.length) {
        setStatusText(phrases[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(msgInterval);
      }
    }, 600);

    return () => clearInterval(msgInterval);
  }, [phase]);

  // Handle final completion redirection
  useEffect(() => {
    if (phase !== 'arrival') return;
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden text-white"
    >
      {/* 1. Cinematic Hyperspace Streaks & Wormhole visual simulations */}
      <div className="absolute inset-0 z-0">
        <img
          src={galaxyBg}
          alt="Cosmic Void"
          className={`absolute inset-0 w-full h-full object-cover transition-all grayscale duration-[2.5s] ${
            phase === 'warping' ? 'scale-[2.4] opacity-50' : 'scale-110 opacity-10'
          }`}
          referrerPolicy="no-referrer"
        />
        
        {/* Particle speed streak overlay */}
        {phase === 'warping' && (
          <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
            {/* Warp lines flying towards user using CSS grids and shadows */}
            <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.15),transparent_70%)] animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/20 via-black to-emerald-950/10 pointer-events-none" />
            
            {/* Exploding star effect */}
            <motion.div
              animate={{ scale: [1, 2], opacity: [0, 0.8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute w-[400px] h-[400px] rounded-full border border-emerald-400/20 blur-[1px]"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_100%)] pointer-events-none" />
      </div>

      {/* 2. Super Dramatic Spinning Timetravel Dial Elements */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-xl text-center px-6">
        
        {/* Glowing circular alignment frame */}
        <div className="relative w-72 h-72 flex items-center justify-center mb-8">
          <motion.div
            animate={phase === 'warping' ? { rotate: 360 } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className={`absolute inset-0 border-2 rounded-full border-dashed transition-colors duration-1000 ${
              phase === 'arrival' ? 'border-emerald-400/60' : 'border-neutral-700/60'
            }`}
          />
          <motion.div
            animate={phase === 'warping' ? { rotate: -360 } : {}}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 border border-white/10 rounded-full"
          />

          {/* Active running year ticker */}
          <div className="flex flex-col items-center justify-center z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={timelineYear}
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(3px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(2px)' }}
                transition={{ duration: 0.08 }}
                className="relative"
              >
                {/* Neon shadow box around Year */}
                <h1 className="text-6xl md:text-7xl font-sans font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-white drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]">
                  {timelineYear}
                </h1>
              </motion.div>
            </AnimatePresence>

            <span className="font-mono text-[9px] text-neutral-500 tracking-[0.4em] uppercase mt-3">
              {phase === 'fade-in' ? 'NEURAL COMPULSES' : phase === 'warping' ? 'TIMELINE RE-ROLLING' : 'TEMPORAL ATTAINED'}
            </span>
          </div>
        </div>

        {/* Dynamic Space-Time Telemetry Log Lines */}
        <div className="h-10">
          <motion.div
            key={statusText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-mono text-[10px] tracking-[0.2em] text-cyan-400/80 uppercase"
          >
            {statusText}
          </motion.div>
        </div>

        {/* Dynamic status nodes bar */}
        <div className="flex items-center gap-2 mt-6">
          <div className={`w-2 h-2 rounded-full transition-all duration-500 ${phase === 'fade-in' ? 'bg-amber-400 animate-ping' : 'bg-neutral-800'}`} />
          <div className="w-10 h-[1.5px] bg-neutral-800" />
          <div className={`w-2 h-2 rounded-full transition-all duration-500 ${phase === 'warping' ? 'bg-cyan-400 animate-spin' : 'bg-neutral-800'}`} />
          <div className="w-10 h-[1.5px] bg-neutral-800" />
          <div className={`w-2 h-2 rounded-full transition-all duration-500 ${phase === 'arrival' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-neutral-800'}`} />
        </div>
      </div>

      {/* Extreme flashing timeline flash at arrival */}
      <AnimatePresence>
        {phase === 'arrival' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, times: [0, 0.2, 1] }}
            className="absolute inset-0 bg-white z-50 pointer-events-none flex items-center justify-center mix-blend-difference"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
