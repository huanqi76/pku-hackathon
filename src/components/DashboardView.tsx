import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryItem, UserProfile } from '../types';
import { Upload, X, MapPin, Compass, Eye, Heart, MessageSquare, Terminal, CloudLightning, Sparkles, Send } from 'lucide-react';

export function DashboardView() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Initial seeded database of multi-user memories
  const [memories, setMemories] = useState<MemoryItem[]>([
    {
      id: 'clara_glacier',
      title: '格陵兰极地古老冰盖',
      description: '晨光穿透冰层折射出冷冽的翠绿，巨大的冰盖在深海的脉动下分裂跌落。那是关于纯粹与宏大最初的感知。',
      image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200',
      userName: 'Dr. Clara Wu',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      date: 'ERA 2035 // AUTUMN',
      location: 'MARS ODYSSEY II // ALPHA HUB'
    },
    {
      id: 'david_snow',
      title: '勃朗峰雪山朝霞',
      description: '在雪山小木屋里推开窗，捧着刚研磨的手冲黑咖啡，空气清冷甜润。那时，阿尔卑斯的雪还没融化。',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200',
      userName: 'Sgt. David Vance',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      date: 'ERA 2038 // WINTER',
      location: 'SATURN RING OUTPOST // SIGMA SEC'
    },
    {
      id: 'marcus_jiangnan',
      title: '江南青石暮雨',
      description: '雨丝绵绵敲打着乌篷船，青石板路反射着两旁摇曳的红色灯笼。那份慵懒的潮湿，只回荡在午夜梦回。',
      image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200',
      userName: 'Marcus Lin',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
      date: 'ERA 2036 // SUMMER',
      location: 'TITAN HYDRO-PORT // DELTA STATION'
    },
    {
      id: 'alicia_desert',
      title: '撒哈拉金色风暴',
      description: '越野车扬起的黄沙在天地间飞舞，落日如熔金般涂抹在起伏的大漠背脊。风沙呼啸，是这颗星球狂野的一面。',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5edd0ea9?q=80&w=1200',
      userName: 'Alicia Croft',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
      date: 'ERA 2037 // SPRING',
      location: 'ASTEROID MINING // CELL-04'
    }
  ]);

  // Current active user details
  const myProfile: UserProfile = {
    name: 'Operator 883 (You)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    location: 'LUNAR SECTOR // CRATER-03',
    station: '月球深空勘测基站',
    badge: 'SENIOR SENSORY DISPATCHER'
  };

  // UI state controllers
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [likedMemories, setLikedMemories] = useState<string[]>([]);
  const [comments, setComments] = useState<Record<string, string[]>>({});
  const [newCommentInput, setNewCommentInput] = useState('');

  // Memory uploading form state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadLocation, setUploadLocation] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadedBaseImg, setUploadedBaseImg] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Handle Drag Events
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
       return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedBaseImg(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const submitNewMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadDesc || !uploadedBaseImg) return;

    const newMemoryItem: MemoryItem = {
      id: `custom_${Date.now()}`,
      title: uploadTitle,
      description: uploadDesc,
      image: uploadedBaseImg,
      userName: myProfile.name,
      userAvatar: myProfile.avatar,
      date: `ERA ${new Date().getFullYear()} // TIMELOCK`,
      location: myProfile.location
    };

    setMemories((prev) => [newMemoryItem, ...prev]);

    // Reset Form
    setUploadTitle('');
    setUploadLocation('');
    setUploadDesc('');
    setUploadedBaseImg(null);
    setIsUploading(false);
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMemories((prev) => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const handleSendComment = () => {
    if (!selectedMemory || !newCommentInput.trim()) return;
    const memoryId = selectedMemory.id;
    setComments((prev) => ({
      ...prev,
      [memoryId]: [...(prev[memoryId] || []), `${myProfile.name}: ${newCommentInput}`]
    }));
    setNewCommentInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-start overflow-y-auto"
    >
      
      {/* HUD Header Bar */}
      <header className="w-full max-w-7xl px-6 py-5 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="font-mono text-[9px] text-emerald-400 tracking-[0.2em] font-bold uppercase">QUANTUM SYNAPTIC EXCHANGE v1.9</span>
          </div>
          <h1 className="text-xl md:text-2xl font-light tracking-widest font-display text-white mt-1">深空记忆同步载体</h1>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 bg-neutral-900/60 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur">
          <img
            src={myProfile.avatar}
            alt="My Avatar"
            className="w-8 h-8 rounded-full border border-emerald-500/30 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="text-left font-mono">
            <div className="text-[10px] font-bold tracking-wider text-neutral-200">{myProfile.name}</div>
            <div className="text-[8px] text-emerald-400/80 tracking-widest">{myProfile.badge}</div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="w-full max-w-7xl px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 z-10">
        
        {/* Left column: Quick Actions & Stats panel */}
        <section className="space-y-6 flex flex-col">
          
          {/* Quick Stats Panel */}
          <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 filter blur-2xl" />
            
            <h3 className="font-mono text-[10px] text-emerald-400 tracking-[0.3em] uppercase mb-4">基站连接状态 // HUD</h3>
            
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-500">地理坐标</span>
                <span>LUNAR CRATER-03</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-500">脑波同步信道</span>
                <span className="text-emerald-400 font-semibold">100% SECURE</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-500">已连结先驱者</span>
                <span>{memories.length + 1} 人</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">感官恢复进度</span>
                <span>COMPLETE</span>
              </div>
            </div>
          </div>

          {/* Upload Portal / Button Panel */}
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden flex-1 flex flex-col justify-between min-h-[220px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
            
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Upload className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-light tracking-widest text-white uppercase">分享感官印记</h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                将你在地球封存的光影记忆、声音与余温上传到星网，与无底浩瀚中的其他先驱者产生精神共震。
              </p>
            </div>

            <button
              onClick={() => setIsUploading(true)}
              className="mt-6 w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono tracking-[0.3em] uppercase transition-all shadow-[0_4px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              启动上传协议 ➔
            </button>
          </div>
        </section>

        {/* Right 2/3 Column: Pioneers Memories Feed */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-mono tracking-[0.25em] text-neutral-400 uppercase">先驱者群组记忆网络</h2>
            </div>
            <span className="font-mono text-[9px] text-neutral-500">NEWEST RELEASES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memories.map((mem) => {
              const hasLiked = likedMemories.includes(mem.id);
              return (
                <motion.div
                  key={mem.id}
                  layoutId={mem.id}
                  onClick={() => setSelectedMemory(mem)}
                  className="bg-neutral-900/30 border border-white/5 hover:border-emerald-500/20 rounded-[28px] overflow-hidden group cursor-pointer transition-all duration-300 shadow-xl"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={mem.image}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Date / Location badge inside card */}
                    <div className="absolute bottom-3 left-3 bg-neutral-950/85 backdrop-blur-md py-1 px-2.5 rounded-lg border border-white/5 font-mono text-[8px] text-neutral-300">
                      {mem.date}
                    </div>
                  </div>

                  <div className="p-5 space-y-3.5">
                    {/* Author profile row */}
                    <div className="flex items-center gap-2">
                      <img
                        src={mem.userAvatar}
                        alt={mem.userName}
                        className="w-5 h-5 rounded-full object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-mono text-[9px] text-neutral-400 tracking-wider">
                        {mem.userName} • {mem.location}
                      </span>
                    </div>

                    <h3 className="text-base text-white tracking-wide font-light group-hover:text-emerald-400 transition-colors">
                      {mem.title}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-light">
                      {mem.description}
                    </p>

                    <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                      <button
                        onClick={(e) => handleLike(mem.id, e)}
                        className={`flex items-center gap-1.5 font-mono text-[9px] tracking-wider transition-colors cursor-pointer ${
                          hasLiked ? 'text-rose-400' : 'text-neutral-500 hover:text-white'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5" fill={hasLiked ? 'currentColor' : 'none'} />
                        <span>同步度 {hasLiked ? 142 : 141}</span>
                      </button>

                      <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-neutral-500">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>评论 ({(comments[mem.id] || []).length})</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      {/* DYNAMIC BACKDROP HUD ELEMENTS */}
      <div className="fixed bottom-4 left-4 font-mono text-[8px] text-neutral-600 uppercase tracking-widest hidden sm:block">
        STEL CLS GRID L-03 // QUANTUM DECRYPTOR 100% COMPATIBLE
      </div>

      {/* 4. CHRONO UPLINK MODAL (UPLOAD DIALOG) */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-neutral-900 border border-emerald-500/30 rounded-3xl max-w-xl w-full p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsUploading(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-6">
                <Terminal className="w-5 h-5 text-emerald-400 animate-pulse" />
                <h3 className="font-display text-lg tracking-widest uppercase text-white font-light">分享你的地球记忆</h3>
              </div>

              <form onSubmit={submitNewMemory} className="space-y-6">
                
                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px] ${
                    uploadedBaseImg 
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : isDragActive
                      ? 'border-emerald-400 bg-emerald-500/5'
                      : 'border-white/15 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {uploadedBaseImg ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden max-h-[150px]">
                      <img src={uploadedBaseImg} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs font-mono text-emerald-400">
                        图片加载就绪 ✅ 点击重新选择
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
                      <div className="text-xs font-mono text-neutral-200">拖曳文件或点击上传你脑中的地球印记</div>
                      <div className="text-[10px] text-neutral-500 font-mono text-center">SUPPORTED: PNG, JPG // MAX SCALE: 10MB</div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 tracking-wider uppercase mb-1">记忆名称</label>
                    <input
                      type="text"
                      required
                      placeholder="例如：北京夏日老胡同的阴凉"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 tracking-wider uppercase mb-1">探索故事</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="写下你最想念的关于这幕场景的温度、微风或者人们的交谈声..."
                      value={uploadDesc}
                      onChange={(e) => setUploadDesc(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsUploading(false)}
                    className="flex-1 py-3 px-6 rounded-xl border border-white/10 hover:bg-white/5 text-neutral-400 hover:text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadTitle || !uploadDesc || !uploadedBaseImg}
                    className="flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    发射同步协议 ➔
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. COGNITIVE DETAIL LIGHTROOM MODAL PLAYER */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              layoutId={selectedMemory.id}
              className="bg-neutral-900 border border-white/10 rounded-3xl max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 relative overflow-hidden shadow-2xl max-h-[95vh]"
            >
              {/* Image Preview Side */}
              <div className="relative aspect-[4/3] md:aspect-auto md:h-full bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedMemory.image}
                  alt={selectedMemory.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Scanline filters */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 bg-black/85 border border-white/10 px-3 py-1.5 rounded-lg text-left">
                  <span className="block text-[8px] font-mono text-emerald-400 uppercase tracking-widest leading-none mb-0.5">LOCATION COORD // UNLOCK</span>
                  <span className="font-mono text-[9px] text-neutral-200 font-semibold uppercase">{selectedMemory.location}</span>
                </div>
              </div>

              {/* Data Commentary Side */}
              <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-neutral-950/70 border-l border-white/5">
                
                {/* Main Content */}
                <div className="space-y-6 overflow-y-auto flex-1 max-h-[60vh] md:max-h-[50vh] pr-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={selectedMemory.userAvatar}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{selectedMemory.userName}</span>
                    </div>
                    
                    <span className="font-mono text-[9px] text-neutral-500 uppercase">{selectedMemory.date}</span>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-xl md:text-2xl text-white font-light tracking-wide font-display">{selectedMemory.title}</h2>
                    <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-light font-sans">{selectedMemory.description}</p>
                  </div>

                  {/* Comments section */}
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <span className="block text-[10px] font-mono text-neutral-500 tracking-wider uppercase">共鸣日志 ({comments[selectedMemory.id]?.length || 0})</span>
                    
                    {/* Comments list */}
                    <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                      {(comments[selectedMemory.id] || []).length === 0 ? (
                        <p className="text-[11px] text-neutral-600 font-mono italic">等待其他发射站写入感官心得...</p>
                      ) : (
                        comments[selectedMemory.id].map((comment, index) => (
                          <div key={index} className="bg-neutral-900/60 p-2.5 rounded-xl border border-white/5 flex items-start text-xs leading-relaxed font-sans text-neutral-300">
                            {comment}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls & Interactive Chat inputs */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                  
                  {/* Write comment */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="写入你的共鸣感官..."
                      value={newCommentInput}
                      onChange={(e) => setNewCommentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment();
                      }}
                      className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    />
                    <button
                      onClick={handleSendComment}
                      className="p-3 bg-emerald-500 text-black hover:bg-emerald-400 rounded-xl cursor-pointer flex items-center justify-center transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setSelectedMemory(null)}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer text-center"
                  >
                    返回同步舱
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
