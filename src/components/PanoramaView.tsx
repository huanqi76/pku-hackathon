import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

interface Props {
  key?: string;
  onBack: () => void;
  imageSrc: string;
}

export function PanoramaView({ onBack, imageSrc }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black overflow-hidden flex flex-col items-center justify-center"
    >
      <button
        onClick={onBack}
        className="absolute top-8 left-8 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors flex items-center gap-2 group z-50 border border-white/10 cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        <span className="font-sans text-sm tracking-widest uppercase">返回舱</span>
      </button>

      {/* Panning Container */}
      <div className="absolute inset-x-0 inset-y-16 overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "linear"
          }}
          className="flex h-full w-[200vw]"
        >
          <img
            src={imageSrc}
            alt="Past Home Panorama"
            className="w-1/2 h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <img
            src={imageSrc}
            alt="Past Home Panorama"
            className="w-1/2 h-full object-cover scale-x-[-1]" 
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]" />
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none z-30">
         <p className="text-white/50 font-display tracking-[0.3em] text-[10px] uppercase whitespace-nowrap">空间全景重建：昔日西四区落日余晖</p>
      </div>
    </motion.div>
  );
}
