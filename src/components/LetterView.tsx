import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

interface Props {
  key?: string;
  onBack: () => void;
}

export function LetterView({ onBack }: Props) {
  const vintageChildLetterImg = '/src/assets/images/vintage-child-letter.png';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-lg overflow-y-auto p-4 z-50 select-none"
    >
      {/* Return button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 p-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all flex items-center gap-2 group z-50 border border-white/10 cursor-pointer shadow-lg active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-sans text-xs tracking-[0.2em] uppercase">返回舱</span>
      </button>

      {/* Cinematic Ambient Glare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container - Styled like a floating spatial desk */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, type: 'spring', damping: 18 }}
        className="relative max-w-2xl w-full bg-neutral-900/80 border border-white/10 rounded-[32px] p-6 md:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.8),inset_0_1px_3px_rgba(255,255,255,0.1)] flex flex-col items-center overflow-hidden gap-8"
      >
        {/* Soft glowing margins */}
        <div className="absolute inset-0 pointer-events-none border border-amber-500/10 rounded-[32px]" />

        {/* Outer view containing child photo and parchment letter */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
          
          {/* Childhood Photo section with polaroid/vintage glass style */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group bg-neutral-950 p-4 rounded-2xl border border-white/10 shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
              <div className="overflow-hidden rounded-lg aspect-square w-full max-w-[220px] relative">
                <img
                  src={vintageChildLetterImg}
                  alt="Childhood photo looking at the night sky"
                  className="w-full h-full object-cover grayscale brightness-90 contrast-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-amber-900/10 mix-blend-color" />
                <div className="absolute inset-x-0 bottom-0 bg-neutral-950/40 p-2 text-center">
                  <span className="font-mono text-[9px] tracking-widest text-neutral-400">二〇二一・盛夏</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="font-display text-[10px] tracking-widest text-neutral-500 uppercase block">写给未来的我</span>
              </div>
            </div>
          </div>

          {/* Aged Parchment / Sheepskin paper container */}
          <div className="relative bg-[#f1ecd8] text-[#362f27] rounded-2xl p-6 md:p-8 border border-amber-900/10 shadow-[0_15px_40px_rgba(0,0,0,0.3)] min-h-[300px] flex flex-col justify-between font-serif relative overflow-hidden ring-4 ring-[#f1ecd8]/35">
            {/* Soft parchment grain details */}
            <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/5 via-transparent to-amber-950/10 pointer-events-none" />

            <div>
              {/* Header */}
              <div className="border-b border-amber-900/15 pb-3 mb-4 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-amber-900/70 uppercase">DEAR FUTURE ME</span>
                <span className="text-xs text-amber-900/60 font-medium">来自八岁的你</span>
              </div>

              {/* Letter contents */}
              <div className="space-y-4 text-sm leading-relaxed tracking-wide font-medium">
                <p>大人们说，天上的月亮很冷清，那里什么都没有。</p>
                <p>但我知道，月亮上一定堆满了所有人的美梦，所以它才会在每个晚上闪闪发光。</p>
                <p>二十年后的我，你现在是不是已经如愿以偿，站在这片银白色的沙砾上了呢？</p>
                <p>如果是的话，请代我向苍茫的宇宙打个招呼吧。</p>
                <p>不要害怕漫长的黑夜，因为我会一直在地球上，看着你的光芒。</p>
              </div>
            </div>

            {/* Signature */}
            <div className="border-t border-amber-900/15 pt-3 mt-4 text-right">
              <span className="text-xs tracking-widest font-semibold text-amber-900/80">八岁的自己 笔</span>
            </div>
          </div>
        </div>

        {/* Ambient message explaining connection */}
        <p className="text-[10px] font-mono tracking-widest text-[#10b981]/80 bg-[#10b981]/5 px-4 py-2 rounded-full border border-[#10b981]/15 leading-relaxed text-center">
          「量子纠缠信笺建立在二十年前的电磁波长之上。跨越漫长星系，温暖依旧。」
        </p>

      </motion.div>
    </motion.div>
  );
}
