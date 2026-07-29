import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useGetDhikrCounts, useIncrementDhikr, getGetDhikrCountsQueryKey, getGetStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { DHIKR_TYPES } from "@/data/islamic-content";
import { toArabicNumerals } from "@/lib/utils";
import { BellRing, BellOff, Vibrate, VibrateOff } from "lucide-react";

const GOLD = "linear-gradient(135deg, #B8860B 0%, #C9A227 50%, #8B6914 100%)";

export function TasbeehSection() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibEnabled,   setVibEnabled]   = useState(true);

  const { data: globalCounts } = useGetDhikrCounts();
  const incrementDhikr         = useIncrementDhikr();
  const queryClient            = useQueryClient();

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx  = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start(); osc.stop(ctx.currentTime + 0.12);
    } catch { /* ignore */ }
  }, [soundEnabled]);

  const triggerVibrate = useCallback(() => {
    if (!vibEnabled || !navigator.vibrate) return;
    navigator.vibrate(40);
  }, [vibEnabled]);

  return (
    <section className="py-28 px-4 relative z-10 bg-[#FEFCF5]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif mb-4"
            style={{ background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            السبحة الرقمية
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
            <br />
            اجعل كل تسبيحة صدقة جارية تزيد في حسناته.
          </p>

          {/* Sound / vibrate toggles */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {[
              { on: soundEnabled, toggle: () => setSoundEnabled(v => !v), on_icon: BellRing,  off_icon: BellOff,     title: "الصوت" },
              { on: vibEnabled,   toggle: () => setVibEnabled(v => !v),   on_icon: Vibrate,    off_icon: VibrateOff,  title: "الاهتزاز" },
            ].map(btn => (
              <button
                key={btn.title}
                onClick={btn.toggle}
                title={btn.title}
                className="p-3 rounded-full border transition-all"
                style={btn.on
                  ? { background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.3)", color: "#B8860B" }
                  : { background: "transparent", border: "1px solid #E5E7EB", color: "#9CA3AF" }}
              >
                {btn.on ? <btn.on_icon className="w-5 h-5" /> : <btn.off_icon className="w-5 h-5" />}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DHIKR_TYPES.map((dhikr, i) => (
            <TasbeehCard
              key={dhikr.key}
              dhikr={dhikr}
              globalCount={globalCounts?.[dhikr.key as keyof typeof globalCounts] || 0}
              onTap={() => {
                playSound(); triggerVibrate();
                incrementDhikr.mutate({ data: { dhikrKey: dhikr.key } }, {
                  onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: getGetDhikrCountsQueryKey() });
                    queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
                  },
                });
              }}
              delay={i * 0.08}
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
    const date  = localStorage.getItem("dhikr_date");
    const today = new Date().toDateString();
    if (date !== today) { localStorage.setItem("dhikr_date", today); return 0; }
    return saved ? parseInt(saved) : 0;
  });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newCount = localCount + 1;
    setLocalCount(newCount);
    localStorage.setItem(`dhikr_${dhikr.key}_daily`, newCount.toString());
    onTap();
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const r = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top };
      setRipples(p => [...p, r]);
      setTimeout(() => setRipples(p => p.filter(x => x.id !== r.id)), 800);
    }
  };

  return (
    <motion.button
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className="tasbeeh-btn w-full text-right rounded-2xl p-6 group cursor-pointer flex flex-col justify-between min-h-[160px] transition-all hover:shadow-lg"
      style={{
        background: "rgba(255,253,245,0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(201,162,39,0.15)",
        boxShadow: "0 2px 12px rgba(201,162,39,0.05)",
      }}
    >
      {ripples.map(r => (
        <span key={r.id} className="tasbeeh-ripple w-10 h-10" style={{ left: r.x - 20, top: r.y - 20 }} />
      ))}

      <div className="relative z-10 flex justify-between items-start mb-4">
        <h3 className="text-xl md:text-2xl font-serif text-gray-800 group-hover:text-[#B8860B] transition-colors leading-tight max-w-[80%]">
          {dhikr.ar}
        </h3>
        <span className="text-sm font-sans text-gray-400 arabic-numerals">اليوم: {toArabicNumerals(localCount)}</span>
      </div>

      <div className="relative z-10 flex justify-between items-end w-full">
        <div className="text-xs text-gray-400 flex flex-col">
          <span>العدد الكلي</span>
          <span className="text-xl font-bold arabic-numerals" style={{ color: "#B8860B" }}>
            {toArabicNumerals(globalCount + localCount)}
          </span>
        </div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
          style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.25)" }}>
          <span className="font-bold text-xl text-[#C9A227]">+</span>
        </div>
      </div>
    </motion.button>
  );
}
