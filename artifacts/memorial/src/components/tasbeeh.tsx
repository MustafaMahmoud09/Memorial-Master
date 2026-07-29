import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useGetDhikrCounts, useIncrementDhikr, getGetDhikrCountsQueryKey, getGetStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { DHIKR_TYPES } from "@/data/islamic-content";
import { toArabicNumerals } from "@/lib/utils";
import { BellRing, BellOff, Vibrate, VibrateOff } from "lucide-react";

export function TasbeehSection() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibEnabled, setVibEnabled] = useState(true);
  
  const { data: globalCounts } = useGetDhikrCounts();
  const incrementDhikr = useIncrementDhikr();
  const queryClient = useQueryClient();

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Audio context might be blocked
    }
  }, [soundEnabled]);

  const triggerVibrate = useCallback(() => {
    if (!vibEnabled || !navigator.vibrate) return;
    navigator.vibrate(50);
  }, [vibEnabled]);

  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground gold-gradient-text mb-4">السبحة الرقمية</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"<br/>
            اجعل كل تسبيحة صدقة جارية تزيد في حسناته.
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-8">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-full border transition-all ${soundEnabled ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-transparent border-border text-muted-foreground'}`}
              title="الصوت"
            >
              {soundEnabled ? <BellRing className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setVibEnabled(!vibEnabled)}
              className={`p-3 rounded-full border transition-all ${vibEnabled ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-transparent border-border text-muted-foreground'}`}
              title="الاهتزاز"
            >
              {vibEnabled ? <Vibrate className="w-5 h-5" /> : <VibrateOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DHIKR_TYPES.map((dhikr, i) => (
            <TasbeehCard 
              key={dhikr.key} 
              dhikr={dhikr} 
              globalCount={globalCounts?.[dhikr.key as keyof typeof globalCounts] || 0}
              onTap={() => {
                playSound();
                triggerVibrate();
                incrementDhikr.mutate({ data: { dhikrKey: dhikr.key } }, {
                  onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: getGetDhikrCountsQueryKey() });
                    queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
                  }
                });
              }}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TasbeehCard({ dhikr, globalCount, onTap, delay }: any) {
  const [localCount, setLocalCount] = useState(() => {
    const saved = localStorage.getItem(`dhikr_${dhikr.key}_daily`);
    const date = localStorage.getItem(`dhikr_date`);
    const today = new Date().toDateString();
    if (date !== today) {
      localStorage.setItem(`dhikr_date`, today);
      return 0;
    }
    return saved ? parseInt(saved) : 0;
  });

  const [ripples, setRipples] = useState<{id: number, x: number, y: number}[]>([]);
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newCount = localCount + 1;
    setLocalCount(newCount);
    localStorage.setItem(`dhikr_${dhikr.key}_daily`, newCount.toString());
    onTap();

    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 800);
    }
  };

  return (
    <motion.button
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="tasbeeh-btn w-full text-right glass-panel rounded-2xl p-6 group cursor-pointer border border-border/50 hover:border-primary/50 transition-colors flex flex-col justify-between min-h-[160px]"
    >
      {ripples.map(r => (
        <span 
          key={r.id} 
          className="tasbeeh-ripple w-10 h-10" 
          style={{ left: r.x - 20, top: r.y - 20 }} 
        />
      ))}
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        <h3 className="text-xl md:text-2xl font-serif text-foreground group-hover:text-primary transition-colors leading-tight max-w-[80%]">
          {dhikr.ar}
        </h3>
        <span className="text-sm font-sans text-muted-foreground arabic-numerals">اليوم: {toArabicNumerals(localCount)}</span>
      </div>

      <div className="relative z-10 flex justify-between items-end w-full">
        <div className="text-xs text-muted-foreground flex flex-col">
          <span>العدد الكلي</span>
          <span className="text-lg text-primary/80 font-bold arabic-numerals">{toArabicNumerals(globalCount + localCount)}</span>
        </div>
        
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
          <span className="text-primary font-bold text-lg">+</span>
        </div>
      </div>
    </motion.button>
  );
}
