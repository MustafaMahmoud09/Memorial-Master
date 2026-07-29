import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import portraitSrc from "@assets/٢٠٢٦٠٧٢٩_١٥٢٠١٢_1785330984595.png";
import { useTimeSince } from "@/hooks/use-time";
import { toArabicNumerals } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

/* ─────────────────────────────────────────────
   Colours / tokens
───────────────────────────────────────────── */
const GOLD_GRAD = "linear-gradient(135deg, #B8860B 0%, #C9A227 50%, #8B6914 100%)";
const GLASS_BG  = "rgba(255, 253, 245, 0.72)";
const GLASS_BORDER = "1px solid rgba(201,162,39,0.22)";
const GLASS_SHADOW = "0 8px 32px rgba(201,162,39,0.10), 0 2px 8px rgba(0,0,0,0.06)";

/* ─────────────────────────────────────────────
   Islamic geometric SVG pattern (low-opacity)
───────────────────────────────────────────── */
function IslamicPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.028 }}
    >
      <defs>
        <pattern id="islamic" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* 8-pointed star motif */}
          <polygon
            points="40,4 46,28 68,20 54,40 68,60 46,52 40,76 34,52 12,60 26,40 12,20 34,28"
            fill="none" stroke="#B8860B" strokeWidth="0.8"
          />
          <circle cx="40" cy="40" r="12" fill="none" stroke="#B8860B" strokeWidth="0.6" />
          <circle cx="0"  cy="0"  r="6"  fill="none" stroke="#B8860B" strokeWidth="0.5" />
          <circle cx="80" cy="0"  r="6"  fill="none" stroke="#B8860B" strokeWidth="0.5" />
          <circle cx="0"  cy="80" r="6"  fill="none" stroke="#B8860B" strokeWidth="0.5" />
          <circle cx="80" cy="80" r="6"  fill="none" stroke="#B8860B" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic)" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Live clocks / dates
───────────────────────────────────────────── */
function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function useHijriLive() {
  const now = useLiveClock();
  try {
    return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      day: "numeric", month: "long", year: "numeric",
    }).format(now);
  } catch {
    return "—";
  }
}

const PASSING_DATE = new Date("2022-03-11T00:00:00");
const PASSING_GREGORIAN = "١١ مارس ٢٠٢٢";
const PASSING_HIJRI = (() => {
  try {
    return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      day: "numeric", month: "long", year: "numeric",
    }).format(PASSING_DATE);
  } catch {
    return "٨ شعبان ١٤٤٣";
  }
})();

/* ─────────────────────────────────────────────
   Prayer times hook (aladhan.com)
───────────────────────────────────────────── */
type PrayerTimes = Record<string, string>;
const PRAYER_NAMES: [string, string][] = [
  ["Fajr",    "الفجر"],
  ["Dhuhr",   "الظهر"],
  ["Asr",     "العصر"],
  ["Maghrib", "المغرب"],
  ["Isha",    "العشاء"],
];

function useNextPrayer() {
  const [info, setInfo] = useState<{ name: string; remaining: string } | null>(null);
  const timesRef = useRef<PrayerTimes | null>(null);

  useEffect(() => {
    async function fetchTimes(lat: number, lng: number) {
      try {
        const ts  = Math.floor(Date.now() / 1000);
        const res = await fetch(
          `https://api.aladhan.com/v1/timings/${ts}?latitude=${lat}&longitude=${lng}&method=4`,
        );
        const data = await res.json();
        if (data?.data?.timings) timesRef.current = data.data.timings;
      } catch { /* silent */ }
    }

    const geo = navigator.geolocation;
    if (geo) {
      geo.getCurrentPosition(
        (p) => fetchTimes(p.coords.latitude, p.coords.longitude),
        ()  => fetchTimes(30.0444, 31.2357),
        { timeout: 8000 },
      );
    } else {
      fetchTimes(30.0444, 31.2357);
    }
  }, []);

  useEffect(() => {
    function calc() {
      const times = timesRef.current;
      if (!times) return;
      const now = new Date();
      const todayMs = now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000;

      for (const [key, label] of PRAYER_NAMES) {
        const parts = (times[key] || "").split(":").map(Number);
        if (parts.length < 2) continue;
        const pMs = parts[0] * 3600000 + parts[1] * 60000;
        if (pMs > todayMs) {
          const diff = pMs - todayMs;
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          const hA = toArabicNumerals(String(h).padStart(2, "0"));
          const mA = toArabicNumerals(String(m).padStart(2, "0"));
          const sA = toArabicNumerals(String(s).padStart(2, "0"));
          setInfo({ name: label, remaining: `${hA}:${mA}:${sA}` });
          return;
        }
      }
      // After Isha — next is Fajr
      setInfo({ name: "الفجر", remaining: "—" });
    }

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return info;
}

/* ─────────────────────────────────────────────
   Glass Info Card
───────────────────────────────────────────── */
interface CardProps {
  icon: string;
  label: string;
  value: React.ReactNode;
  delay?: number;
  accent?: boolean;
}

function InfoCard({ icon, label, value, delay = 0, accent = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 1.2 + delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, boxShadow: "0 14px 40px rgba(201,162,39,0.18), 0 2px 10px rgba(0,0,0,0.07)" }}
      className="flex flex-col gap-1.5 rounded-2xl px-4 py-4 cursor-default"
      style={{
        background: accent
          ? "linear-gradient(135deg, rgba(201,162,39,0.10) 0%, rgba(255,253,245,0.85) 100%)"
          : GLASS_BG,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: accent ? "1px solid rgba(201,162,39,0.40)" : GLASS_BORDER,
        boxShadow: GLASS_SHADOW,
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg leading-none">{icon}</span>
        <span className="text-[11px] text-gray-400 font-sans tracking-wide leading-tight">{label}</span>
      </div>
      <div
        className="font-serif text-sm leading-snug font-semibold text-right"
        style={accent ? { background: GOLD_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : { color: "#374151" }}
      >
        {value || "—"}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Hero
───────────────────────────────────────────── */
export function Hero() {
  const clock = useLiveClock();
  const hijri = useHijriLive();
  const since = useTimeSince();
  const nextPrayer = useNextPrayer();

  const gregorianNow = new Intl.DateTimeFormat("ar-EG", { dateStyle: "long" }).format(clock);
  const timeNow = new Intl.DateTimeFormat("ar-EG", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  }).format(clock);

  const timeSinceStr = since.years > 0
    ? `${toArabicNumerals(since.years)} سنة ${toArabicNumerals(since.months)} شهر ${toArabicNumerals(since.days)} يوم`
    : `${toArabicNumerals(since.months)} شهر ${toArabicNumerals(since.days)} يوم`;

  const timeSinceFull = `${toArabicNumerals(String(since.hours).padStart(2,"0"))}:${toArabicNumerals(String(since.minutes).padStart(2,"0"))}:${toArabicNumerals(String(since.seconds).padStart(2,"0"))}`;

  return (
    <section
      className="relative min-h-[100dvh] flex flex-col items-center overflow-hidden bg-white"
      dir="rtl"
      style={{ fontFamily: "inherit" }}
    >
      {/* ── Ambient golden gradients ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[60%]"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(201,162,39,0.10) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2"
          style={{ background: "radial-gradient(ellipse 60% 60% at 0% 100%, rgba(201,162,39,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2"
          style={{ background: "radial-gradient(ellipse 60% 60% at 100% 100%, rgba(201,162,39,0.06) 0%, transparent 70%)" }} />
      </div>

      {/* ── Islamic geometric pattern ── */}
      <IslamicPattern />

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 pt-24 pb-20 flex flex-col items-center gap-10">

        {/* ── Portrait ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex-shrink-0"
        >
          {/* Outer golden glow ring */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: "0 0 0 6px rgba(201,162,39,0.18), 0 0 60px rgba(201,162,39,0.22), 0 0 120px rgba(201,162,39,0.10)",
            }}
          />

          {/* Floating animation wrapper */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Glass border ring */}
            <div
              className="rounded-full p-[3px]"
              style={{
                background: "linear-gradient(135deg, rgba(201,162,39,0.80) 0%, rgba(255,215,80,0.60) 40%, rgba(184,134,11,0.80) 100%)",
                boxShadow: "0 8px 40px rgba(201,162,39,0.30), 0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              {/* Inner glass ring */}
              <div
                className="rounded-full p-[2px]"
                style={{
                  background: "linear-gradient(135deg, rgba(255,253,245,0.9) 0%, rgba(255,250,220,0.6) 100%)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {/* Portrait */}
                <div
                  className="rounded-full overflow-hidden"
                  style={{
                    width: "clamp(180px, 28vw, 260px)",
                    height: "clamp(180px, 28vw, 260px)",
                  }}
                >
                  <img
                    src={portraitSrc}
                    alt="المهندس أيمن مبروك ريان مع ابنه"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center 15%" }}
                  />
                </div>
              </div>
            </div>

            {/* Sparkle dots */}
            {[
              { top: "8%",  right: "4%",  size: 7,  delay: 0    },
              { top: "80%", right: "0%",  size: 5,  delay: 0.8  },
              { top: "20%", left: "2%",   size: 6,  delay: 1.5  },
              { top: "70%", left: "5%",   size: 4,  delay: 0.4  },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: s.size, height: s.size,
                  background: "radial-gradient(circle, #C9A227 0%, transparent 70%)",
                  top: s.top, right: (s as any).right, left: (s as any).left,
                  boxShadow: "0 0 8px rgba(201,162,39,0.8)",
                }}
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* ── Name ── */}
        <div className="text-center flex flex-col items-center gap-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-3 justify-center"
          >
            <div className="h-px w-10" style={{ background: GOLD_GRAD }} />
            <span className="text-[#C9A227] text-xs tracking-[0.32em] font-sans font-medium uppercase">
              في ذمة الله
            </span>
            <div className="h-px w-10" style={{ background: GOLD_GRAD }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-center leading-[1.3]"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 3.6rem)",
              background: GOLD_GRAD,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            المهندس<br />أيمن مبروك ريان
          </motion.h1>

          {/* Decorative rule */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.85, ease: "easeOut" }}
            style={{ transformOrigin: "center" }}
            className="w-40"
          >
            <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, #C9A227 30%, #C9A227 70%, transparent)" }} />
          </motion.div>

          {/* Dua */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0 }}
            className="relative rounded-2xl px-7 py-6 max-w-xl text-center"
            style={{
              background: GLASS_BG,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(201,162,39,0.25)",
              boxShadow: "0 6px 40px rgba(201,162,39,0.10), 0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* Corner gems */}
            {["-top-1.5 -right-1.5", "-top-1.5 -left-1.5"].map((pos) => (
              <div key={pos} className={`absolute ${pos} w-3 h-3 rounded-full`}
                style={{ background: "#C9A227", boxShadow: "0 0 10px rgba(201,162,39,0.7)" }} />
            ))}
            <p className="font-serif text-gray-700 leading-[2.1] text-[0.98rem] sm:text-[1.05rem]">
              اللهم اغفر له وارحمه، وعافه واعفُ عنه، وأكرم نُزُله، ووسِّع مُدخله،
              <br className="hidden sm:block" />
              واجعل هذا العمل صدقةً جاريةً له. اللهم آمين.
            </p>
          </motion.div>
        </div>

        {/* ── 8 Info Cards ── */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Row 1 */}
          <InfoCard
            icon="📅"
            label="تاريخ الوفاة (ميلادي)"
            value={PASSING_GREGORIAN}
            delay={0}
            accent
          />
          <InfoCard
            icon="🌙"
            label="تاريخ الوفاة (هجري)"
            value={PASSING_HIJRI}
            delay={0.07}
            accent
          />
          <InfoCard
            icon="⏳"
            label="المدة منذ رحيله"
            value={
              <span className="flex flex-col gap-0.5">
                <span>{timeSinceStr}</span>
                <span className="text-[11px] font-mono tabular-nums opacity-70">{timeSinceFull}</span>
              </span>
            }
            delay={0.14}
          />
          <InfoCard
            icon="🕌"
            label="عدد الجمعات منذ ١١ مارس ٢٠٢٢"
            value={`${toArabicNumerals(since.fridays)} جمعة`}
            delay={0.21}
          />

          {/* Row 2 */}
          <InfoCard
            icon="🕒"
            label="الوقت الآن"
            value={timeNow}
            delay={0.28}
          />
          <InfoCard
            icon="📅"
            label="التاريخ الميلادي"
            value={gregorianNow}
            delay={0.35}
          />
          <InfoCard
            icon="🌙"
            label="التاريخ الهجري"
            value={hijri}
            delay={0.42}
          />
          <InfoCard
            icon="🕌"
            label={nextPrayer ? `الوقت المتبقي لـ ${nextPrayer.name}` : "الصلاة القادمة"}
            value={nextPrayer?.remaining ?? "جارٍ التحميل…"}
            delay={0.49}
            accent
          />
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-[#C9A227]/60" />
        </motion.div>
        <span className="text-[10px] text-gray-400 tracking-[0.3em] uppercase font-sans">تمرير</span>
      </motion.div>
    </section>
  );
}
