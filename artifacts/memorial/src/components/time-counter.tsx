import { motion } from "framer-motion";
import { useTimeSince } from "@/hooks/use-time";
import { toArabicNumerals } from "@/lib/utils";
import { Clock, CalendarDays } from "lucide-react";

export function TimeCounter() {
  const time = useTimeSince();

  const blocks = [
    { label: "سنة", value: time.years },
    { label: "شهر", value: time.months },
    { label: "أسبوع", value: time.weeks },
    { label: "يوم", value: time.days }
  ];

  return (
    <section className="py-20 px-4 z-10 relative">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 text-primary">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-foreground gold-gradient-text">المدة منذ الرحيل</h2>
          <p className="text-muted-foreground mt-2">عن دار الفناء إلى جوار أرحم الراحمين</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-6 dir-ltr arabic-numerals">
          {blocks.map((block, i) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-panel w-24 h-24 md:w-32 md:h-32 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
              <span className="text-3xl md:text-4xl font-sans font-bold text-foreground mb-1">
                {toArabicNumerals(block.value)}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground font-medium">
                {block.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 max-w-md mx-auto bg-card border border-primary/20 rounded-2xl p-6 text-center shadow-lg flex items-center justify-center gap-4"
        >
          <CalendarDays className="w-8 h-8 text-primary opacity-80" />
          <div>
            <h3 className="text-lg font-serif text-foreground/90">مرت <span className="text-primary font-bold arabic-numerals mx-1">{toArabicNumerals(time.fridays)}</span> صلاة جمعة</h3>
            <p className="text-sm text-muted-foreground mt-1">نسأل الله أن تتنزل عليه رحمات كل يوم جمعة</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
