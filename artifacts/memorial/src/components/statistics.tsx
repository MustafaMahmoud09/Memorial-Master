import { motion } from "framer-motion";
import { useGetStats } from "@workspace/api-client-react";
import { toArabicNumerals } from "@/lib/utils";
import { Users, Heart, Activity, Globe2, BookHeart } from "lucide-react";

export function Statistics() {
  const { data: stats } = useGetStats();

  if (!stats) return null;

  const statCards = [
    { label: "الزوار الكرام", value: stats.totalVisitors, icon: Users },
    { label: "الدعوات المسجلة", value: stats.totalDuas, icon: Heart },
    { label: "مجموع التسبيحات", value: stats.totalDhikr, icon: Activity },
    { label: "الصلوات على النبي", value: stats.totalSalawat, icon: BookHeart },
  ];

  return (
    <section className="py-24 px-4 z-10 relative bg-black/10 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Globe2 className="w-8 h-8 text-primary mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-serif text-foreground gold-gradient-text">أثر باقٍ</h2>
          <p className="text-muted-foreground mt-4 text-lg">
            هذه الأرقام هي شهادة حب ورجاء، ونور يتصل به في قبره بإذن الله.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className="bg-card border border-primary/10 rounded-2xl p-6 text-center shadow-lg hover:border-primary/30 transition-all group"
            >
              <stat.icon className="w-6 h-6 text-primary/60 mx-auto mb-3 group-hover:text-primary transition-colors group-hover:scale-110" />
              <div className="text-3xl md:text-4xl font-bold text-foreground font-sans arabic-numerals mb-2">
                {toArabicNumerals(stat.value)}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {stats.countries && stats.countries.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            دعوات وصلت من {toArabicNumerals(stats.countries.length)} دولة حول العالم
          </motion.div>
        )}
      </div>
    </section>
  );
}
