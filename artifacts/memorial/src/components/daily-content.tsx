import { useMemo } from "react";
import { motion } from "framer-motion";
import { QURAN_VERSES, AHADITH, DUAS, REMINDERS } from "@/data/islamic-content";
import { BookOpen, Book, Quote, Lightbulb } from "lucide-react";

const GOLD = "linear-gradient(135deg, #B8860B 0%, #C9A227 50%, #8B6914 100%)";

export function DailyContent() {
  const dailyIndices = useMemo(() => {
    const now   = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff  = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000);
    const day   = Math.floor(diff / 86400000);
    return {
      verse:    day % QURAN_VERSES.length,
      hadith:   day % AHADITH.length,
      dua:      day % DUAS.length,
      reminder: day % REMINDERS.length,
    };
  }, []);

  const verse    = QURAN_VERSES[dailyIndices.verse];
  const hadith   = AHADITH[dailyIndices.hadith];
  const dua      = DUAS[dailyIndices.dua];
  const reminder = REMINDERS[dailyIndices.reminder];

  const cards = [
    { title: "آية اليوم",    icon: BookOpen,   content: verse.text,    meta: `سورة ${verse.surah} — آية ${verse.ayah}`, english: verse.translation },
    { title: "حديث اليوم",   icon: Book,       content: hadith.text,   english: hadith.translation },
    { title: "دعاء اليوم",   icon: Quote,      content: dua },
    { title: "تذكرة اليوم",  icon: Lightbulb,  content: reminder },
  ];

  return (
    <section className="py-28 px-4 z-10 relative bg-white">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A227]/50" />
            <span className="text-[#C9A227]/70 text-xs tracking-[0.3em] uppercase font-sans">يتجدد كل يوم</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A227]/50" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif"
            style={{ background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            زاد اليوم
          </h2>
          <p className="text-gray-500 mt-3">قطوف إيمانية تتجدد كل يوم</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="rounded-2xl p-7 md:p-9 flex flex-col hover:shadow-lg transition-shadow"
              style={{
                background: "rgba(255,253,245,0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(201,162,39,0.15)",
                boxShadow: "0 2px 16px rgba(201,162,39,0.05)",
              }}
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-5">
                <div className="p-2.5 rounded-xl"
                  style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.15)" }}>
                  <card.icon className="w-5 h-5 text-[#C9A227]" />
                </div>
                <h3 className="text-lg font-serif text-gray-700">{card.title}</h3>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-xl md:text-2xl font-serif text-gray-800 leading-[2] text-center mb-5">
                  {card.content}
                </p>
                {card.meta && (
                  <span className="block text-center text-[#B8860B] font-sans text-sm mb-4 arabic-numerals">
                    [{card.meta}]
                  </span>
                )}
                {card.english && (
                  <p className="text-sm text-gray-400 text-center font-sans mt-auto border-t border-gray-100 pt-4" dir="ltr">
                    {card.english}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
