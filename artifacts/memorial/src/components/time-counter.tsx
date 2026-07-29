import { motion } from "framer-motion";
import { useTimeSince } from "@/hooks/use-time";
import { toArabicNumerals } from "@/lib/utils";
import { Clock, CalendarDays } from "lucide-react";

const GOLD = "linear-gradient(135deg, #B8860B 0%, #C9A227 50%, #8B6914 100%)";

export function TimeCounter() {
  const time = useTimeSince();

  const blocks = [
    { label: "سنة",    value: time.years  },
    { label: "شهر",   value: time.months },
    { label: "أسبوع", value: time.weeks  },
    { label: "يوم",   value: time.days   },
  ];

  return (
    <section className="py-24 px-4 z-10 relative bg-[#FEFCF5]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
            style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)" }}
          >
            <Clock className="w-6 h-6 text-[#C9A227]" />
          </div>
          <h2
            className="text-3xl md:text-4xl font-serif mb-3"
            style={{ background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
          >
            المدة منذ الرحيل
          </h2>
          <p className="text-gray-500">عن دار الفناء إلى جوار أرحم الراحمين</p>
        </div>

        {/* Blocks */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 arabic-numerals">
          {blocks.map((block, i) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="w-28 h-28 md:w-36 md:h-36 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden"
              style={{
                background: "rgba(255,253,245,0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(201,162,39,0.18)",
                boxShadow: "0 4px 24px rgba(201,162,39,0.07), 0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/50 to-transparent" />
              <span
                className="text-4xl md:text-5xl font-sans font-bold mb-1"
                style={{ background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                {toArabicNumerals(block.value)}
              </span>
              <span className="text-xs md:text-sm text-gray-400 font-medium">{block.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Fridays counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-14 max-w-md mx-auto rounded-2xl p-6 text-center flex items-center justify-center gap-4"
          style={{
            background: "rgba(255,253,245,0.9)",
            border: "1px solid rgba(201,162,39,0.2)",
            boxShadow: "0 4px 24px rgba(201,162,39,0.07)",
          }}
        >
          <CalendarDays className="w-8 h-8 text-[#C9A227] opacity-80 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-serif text-gray-700">
              مرّت{" "}
              <span className="arabic-numerals font-bold" style={{ color: "#B8860B" }}>
                {toArabicNumerals(time.fridays)}
              </span>{" "}
              صلاة جمعة
            </h3>
            <p className="text-sm text-gray-400 mt-1">نسأل الله أن تتنزل عليه رحمات كل يوم جمعة</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
