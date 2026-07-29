import { useMemo } from "react";
import { motion } from "framer-motion";
import { QURAN_VERSES, AHADITH, DUAS, REMINDERS } from "@/data/islamic-content";
import { BookOpen, Book, Quote, Lightbulb } from "lucide-react";

export function DailyContent() {
  const dailyIndices = useMemo(() => {
    // Get day of year 0-365
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    
    return {
      verse: day % QURAN_VERSES.length,
      hadith: day % AHADITH.length,
      dua: day % DUAS.length,
      reminder: day % REMINDERS.length
    };
  }, []);

  const verse = QURAN_VERSES[dailyIndices.verse];
  const hadith = AHADITH[dailyIndices.hadith];
  const dua = DUAS[dailyIndices.dua];
  const reminder = REMINDERS[dailyIndices.reminder];

  const cards = [
    { title: "آية اليوم", icon: BookOpen, content: verse.text, meta: `سورة ${verse.surah} - آية ${verse.ayah}`, english: verse.translation },
    { title: "حديث اليوم", icon: Book, content: hadith.text, english: hadith.translation },
    { title: "دعاء اليوم", icon: Quote, content: dua },
    { title: "تذكرة اليوم", icon: Lightbulb, content: reminder }
  ];

  return (
    <section className="py-24 px-4 z-10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground gold-gradient-text">زاد اليوم</h2>
          <p className="text-muted-foreground mt-4">قطوف إيمانية تتجدد كل يوم</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="glass-panel p-6 md:p-8 rounded-2xl border border-border/60 hover:border-primary/40 transition-colors flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-serif text-foreground/90">{card.title}</h3>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-xl md:text-2xl font-serif text-foreground leading-loose text-center mb-6">
                  {card.content}
                </p>
                {card.meta && (
                  <span className="block text-center text-primary/80 font-sans text-sm mb-4 arabic-numerals">
                    [{card.meta}]
                  </span>
                )}
                {card.english && (
                  <p className="text-sm text-muted-foreground/70 text-center font-sans mt-auto border-t border-border/30 pt-4 dir-ltr">
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
