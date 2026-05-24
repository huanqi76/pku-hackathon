import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

interface Props {
  key?: string;
  onBack: () => void;
  imageSrc: string;
}

export function MemoryView({ onBack, imageSrc }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/80 backdrop-blur-md"
    >
      <button
        onClick={onBack}
        className="absolute top-8 left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-2 group z-50 cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        <span className="font-sans text-sm tracking-widest uppercase">返回舱</span>
      </button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative max-w-4xl w-full aspect-video rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-white/5"
      >
        <img
          src={imageSrc}
          alt="Earth Memory"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-8 text-neutral-300 font-display tracking-[0.2em] text-sm max-w-2xl text-center leading-loose"
      >
        二〇三八年七月十二日・中央公园的午后<br/> 
        那天的风很暖。那时，我们都觉得有些事情是永恒的。
      </motion.p>
    </motion.div>
  );
}
