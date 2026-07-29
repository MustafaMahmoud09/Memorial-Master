import { motion } from "framer-motion";
import { useHijriDate } from "@/hooks/use-time";
import portraitSrc from "@assets/٢٠٢٦٠٧٢٩_١٥٢٠١٢_1785328653287.png";
import { ChevronDown } from "lucide-react";

const GOLD = "linear-gradient(135deg, #B8860B 0%, #C9A227 50%, #8B6914 100%)";

export function Hero() {
  const hijri = useHijriDate();
  const gregorian = new Intl.DateTimeFormat("ar-EG", { dateStyle: "long" }).format(new Date());

  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-white" dir="rtl">

      {/* ── Background: soft radial light ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_40%,rgba(201,162,39,0.07),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_25%_60%,rgba(201,162,39,0.04),transparent)]" />
      </div>

      {/* ── Cinematic photo — right side bleeds to edge, no box ── */}
      <div className="absolute inset-y-0 left-0 right-0 md:left-[38%] pointer-events-none">
        {/* The photo itself */}
        <img
          src={portraitSrc}
          alt="المهندس أيمن مبروك ريان مع ابنه"
          className="w-full h-full object-cover object-center"
          style={{ objectPosition: "60% center" }}
        />
        {/* Gradient vignettes to blend photo into white background */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white via-white/60 to-transparent" />
        {/* Left fade — on desktop, this blends the photo into the text area */}
        <div className="absolute inset-y-0 left-0 w-3/4 md:w-1/2 bg-gradient-to-r from-white via-white/95 to-transparent" />
      </div>

      {/* ── Content — left column ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-28 pb-24 max-w-2xl">

        {/* Eyebrow tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px w-8 bg-[#C9A227]/60" />
          <span className="text-[#C9A227] text-xs tracking-[0.35em] uppercase font-sans font-medium">
            في ذمة الله • ١١ مارس ٢٠٢٢
          </span>
        </motion.div>

        {/* Name — the visual centrepiece */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="font-display leading-[1.25] mb-8"
          style={{
            fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
            background: GOLD,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          المهندس
          <br />
          أيمن مبروك ريان
        </motion.h1>

        {/* Decorative rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          style={{ transformOrigin: "right" }}
          className="mb-8 h-px bg-gradient-to-l from-[#C9A227]/70 via-[#C9A227]/25 to-transparent w-full max-w-xs"
        />

        {/* Dua card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="relative rounded-2xl p-6 mb-10 max-w-md"
          style={{
            background: "rgba(255, 253, 245, 0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(201, 162, 39, 0.2)",
            boxShadow: "0 4px 30px rgba(201, 162, 39, 0.08), 0 1px 6px rgba(0,0,0,0.04)",
          }}
        >
          {/* Glow dot */}
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#C9A227]/60 shadow-[0_0_12px_rgba(201,162,39,0.6)]" />
          <p className="font-serif text-gray-700 leading-[2] text-[1.05rem]">
            اللهم اغفر له وارحمه، وعافه واعفُ عنه، وأكرم نُزُله، ووسِّع مُدخله، واجعل هذا العمل صدقةً جاريةً له.
          </p>
        </motion.div>

        {/* Dates row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap gap-3"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 bg-white/80 text-sm text-gray-500 font-sans shadow-sm">
            {gregorian}
          </span>
          <span
            className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-sans shadow-sm"
            style={{
              background: "rgba(201, 162, 39, 0.06)",
              border: "1px solid rgba(201, 162, 39, 0.25)",
              color: "#8B6914",
            }}
          >
            {hijri}
          </span>
        </motion.div>
      </div>

      {/* ── Scroll cue ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-[#C9A227]/60" />
        </motion.div>
        <span className="text-[10px] text-gray-400 tracking-[0.3em] uppercase font-sans">تمرير</span>
      </motion.div>
    </section>
  );
}
