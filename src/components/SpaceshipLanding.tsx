import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, MouseEvent } from 'react';
import { Terminal, Radio } from 'lucide-react';

interface Props {
  onZoomComplete: () => void;
}

interface ChatMessage {
  sender: 'station' | 'astronaut';
  text: string;
}

export function SpaceshipLanding({ onZoomComplete }: Props) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0); 
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [state, setState] = useState<'intro_fly_in' | 'chatting' | 'zooming'>('intro_fly_in');

  const stationMessages = [
    "在月球的第883天, 你想念地球吗?",
    "地球也想念你"
  ];

  const replyOptions = [
    [
      { text: "是的, 我一直记着", filler: "" },
      { text: "这无垠的宇宙实在太安静了", filler: "" }
    ]
  ];

  // Types messages slowly (105ms per character) for high cinematique atmospheric effect
  useEffect(() => {
    let active = true;
    const targetText = stationMessages[currentStep];
    if (!targetText) return;

    setDisplayText("");
    setIsTyping(true);
    setShowReplies(false);
    let index = 0;

    const interval = setInterval(() => {
      if (!active) return;
      if (index < targetText.length) {
        setDisplayText(targetText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        // Show reply options if there are more messages
        if (currentStep < stationMessages.length - 1) {
          setShowReplies(true);
        } else {
          setShowReplies(false);
        }
      }
    }, 105); 

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [currentStep]);

  const handleReplySelect = (selectedText: string) => {
    if (isTyping) return;
    
    // Add current message and astronaut's response to the ledger
    setChatHistory(prev => [
      ...prev, 
      { sender: 'station', text: stationMessages[currentStep] },
      { sender: 'astronaut', text: selectedText }
    ]);
    
    // Step forward
    setCurrentStep(prev => prev + 1);
  };

  const handleZoomClick = (e: MouseEvent) => {
    e.stopPropagation();
    setState('zooming');
    setTimeout(() => {
      onZoomComplete();
    }, 2200); // 2.2 seconds hyper drive zoom action
  };

  const spaceshipEarthImage = '/src/assets/images/spaceship-earth-window.png';
  const isLastMessage = currentStep === stationMessages.length - 1;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Absolute Cinematic Space Window View */}
      <motion.div
        animate={
          state === 'zooming'
            ? {
                scale: [1, 1.1, 18],
                rotate: [0, -2, 5, -10],
                filter: ['blur(0px)', 'blur(3px)', 'blur(40px)'],
                opacity: [1, 1, 0]
              }
            : {
                scale: [1.02, 1, 1.02],
                rotate: [0, 0.2, -0.2, 0]
              }
        }
        transition={
          state === 'zooming'
            ? { duration: 2.2, ease: [0.7, 0, 0.3, 1] }
            : { duration: 15, repeat: Infinity, ease: "easeInOut" }
        }
        className="absolute inset-0 w-full h-full"
      >
        <img
          src={spaceshipEarthImage}
          alt="Planet Earth from spaceship window"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-neutral-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_95%)]" />
      </motion.div>

      {/* Cockpit HUD Elements Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-10 select-none z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 bg-black/45 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="font-mono text-[10px] tracking-widest text-neutral-300 uppercase">
              基站连接：良好
            </div>
          </div>
          <div className="font-mono text-[10px] tracking-wider text-right text-neutral-400">
            <div>空间坐标 ID: CR-3000</div>
            <div>系统纪元: 883.10.05</div>
          </div>
        </div>

        {/* Circular Spaceship Lens frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[85vw] h-[85vw] max-w-[85vh] max-h-[85vh] border border-white/5 rounded-full relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[4px] border border-dashed border-white/10 rounded-full animate-pulse"
            />
            <div className="absolute w-8 h-[1px] bg-white/20 left-4" />
            <div className="absolute w-8 h-[1px] bg-white/20 right-4" />
            <div className="absolute h-8 w-[1px] bg-white/20 top-4" />
            <div className="absolute h-8 w-[1px] bg-white/20 bottom-4" />
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="font-mono text-[10px] text-neutral-500 leading-relaxed hidden sm:block">
            <div>大气循环: 100%</div>
            <div>重力拟真: 0.16G</div>
          </div>
          <div className="font-mono text-[10px] text-neutral-400 tracking-widest">
          </div>
        </div>
      </div>

      {/* Sliding-in Chat interface with beautiful 3D float and glow properties */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 max-w-lg w-full">
        <motion.div
          initial={{ x: '-120vw', opacity: 0, rotate: -3 }}
          animate={{ 
            x: 0, 
            opacity: state === 'zooming' ? 0 : 1, 
            rotate: 0,
            y: [0, -8, 0] // Dynamic floating
          }}
          transition={{ 
            x: { type: 'spring', damping: 22, stiffness: 60 },
            y: { duration: 6, ease: 'easeInOut', repeat: Infinity }
          }}
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          className="w-full bg-neutral-950/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_80px_rgba(16,185,129,0.05)] relative overflow-hidden"
        >
          {/* Neon cosmic grid backdrop details */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_60%)]" />

          {/* Chat Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-emerald-400">
              <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="font-display text-xs tracking-[0.2em] uppercase font-semibold"></span>
            </div>
            <div className="font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              信道加密
            </div>
          </div>

          {/* Dialogue Logs */}
          <div className="space-y-4 max-h-[200px] overflow-y-auto mb-6 pr-1 scrollbar-thin">
            {chatHistory.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex flex-col ${item.sender === 'station' ? 'items-start' : 'items-end'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  item.sender === 'station' 
                    ? 'bg-white/5 text-neutral-300 border border-white/10 rounded-tl-none' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 rounded-tr-none font-medium'
                }`}>
                  {item.text}
                </div>
              </motion.div>
            ))}

            {/* Current Active Station Message */}
            <div className="flex flex-col items-start">
              <div className="max-w-[85%] bg-white/5 text-neutral-100 border border-white/10 rounded-2xl rounded-tl-none px-4 py-2.5 text-base font-display flex items-center leading-relaxed">
                <span>{displayText}</span>
                {isTyping && <span className="inline-block w-2.5 h-4 bg-emerald-400 ml-1.5 animate-pulse" />}
              </div>
            </div>
          </div>

          {/* User replies mapping */}
          <AnimatePresence mode="wait">
            {showReplies && !isTyping && replyOptions[currentStep] && (
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-2 pt-2 border-t border-white/10"
              >
                <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase mb-1 block"></span>
                <div className="grid grid-cols-1 gap-2">
                  {replyOptions[currentStep].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleReplySelect(opt.text)}
                      className="w-full text-left p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-400/30 transition-all text-neutral-300 hover:text-emerald-300 text-xs font-display flex items-center justify-between group cursor-pointer"
                    >
                      <span>{opt.text}</span>
                      <span className="font-mono text-[9px] text-neutral-500 group-hover:text-emerald-400 uppercase tracking-widest">{opt.filler}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Extremely Cinematic highly detailed scale-expansion button for opening capsule */}
          {isLastMessage && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 90, damping: 14 }}
              className="pt-6 border-t border-white/10 relative"
            >
              {/* Pulsing sub-space radar rings radiating outward continuously from behind the button */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                <motion.div
                  animate={{ scale: [0.95, 1.45], opacity: [0.8, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute w-[80%] h-[70%] rounded-2xl border-2 border-emerald-400/50 filter blur-[4px]"
                />
                <motion.div
                  animate={{ scale: [0.95, 1.75], opacity: [0.5, 0] }}
                  transition={{ duration: 2.2, delay: 0.8, repeat: Infinity, ease: "easeOut" }}
                  className="absolute w-[80%] h-[70%] rounded-2xl border-2 border-cyan-400/30 filter blur-[8px]"
                />
              </div>

              <div className="relative group overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)] hover:shadow-[0_0_70px_rgba(34,211,238,0.4)] transition-shadow duration-500">
                {/* Background breathing plasma aura */}
                <motion.span 
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 h-full w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 blur-xl transition-opacity duration-1000" 
                />
                
                <button
                  onClick={handleZoomClick}
                  className="w-full py-5 px-6 rounded-2xl bg-white text-black hover:bg-emerald-50 font-display text-sm font-bold tracking-[0.55em] uppercase relative overflow-hidden transition-all duration-300 transform active:scale-95 shadow-[0_4px_30px_rgba(255,255,255,0.2)] cursor-pointer select-none flex items-center justify-center gap-3 group"
                >
                  {/* Glowing neon sidebars on button focus */}
                  <span className="absolute left-0 inset-y-0 w-[5px] bg-gradient-to-b from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute right-0 inset-y-0 w-[5px] bg-gradient-to-b from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Subtle inner reflective glossy sliding shine */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] skew-x-[-28deg]" />
                  
                  <span className="relative z-10 text-neutral-950 flex items-center gap-2 group-hover:scale-[1.03] transition-transform duration-300">
                    开启时空胶囊
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {state === 'zooming' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [1, 2.5, 4] }}
          transition={{ duration: 2.2, times: [0, 0.4, 0.8, 1], ease: "easeInOut" }}
          className="absolute inset-0 z-50 bg-white mix-blend-screen flex items-center justify-center"
        >
          {/* Dynamic ring explosion */}
          <div className="w-96 h-96 border-[4px] border-emerald-400 rounded-full blur-[2px] animate-ping" />
        </motion.div>
      )}
    </div>
  );
}
